import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { calculateAggregatedNutrition, DAILY_RECOMMENDED_VALUES } from '../utils/nutrition';

const router = Router();

const AggregateSchema = z.object({
  dishes: z.array(
    z.object({
      recipe_id: z.number().int().positive(),
      servings: z.number().positive(),
    })
  ).min(1, 'Debe incluir al menos un plato'),
});

// POST /api/nutrition/aggregate
router.post('/aggregate', (req: Request, res: Response) => {
  try {
    const parsed = AggregateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const result = calculateAggregatedNutrition(parsed.data.dishes);

    return res.json({
      dailyReferenceValues: DAILY_RECOMMENDED_VALUES,
      ...result,
    });
  } catch (err: any) {
    console.error('Nutrition calculation error:', err);
    return res.status(500).json({ error: 'Error al calcular la nutrición consolidada' });
  }
});

export default router;
