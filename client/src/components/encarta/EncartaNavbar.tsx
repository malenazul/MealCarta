import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { 
  Compass, 
  BookOpen, 
  Activity, 
  ShoppingCart, 
  Users, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export const EncartaNavbar: React.FC = () => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    banquet, 
    authModalOpen,
    setAuthModalOpen,
    setAuthMode,
    soundEnabled, 
    toggleSound, 
    logout,
    t,
    language,
    setLanguage,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'atlas', label: 'Atlas Culinario', icon: Compass },
    { id: 'articles', label: 'Artículos', icon: BookOpen },
    { id: 'nutrition', label: 'Lab Nutricional', icon: Activity, badge: banquet.length > 0 ? banquet.length : undefined },
    { id: 'shopping', label: 'Lista de Compras', icon: ShoppingCart, badge: banquet.length > 0 ? banquet.length : undefined },
    { id: 'community', label: 'Comunidad & Pedidos', icon: Users },
    { id: 'favorites', label: 'Mi Cuaderno', icon: Bookmark, authRequired: true },
  ];

  const handleTabClick = (tabId: string, authRequired?: boolean) => {
    if (authRequired && !user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setActiveTab(tabId as any);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[1200] w-full border-b border-violet-900/50 bg-dark-900 shadow-2xl backdrop-blur-md">
      {/* Top Classic Encarta Banner Bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-violet-950/90 via-dark-900 to-cyan-950/80 text-xs border-b border-violet-500/20 text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-cyan-400 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>ENCARTA NEO EDITION v2.4</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Base Culinaria Universal de Conocimiento</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSound}
            className="flex items-center space-x-1.5 hover:text-cyan-300 transition-colors"
            title={soundEnabled ? 'Silenciar audio enciclopédico' : 'Activar audio enciclopédico'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400 font-mono font-medium">{t('audio_on')}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 font-mono font-medium">{t('audio_off')}</span>
              </>
            )}</button>
            {/* <LanguageSwitcher className="ml-2" /> */}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleTabClick('atlas')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-encarta-violet to-encarta-cyan p-0.5 shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-serif font-bold text-xl tracking-wider bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  MEALCARTA
                </span>
              </div>
              <span className="block text-[10px] tracking-widest text-cyan-400/90 uppercase font-mono">
                Atlas Gastronómico
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id, item.authRequired)}
                  className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/50 shadow-glow-cyan font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-violet-950/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-encarta-violet text-white shadow-glow-violet">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3 shrink-0">
            {user ? (
              <div className="flex items-center space-x-3 bg-dark-850 border border-violet-800/40 px-3 py-1.5 rounded-xl">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} 
                  alt={user.username}
                  className="w-7 h-7 rounded-lg border border-cyan-400/60"
                />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">{user.username}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Investigador Gastronómico</div>
                </div>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-200 hover:text-white hover:bg-violet-950/40 border border-violet-800/40 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-encarta-violet to-encarta-cyan text-white shadow-glow-combined hover:opacity-95 transition-opacity"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleSound}
              className="p-2 text-cyan-400 hover:bg-dark-800 rounded-lg"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-dark-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-violet-900/60 bg-dark-900/95 px-4 pt-2 pb-5 space-y-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.authRequired)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/50'
                    : 'text-slate-300 hover:bg-violet-950/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-encarta-violet text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80">
            {user ? (
              <div className="flex items-center justify-between px-2 py-2 bg-dark-850 rounded-xl border border-violet-800/40">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                    alt={user.username}
                    className="w-8 h-8 rounded-lg border border-cyan-400/60"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{user.username}</div>
                    <div className="text-xs text-cyan-400 font-mono">Investigador Gastronómico</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-rose-400 hover:bg-dark-800 rounded-lg"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-dark-850 text-slate-200 border border-violet-800/40"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-gradient-to-r from-encarta-violet to-encarta-cyan text-white"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
