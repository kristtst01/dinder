import { useMemo, useState } from 'react';
import { RecipeCard } from '../components/recipe-card';
import type { Recipe } from '../types/recipe';
import { FilterSidebar, type Filters } from '../components/filter-sidebar';
import { useSavedRecipesContext } from '../context/SavedRecipesContext';
import { ALL_RECIPES } from '../data/recipes';

// Map our sample data to the RecipeCard type used across the app
function mapSampleToRecipeCardType() : Recipe[] {
  return ALL_RECIPES.map((s) => {
    const cookingTime = s.prepMinutes ?? 30;
    const difficulty: Recipe['difficulty'] = cookingTime <= 20 ? 'Easy' : cookingTime <= 35 ? 'Medium' : 'Hard';
    const area = s.kitchen ?? 'Other';
    const category = s.vegetarian ? 'Vegetarian' : 'Main';
    return {
      id: s.id,
      title: s.title,
      image: s.image,
      category,
      area,
      difficulty,
      cookingTime,
    };
  });
}

const ALL: Recipe[] = mapSampleToRecipeCardType();

export function SavedPage() {
  const { saved } = useSavedRecipesContext();

  const [filters, setFilters] = useState<Filters>({ area: 'All', difficulty: 'All', maxTime: null, vegetarian: 'Any' });
  const [showFilters, setShowFilters] = useState(false);

  const savedItems = useMemo(() => ALL.filter((r) => saved.has(r.id)), [saved]);
  // Fallback to samples so the page and filters demonstrate on first load
  const items = savedItems.length > 0 ? savedItems : ALL;

  const filtered = useMemo(() => {
    return items.filter((r) => {
      if (filters.area !== 'All' && r.area !== filters.area) return false;
      if (filters.difficulty !== 'All' && r.difficulty !== filters.difficulty) return false;
      if (typeof filters.maxTime === 'number' && r.cookingTime && r.cookingTime > filters.maxTime) return false;
      if (filters.vegetarian !== 'Any') {
        const isVeg = r.category?.toLowerCase().includes('veget') || false;
        if (filters.vegetarian === true && !isVeg) return false;
        if (filters.vegetarian === false && isVeg) return false;
      }
      return true;
    });
  }, [items, filters]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>
          <button
            className="md:hidden inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full"
            onClick={() => setShowFilters((s) => !s)}
          >
            Filters
          </button>
        </div>

        {/* Mobile filters panel */}
        {showFilters && (
          <div className="md:hidden bg-white border border-gray-100 rounded-2xl p-4 mb-4">
            <FilterSidebar recipes={items} filters={filters} onChange={setFilters} />
          </div>
        )}

        {/* Desktop layout */}
        <div className="md:flex md:gap-6">
          <div className="hidden md:block">
            <FilterSidebar recipes={items} filters={filters} onChange={setFilters} />
          </div>

          <div className="flex-1">
            {savedItems.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mb-3 w-max">
                Showing sample favorites
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedPage;
