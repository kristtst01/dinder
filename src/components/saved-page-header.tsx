import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FilterState } from './filter-panel';

interface SavedPageHeaderProps {
  filteredCount: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableAreas: string[];
}

export function SavedPageHeader({
  filteredCount,
  filters,
  onFiltersChange,
  availableAreas,
}: SavedPageHeaderProps) {
  const hasActiveFilters =
    filters.searchQuery ||
    filters.kitchen !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.vegetarian !== 'any';

  const clearFilters = () => {
    onFiltersChange({
      kitchen: 'all',
      difficulty: 'all',
      maxPrepTime: undefined,
      vegetarian: 'any',
      searchQuery: '',
    });
  };

  return (
    <header className="hidden md:block bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30">
      {/* Title and Create Weekplan button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCount} recipe{filteredCount !== 1 ? 's' : ''} found
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
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Kitchen Filter Dropdown */}
        <select
          value={filters.kitchen}
          onChange={(e) => onFiltersChange({ ...filters, kitchen: e.target.value })}
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[160px] font-medium"
        >
          <option value="all">All Kitchens</option>
          {availableAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        {/* Difficulty Filter Dropdown */}
        <select
          value={filters.difficulty}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              difficulty: e.target.value as FilterState['difficulty'],
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
            onFiltersChange({
              ...filters,
              vegetarian: e.target.value as FilterState['vegetarian'],
            })
          }
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[140px] font-medium"
        >
          <option value="any">All Types</option>
          <option value="only">Vegetarian Only</option>
          <option value="exclude">Non-Vegetarian</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>
    </header>
  );
}
