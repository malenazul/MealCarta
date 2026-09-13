import React, { useState, useEffect } from 'react';
import { CommunityRequest } from '../../types';
import { api } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Users, 
  PlusCircle, 
  Send, 
  MessageSquare, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ChefHat
} from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const { user, setAuthModalOpen, setAuthMode } = useApp();
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [dishName, setDishName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    api.getRequests().then(setRequests).catch(console.error);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.createRequest(dishName, country, city || undefined, description);
      soundManager.playFanfare();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#06B6D4', '#8B5CF6']
      });
      setSuccessMsg(true);
      setDishName('');
      setCountry('');
      setCity('');
      setDescription('');
      setFormOpen(false);
      loadRequests();
      setTimeout(() => setSuccessMsg(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-violet-900/40 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Ágora de Investigadores & Solicitudes</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Comunidad Encarta: Pedidos y Recomendaciones
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            ¿Hay un plato regional histórico o una receta tradicional de tu infancia que aún no figura en el Atlas? Publica un pedido para que nuestros investigadores y la comunidad la documenten.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            if (!user) {
              setAuthMode('login');
              setAuthModalOpen(true);
              return;
            }
            setFormOpen(!formOpen);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-encarta-violet to-encarta-cyan text-white text-xs font-semibold shadow-glow-combined hover:opacity-95 flex items-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{formOpen ? 'Cerrar Formulario' : 'Hacer Pedido de Receta'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-cyan-950/80 border border-cyan-500/60 rounded-xl text-cyan-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>¡Tu pedido de receta ha sido enviado y registrado en los despachos de MealCarta!</span>
        </div>
      )}

      {/* New Request Modal / Collapsible Form */}
      {formOpen && (
        <div className="p-6 bg-dark-900 border border-violet-700/60 rounded-2xl shadow-xl space-y-4 max-w-2xl mx-auto">
          <h3 className="font-serif font-bold text-base text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Publicar un Pedido a la Comunidad</span>
          </h3>

          <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nombre del plato o receta:</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="Ej: Humita en chala salteña..."
                  className="w-full p-2.5 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">País de origen:</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ej: Argentina, Colombia, etc."
                  className="w-full p-2.5 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Ciudad o región específica (opcional):</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Salta, Oaxaca, Bretaña..."
                className="w-full p-2.5 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Detalles, ingredientes clave o recuerdos:</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntanos qué ingredientes recuerdas que llevaba, su técnica de cocción o por qué es un plato tradicional valioso..."
                className="w-full p-2.5 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-850 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold flex items-center space-x-1.5 shadow-glow-cyan disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Enviando...' : 'Publicar Pedido'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-lg text-slate-200">
          Pedidos Recientes de la Comunidad ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-dark-900/60 border border-violet-900/40 rounded-2xl">
            <MessageSquare className="w-10 h-10 mx-auto text-violet-500/40 mb-2" />
            <p className="text-sm">Aún no hay pedidos de recetas registrados.</p>
            <p className="text-xs text-slate-500 mt-1">¡Sé el primero en solicitar un plato tradicional!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-dark-900 border border-violet-900/40 hover:border-cyan-500/50 rounded-2xl shadow-lg space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-100">
                      {req.dish_name}
                    </h3>
                    <div className="flex items-center space-x-2 text-[11px] text-cyan-400 font-mono mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {req.city ? `${req.city}, ` : ''}{req.country}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-violet-950 text-violet-300 border border-violet-700/50 uppercase">
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "{req.description}"
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <img
                      src={req.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.username}`}
                      alt={req.username}
                      className="w-5 h-5 rounded-md border border-cyan-500/40"
                    />
                    <span>Pedido por <strong className="text-slate-200">{req.username}</strong></span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
