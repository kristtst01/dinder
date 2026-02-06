import { Plus, Search, Sliders, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Recipe } from '@features/recipes/types/recipe';
import { Link } from 'react-router-dom';
export type FilterState = {
  kitchen: string | 'all';
  difficulty: 'all' | 'Easy' | 'Medium' | 'Hard';
  maxPrepTime: number | undefined;
  vegetarian: 'any' | 'only' | 'exclude';
  searchQuery: string;
};

export function FilterPanel({
  filters,
  onChange,
  recipes = [],
  showFilters: controlledShowFilters,
  onToggleFilters,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  recipes?: Recipe[];
  showFilters?: boolean;
  onToggleFilters?: (show: boolean) => void;
}) {
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const [kitchenSearch, setKitchenSearch] = useState('');
  const [showKitchenDropdown, setShowKitchenDropdown] = useState(false);
  const showFilters = controlledShowFilters ?? internalShowFilters;
  const panelRef = useRef<HTMLDivElement>(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        toggleFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const toggleFilters = (newValue: boolean) => {
    if (onToggleFilters) {
      onToggleFilters(newValue);
    } else {
      setInternalShowFilters(newValue);
    }
  };

  const areas = Array.from(new Set(recipes.map((r) => r.area))).filter(Boolean);
  const filteredAreas = areas.filter((a) =>
    a.toLowerCase().startsWith(kitchenSearch.toLowerCase())
  );

  const activeFilterCount = [
    filters.kitchen !== 'all',
    filters.difficulty !== 'all',
    filters.maxPrepTime !== undefined,
    filters.vegetarian !== 'any',
  ].filter(Boolean).length;

  return (
    <div ref={panelRef} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-4">
      {/* Search Bar and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => toggleFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium text-gray-700 dark:text-gray-200"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        {/* Create Recipe Button - Inline with filter */}
        <Link
          to="/create-recipe"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl border border-orange-600 transition-colors flex items-center justify-center px-4 h-[42px] min-w-[42px]"
        >
          <Plus size={20} />
        </Link>
      </div>

      {/* Expandable Filters with smooth animation */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${showFilters ? 'max-h-[600px] sm:max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-0.5">
          {/* Kitchen / Area */}
          <div className="relative">
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-medium mb-1.5">
              Kitchen
            </label>
            <input
              type="text"
              value={filters.kitchen === 'all' ? kitchenSearch : filters.kitchen}
              onChange={(e) => {
                setKitchenSearch(e.target.value);
                setShowKitchenDropdown(true);
                if (e.target.value === '') {
                  onChange({ ...filters, kitchen: 'all' });
                }
              }}
              onFocus={() => setShowKitchenDropdown(true)}
              onBlur={() => setTimeout(() => setShowKitchenDropdown(false), 200)}
              placeholder="Search kitchens..."
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {showKitchenDropdown && kitchenSearch.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <button
                  onClick={() => {
                    onChange({ ...filters, kitchen: 'all' });
                    setKitchenSearch('');
                    setShowKitchenDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors"
                >
                  All Kitchens
                </button>
                {filteredAreas.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      onChange({ ...filters, kitchen: a });
                      setKitchenSearch('');
                      setShowKitchenDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {a}
                  </button>
                ))}
                {filteredAreas.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                    No kitchens found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-medium mb-1.5">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) =>
                onChange({ ...filters, difficulty: e.target.value as FilterState['difficulty'] })
              }
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Max Time */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-medium mb-1.5">
              Max Prep Time
            </label>
            <input
              type="number"
              min={0}
              value={filters.maxPrepTime ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                onChange({
                  ...filters,
                  maxPrepTime: v === '' ? undefined : Math.max(0, Number(v)),
                });
              }}
              placeholder="Any (minutes)"
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[15, 30, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => onChange({ ...filters, maxPrepTime: time })}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    filters.maxPrepTime === time
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300'
                  }`}
                >
                  {time}m
                </button>
              ))}
            </div>
          </div>

          {/* Vegetarian */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-medium mb-1.5">
              Vegetarian
            </label>
            <select
              value={filters.vegetarian}
              onChange={(e) =>
                onChange({ ...filters, vegetarian: e.target.value as FilterState['vegetarian'] })
              }
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="any">Any</option>
              <option value="only">Vegetarian Only</option>
              <option value="exclude">Exclude Vegetarian</option>
            </select>
          </div>

          {/* Clear Filters Button - Always reserve space */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end min-h-[40px]">
            {activeFilterCount > 0 && (
              <button
                onClick={() =>
                  onChange({
                    kitchen: 'all',
                    difficulty: 'all',
                    maxPrepTime: undefined,
                    vegetarian: 'any',
                    searchQuery: '',
                  })
                }
                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-opacity duration-200"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
