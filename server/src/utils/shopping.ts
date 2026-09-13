import { db } from '../db/database';

export interface RequestedDish {
  recipe_id: number;
  servings: number;
}

export interface ConsolidatedIngredient {
  name: string;
  totalAmount: number;
  unit: string;
  category: string;
  recipes: string[];
}

export function consolidateShoppingList(requestedDishes: RequestedDish[]): {
  categories: Record<string, ConsolidatedIngredient[]>;
  totalItems: number;
  dishesSummary: { title: string; servings: number }[];
} {
  const map = new Map<string, ConsolidatedIngredient>();
  const dishesSummary: { title: string; servings: number }[] = [];

  for (const dish of requestedDishes) {
    if (!dish.servings || dish.servings <= 0) continue;

    const recipe = db.prepare('SELECT id, title, servings_base FROM recipes WHERE id = ?').get(dish.recipe_id) as
      | { id: number; title: string; servings_base: number }
      | undefined;

    if (!recipe) continue;

    dishesSummary.push({
      title: recipe.title,
      servings: dish.servings,
    });

    const scaleFactor = dish.servings / recipe.servings_base;

    const ingredients = db.prepare('SELECT name, amount_base, unit, category FROM ingredients WHERE recipe_id = ?').all(dish.recipe_id) as {
      name: string;
      amount_base: number;
      unit: string;
      category: string;
    }[];

    for (const ing of ingredients) {
      const normalizedKey = `${ing.name.toLowerCase().trim()}___${ing.unit.toLowerCase().trim()}`;
      const scaledAmount = ing.amount_base * scaleFactor;

      if (map.has(normalizedKey)) {
        const existing = map.get(normalizedKey)!;
        existing.totalAmount += scaledAmount;
        if (!existing.recipes.includes(recipe.title)) {
          existing.recipes.push(recipe.title);
        }
      } else {
        map.set(normalizedKey, {
          name: ing.name,
          totalAmount: scaledAmount,
          unit: ing.unit,
          category: ing.category || 'Almacén & Granos',
          recipes: [recipe.title],
        });
      }
    }
  }

  // Format quantities and group by category
  const categories: Record<string, ConsolidatedIngredient[]> = {};
  let totalItems = 0;

  for (const item of map.values()) {
    // Round cleanly
    item.totalAmount = Math.round(item.totalAmount * 10) / 10;
    totalItems++;

    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  }

  // Sort each category alphabetically
  for (const cat in categories) {
    categories[cat].sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    categories,
    totalItems,
    dishesSummary,
  };
}
