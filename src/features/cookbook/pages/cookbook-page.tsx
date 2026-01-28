import { useState, useEffect, useRef } from 'react';
import { RecipeCard } from '../../../shared/recipe-card';
import { FilterPanel, type FilterState } from '../../../shared/filter-panel';
import { Navbar } from '../../../shared/navbar';
import { CookbookHeader } from '../ui/cookbook-header';
import { useSavedRecipesContext } from '../../recipes/context/SavedRecipesContext';
import { useRecipes } from '../../recipes/hooks/use-recipes';
import { useAuth } from '@/common/hooks/use-auth';

export type ViewMode = 'saved' | 'mine';

export default function CookbookPage() {
  const { isSaved } = useSavedRecipesContext();
  const { recipes: allRecipes, loading: recipesLoading } = useRecipes();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('saved');
  const [filters, setFilters] = useState<FilterState>({
    kitchen: 'all',
    difficulty: 'all',
    maxPrepTime: undefined,
    vegetarian: 'any',
    searchQuery: '',
  });

  const [showMobileFilter, setShowMobileFilter] = useState(true);
  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);
  const [desktopFiltersExpanded, setDesktopFiltersExpanded] = useState(false);
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

  // Get recipes based on view mode
  const recipesToShow =
    viewMode === 'saved'
      ? allRecipes.filter((r) => isSaved(r.id))
      : allRecipes.filter((r) => user && r.createdBy === user.id);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Cookbook Header with view toggle */}
        <CookbookHeader
          filteredCount={filteredRecipes.length}
          filters={filters}
          onFiltersChange={setFilters}
          recipes={recipesToShow}
          desktopFiltersExpanded={desktopFiltersExpanded}
          onDesktopFiltersToggle={setDesktopFiltersExpanded}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-32 md:p-6 md:pb-6">
          {recipesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading recipes...</p>
            </div>
          ) : recipesToShow.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {viewMode === 'saved' ? 'No saved recipes yet' : 'No recipes yet'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {viewMode === 'saved'
                  ? 'Start adding recipes by clicking the heart icon on any recipe from the home page'
                  : 'Create your first recipe to see it here'}
              </p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No recipes match your filters</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your filters or clearing them
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Overlay to intercept clicks when desktop filters are expanded */}
              {desktopFiltersExpanded && (
                <div
                  className="hidden md:block absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setDesktopFiltersExpanded(false)}
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
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
            md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50 dark:via-gray-900 to-transparent
            transition-transform duration-300 ease-in-out z-20
            ${showMobileFilter ? 'translate-y-0' : 'translate-y-full'}
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
