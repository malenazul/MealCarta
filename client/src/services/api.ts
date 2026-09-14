import { Recipe, CountryPin, ShoppingListResult, CommunityRequest, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';
  
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mealcarta_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
  },

  async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrar usuario');
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'No autorizado');
    return data;
  },

  // Recipes & Atlas
  async getRecipes(params?: { search?: string; country?: string; category?: string; difficulty?: string }): Promise<Recipe[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.country) query.set('country', params.country);
    if (params?.category) query.set('category', params.category);
    if (params?.difficulty) query.set('difficulty', params.difficulty);

    const res = await fetch(`${API_BASE}/recipes?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Error al cargar recetas');
    return res.json();
  },

  async getCountries(): Promise<CountryPin[]> {
    const res = await fetch(`${API_BASE}/recipes/countries`);
    if (!res.ok) throw new Error('Error al cargar países del Atlas');
    return res.json();
  },

  async getRecipeById(id: number): Promise<Recipe> {
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Error al cargar la receta');
    return res.json();
  },

  // Nutrition Aggregator
  async calculateAggregatedNutrition(dishes: { recipe_id: number; servings: number }[]): Promise<any> {
    const res = await fetch(`${API_BASE}/nutrition/aggregate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishes }),
    });
    if (!res.ok) throw new Error('Error al calcular nutrición');
    return res.json();
  },

  // Consolidated Shopping List
  async getConsolidatedShoppingList(dishes: { recipe_id: number; servings: number }[]): Promise<ShoppingListResult> {
    const res = await fetch(`${API_BASE}/shopping/consolidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishes }),
    });
    if (!res.ok) throw new Error('Error al generar lista de compras');
    return res.json();
  },

  // Community & Interaction
  async toggleFavorite(recipeId: number): Promise<{ is_favorite: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/community/recipes/${recipeId}/favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al actualizar favoritos');
    return data;
  },

  async getFavorites(): Promise<Recipe[]> {
    const res = await fetch(`${API_BASE}/community/favorites`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Error al cargar favoritos');
    return res.json();
  },

  async addReview(recipeId: number, rating: number, comment: string, tip?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/community/recipes/${recipeId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment, tip }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al guardar la reseña');
  },

  async getRequests(): Promise<CommunityRequest[]> {
    const res = await fetch(`${API_BASE}/community/requests`);
    if (!res.ok) throw new Error('Error al consultar solicitudes');
    return res.json();
  },

  async createRequest(dish_name: string, country: string, city: string | undefined, description: string): Promise<void> {
    const res = await fetch(`${API_BASE}/community/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ dish_name, country, city, description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al enviar pedido');
  },
};
