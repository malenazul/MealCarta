import React, { useState, useEffect } from 'react';
import { Recipe, Review } from '../../types';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  X, 
  Bookmark, 
  Plus, 
  Clock, 
  Users, 
  Flame, 
  MapPin, 
  Sparkles, 
  ChefHat, 
  CheckCircle2, 
  Star, 
  Share2, 
  MessageSquare,
  Info,
  Scale,
  Minus,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe: initialRecipe, onClose }) => {
  const { user, addToBanquet, setAuthModalOpen, setAuthMode, refreshFavorites } = useApp();
  const [fullRecipe, setFullRecipe] = useState<Recipe | null>(initialRecipe);
  const [activeTab, setActiveTab] = useState<'history' | 'ingredients' | 'steps' | 'nutrition' | 'reviews'>('history');
  const [servings, setServings] = useState<number>(initialRecipe?.servings_base || 4);
  const [isFavorite, setIsFavorite] = useState<boolean>(initialRecipe?.is_favorite || false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  
  // Review form state
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [userTip, setUserTip] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch full details if needed
  useEffect(() => {
    if (initialRecipe) {
      setServings(initialRecipe.servings_base || 4);
      setIsFavorite(!!initialRecipe.is_favorite);
      api.getRecipeById(initialRecipe.id)
        .then((data) => {
          setFullRecipe(data);
          setIsFavorite(!!data.is_favorite);
        })
        .catch(console.error);
    }
  }, [initialRecipe]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!initialRecipe || !fullRecipe) return null;

  const baseServings = fullRecipe.servings_base || 4;
  const ratio = servings / baseServings;

  const handleFavoriteToggle = async () => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    try {
      soundManager.playClick();
      const res = await api.toggleFavorite(fullRecipe.id);
      setIsFavorite(res.is_favorite);
      if (res.is_favorite) {
        soundManager.playFanfare();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06B6D4', '#8B5CF6', '#F59E0B']
        });
      }
      refreshFavorites();
    } catch (err) {
      console.error('Favorite toggle failed', err);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      await api.addReview(fullRecipe.id, userRating, userComment, userTip);
      soundManager.playFanfare();
      setReviewSuccess(true);
      setUserComment('');
      setUserTip('');
      // Reload recipe reviews
      const updated = await api.getRecipeById(fullRecipe.id);
      setFullRecipe(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleStep = (index: number) => {
    soundManager.playClick();
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const switchTab = (tab: any) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  const nutrition = fullRecipe.nutrition_facts;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-dark-950/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-dark-900 border border-violet-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Action Bar with High Visibility */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
          {/* Prominent Back Button */}
          <button
            onClick={onClose}
            className="pointer-events-auto px-3.5 py-2 rounded-xl bg-dark-950/95 hover:bg-violet-950 text-cyan-300 hover:text-white border-2 border-cyan-400/80 hover:border-cyan-300 shadow-glow-cyan text-xs font-bold tracking-wide flex items-center space-x-2 transition-all group scale-100 hover:scale-105 backdrop-blur-xl"
            title="Volver a la pantalla anterior (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-x-1" />
            <span>← Volver a la pantalla anterior</span>
          </button>

          {/* Prominent Close Button */}
          <button
            onClick={onClose}
            className="pointer-events-auto px-3.5 py-2 rounded-xl bg-dark-950/95 hover:bg-rose-950/90 text-slate-200 hover:text-rose-200 border border-violet-800/80 hover:border-rose-500 shadow-lg text-xs font-bold tracking-wide flex items-center space-x-1.5 transition-all backdrop-blur-xl"
            title="Cerrar cuadro (Esc)"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Encarta Article Header & Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden">
          <img
            src={fullRecipe.image_url}
            alt={fullRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>

          {/* Ribbon & Coordinates (Positioned below top button bar) */}
          <div className="absolute top-16 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-mono font-bold bg-dark-950/90 text-cyan-400 border border-cyan-500/50 rounded-full shadow-glow-cyan">
              {fullRecipe.city}, {fullRecipe.country} [{fullRecipe.country_code}]
            </span>
            <span className="px-2.5 py-1 text-xs font-mono bg-violet-950/80 text-violet-300 border border-violet-700/50 rounded-full">
              {fullRecipe.category}
            </span>
          </div>

          {/* Title & Metadata Bottom Header */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs italic text-cyan-300 font-serif">
                "{fullRecipe.original_name}"
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {fullRecipe.title}
              </h1>
              <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-300">
                <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{fullRecipe.average_rating}</span>
                  <span className="text-slate-400">({fullRecipe.reviews_count} reseñas)</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Prep: {fullRecipe.prep_time}m | Cocción: {fullRecipe.cook_time}m</span>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-700/40">
                  {fullRecipe.difficulty}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2.5 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-rose-950/70 border-rose-500 text-rose-400 shadow-lg'
                    : 'bg-dark-850/80 border-violet-800/60 text-slate-300 hover:text-white'
                }`}
                title={isFavorite ? 'Guardado en Cuaderno' : 'Guardar en Favoritos'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => {
                  addToBanquet(fullRecipe, servings);
                  confetti({
                    particleCount: 25,
                    spread: 45,
                    origin: { y: 0.7 },
                    colors: ['#06B6D4', '#8B5CF6']
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-encarta-violet to-encarta-cyan text-white text-xs font-semibold shadow-glow-combined hover:opacity-95 flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Sumar al Banquete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-violet-900/50 bg-dark-950/60 px-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'history', label: 'Historia & Tradición' },
            { id: 'ingredients', label: 'Ingredientes & Porciones' },
            { id: 'steps', label: 'Preparación' },
            { id: 'nutrition', label: 'Nutrición & Vitaminas' },
            { id: 'reviews', label: `Reseñas (${fullRecipe.reviews_count})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`py-3 px-4 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: HISTORIA */}
          {activeTab === 'history' && (
            <div className="space-y-6 text-slate-200">
              <div className="prose prose-invert max-w-none">
                <h3 className="font-serif text-lg font-bold text-cyan-300 mb-2 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>Crónica Histórica y Origen</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line font-serif">
                  {fullRecipe.story_history}
                </p>
              </div>

              {fullRecipe.cultural_notes && (
                <div className="p-4 rounded-xl bg-dark-850/90 border border-violet-900/60">
                  <h4 className="font-serif font-bold text-sm text-violet-300 mb-1 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span>Ritual Social & Costumbres Culinarias</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {fullRecipe.cultural_notes}
                  </p>
                </div>
              )}

              {fullRecipe.fun_facts && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-950/40 via-dark-850 to-cyan-950/30 border border-cyan-500/40 shadow-glow-cyan">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono font-bold mb-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Archivo Encarta: ¿Sabías que...?</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {fullRecipe.fun_facts}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INGREDIENTES & COMENSALES */}
          {activeTab === 'ingredients' && (
            <div className="space-y-6">
              {/* Servings Dynamic Scaler */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-850 border border-violet-800/40 rounded-xl gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Calculadora de Comensales</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Ajusta la cantidad de personas y los ingredientes se recalcularán automáticamente.
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-start sm:self-center">
                  <button
                    onClick={() => {
                      if (servings > 1) {
                        soundManager.playClick();
                        setServings(servings - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-dark-900 border border-violet-700/50 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold font-mono text-cyan-300">{servings}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {servings === 1 ? 'persona' : 'personas'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setServings(servings + 1);
                    }}
                    className="w-8 h-8 rounded-lg bg-dark-900 border border-violet-700/50 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scaled Ingredients Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fullRecipe.ingredients?.map((ing) => {
                  const scaledAmount = Math.round((ing.amount_base * ratio) * 10) / 10;
                  return (
                    <div
                      key={ing.id}
                      className="p-3 bg-dark-850/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{ing.name}</div>
                        <div className="text-[10px] text-violet-400 font-mono">{ing.category}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-cyan-300">
                          {scaledAmount}
                        </span>{' '}
                        <span className="text-xs text-slate-400">{ing.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PREPARACIÓN PASO A PASO */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-2">
                Toca cada paso para marcarlo como completado mientras cocinas:
              </div>

              {fullRecipe.instructions?.map((inst) => {
                const done = !!completedSteps[inst.step_number];
                return (
                  <div
                    key={inst.id}
                    onClick={() => toggleStep(inst.step_number)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                      done
                        ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-400'
                        : 'bg-dark-850/80 border-violet-900/40 hover:border-violet-600/60 text-slate-200'
                    }`}
                  >
                    <div className="pt-0.5">
                      <CheckCircle2
                        className={`w-5 h-5 transition-colors ${
                          done ? 'text-cyan-400 fill-cyan-950' : 'text-slate-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
                        Paso {inst.step_number}
                      </div>
                      <p className={`text-sm leading-relaxed ${done ? 'line-through opacity-75' : ''}`}>
                        {inst.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: NUTRICIÓN Y VITAMINAS */}
          {activeTab === 'nutrition' && nutrition && (
            <div className="space-y-6">
              <div className="p-4 bg-dark-850 rounded-xl border border-violet-800/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-200">
                    Aporte Nutricional Estimado ({servings} {servings === 1 ? 'porción' : 'porciones'})
                  </span>
                  <span className="text-xs font-mono text-cyan-300">
                    Base: {Math.round(nutrition.calories * ratio)} kcal
                  </span>
                </div>

                {/* Macronutrient Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Calorías', val: `${Math.round(nutrition.calories * ratio)} kcal`, color: 'text-amber-400' },
                    { label: 'Proteínas', val: `${Math.round(nutrition.protein * ratio * 10) / 10} g`, color: 'text-cyan-400' },
                    { label: 'Carbohidratos', val: `${Math.round(nutrition.carbs * ratio * 10) / 10} g`, color: 'text-violet-400' },
                    { label: 'Grasas', val: `${Math.round(nutrition.fat * ratio * 10) / 10} g`, color: 'text-rose-400' },
                  ].map((macro) => (
                    <div key={macro.label} className="p-3 bg-dark-900 rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] uppercase font-mono text-slate-400">{macro.label}</div>
                      <div className={`text-base font-bold font-mono mt-0.5 ${macro.color}`}>
                        {macro.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micronutrients & Vitamins Breakdown Table */}
              <div className="bg-dark-850 rounded-xl border border-violet-800/40 overflow-hidden">
                <div className="p-3 bg-dark-900 border-b border-violet-900/40 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Tabla de Vitaminas y Minerales Clave
                </div>
                <div className="divide-y divide-slate-800/60 text-xs">
                  {[
                    { name: 'Vitamina A', amount: `${Math.round(nutrition.vit_a * ratio)} mcg`, rda: `${Math.round(((nutrition.vit_a * ratio) / 800) * 100)}%` },
                    { name: 'Vitamina C', amount: `${Math.round(nutrition.vit_c * ratio)} mg`, rda: `${Math.round(((nutrition.vit_c * ratio) / 80) * 100)}%` },
                    { name: 'Vitamina D', amount: `${Math.round(nutrition.vit_d * ratio * 10) / 10} mcg`, rda: `${Math.round(((nutrition.vit_d * ratio) / 15) * 100)}%` },
                    { name: 'Vitamina B12', amount: `${Math.round(nutrition.vit_b12 * ratio * 10) / 10} mcg`, rda: `${Math.round(((nutrition.vit_b12 * ratio) / 2.4) * 100)}%` },
                    { name: 'Hierro', amount: `${Math.round(nutrition.iron * ratio * 10) / 10} mg`, rda: `${Math.round(((nutrition.iron * ratio) / 14) * 100)}%` },
                    { name: 'Calcio', amount: `${Math.round(nutrition.calcium * ratio)} mg`, rda: `${Math.round(((nutrition.calcium * ratio) / 1000) * 100)}%` },
                    { name: 'Potasio', amount: `${Math.round(nutrition.potassium * ratio)} mg`, rda: `${Math.round(((nutrition.potassium * ratio) / 3500) * 100)}%` },
                    { name: 'Sodio', amount: `${Math.round(nutrition.sodium * ratio)} mg`, rda: `${Math.round(((nutrition.sodium * ratio) / 2300) * 100)}%` },
                  ].map((vit) => (
                    <div key={vit.name} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-slate-300 font-medium">{vit.name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="font-mono text-cyan-300">{vit.amount}</span>
                        <span className="font-mono text-[11px] text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded">
                          {vit.rda} IDR
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESEÑAS & COMUNIDAD */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <div className="p-4 bg-dark-850 rounded-xl border border-violet-800/40">
                <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Calificar y comentar este plato tradicional</span>
                </h4>

                {reviewSuccess && (
                  <div className="p-3 mb-3 bg-cyan-950/60 border border-cyan-500/60 text-cyan-300 rounded-lg text-xs font-semibold">
                    ¡Gracias! Tu reseña y consejo culinario han sido agregados a la enciclopedia.
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Puntuación:</label>
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setUserRating(star);
                          }}
                          className="p-1 text-lg transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= userRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Comentario sobre la preparación:</label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows={2}
                      required
                      placeholder="Comparte tu experiencia cocinando este plato..."
                      className="w-full p-2.5 bg-dark-900 text-xs text-slate-200 rounded-lg border border-violet-800/40 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Consejo o secreto de cocina (opcional):</label>
                    <input
                      type="text"
                      value={userTip}
                      onChange={(e) => setUserTip(e.target.value)}
                      placeholder="Ej: Dejar reposar 15 minutos antes de cortar..."
                      className="w-full p-2 bg-dark-900 text-xs text-slate-200 rounded-lg border border-violet-800/40 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {submittingReview ? 'Publicando...' : 'Publicar Reseña'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {fullRecipe.reviews && fullRecipe.reviews.length > 0 ? (
                  fullRecipe.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-dark-850/70 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={rev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.username}`}
                            alt={rev.username}
                            className="w-6 h-6 rounded-md border border-cyan-500/40"
                          />
                          <span className="text-xs font-semibold text-slate-200">{rev.username}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-400 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                      {rev.tip && (
                        <div className="p-2.5 bg-dark-900 rounded-lg border border-cyan-900/40 text-[11px] text-cyan-300">
                          <strong className="text-cyan-400">💡 Consejo:</strong> {rev.tip}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Aún no hay reseñas para este plato. ¡Sé el primero en calificarlo!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Prominent Back/Close Button */}
        <div className="px-6 py-3.5 bg-dark-950/95 border-t border-violet-900/50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-violet-950 text-cyan-300 hover:text-white border border-cyan-500/60 hover:border-cyan-300 shadow-glow-cyan text-xs font-bold flex items-center space-x-2 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-x-1" />
            <span>← Volver a la pantalla anterior</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-dark-900 border border-slate-700 text-cyan-300 font-bold">ESC</kbd> o toca fuera para cerrar
          </span>
        </div>
      </div>
    </div>
  );
};
