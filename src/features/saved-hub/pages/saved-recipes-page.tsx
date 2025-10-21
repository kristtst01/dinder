import { useState, useEffect, useRef } from 'react';
import { Menu, ChefHat, Calendar } from 'lucide-react';
import { RecipeCard } from '../../../shared/recipe-card';
import { FilterPanel, type FilterState } from '../../../shared/filter-panel';
import { Navbar } from '../../../shared/navbar';
import { SavedPageHeader } from '../ui/saved-page-header';
import { WeekplanCard } from '../../../shared/weekplan-card';
import { useSavedRecipesContext } from '../../recipes/context/SavedRecipesContext';
import { useRecipes } from '../../recipes/hooks/use-recipes';

export type ViewMode = 'recipes' | 'weekplans';

export default function SavedPage() {
  const { isSaved } = useSavedRecipesContext();
  const { recipes: allRecipes, loading: recipesLoading } = useRecipes();
  const [navOpen, setNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('recipes');
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

  // Mock weekplans data - replace with actual data source later
  const weekplans = [
    { title: 'Uke 42 – Middager', author: 'Lina' },
    { title: 'Uke 43 – Kjappe retter', author: 'Lina' },
    { title: 'Uke 44 – Vegetar', author: 'Lina' },
  ];

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

  // Get saved recipes only
  const savedRecipes = allRecipes.filter((r) => isSaved(r.id));
  const recipesToShow = savedRecipes;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Saved Page Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNavOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {viewMode === 'recipes' ? 'Saved Recipes' : 'Week Plans'}
            </h1>
          </div>

          {/* Mobile view toggle - compact icon buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('recipes')}
              aria-label="Show recipes"
              className={`p-2 rounded-md transition ${
                viewMode === 'recipes'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <ChefHat size={18} />
            </button>
            <button
              onClick={() => setViewMode('weekplans')}
              aria-label="Show weekplans"
              className={`p-2 rounded-md transition ${
                viewMode === 'weekplans'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Calendar size={18} />
            </button>
          </div>
        </header>

        {/* Desktop Dashboard Header */}
        <SavedPageHeader
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
          {viewMode === 'recipes' ? (
            /* Recipe Grid or Empty State */
            <>
              {recipesLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Loading recipes...</p>
                </div>
              ) : savedRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    No saved recipes yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Start adding recipes by clicking the heart icon on any recipe from the home page
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
            </>
          ) : (
            /* Weekplans Grid or Empty State */
            <>
              {weekplans.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    Du har ingen ukeplaner ennå
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Opprett din første ukeplan nå!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {weekplans.map((plan, i) => (
                    <WeekplanCard
                      key={i}
                      title={plan.title}
                      author={plan.author}
                      onClick={() => {
                        // TODO: Navigate to weekplan detail page
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile Filter Overlay */}
        {mobileFiltersExpanded && viewMode === 'recipes' && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-10"
            onClick={() => setMobileFiltersExpanded(false)}
          />
        )}

        {/* Mobile Floating Filter Bar - Only show for recipes view */}
        {viewMode === 'recipes' && (
          <div
            className={`
              md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50 dark:via-gray-900 to-transparent
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
        )}
      </div>
    </div>
  );
}
