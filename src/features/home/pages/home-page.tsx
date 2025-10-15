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
import { FeaturedRecipe } from '../ui/featured-recipe';

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

  // Use recipes from recipe-loader
  const allRecipes = ALL_RECIPES;

  // Random recipe for hero section
  const randomRecipe = useMemo(() => {
    return allRecipes[Math.floor(Math.random() * allRecipes.length)];
  }, [allRecipes]);

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
          {/* Featured Recipe */}
          {!filters.searchQuery && !hasActiveFilters && randomRecipe && (
            <FeaturedRecipe recipe={randomRecipe} />
          )}

          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel filters={filters} onChange={updateFilters} recipes={allRecipes} />
          </div>

          {/* Empty State */}
          {hasNoResults && (
            <EmptyState searchQuery={filters.searchQuery} hasFilters={hasActiveFilters} />
          )}

          {/* All Recipes Grid */}
          {!hasNoResults && filteredRecipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
