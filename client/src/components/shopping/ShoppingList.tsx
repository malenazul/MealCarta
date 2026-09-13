import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { ShoppingListResult, Recipe } from '../../types';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Circle, 
  Share2, 
  Printer, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles,
  ClipboardCheck,
  Store,
  Layers
} from 'lucide-react';

export const ShoppingList: React.FC = () => {
  const { banquet, updateBanquetServings, removeFromBanquet, addToBanquet } = useApp();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [shoppingData, setShoppingData] = useState<ShoppingListResult | null>(null);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);
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

      api.getConsolidatedShoppingList(payload)
        .then((data) => {
          setShoppingData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setShoppingData(null);
    }
  }, [banquet]);

  const handleAddDish = () => {
    if (!selectedToAdd) return;
    const found = allRecipes.find((r) => r.id === Number(selectedToAdd));
    if (found) {
      addToBanquet(found, 4);
      setSelectedToAdd('');
    }
  };

  const toggleCheck = (key: string) => {
    soundManager.playClick();
    setCheckedItems((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      
      // Check if all are completed
      if (shoppingData) {
        let allChecked = true;
        for (const cat in shoppingData.categories) {
          for (const item of shoppingData.categories[cat]) {
            const itemKey = `${item.name}-${item.unit}`;
            if (!updated[itemKey]) {
              allChecked = false;
              break;
            }
          }
        }
        if (allChecked && shoppingData.totalItems > 0) {
          soundManager.playFanfare();
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06B6D4', '#8B5CF6', '#10B981']
          });
        }
      }

      return updated;
    });
  };

  const copyForWhatsApp = () => {
    if (!shoppingData) return;
    soundManager.playFanfare();

    let text = `🛒 *LISTA DE COMPRAS - MEALCARTA ATLAS*\n`;
    text += `🍽️ *Platos a preparar:*\n`;
    shoppingData.dishesSummary.forEach((d) => {
      text += `  • ${d.title} (${d.servings} comensales)\n`;
    });
    text += `\n`;

    for (const [category, items] of Object.entries(shoppingData.categories)) {
      text += `📍 *${category.toUpperCase()}*\n`;
      items.forEach((item) => {
        const itemKey = `${item.name}-${item.unit}`;
        const mark = checkedItems[itemKey] ? '✅' : '▫️';
        text += ` ${mark} ${item.name}: ${item.totalAmount} ${item.unit}\n`;
      });
      text += `\n`;
    }

    text += `_Generado por MealCarta - Encarta Neo Gastronómico_`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  // Count checked
  const totalCount = shoppingData?.totalItems || 0;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-900/40 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Módulo de Logística & Aprovisionamiento</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Lista de Compras Inteligente y Consolidada
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Selecciona múltiples platos de cualquier rincón del mundo. Nuestro motor agrupa y suma automáticamente los ingredientes idénticos, organizándolos por secciones de supermercado para tu compra móvil.
          </p>
        </div>

        {/* Action Buttons */}
        {shoppingData && (
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={copyForWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-colors flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Copiar para WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 border border-violet-800/40 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          </div>
        )}
      </div>

      {copiedNotification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <ClipboardCheck className="w-4 h-4" />
          <span>¡Lista copiada al portapapeles con formato listo para enviar por WhatsApp!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Menu Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-dark-900 border border-violet-800/40 rounded-2xl space-y-4 overflow-hidden">
            <h2 className="font-serif font-bold text-base text-slate-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Platos Seleccionados</span>
            </h2>

            {/* Quick Add Dish */}
            <div className="flex items-center gap-2 w-full min-w-0">
              <select
                value={selectedToAdd}
                onChange={(e) => setSelectedToAdd(e.target.value)}
                className="flex-1 min-w-0 w-full px-3 py-2 bg-dark-850 text-xs text-slate-200 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400 truncate"
              >
                <option value="">Añadir plato a la lista...</option>
                {allRecipes.map((r) => (
                  <option key={r.id} value={r.id} className="bg-dark-900 text-slate-200">
                    {r.title} ({r.city})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddDish}
                disabled={!selectedToAdd}
                className="shrink-0 p-2 bg-violet-600 hover:bg-cyan-500 hover:text-dark-950 text-white rounded-xl disabled:opacity-40 transition-colors shadow-glow-violet"
                title="Añadir plato a la lista"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Dishes list */}
            {banquet.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-800 rounded-xl text-xs">
                Suma platos para calcular los ingredientes consolidados.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {banquet.map((item) => (
                  <div
                    key={item.recipe.id}
                    className="p-3 bg-dark-850 border border-slate-800 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {item.recipe.title}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono">
                        {item.recipe.city}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <div className="flex items-center space-x-1 bg-dark-900 px-2 py-0.5 rounded-lg border border-slate-700/60 text-xs">
                        <button
                          onClick={() => updateBanquetServings(item.recipe.id, item.servings - 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono font-bold text-cyan-300 px-1">
                          {item.servings}p
                        </span>
                        <button
                          onClick={() => updateBanquetServings(item.recipe.id, item.servings + 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromBanquet(item.recipe.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supermarket Progress Widget */}
          {shoppingData && (
            <div className="p-5 bg-gradient-to-br from-violet-950/40 via-dark-900 to-cyan-950/30 border border-cyan-500/40 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Progreso en el Mercado</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {checkedCount} de {totalCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Consolidated Ingredients by Supermarket Aisle (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!shoppingData || totalCount === 0 ? (
            <div className="p-10 bg-dark-900/60 border border-violet-900/30 rounded-2xl text-center space-y-3">
              <Store className="w-12 h-12 mx-auto text-cyan-400/40" />
              <h3 className="font-serif text-lg font-bold text-slate-200">
                Tu Canasta Encarta está Vacía
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Agrega al menos un plato tradicional con la cantidad de personas deseadas para ver la lista consolidada de ingredientes organizada por pasillo comercial.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(shoppingData.categories).map(([category, items]) => (
                <div
                  key={category}
                  className="bg-dark-900 border border-violet-800/40 rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Category Banner */}
                  <div className="px-5 py-3 bg-dark-850 border-b border-violet-900/40 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm text-cyan-300 flex items-center space-x-2">
                      <Store className="w-4 h-4 text-cyan-400" />
                      <span>{category}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-dark-900 px-2 py-0.5 rounded border border-slate-800">
                      {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-slate-800/60">
                    {items.map((item) => {
                      const itemKey = `${item.name}-${item.unit}`;
                      const isChecked = !!checkedItems[itemKey];

                      return (
                        <div
                          key={itemKey}
                          onClick={() => toggleCheck(itemKey)}
                          className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-cyan-950/20 text-slate-500'
                              : 'hover:bg-violet-950/20 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                            )}
                            <div>
                              <span className={`text-sm font-medium ${isChecked ? 'line-through' : ''}`}>
                                {item.name}
                              </span>
                              {item.recipes.length > 1 && (
                                <div className="text-[10px] text-violet-400 font-mono mt-0.5">
                                  Usado en: {item.recipes.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-sm font-bold text-cyan-300">
                              {item.totalAmount}
                            </span>{' '}
                            <span className="text-xs text-slate-400">{item.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
