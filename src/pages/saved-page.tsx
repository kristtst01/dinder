import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { RecipeCard } from '../components/recipe-card';
import { FilterSidebar, type FilterState } from '../components/filter-sidebar';
import { SavedPageNavbar } from '../components/saved-page-navbar';
import { useSavedRecipesContext } from '../context/SavedRecipesContext';
import { ALL_RECIPES } from '../data/recipes';
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

  // Scroll detection state
  const [showFilter, setShowFilter] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show filter when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current) {
        setShowFilter(true);
        // Collapse filters when scrolling up if they're expanded
        if (showFilters) {
          setShowFilters(false);
        }
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowFilter(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFilters]);

  // Map sample recipes from data/recipes to types/recipe format
  const sampleRecipes: Recipe[] = ALL_RECIPES.map((r, i) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    category: r.vegetarian ? 'Vegetarian' : 'Main Course',
    area: r.kitchen || 'Other',
    difficulty: (['Easy', 'Medium', 'Hard'] as const)[i % 3],
    cookingTime: r.prepMinutes || 30,
  }));

  // Get saved recipes or show samples
  const savedRecipes = sampleRecipes.filter((r) => isSaved(r.id));
  const recipesToShow = savedRecipes.length > 0 ? savedRecipes : sampleRecipes;

  // Apply filters and search
  const filteredRecipes = recipesToShow.filter((recipe) => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        recipe.title.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.area.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    // Other filters
    if (filters.kitchen !== 'all' && recipe.area !== filters.kitchen) return false;
    if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;
    if (filters.maxPrepTime && recipe.cookingTime && recipe.cookingTime > filters.maxPrepTime)
      return false;
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setNavOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Saved Recipes</h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-32">
          {/* Sample Indicator */}
          {savedRecipes.length === 0 && (
            <div className="mb-4 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
              Showing sample favorites
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </main>

        {/* Floating Filter Bar - Bottom, shows on scroll up (hidden when nav is open) */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent
            transition-transform duration-300 ease-in-out z-20
            ${showFilter && !navOpen ? 'translate-y-0' : 'translate-y-full'}
          `}
        >
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                recipes={recipesToShow}
                showFilters={showFilters}
                onToggleFilters={setShowFilters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
