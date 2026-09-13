import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Recipe, BanquetDish } from '../types';
import { api } from '../services/api';
import { soundManager } from '../utils/audio';
import { Language, TranslationKey, translations } from '../i18n/translations';

export type ActiveTab = 'atlas' | 'articles' | 'nutrition' | 'shopping' | 'community' | 'favorites';

interface AppContextType {
  user: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  banquet: BanquetDish[];
  addToBanquet: (recipe: Recipe, servings?: number) => void;
  removeFromBanquet: (recipeId: number) => void;
  updateBanquetServings: (recipeId: number, servings: number) => void;
  clearBanquet: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (user: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  favorites: Recipe[];
  refreshFavorites: () => Promise<void>;
  refreshUser: () => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTabState] = useState<ActiveTab>('atlas');
  const [selectedRecipe, setSelectedRecipeState] = useState<Recipe | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [banquet, setBanquet] = useState<BanquetDish[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mealcarta_language') as Language;
      if (saved && translations[saved]) return saved;
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    soundManager.playClick();
    setLanguageState(lang);
    localStorage.setItem('mealcarta_language', lang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.es;
    return (dict as any)[key] || (translations.es as any)[key] || key;
  };

  const toggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundEnabled(next);
  };

  const setActiveTab = (tab: ActiveTab) => {
    soundManager.playClick();
    setActiveTabState(tab);
  };

  const setSelectedRecipe = (recipe: Recipe | null) => {
    if (recipe) {
      soundManager.playChime();
    } else {
      soundManager.playClick();
    }
    setSelectedRecipeState(recipe);
  };

  // Check login on start
  useEffect(() => {
    const token = localStorage.getItem('mealcarta_token');
    if (token) {
      api.getMe()
        .then((res) => {
          setUser(res.user);
          refreshFavorites();
        })
        .catch(() => {
          localStorage.removeItem('mealcarta_token');
          setUser(null);
        });
    }

    // Load initial banquet from local storage if available
    const savedBanquet = localStorage.getItem('mealcarta_banquet');
    if (savedBanquet) {
      try {
        setBanquet(JSON.parse(savedBanquet));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save banquet to localStorage
  useEffect(() => {
    localStorage.setItem('mealcarta_banquet', JSON.stringify(banquet));
  }, [banquet]);

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      // ignore
    }
  };

  const refreshFavorites = async () => {
    try {
      const favs = await api.getFavorites();
      setFavorites(favs);
    } catch {
      setFavorites([]);
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('mealcarta_token', res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    soundManager.playFanfare();
    await refreshFavorites();
  };

  const register = async (username: string, email: string, pass: string) => {
    const res = await api.register(username, email, pass);
    localStorage.setItem('mealcarta_token', res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    soundManager.playFanfare();
    await refreshFavorites();
  };

  const logout = () => {
    soundManager.playClick();
    localStorage.removeItem('mealcarta_token');
    setUser(null);
    setFavorites([]);
  };

  const addToBanquet = (recipe: Recipe, servings = recipe.servings_base || 4) => {
    soundManager.playClick();
    setBanquet((prev) => {
      const exists = prev.find((item) => item.recipe.id === recipe.id);
      if (exists) {
        return prev.map((item) =>
          item.recipe.id === recipe.id ? { ...item, servings: item.servings + servings } : item
        );
      }
      return [...prev, { recipe, servings }];
    });
  };

  const removeFromBanquet = (recipeId: number) => {
    soundManager.playClick();
    setBanquet((prev) => prev.filter((item) => item.recipe.id !== recipeId));
  };

  const updateBanquetServings = (recipeId: number, servings: number) => {
    if (servings <= 0) {
      removeFromBanquet(recipeId);
      return;
    }
    setBanquet((prev) =>
      prev.map((item) => (item.recipe.id === recipeId ? { ...item, servings } : item))
    );
  };

  const clearBanquet = () => {
    soundManager.playClick();
    setBanquet([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        selectedRecipe,
        setSelectedRecipe,
        selectedCountry,
        setSelectedCountry,
        banquet,
        addToBanquet,
        removeFromBanquet,
        updateBanquetServings,
        clearBanquet,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        soundEnabled,
        toggleSound,
        login,
        register,
        logout,
        favorites,
        refreshFavorites,
        refreshUser,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
