import bcrypt from 'bcryptjs';
import { db, initDatabase } from '../db/database';
import { SEED_RECIPES } from './recipesData';

export function runSeed() {
  initDatabase();

  console.log('[MealCarta Seed] Starting database seeding...');

  // Create default curator user
  const passwordHash = bcrypt.hashSync('mealcarta123', 10);
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash, avatar)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertUser.run(
    1,
    'EncartaCurator',
    'curador@mealcarta.org',
    passwordHash,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );

  // Check if recipes are already seeded
  const count = (db.prepare('SELECT count(*) as total FROM recipes').get() as { total: number }).total;
  if (count > 0) {
    console.log(`[MealCarta Seed] Database already contains ${count} recipes. Skipping duplicate seeding.`);
    return;
  }

  const insertRecipe = db.prepare(`
    INSERT INTO recipes (
      title, original_name, country, country_code, city, lat, lng,
      story_history, cultural_notes, fun_facts, prep_time, cook_time,
      servings_base, difficulty, image_url, category, author_id
    ) VALUES (
      @title, @original_name, @country, @country_code, @city, @lat, @lng,
      @story_history, @cultural_notes, @fun_facts, @prep_time, @cook_time,
      @servings_base, @difficulty, @image_url, @category, 1
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

  const insertReview = db.prepare(`
    INSERT INTO reviews (user_id, recipe_id, rating, comment, tip)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((recipes) => {
    for (const r of recipes) {
      const info = insertRecipe.run({
        title: r.title,
        original_name: r.original_name,
        country: r.country,
        country_code: r.country_code,
        city: r.city,
        lat: r.lat,
        lng: r.lng,
        story_history: r.story_history,
        cultural_notes: r.cultural_notes,
        fun_facts: r.fun_facts,
        prep_time: r.prep_time,
        cook_time: r.cook_time,
        servings_base: r.servings_base,
        difficulty: r.difficulty,
        image_url: r.image_url,
        category: r.category
      });

      const recipeId = info.lastInsertRowid;

      for (const ing of r.ingredients) {
        insertIngredient.run(recipeId, ing.name, ing.amount_base, ing.unit, ing.category);
      }

      for (let i = 0; i < r.instructions.length; i++) {
        insertInstruction.run(recipeId, i + 1, r.instructions[i]);
      }

      const n = r.nutrition_facts;
      insertNutrition.run(
        recipeId,
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

      // Seed a starter review
      insertReview.run(
        1,
        recipeId,
        5,
        `Excelente artículo enciclopédico. La precisión histórica y la autenticidad de los ingredientes reflejan fielmente la tradición de ${r.city}.`,
        'Consejo del curador: Utilizar ingredientes frescos y respetar los tiempos de reposo para el máximo esplendor aromático.'
      );
    }
  });

  tx(SEED_RECIPES);
  console.log(`[MealCarta Seed] Successfully inserted ${SEED_RECIPES.length} historical recipes with complete nutrition and ingredients.`);
}

if (require.main === module) {
  runSeed();
}
