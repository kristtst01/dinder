import { Calendar, ChefHat } from 'lucide-react';
import type { FilterState } from '@shared/filter-panel';
import { FilterPanel } from '../../../shared/filter-panel';
import type { Recipe } from '../types/recipe';
import type { ViewMode } from '../pages/saved-recipes-page';

interface SavedPageHeaderProps {
  filteredCount: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  recipes: Recipe[];
  desktopFiltersExpanded: boolean;
  onDesktopFiltersToggle: (expanded: boolean) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SavedPageHeader({
  filteredCount,
  filters,
  onFiltersChange,
  recipes,
  desktopFiltersExpanded,
  onDesktopFiltersToggle,
  viewMode,
  onViewModeChange,
}: SavedPageHeaderProps) {
  return (
    <header className="hidden md:block bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {viewMode === 'recipes' ? 'Saved Recipes' : 'Week Plans'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode === 'recipes'
              ? `${filteredCount} recipe${filteredCount !== 1 ? 's' : ''} found`
              : 'Dine lagrede ukeplaner – legg til, rediger eller bestill når du vil.'}
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => onViewModeChange('recipes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              viewMode === 'recipes'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChefHat size={18} />
            <span>Recipes</span>
          </button>
          <button
            onClick={() => onViewModeChange('weekplans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              viewMode === 'weekplans'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar size={18} />
            <span>Weekplans</span>
          </button>
        </div>
      </div>

      {/* --- visual separation line --- */}
      <hr className="border-gray-200 mb-4" />

      {/* Filter panel (contains search + dropdowns) - Only show for recipes view */}
      {viewMode === 'recipes' && (
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
      )}
    </header>
  );
}
