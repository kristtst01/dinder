import { Bell, Bookmark, Home, Search, User } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RecipeCard } from '../components/recipe-card';
import { SearchBar } from '../components/search-bar';
import { FilterPanel } from '../components/filter-panel';
import { EmptyState } from '../components/empty-state';
import { convertMealDBArrayToRecipes } from '../utils/meal-db-helpers';
import type { FilterOptions } from '../components/filter-panel';
import chickenData from '../assets/mealdb-chicken.json';
import soupData from '../assets/mealdb-soup.json';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get search and filter values from URL
  const searchQuery = searchParams.get('q') || '';
  const cuisineParam = searchParams.get('cuisine') || '';
  const dietParam = searchParams.get('diet') || '';
  const maxTimeParam = searchParams.get('maxTime');

  const filters: FilterOptions = useMemo(() => ({
    cuisine: cuisineParam ? cuisineParam.split(',') : [],
    diet: dietParam ? dietParam.split(',') : [],
    maxTime: maxTimeParam ? parseInt(maxTimeParam) : null,
  }), [cuisineParam, dietParam, maxTimeParam]);

  // Update URL params
  const updateSearch = useCallback((value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set('q', value);
      } else {
        prev.delete('q');
      }
      return prev;
    });
  }, [setSearchParams]);

  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setSearchParams((prev) => {
      if (newFilters.cuisine.length > 0) {
        prev.set('cuisine', newFilters.cuisine.join(','));
      } else {
        prev.delete('cuisine');
      }
      if (newFilters.diet.length > 0) {
        prev.set('diet', newFilters.diet.join(','));
      } else {
        prev.delete('diet');
      }
      if (newFilters.maxTime) {
        prev.set('maxTime', newFilters.maxTime.toString());
      } else {
        prev.delete('maxTime');
      }
      return prev;
    });
  }, [setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

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

  // Prepare all recipes
  const allRecipes = useMemo(() => {
    const chicken = convertMealDBArrayToRecipes(chickenData.meals.slice(0, 6)).map(
      (recipe, index) => ({
        ...recipe,
        cookingTime: [30, 45, 60][index % 3],
        difficulty: (['Easy', 'Medium', 'Hard'] as const)[index % 3],
        badge: index === 0 ? 'New' : undefined,
      })
    );

    const soup = convertMealDBArrayToRecipes(soupData.meals.slice(0, 6)).map(
      (recipe, index) => ({
        ...recipe,
        cookingTime: [20, 35, 50][index % 3],
        difficulty: (['Easy', 'Medium'] as const)[index % 2],
      })
    );

    return [...chicken, ...soup];
  }, []);

  // Extract unique cuisines and diets from all recipes
  const availableCuisines = useMemo(() => {
    const cuisines = new Set(allRecipes.map((r) => r.area).filter(Boolean));
    return Array.from(cuisines).sort();
  }, [allRecipes]);

  const availableDiets = useMemo(() => {
    // TODO: When we have proper diet data from API, extract unique diet tags
    // For now, return empty array since we don't have diet information in the data
    return [];
  }, []);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Search filter
      if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Cuisine filter
      if (filters.cuisine.length > 0 && !filters.cuisine.includes(recipe.area)) {
        return false;
      }

      // Time filter
      if (filters.maxTime && recipe.cookingTime && recipe.cookingTime > filters.maxTime) {
        return false;
      }

      // Note: Diet filter would need additional data in Recipe type
      // For now, we'll skip diet filtering as it's not in the current data

      return true;
    });
  }, [allRecipes, searchQuery, filters]);

  const chickenRecipes = filteredRecipes.filter((r) => r.category === 'Chicken');
  const soupRecipes = filteredRecipes.filter((r) => r.category !== 'Chicken');

  const hasActiveFilters = filters.cuisine.length > 0 || filters.diet.length > 0 || filters.maxTime !== null;
  const hasNoResults = searchQuery || hasActiveFilters ? filteredRecipes.length === 0 : false;

  return (
    <div className="w-full overflow-x-hidden bg-gray-50 min-h-screen pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Abigail Raychielle</h2>
              <p className="text-sm text-gray-400">Housewife</p>
            </div>
          </div>
          <button className="relative">
            <Bell className="w-7 h-7 text-gray-700" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3 font-medium">New Update 1.4</p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            What Do You Want To
            <br />
            Cook Today?
          </h1>
        </div>

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={updateSearch} />
      </div>

      {/* Filter Panel */}
      <div className="px-6 py-4 md:px-6 md:max-w-7xl md:mx-auto">
        <FilterPanel
          filters={filters}
          onChange={updateFilters}
          onClearAll={clearAllFilters}
          availableCuisines={availableCuisines}
          availableDiets={availableDiets}
        />
      </div>

      {/* Categories - Hide when searching/filtering */}
      {!searchQuery && !hasActiveFilters && (
        <div className="bg-white px-6 py-8 mb-6 mt-2 rounded-3xl mx-4">
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
        <EmptyState searchQuery={searchQuery} hasFilters={hasActiveFilters} />
      )}

      {/* Chicken Recipes */}
      {!hasNoResults && chickenRecipes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5 px-6 max-w-7xl mx-auto">
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
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
            {chickenRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* Soup Recipes */}
      {!hasNoResults && soupRecipes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5 px-6 max-w-7xl mx-auto">
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
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
            {soupRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 border border-gray-100">
        <button className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
          <Home className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
        <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all">
          <Search className="w-6 h-6 text-orange-500" strokeWidth={2} />
        </button>
        <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all">
          <Bookmark className="w-6 h-6 text-orange-500" strokeWidth={2} />
        </button>
        <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all">
          <User className="w-6 h-6 text-orange-500" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default HomePage;
