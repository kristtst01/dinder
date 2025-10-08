import { Plus, Search, Sliders, X } from 'lucide-react';
import { useState } from 'react';
import type { Recipe } from '../types/recipe';
import { Link } from 'react-router-dom';
export type FilterState = {
  kitchen: string | 'all';
  difficulty: 'all' | 'Easy' | 'Medium' | 'Hard';
  maxPrepTime: number | undefined;
  vegetarian: 'any' | 'only' | 'exclude';
  searchQuery: string;
};

export function FilterSidebar({
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
  const showFilters = controlledShowFilters ?? internalShowFilters;
  
  const toggleFilters = (newValue: boolean) => {
    if (onToggleFilters) {
      onToggleFilters(newValue);
    } else {
      setInternalShowFilters(newValue);
    }
  };
  
  const areas = Array.from(new Set(recipes.map((r) => r.area))).filter(Boolean);

  const activeFilterCount = [
    filters.kitchen !== 'all',
    filters.difficulty !== 'all',
    filters.maxPrepTime !== undefined,
    filters.vegetarian !== 'any',
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 mb-4">
      {/* Search Bar and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => toggleFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
           {/* Create Weekplan Button - Inline with filter */}
            <Link
              to="/weekplans/new"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl border border-orange-600 transition-colors flex items-center justify-center px-4 h-[42px] min-w-[42px]"
            >
              <Plus size={20} />
            </Link>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kitchen / Area */}
          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1.5">Kitchen</label>
            <select
              value={filters.kitchen}
              onChange={(e) => onChange({ ...filters, kitchen: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Kitchens</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1.5">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => onChange({ ...filters, difficulty: e.target.value as FilterState['difficulty'] })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Max Time */}
          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1.5">Max Prep Time</label>
            <input
              type="number"
              min={0}
              value={filters.maxPrepTime ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                onChange({ ...filters, maxPrepTime: v === '' ? undefined : Math.max(0, Number(v)) });
              }}
              placeholder="Any (minutes)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Vegetarian */}
          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1.5">Vegetarian</label>
            <select
              value={filters.vegetarian}
              onChange={(e) => onChange({ ...filters, vegetarian: e.target.value as FilterState['vegetarian'] })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="any">Any</option>
              <option value="only">Vegetarian Only</option>
              <option value="exclude">Exclude Vegetarian</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={() => onChange({ kitchen: 'all', difficulty: 'all', maxPrepTime: undefined, vegetarian: 'any', searchQuery: '' })}
                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
