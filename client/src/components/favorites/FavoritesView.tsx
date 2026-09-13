import React, { useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { 
  Bookmark, 
  Sparkles, 
  Clock, 
  Flame, 
  Plus, 
  Compass 
} from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, refreshFavorites, setSelectedRecipe, addToBanquet, setActiveTab } = useApp();

  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-violet-900/40 pb-6">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Bookmark className="w-4 h-4" />
          <span>Fondo Personal del Investigador</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Mi Cuaderno de Recetas Guardadas
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Tus artículos y preparaciones gastronómicas favoritas archivadas para acceder rápidamente desde tu celular o computadora.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-dark-900/60 border border-violet-900/40 rounded-2xl space-y-4">
          <Bookmark className="w-12 h-12 mx-auto text-violet-500/40" />
          <h3 className="font-serif text-lg font-bold text-slate-200">
            Tu cuaderno está en blanco
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Explora las ciudades del Atlas o el catálogo de recetas y presiona el ícono del cuaderno para guardar tus platos preferidos aquí.
          </p>
          <button
            onClick={() => setActiveTab('atlas')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold shadow-glow-cyan inline-flex items-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Ir al Atlas Culinario</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group bg-dark-900 border border-violet-900/40 hover:border-cyan-400/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-glow-cyan flex flex-col cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold bg-dark-950/90 text-cyan-300 border border-cyan-500/40 rounded-full">
                  {recipe.city}, {recipe.country_code}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-400 italic line-clamp-1 mt-0.5">
                    "{recipe.original_name}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{recipe.prep_time + recipe.cook_time} min</span>
                  </span>

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
