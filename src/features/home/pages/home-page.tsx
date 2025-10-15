import LoadingSpinner from '@/components/loading-spinner';
import { useAuth } from '@common/hooks/use-auth';
import { Menu } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../components/empty-state';
import { FilterPanel, type FilterState } from '../../../shared/filter-panel';
import { RecipeCard } from '../../../shared/recipe-card';
import { Navbar } from '../../../shared/navbar';
import { ALL_RECIPES } from '../../../utils/recipe-loader';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setNavOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Home</h1>
          </div>
        </header>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-6">
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">New Update 1.4</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              What Do You Want To Cook Today?
            </h1>
          </div>
        </div>

        {/* Example loading spinner */}
        {loading && <LoadingSpinner />}

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-6 md:p-6">
          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel filters={filters} onChange={updateFilters} recipes={allRecipes} />
          </div>
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
        </main>
      </div>
    </div>
  );
}

export default HomePage;
