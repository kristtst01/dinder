import LoadingSpinner from '@/components/loading-spinner';
import { useAuth } from '@common/hooks/use-auth';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../components/empty-state';
import { FilterPanel, type FilterState } from '../../../shared/filter-panel';
import { RecipeCard } from '../../../shared/recipe-card';
import { Navbar } from '../../../shared/navbar';
import { useRecipes } from '../../recipes/hooks/use-recipes';
import { FeaturedRecipe } from '../ui/featured-recipe';
import { WeekplanCTA } from '../ui/weekplan-cta';
import { ExpandableSection } from '../ui/expandable-section';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading: authLoading } = useAuth();
  const { recipes: allRecipes, loading: recipesLoading, error: recipesError } = useRecipes();
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

  const loading = authLoading || recipesLoading;

  // Random recipe for hero section
  const randomRecipe = useMemo(() => {
    return allRecipes[Math.floor(Math.random() * allRecipes.length)];
  }, [allRecipes]);

  // Popular recipes (mock data - will be replaced with Supabase data later)
  const popularRecipes = useMemo(() => {
    // For now, just get a random selection of recipes
    const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
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
    <div className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory bg-white dark:bg-gray-950">
      <Navbar />

      {/* Example loading spinner */}
      {loading && <LoadingSpinner />}

      {/* Error state */}
      {recipesError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mx-4 md:mx-6 mt-6">
          <p className="text-red-600 dark:text-red-400">
            Failed to load recipes. Please try again later.
          </p>
        </div>
      )}

      {/* Hero Section - Full Width Featured Recipe */}
      {!filters.searchQuery && !hasActiveFilters && randomRecipe && (
        <section className="w-full">
          <FeaturedRecipe recipe={randomRecipe} />
        </section>
      )}

      {/* Popular This Week Section - Constrained Height */}
      {!filters.searchQuery && !hasActiveFilters && popularRecipes.length > 0 && (
        <section className="w-full bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <ExpandableSection
              title="Popular This Week"
              items={popularRecipes}
              renderItem={(recipe) => <RecipeCard recipe={recipe} />}
              initialCarouselCount={9}
            />
          </div>
        </section>
      )}

      {/* Recipes Section - Different Background */}
      <section className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 pb-6 md:p-6">
          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel filters={filters} onChange={updateFilters} recipes={allRecipes} />
          </div>

          {/* Empty State */}
          {hasNoResults && (
            <EmptyState searchQuery={filters.searchQuery} hasFilters={hasActiveFilters} />
          )}

          {/* All Recipes Grid - Show when filtering/searching */}
          {(filters.searchQuery || hasActiveFilters) &&
            !hasNoResults &&
            filteredRecipes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
