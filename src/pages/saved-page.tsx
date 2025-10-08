import { useState, useEffect, useRef } from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import { RecipeCard } from '../components/recipe-card';
import { FilterPanel, type FilterState } from '../components/filter-panel';
import { SavedPageNavbar } from '../components/saved-page-navbar';
import { useSavedRecipesContext } from '../context/SavedRecipesContext';
import { ALL_RECIPES } from '../utils/recipe-loader';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Navbar */}
      <SavedPageNavbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-30 md:hidden">
          <button onClick={() => setNavOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Saved Recipes</h1>
        </header>

        {/* Desktop Dashboard Header */}
        <header className="hidden md:block bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Link
              to="/weekplans/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium shadow-sm"
            >
              <Plus size={18} />
              <span>Create Weekplan</span>
            </Link>
          </div>

          {/* Desktop Search and Filters Bar */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved recipes..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Kitchen Filter Dropdown */}
            <select
              value={filters.kitchen}
              onChange={(e) => setFilters({ ...filters, kitchen: e.target.value })}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[160px] font-medium"
            >
              <option value="all">All Kitchens</option>
              {Array.from(new Set(recipesToShow.map((r) => r.area)))
                .filter(Boolean)
                .map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
            </select>

            {/* Difficulty Filter Dropdown */}
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  difficulty: e.target.value as 'all' | 'Easy' | 'Medium' | 'Hard',
                })
              }
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[140px] font-medium"
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Vegetarian Filter Dropdown */}
            <select
              value={filters.vegetarian}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  vegetarian: e.target.value as 'any' | 'only' | 'exclude',
                })
              }
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[140px] font-medium"
            >
              <option value="any">All Types</option>
              <option value="only">Vegetarian Only</option>
              <option value="exclude">Non-Vegetarian</option>
            </select>

            {/* Clear Filters */}
            {(filters.searchQuery ||
              filters.kitchen !== 'all' ||
              filters.difficulty !== 'all' ||
              filters.vegetarian !== 'any') && (
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
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </header>

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
