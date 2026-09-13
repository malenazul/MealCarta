export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  favorites_count?: number;
  reviews_count?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  amount_base: number;
  unit: string;
  category: string;
}

export interface Instruction {
  id: number;
  step_number: number;
  instruction: string;
}

export interface NutritionFacts {
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

export interface Review {
  id: number;
  rating: number;
  comment: string;
  tip?: string;
  created_at: string;
  username: string;
  avatar?: string;
}

export interface Recipe {
  id: number;
  title: string;
  original_name: string;
  country: string;
  country_code: string;
  city: string;
  lat: number;
  lng: number;
  story_history: string;
  cultural_notes?: string;
  fun_facts?: string;
  prep_time: number;
  cook_time: number;
  servings_base: number;
  difficulty: 'Fácil' | 'Media' | 'Experto';
  image_url: string;
  category: string;
  author_name?: string;
  average_rating: number;
  reviews_count: number;
  is_favorite?: boolean;
  ingredients?: Ingredient[];
  instructions?: Instruction[];
  nutrition_facts?: NutritionFacts;
  reviews?: Review[];
}

export interface CountryPin {
  country: string;
  country_code: string;
  city: string;
  lat: number;
  lng: number;
  total_recipes: number;
  sample_image: string;
}

export interface BanquetDish {
  recipe: Recipe;
  servings: number;
}

export interface ConsolidatedIngredient {
  name: string;
  totalAmount: number;
  unit: string;
  category: string;
  recipes: string[];
}

export interface ShoppingListResult {
  categories: Record<string, ConsolidatedIngredient[]>;
  totalItems: number;
  dishesSummary: { title: string; servings: number }[];
}

export interface CommunityRequest {
  id: number;
  user_id: number;
  dish_name: string;
  country: string;
  city?: string;
  description: string;
  status: string;
  created_at: string;
  username: string;
  avatar?: string;
}
