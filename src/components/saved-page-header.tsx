import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FilterState } from './filter-panel';
import { FilterPanel } from './filter-panel';
import type { Recipe } from '../types/recipe';

interface SavedPageHeaderProps {
  filteredCount: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  recipes: Recipe[];
  desktopFiltersExpanded: boolean;
  onDesktopFiltersToggle: (expanded: boolean) => void;
}

export function SavedPageHeader({
  filteredCount,
  filters,
  onFiltersChange,
  recipes,
  desktopFiltersExpanded,
  onDesktopFiltersToggle,
}: SavedPageHeaderProps) {
  return (
    <header className="hidden md:block bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">Saved Recipes</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCount} recipe{filteredCount !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          to="/weekplans/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium shadow-sm shrink-0"
        >
          <Plus size={18} />
          <span>Create Weekplan</span>
        </Link>
      </div>

      {/* --- visual separation line --- */}
      <hr className="border-gray-200 mb-4" />

      {/* Filter panel (contains search + dropdowns) */}
      <div className="space-y-4">
        {/* First, the FilterPanel search bar */}
        <FilterPanel 
          filters={filters} 
          onChange={onFiltersChange} 
          recipes={recipes}
          showFilters={desktopFiltersExpanded}
          onToggleFilters={onDesktopFiltersToggle}
        />
      </div>
    </header>
  );
}
