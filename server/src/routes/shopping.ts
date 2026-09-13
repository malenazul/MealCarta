import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { consolidateShoppingList } from '../utils/shopping';

const router = Router();

const ConsolidateSchema = z.object({
  dishes: z.array(
    z.object({
      recipe_id: z.number().int().positive(),
      servings: z.number().positive(),
    })
  ).min(1, 'Seleccione al menos un plato para generar la lista de compras'),
});

// POST /api/shopping/consolidate
router.post('/consolidate', (req: Request, res: Response) => {
  try {
    const parsed = ConsolidateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const result = consolidateShoppingList(parsed.data.dishes);

    return res.json(result);
  } catch (err: any) {
    console.error('Shopping list consolidation error:', err);
    return res.status(500).json({ error: 'Error al generar la lista de compras consolidada' });
  }
});

export default router;
