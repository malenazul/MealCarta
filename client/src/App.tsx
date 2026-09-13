import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { EncartaNavbar } from './components/encarta/EncartaNavbar';
import { AtlasMap } from './components/map/AtlasMap';
import { ArticlesCatalog } from './components/recipe/ArticlesCatalog';
import { NutritionCalculator } from './components/nutrition/NutritionCalculator';
import { ShoppingList } from './components/shopping/ShoppingList';
import { CommunityHub } from './components/community/CommunityHub';
import { FavoritesView } from './components/favorites/FavoritesView';
import { RecipeModal } from './components/recipe/RecipeModal';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab, selectedRecipe, setSelectedRecipe } = useApp();

  return (
    <main className="flex-1 flex flex-col w-full relative">
      {activeTab === 'atlas' && <AtlasMap />}
      {activeTab === 'articles' && <ArticlesCatalog />}
      {activeTab === 'nutrition' && <NutritionCalculator />}
      {activeTab === 'shopping' && <ShoppingList />}
      {activeTab === 'community' && <CommunityHub />}
      {activeTab === 'favorites' && <FavoritesView />}

      {/* Global Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Global Auth Modal */}
      <AuthModal />
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans bg-cyber-grid">
        <EncartaNavbar />
        <MainContent />
        
        {/* Encarta Classic Minimal Footer */}
        <footer className="border-t border-violet-950/60 bg-dark-900/90 py-4 px-6 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 1995–2026 MealCarta Corporation. Todos los derechos reservados.</span>
            <span className="text-cyan-400/80">Edición Multimedia Encarta Neo — Atlas Gastronómico Mundial</span>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
