import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { Recipe } from '../../types';
import { soundManager } from '../../utils/audio';
import { 
  Activity, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Flame, 
  Sparkles, 
  Layers, 
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';

export const NutritionCalculator: React.FC = () => {
  const { banquet, addToBanquet, removeFromBanquet, updateBanquetServings, setActiveTab } = useApp();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [aggregatedData, setAggregatedData] = useState<any>(null);
  const [selectedRecipeToAdd, setSelectedRecipeToAdd] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getRecipes().then(setAllRecipes).catch(console.error);
  }, []);

  useEffect(() => {
    if (banquet.length > 0) {
      setLoading(true);
      const payload = banquet.map((b) => ({
        recipe_id: b.recipe.id,
        servings: b.servings,
      }));

      api.calculateAggregatedNutrition(payload)
        .then((res) => {
          setAggregatedData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setAggregatedData(null);
    }
  }, [banquet]);

  const handleAddDish = () => {
    if (!selectedRecipeToAdd) return;
    const found = allRecipes.find((r) => r.id === Number(selectedRecipeToAdd));
    if (found) {
      addToBanquet(found, 2);
      setSelectedRecipeToAdd('');
    }
  };

  const totals = aggregatedData?.totals;
  const rda = aggregatedData?.percentagesRDA;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-900/40 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Módulo de Bioquímica y Nutrición Encarta</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Calculadora y Laboratorio Nutricional
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Modela porciones para comensales individuales o compone un banquete completo de múltiples platos sumando calorías, macronutrientes y vitaminas esenciales en tiempo real.
          </p>
        </div>

        {banquet.length > 0 && (
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('shopping');
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-encarta-violet to-encarta-cyan text-white text-xs font-semibold shadow-glow-combined hover:opacity-95 flex items-center space-x-2 self-start md:self-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Generar Lista de Compras de este Banquete</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Banquet Dishes Manager (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-dark-900/90 border border-violet-800/40 rounded-2xl shadow-lg space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-slate-100 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Platos en el Banquete ({banquet.length})</span>
              </h2>
            </div>

            {/* Quick Add Dish Selector */}
            <div className="flex items-center gap-2 w-full min-w-0">
              <select
                value={selectedRecipeToAdd}
                onChange={(e) => setSelectedRecipeToAdd(e.target.value)}
                className="flex-1 min-w-0 w-full px-3 py-2 bg-dark-850 text-xs text-slate-200 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400 truncate"
              >
                <option value="">Seleccionar plato para sumar...</option>
                {allRecipes.map((r) => (
                  <option key={r.id} value={r.id} className="bg-dark-900 text-slate-200">
                    {r.title} ({r.city}, {r.country})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddDish}
                disabled={!selectedRecipeToAdd}
                className="shrink-0 p-2 bg-violet-600 hover:bg-cyan-500 hover:text-dark-950 text-white rounded-xl disabled:opacity-40 transition-colors shadow-glow-violet"
                title="Añadir plato al banquete"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Dishes list */}
            {banquet.length === 0 ? (
              <div className="text-center py-10 text-slate-400 border border-dashed border-slate-800 rounded-xl">
                <Scale className="w-8 h-8 mx-auto text-violet-500/40 mb-2" />
                <p className="text-xs">No has sumado platos al banquete aún.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Usa el selector arriba o explora el Atlas para sumar platos tradicionales.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {banquet.map((item) => (
                  <div
                    key={item.recipe.id}
                    className="p-3 bg-dark-850 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img
                        src={item.recipe.image_url}
                        alt={item.recipe.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-violet-700/40"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {item.recipe.title}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono">
                          {item.recipe.city}, {item.recipe.country}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="flex items-center space-x-1.5 bg-dark-900 px-2 py-1 rounded-lg border border-slate-700/60">
                        <button
                          onClick={() => updateBanquetServings(item.recipe.id, item.servings - 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-cyan-300 w-4 text-center">
                          {item.servings}
                        </span>
                        <button
                          onClick={() => updateBanquetServings(item.recipe.id, item.servings + 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromBanquet(item.recipe.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Eliminar del banquete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Nutrition Totals & RDA Gauges (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {banquet.length === 0 ? (
            <div className="p-8 bg-dark-900/60 border border-violet-900/30 rounded-2xl text-center space-y-3">
              <Sparkles className="w-12 h-12 mx-auto text-cyan-400/40" />
              <h3 className="font-serif text-lg font-bold text-slate-200">
                El Laboratorio está en espera
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Suma uno o varios platos a la bandeja de la izquierda para observar la sumatoria energética, macronutrientes balanceados y el aporte de micronutrientes frente a las guías de la OMS/FDA.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Macro Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-dark-900 border border-amber-500/30 rounded-2xl text-center shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Calorías Totales</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                    {totals?.calories || 0}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {rda?.calories || 0}% Valor Diario
                  </div>
                </div>

                <div className="p-4 bg-dark-900 border border-cyan-500/30 rounded-2xl text-center shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Proteínas</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                    {totals?.protein || 0}g
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {rda?.protein || 0}% Valor Diario
                  </div>
                </div>

                <div className="p-4 bg-dark-900 border border-violet-500/30 rounded-2xl text-center shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Carbohidratos</div>
                  <div className="text-2xl font-bold font-mono text-violet-400 mt-1">
                    {totals?.carbs || 0}g
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {rda?.carbs || 0}% Valor Diario
                  </div>
                </div>

                <div className="p-4 bg-dark-900 border border-rose-500/30 rounded-2xl text-center shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Grasas Totales</div>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    {totals?.fat || 0}g
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {rda?.fat || 0}% Valor Diario
                  </div>
                </div>
              </div>

              {/* Vitamins and Minerals Progress Bars */}
              <div className="p-5 bg-dark-900/90 border border-violet-800/40 rounded-2xl shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-violet-900/40 pb-3">
                  <h3 className="font-serif font-bold text-sm text-slate-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Balance de Micronutrientes y Vitaminas (% IDR)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Ref: 2,000 kcal/día</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { name: 'Vitamina A', val: totals?.vit_a, unit: 'mcg', pct: rda?.vit_a },
                    { name: 'Vitamina C', val: totals?.vit_c, unit: 'mg', pct: rda?.vit_c },
                    { name: 'Vitamina D', val: totals?.vit_d, unit: 'mcg', pct: rda?.vit_d },
                    { name: 'Vitamina B12', val: totals?.vit_b12, unit: 'mcg', pct: rda?.vit_b12 },
                    { name: 'Hierro', val: totals?.iron, unit: 'mg', pct: rda?.iron },
                    { name: 'Calcio', val: totals?.calcium, unit: 'mg', pct: rda?.calcio || rda?.calcium },
                    { name: 'Potasio', val: totals?.potassium, unit: 'mg', pct: rda?.potassium },
                    { name: 'Sodio', val: totals?.sodium, unit: 'mg', pct: rda?.sodium },
                  ].map((item) => {
                    const percentage = Math.min(item.pct || 0, 150);
                    return (
                      <div key={item.name} className="space-y-1.5 p-2 bg-dark-850/60 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between text-slate-300">
                          <span className="font-medium">{item.name}</span>
                          <span className="font-mono text-cyan-300 font-bold">
                            {item.val || 0} {item.unit} ({item.pct || 0}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
