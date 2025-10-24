import { Bookmark, ChefHat } from 'lucide-react';
import type { FilterState } from '@shared/filter-panel';
import { FilterPanel } from '../../../shared/filter-panel';
import type { Recipe } from '@features/recipes/types/recipe';
import type { ViewMode } from '../pages/cookbook-page';

interface CookbookHeaderProps {
  filteredCount: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  recipes: Recipe[];
  desktopFiltersExpanded: boolean;
  onDesktopFiltersToggle: (expanded: boolean) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function CookbookHeader({
  filteredCount,
  filters,
  onFiltersChange,
  recipes,
  desktopFiltersExpanded,
  onDesktopFiltersToggle,
  viewMode,
  onViewModeChange,
}: CookbookHeaderProps) {
  return (
    <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 sticky top-0 z-30">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">Cookbook</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {`${filteredCount} recipe${filteredCount !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shrink-0">
          <button
            onClick={() => onViewModeChange('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              viewMode === 'saved'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Bookmark size={18} />
            <span>Saved</span>
          </button>
          <button
            onClick={() => onViewModeChange('mine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              viewMode === 'mine'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ChefHat size={18} />
            <span>My Recipes</span>
          </button>
        </div>
      </div>

      {/* --- visual separation line --- */}
      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

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
