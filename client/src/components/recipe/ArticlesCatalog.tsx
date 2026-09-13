import React, { useState, useEffect } from 'react';
import { Recipe } from '../../types';
import { api } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Plus, 
  Bookmark, 
  Sparkles,
  Flame
} from 'lucide-react';

export const ArticlesCatalog: React.FC = () => {
  const { setSelectedRecipe, addToBanquet } = useApp();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getRecipes({ search, category, difficulty })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [search, category, difficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-violet-900/40 pb-6">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Fondo Enciclopédico General</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Artículos Gastronómicos & Recetas Históricas
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Explora la colección universal de preparaciones tradicionales curadas con precisión histórica, ingredientes auténticos y datos de origen.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-dark-900 border border-violet-800/40 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por plato, ciudad o ingrediente..."
            className="w-full pl-9 pr-3 py-2 bg-dark-850 text-xs text-slate-200 placeholder-slate-400 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-dark-850 text-xs text-slate-200 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
          >
            <option value="">Todas las Categorías</option>
            <option value="Plato Principal">Platos Principales</option>
            <option value="Entrada">Entradas & Tapas</option>
            <option value="Sopa/Guiso">Sopas & Guisos</option>
            <option value="Postre">Postres & Dulces</option>
          </select>
        </div>

        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 bg-dark-850 text-xs text-slate-200 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
          >
            <option value="">Cualquier Dificultad</option>
            <option value="Fácil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Experto">Experto</option>
          </select>
        </div>
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div className="text-center py-16 text-cyan-400 font-mono text-sm">
          Consultando archivos de la enciclopedia...
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No se encontraron recetas que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group bg-dark-900 border border-violet-900/40 hover:border-cyan-400/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-glow-cyan flex flex-col cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-dark-950/90 text-cyan-300 border border-cyan-500/40 rounded-full">
                    {recipe.city}, {recipe.country_code}
                  </span>
                </div>

                <span className="absolute bottom-2.5 right-3 text-xs font-semibold text-amber-400 bg-dark-950/80 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center space-x-1">
                  <span>★</span>
                  <span>{recipe.average_rating}</span>
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-slate-400 italic font-serif">
                    "{recipe.original_name}"
                  </div>
                  <h3 className="font-serif font-bold text-lg text-slate-100 group-hover:text-cyan-300 transition-colors mt-0.5 line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {recipe.story_history}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{recipe.prep_time + recipe.cook_time} min</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-violet-400" />
                      <span>{recipe.nutrition_facts?.calories || 450} kcal</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToBanquet(recipe);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-violet-950 hover:bg-cyan-500 hover:text-dark-950 text-cyan-300 border border-violet-700/50 transition-colors text-xs font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Banquete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
