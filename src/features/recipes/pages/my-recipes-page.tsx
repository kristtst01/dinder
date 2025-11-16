import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { useAuth } from '@/common/hooks/use-auth';
import { useUserRecipes } from '../hooks/use-user-recipes';
import { RecipeCard } from '@/shared/recipe-card';
import { Navbar } from '@/shared/navbar';

export function MyRecipesPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { recipes, loading: recipesLoading } = useUserRecipes();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [authLoading, user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNavOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Recipes</h1>
          </div>

          <button
            onClick={() => navigate('/recipe/create')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Create new recipe"
          >
            <Plus size={24} className="text-gray-700 dark:text-gray-200" />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Recipes</h1>
              {!recipesLoading && recipes.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/recipe/create')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>New Recipe</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-32 md:p-6 md:pb-6">
          {recipesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No recipes yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start sharing your culinary creations with the community!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
