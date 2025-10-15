import LoadingSpinner from '@/components/loading-spinner';
import { useAuth } from '@common/hooks/use-auth';
import { LogIn, LogOut } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../components/empty-state';
import { FilterPanel, type FilterState } from '../../../shared/filter-panel';
import { RecipeCard } from '../../../shared/recipe-card';
import { ALL_RECIPES } from '../../../utils/recipe-loader';
import { AuthModal } from '../../login/ui/auth-modal';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Get search and filter values from URL
  const kitchenParam = searchParams.get('kitchen') || 'all';
  const difficultyParam = searchParams.get('difficulty') || 'all';
  const maxPrepTimeParam = searchParams.get('maxPrepTime');
  const vegetarianParam = searchParams.get('vegetarian') || 'any';
  const searchQuery = searchParams.get('q') || '';

  const filters: FilterState = useMemo(
    () => ({
      kitchen: kitchenParam,
      difficulty: difficultyParam as FilterState['difficulty'],
      maxPrepTime: maxPrepTimeParam ? parseInt(maxPrepTimeParam) : undefined,
      vegetarian: vegetarianParam as FilterState['vegetarian'],
      searchQuery: searchQuery,
    }),
    [kitchenParam, difficultyParam, maxPrepTimeParam, vegetarianParam, searchQuery]
  );

  // Update URL params when filters change
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setSearchParams((prev) => {
        if (newFilters.kitchen !== 'all') {
          prev.set('kitchen', newFilters.kitchen);
        } else {
          prev.delete('kitchen');
        }
        if (newFilters.difficulty !== 'all') {
          prev.set('difficulty', newFilters.difficulty);
        } else {
          prev.delete('difficulty');
        }
        if (newFilters.maxPrepTime !== undefined) {
          prev.set('maxPrepTime', newFilters.maxPrepTime.toString());
        } else {
          prev.delete('maxPrepTime');
        }
        if (newFilters.vegetarian !== 'any') {
          prev.set('vegetarian', newFilters.vegetarian);
        } else {
          prev.delete('vegetarian');
        }
        if (newFilters.searchQuery) {
          prev.set('q', newFilters.searchQuery);
        } else {
          prev.delete('q');
        }
        return prev;
      });
    },
    [setSearchParams]
  );

  const categories = [
    { icon: '🍔', label: 'Western' },
    { icon: '🍞', label: 'Bread' },
    { icon: '🥘', label: 'Western' },
    { icon: '🍲', label: 'Soup' },
    { icon: '🍨', label: 'Dessert' },
    { icon: '🍸', label: 'Coctail' },
    { icon: '🍝', label: 'Noodles' },
    { icon: '☕', label: 'Coffee' },
  ];

  // Use recipes from recipe-loader
  const allRecipes = ALL_RECIPES;

  // Filter recipes based on FilterState
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Search filter
      if (
        filters.searchQuery &&
        !recipe.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Kitchen/Area filter
      if (filters.kitchen !== 'all' && recipe.area !== filters.kitchen) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) {
        return false;
      }

      // Time filter
      if (filters.maxPrepTime && recipe.cookingTime && recipe.cookingTime > filters.maxPrepTime) {
        return false;
      }

      // Vegetarian filter (if you add this data to your recipes)
      // if (filters.vegetarian === 'only' && !recipe.isVegetarian) return false;
      // if (filters.vegetarian === 'exclude' && recipe.isVegetarian) return false;

      return true;
    });
  }, [allRecipes, filters]);

  const chickenRecipes = filteredRecipes.filter((r) => r.category === 'Chicken');
  const soupRecipes = filteredRecipes.filter((r) => r.category !== 'Chicken');

  const hasActiveFilters =
    filters.kitchen !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.maxPrepTime !== undefined ||
    filters.vegetarian !== 'any';
  const hasNoResults =
    filters.searchQuery || hasActiveFilters ? filteredRecipes.length === 0 : false;

  return (
    <div className="w-full md:w-4/5 md:max-w-7xl mx-auto px-6 py-4 min-h-screen pb-32 overflow-x-hidden">
      {/* Header */}
      {/* Example loading spinner, we have no data fetching so... */}
      {loading && <LoadingSpinner />}
      <div>
        <div className="flex items-center justify-between mb-8">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {user.user_metadata?.full_name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="relative hover:bg-gray-50 p-2 rounded-full transition-colors"
              >
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Welcome!</h2>
                <p className="text-sm text-gray-400">Sign in to save recipes</p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            </>
          )}
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3 font-medium">New Update 1.4</p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            What Do You Want To
            <br />
            Cook Today?
          </h1>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="">
        <FilterPanel filters={filters} onChange={updateFilters} recipes={allRecipes} />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {/* Categories - Hide when searching/filtering */}
      {!filters.searchQuery && !hasActiveFilters && (
        <div className="px-6 py-4 md:px-6 md:mx-auto">
          <div className="grid grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <button key={index} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl hover:bg-orange-50 transition-colors shadow-sm">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700 font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Empty State */}
      {hasNoResults && (
        <EmptyState searchQuery={filters.searchQuery} hasFilters={hasActiveFilters} />
      )}

      {/* Chicken Recipes */}
      {!hasNoResults && chickenRecipes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5 px-6 mx-auto">
            <h3 className="text-2xl font-bold text-gray-900">Chicken Recipes</h3>
            <button className="text-sm text-gray-500 flex items-center gap-1 font-medium">
              See More <span className="text-lg">›</span>
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide md:hidden">
            {chickenRecipes.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-72">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mx-auto">
            {chickenRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
      {/* Soup Recipes */}
      {!hasNoResults && soupRecipes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5 px-6 mx-auto">
            <h3 className="text-2xl font-bold text-gray-900">Soup Recipes</h3>
            <button className="text-sm text-gray-500 flex items-center gap-1 font-medium">
              See More <span className="text-lg">›</span>
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide md:hidden">
            {soupRecipes.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-72">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mx-auto">
            {soupRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
