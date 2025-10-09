import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { RecipeCard } from '../components/recipe-card';
import { FilterPanel, type FilterState } from '../components/filter-panel';
import { SavedPageNavbar } from '../components/navbar';
import { SavedPageHeader } from '../components/saved-page-header';
import { useSavedRecipesContext } from '../context/SavedRecipesContext';
import { ALL_RECIPES } from '../utils/recipe-loader';
import type { Recipe } from '../types/recipe';

export function SavedPage() {
  const { isSaved } = useSavedRecipesContext();
  const [navOpen, setNavOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    kitchen: 'all',
    difficulty: 'all',
    maxPrepTime: undefined,
    vegetarian: 'any',
    searchQuery: '',
  });

  const [showMobileFilter, setShowMobileFilter] = useState(true);
  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);
  const lastScrollY = useRef(0);

  // Auto-hide mobile filter bar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show filter bar
        setShowMobileFilter(true);
        // Collapse expanded filters when scrolling
        if (mobileFiltersExpanded) {
          setMobileFiltersExpanded(false);
        }
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down - hide filter bar
        setShowMobileFilter(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileFiltersExpanded]);

  // Get all recipes from loader
  const allRecipes: Recipe[] = ALL_RECIPES;

  // Get saved recipes
  const savedRecipes = allRecipes.filter((r) => isSaved(r.id));
  const hasSavedRecipes = savedRecipes.length > 0;
  const recipesToShow = hasSavedRecipes ? savedRecipes : allRecipes;

  // Apply filters and search
  const filteredRecipes = recipesToShow.filter((recipe) => {
    // Search filter - matches title, category, or area
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        recipe.title.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.area.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Kitchen/Area filter
    if (filters.kitchen !== 'all' && recipe.area !== filters.kitchen) return false;

    // Difficulty filter
    if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;

    // Max prep time filter
    if (filters.maxPrepTime && recipe.cookingTime && recipe.cookingTime > filters.maxPrepTime)
      return false;

    // Vegetarian filter (TODO: Add isVegetarian property to Recipe type for better filtering)
    if (filters.vegetarian === 'only' && !recipe.category.toLowerCase().includes('veget'))
      return false;
    if (filters.vegetarian === 'exclude' && recipe.category.toLowerCase().includes('veget'))
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-clip">
      {/* Left Navbar */}
      <SavedPageNavbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-30 md:hidden">
          <button onClick={() => setNavOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Saved Recipes</h1>
        </header>

        {/* Desktop Dashboard Header */}
        <SavedPageHeader
          filteredCount={filteredRecipes.length}
          filters={filters}
          onFiltersChange={setFilters}
          availableAreas={Array.from(new Set(recipesToShow.map((r) => r.area))).filter(Boolean)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-32 md:p-6 md:pb-6">
          {/* Show indicator when displaying sample recipes */}
          {!hasSavedRecipes && (
            <div className="mb-4 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
              No saved recipes yet. Showing all available recipes.
            </div>
          )}

          {/* Recipe Grid or Empty State */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No recipes match your filters</p>
              <button
                onClick={() =>
                  setFilters({
                    kitchen: 'all',
                    difficulty: 'all',
                    maxPrepTime: undefined,
                    vegetarian: 'any',
                    searchQuery: '',
                  })
                }
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </main>

        {/* Mobile Filter Overlay */}
        {mobileFiltersExpanded && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-10"
            onClick={() => setMobileFiltersExpanded(false)}
          />
        )}

        {/* Mobile Floating Filter Bar */}
        <div
          className={`
            md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent
            transition-transform duration-300 ease-in-out z-20
            ${showMobileFilter && !navOpen ? 'translate-y-0' : 'translate-y-full'}
          `}
        >
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                recipes={recipesToShow}
                showFilters={mobileFiltersExpanded}
                onToggleFilters={setMobileFiltersExpanded}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
