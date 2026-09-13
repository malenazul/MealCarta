import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/community/recipes/:id/reviews - Add review/rating
const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5, 'El comentario debe tener al menos 5 caracteres'),
  tip: z.string().trim().optional(),
});

router.post('/recipes/:id/reviews', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: 'ID de receta inválido' });
    }

    const parsed = ReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { rating, comment, tip } = parsed.data;
    const userId = req.user!.id;

    // Check if recipe exists
    const recipe = db.prepare('SELECT id FROM recipes WHERE id = ?').get(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const insert = db.prepare(`
      INSERT INTO reviews (user_id, recipe_id, rating, comment, tip)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(userId, recipeId, rating, comment, tip || null);

    return res.status(201).json({ message: 'Reseña y puntuación añadidas exitosamente' });
  } catch (err: any) {
    console.error('Review error:', err);
    return res.status(500).json({ error: 'Error al publicar la reseña' });
  }
});

// POST /api/community/recipes/:id/favorite - Toggle favorite
router.post('/recipes/:id/favorite', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: 'ID de receta inválido' });
    }

    const userId = req.user!.id;

    const existing = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = ?').get(userId, recipeId);

    if (existing) {
      db.prepare('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?').run(userId, recipeId);
      return res.json({ is_favorite: false, message: 'Eliminado del Cuaderno de Recetas' });
    } else {
      db.prepare('INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)').run(userId, recipeId);
      return res.json({ is_favorite: true, message: 'Guardado en tu Cuaderno Encarta' });
    }
  } catch (err: any) {
    console.error('Favorite toggle error:', err);
    return res.status(500).json({ error: 'Error al actualizar favoritos' });
  }
});

// GET /api/community/favorites - Get user favorite recipes
router.get('/favorites', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const favorites = db.prepare(`
      SELECT 
        r.*,
        1 as is_favorite,
        COALESCE(AVG(rev.rating), 5.0) as average_rating,
        COUNT(rev.id) as reviews_count,
        f.created_at as saved_at
      FROM favorites f
      JOIN recipes r ON f.recipe_id = r.id
      LEFT JOIN reviews rev ON r.id = rev.recipe_id
      WHERE f.user_id = ?
      GROUP BY r.id
      ORDER BY f.created_at DESC
    `).all(userId) as any[];

    const results = favorites.map((r) => ({
      ...r,
      average_rating: Math.round(r.average_rating * 10) / 10,
    }));

    return res.json(results);
  } catch (err: any) {
    console.error('Get favorites error:', err);
    return res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// GET /api/community/requests - List recipe requests
router.get('/requests', (_req, res: Response) => {
  try {
    const requests = db.prepare(`
      SELECT 
        cr.*,
        u.username,
        u.avatar
      FROM community_requests cr
      JOIN users u ON cr.user_id = u.id
      ORDER BY cr.created_at DESC
    `).all();

    return res.json(requests);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error al consultar solicitudes de recetas' });
  }
});

// POST /api/community/requests - Submit a new recipe request
const RequestSchema = z.object({
  dish_name: z.string().trim().min(3, 'El nombre del plato debe tener al menos 3 caracteres'),
  country: z.string().trim().min(2, 'El país es obligatorio'),
  city: z.string().trim().optional(),
  description: z.string().trim().min(10, 'Describa su pedido o recuerdos sobre este plato (mínimo 10 caracteres)'),
});

router.post('/requests', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { dish_name, country, city, description } = parsed.data;
    const userId = req.user!.id;

    const insert = db.prepare(`
      INSERT INTO community_requests (user_id, dish_name, country, city, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(userId, dish_name, country, city || null, description);

    return res.status(201).json({
      message: 'Solicitud enviada a la comunidad de MealCarta',
      requestId: Number(result.lastInsertRowid),
    });
  } catch (err: any) {
    console.error('Request error:', err);
    return res.status(500).json({ error: 'Error al publicar la solicitud' });
  }
});

export default router;
