import { db } from '../db/database';

export const DAILY_RECOMMENDED_VALUES = {
  calories: 2000, // kcal
  protein: 50,    // g
  carbs: 275,     // g
  fat: 70,        // g
  fiber: 28,      // g
  vit_a: 800,     // mcg
  vit_c: 80,      // mg
  vit_d: 15,      // mcg
  vit_b12: 2.4,   // mcg
  iron: 14,       // mg
  calcium: 1000,  // mg
  potassium: 3500,// mg
  sodium: 2300,   // mg
};

export interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vit_a: number;
  vit_c: number;
  vit_d: number;
  vit_b12: number;
  iron: number;
  calcium: number;
  potassium: number;
  sodium: number;
}

export interface DishPortion {
  recipe_id: number;
  servings: number;
}

export function calculateAggregatedNutrition(dishes: DishPortion[]) {
  const totals: NutritionValues = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    vit_a: 0,
    vit_c: 0,
    vit_d: 0,
    vit_b12: 0,
    iron: 0,
    calcium: 0,
    potassium: 0,
    sodium: 0,
  };

  const dishesBreakdown: {
    recipe_id: number;
    title: string;
    servings: number;
    nutrition: NutritionValues;
  }[] = [];

  for (const dish of dishes) {
    if (!dish.servings || dish.servings <= 0) continue;

    const row = db.prepare(`
      SELECT r.title, r.servings_base, n.*
      FROM recipes r
      JOIN nutrition_facts n ON r.id = n.recipe_id
      WHERE r.id = ?
    `).get(dish.recipe_id) as any;

    if (!row) continue;

    // The nutrition_facts in DB are per base serving (or per total recipe / servings_base)
    // In our seed, the values in nutrition_facts are PER SINGLE SERVING.
    const dishFactor = dish.servings;

    const dishNutrition: NutritionValues = {
      calories: Math.round(row.calories * dishFactor),
      protein: Math.round(row.protein * dishFactor * 10) / 10,
      carbs: Math.round(row.carbs * dishFactor * 10) / 10,
      fat: Math.round(row.fat * dishFactor * 10) / 10,
      fiber: Math.round(row.fiber * dishFactor * 10) / 10,
      vit_a: Math.round(row.vit_a * dishFactor * 10) / 10,
      vit_c: Math.round(row.vit_c * dishFactor * 10) / 10,
      vit_d: Math.round(row.vit_d * dishFactor * 10) / 10,
      vit_b12: Math.round(row.vit_b12 * dishFactor * 10) / 10,
      iron: Math.round(row.iron * dishFactor * 10) / 10,
      calcium: Math.round(row.calcium * dishFactor * 10) / 10,
      potassium: Math.round(row.potassium * dishFactor * 10) / 10,
      sodium: Math.round(row.sodium * dishFactor * 10) / 10,
    };

    dishesBreakdown.push({
      recipe_id: dish.recipe_id,
      title: row.title,
      servings: dish.servings,
      nutrition: dishNutrition,
    });

    totals.calories += dishNutrition.calories;
    totals.protein += dishNutrition.protein;
    totals.carbs += dishNutrition.carbs;
    totals.fat += dishNutrition.fat;
    totals.fiber += dishNutrition.fiber;
    totals.vit_a += dishNutrition.vit_a;
    totals.vit_c += dishNutrition.vit_c;
    totals.vit_d += dishNutrition.vit_d;
    totals.vit_b12 += dishNutrition.vit_b12;
    totals.iron += dishNutrition.iron;
    totals.calcium += dishNutrition.calcium;
    totals.potassium += dishNutrition.potassium;
    totals.sodium += dishNutrition.sodium;
  }

  // Calculate RDA percentages
  const percentagesRDA = {
    calories: Math.round((totals.calories / DAILY_RECOMMENDED_VALUES.calories) * 100),
    protein: Math.round((totals.protein / DAILY_RECOMMENDED_VALUES.protein) * 100),
    carbs: Math.round((totals.carbs / DAILY_RECOMMENDED_VALUES.carbs) * 100),
    fat: Math.round((totals.fat / DAILY_RECOMMENDED_VALUES.fat) * 100),
    fiber: Math.round((totals.fiber / DAILY_RECOMMENDED_VALUES.fiber) * 100),
    vit_a: Math.round((totals.vit_a / DAILY_RECOMMENDED_VALUES.vit_a) * 100),
    vit_c: Math.round((totals.vit_c / DAILY_RECOMMENDED_VALUES.vit_c) * 100),
    vit_d: Math.round((totals.vit_d / DAILY_RECOMMENDED_VALUES.vit_d) * 100),
    vit_b12: Math.round((totals.vit_b12 / DAILY_RECOMMENDED_VALUES.vit_b12) * 100),
    iron: Math.round((totals.iron / DAILY_RECOMMENDED_VALUES.iron) * 100),
    calcium: Math.round((totals.calcium / DAILY_RECOMMENDED_VALUES.calcium) * 100),
    potassium: Math.round((totals.potassium / DAILY_RECOMMENDED_VALUES.potassium) * 100),
    sodium: Math.round((totals.sodium / DAILY_RECOMMENDED_VALUES.sodium) * 100),
  };

  return {
    totals,
    percentagesRDA,
    dishesBreakdown,
  };
}
