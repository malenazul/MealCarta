import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { soundManager } from '../../utils/audio';
import { X, Lock, Mail, User as UserIcon, Sparkles, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    soundManager.playClick();
    setEmail('curador@mealcarta.org');
    setPassword('mealcarta123');
    setAuthMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-dark-900 border border-violet-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-dark-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-500/30 border border-violet-500/40 mb-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="font-serif font-bold text-xl text-white">
            {authMode === 'login' ? 'Acceso al Registro Encarta' : 'Crear Credencial de Investigador'}
          </h2>
          <p className="text-xs text-slate-400">
            {authMode === 'login'
              ? 'Ingresa tus credenciales seguras para sincronizar tu cuaderno y banquete.'
              : 'Regístrate para calificar recetas, guardar platos y publicar pedidos.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-xl text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Nombre de Usuario:</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: MarcoPolo99"
                  className="w-full pl-9 pr-3 py-2 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Correo Electrónico:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigador@mealcarta.org"
                className="w-full pl-9 pr-3 py-2 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Contraseña:</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-dark-850 text-slate-100 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-xs shadow-glow-combined hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {loading
              ? 'Procesando...'
              : authMode === 'login'
              ? 'Iniciar Sesión Segura'
              : 'Registrar Cuenta'}
          </button>
        </form>

        {/* Demo login shortcut */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-3">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
          >
            ⚡ Usar cuenta demo de Curador (1-Click)
          </button>

          <div>
            {authMode === 'login' ? (
              <p className="text-xs text-slate-400">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setAuthMode('register');
                    setError(null);
                  }}
                  className="text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setAuthMode('login');
                    setError(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
