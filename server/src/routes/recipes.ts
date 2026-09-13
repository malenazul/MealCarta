import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/recipes - List all recipes with filters
router.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, country, category, difficulty } = req.query;

    let query = `
      SELECT 
        r.*,
        COALESCE(AVG(rev.rating), 5.0) as average_rating,
        COUNT(rev.id) as reviews_count
      FROM recipes r
      LEFT JOIN reviews rev ON r.id = rev.recipe_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search && typeof search === 'string') {
      query += ` AND (r.title LIKE ? OR r.original_name LIKE ? OR r.city LIKE ? OR r.country LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (country && typeof country === 'string') {
      query += ` AND r.country = ?`;
      params.push(country);
    }

    if (category && typeof category === 'string') {
      query += ` AND r.category = ?`;
      params.push(category);
    }

    if (difficulty && typeof difficulty === 'string') {
      query += ` AND r.difficulty = ?`;
      params.push(difficulty);
    }

    query += ` GROUP BY r.id ORDER BY r.id ASC`;

    const recipes = db.prepare(query).all(...params) as any[];

    // If user is logged in, attach is_favorite flag
    let favoriteIds = new Set<number>();
    if (req.user) {
      const favs = db.prepare('SELECT recipe_id FROM favorites WHERE user_id = ?').all(req.user.id) as { recipe_id: number }[];
      favoriteIds = new Set(favs.map((f) => f.recipe_id));
    }

    const results = recipes.map((r) => ({
      ...r,
      average_rating: Math.round(r.average_rating * 10) / 10,
      is_favorite: favoriteIds.has(r.id),
    }));

    return res.json(results);
  } catch (err: any) {
    console.error('List recipes error:', err);
    return res.status(500).json({ error: 'Error al consultar las recetas' });
  }
});

// GET /api/recipes/countries - List all distinct countries and their locations
router.get('/countries', (_req, res: Response) => {
  try {
    const countries = db.prepare(`
      SELECT 
        country,
        country_code,
        city,
        lat,
        lng,
        COUNT(id) as total_recipes,
        MIN(image_url) as sample_image
      FROM recipes
      GROUP BY country, city
      ORDER BY country ASC
    `).all();

    return res.json(countries);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error al consultar países' });
  }
});

// GET /api/recipes/:id - Get full recipe details
router.get('/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de receta inválido' });
    }

    const recipe = db.prepare(`
      SELECT 
        r.*,
        u.username as author_name,
        COALESCE(AVG(rev.rating), 5.0) as average_rating,
        COUNT(rev.id) as reviews_count
      FROM recipes r
      LEFT JOIN users u ON r.author_id = u.id
      LEFT JOIN reviews rev ON r.id = rev.recipe_id
      WHERE r.id = ?
      GROUP BY r.id
    `).get(id) as any;

    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada en la enciclopedia' });
    }

    const ingredients = db.prepare(`
      SELECT id, name, amount_base, unit, category
      FROM ingredients
      WHERE recipe_id = ?
      ORDER BY id ASC
    `).all(id);

    const instructions = db.prepare(`
      SELECT id, step_number, instruction
      FROM instructions
      WHERE recipe_id = ?
      ORDER BY step_number ASC
    `).all(id);

    const nutrition = db.prepare(`
      SELECT *
      FROM nutrition_facts
      WHERE recipe_id = ?
    `).get(id);

    const reviews = db.prepare(`
      SELECT 
        rev.id,
        rev.rating,
        rev.comment,
        rev.tip,
        rev.created_at,
        u.username,
        u.avatar
      FROM reviews rev
      JOIN users u ON rev.user_id = u.id
      WHERE rev.recipe_id = ?
      ORDER BY rev.created_at DESC
    `).all(id);

    let is_favorite = false;
    if (req.user) {
      const fav = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = ?').get(req.user.id, id);
      is_favorite = !!fav;
    }

    return res.json({
      ...recipe,
      average_rating: Math.round(recipe.average_rating * 10) / 10,
      is_favorite,
      ingredients,
      instructions,
      nutrition_facts: nutrition,
      reviews,
    });
  } catch (err: any) {
    console.error('Recipe detail error:', err);
    return res.status(500).json({ error: 'Error al obtener el artículo de la receta' });
  }
});

// POST /api/recipes - Submit user recommendation / community recipe
const CreateRecipeSchema = z.object({
  title: z.string().min(3),
  original_name: z.string().min(3),
  country: z.string().min(2),
  country_code: z.string().min(2).max(4),
  city: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  story_history: z.string().min(20),
  cultural_notes: z.string().optional(),
  fun_facts: z.string().optional(),
  prep_time: z.number().min(1),
  cook_time: z.number().min(0),
  servings_base: z.number().min(1),
  difficulty: z.enum(['Fácil', 'Media', 'Experto']),
  image_url: z.string().url(),
  category: z.string().min(2),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      amount_base: z.number().positive(),
      unit: z.string().min(1),
      category: z.string().min(1),
    })
  ).min(1),
  instructions: z.array(z.string().min(5)).min(1),
  nutrition_facts: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
    vit_a: z.number().default(0),
    vit_c: z.number().default(0),
    vit_d: z.number().default(0),
    vit_b12: z.number().default(0),
    iron: z.number().default(0),
    calcium: z.number().default(0),
    potassium: z.number().default(0),
    sodium: z.number().default(0),
  }),
});

router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = CreateRecipeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const data = parsed.data;
    const authorId = req.user!.id;

    const insertRecipe = db.prepare(`
      INSERT INTO recipes (
        title, original_name, country, country_code, city, lat, lng,
        story_history, cultural_notes, fun_facts, prep_time, cook_time,
        servings_base, difficulty, image_url, category, author_id, is_verified
      ) VALUES (
        @title, @original_name, @country, @country_code, @city, @lat, @lng,
        @story_history, @cultural_notes, @fun_facts, @prep_time, @cook_time,
        @servings_base, @difficulty, @image_url, @category, @author_id, 1
      )
    `);

    const insertIngredient = db.prepare(`
      INSERT INTO ingredients (recipe_id, name, amount_base, unit, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertInstruction = db.prepare(`
      INSERT INTO instructions (recipe_id, step_number, instruction)
      VALUES (?, ?, ?)
    `);

    const insertNutrition = db.prepare(`
      INSERT INTO nutrition_facts (
        recipe_id, calories, protein, carbs, fat, fiber,
        vit_a, vit_c, vit_d, vit_b12, iron, calcium, potassium, sodium
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let newRecipeId: number = 0;

    const tx = db.transaction(() => {
      const info = insertRecipe.run({
        ...data,
        author_id: authorId,
      });
      newRecipeId = Number(info.lastInsertRowid);

      for (const ing of data.ingredients) {
        insertIngredient.run(newRecipeId, ing.name, ing.amount_base, ing.unit, ing.category);
      }

      for (let i = 0; i < data.instructions.length; i++) {
        insertInstruction.run(newRecipeId, i + 1, data.instructions[i]);
      }

      const n = data.nutrition_facts;
      insertNutrition.run(
        newRecipeId,
        n.calories,
        n.protein,
        n.carbs,
        n.fat,
        n.fiber,
        n.vit_a,
        n.vit_c,
        n.vit_d,
        n.vit_b12,
        n.iron,
        n.calcium,
        n.potassium,
        n.sodium
      );
    });

    tx();

    return res.status(201).json({
      message: 'Receta incorporada al Atlas Encarta con éxito',
      recipeId: newRecipeId,
    });
  } catch (err: any) {
    console.error('Create recipe error:', err);
    return res.status(500).json({ error: 'Error al registrar la receta' });
  }
});

export default router;
