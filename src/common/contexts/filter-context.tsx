import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { FilterState } from '@/shared/filter-panel';
import type { Recipe } from '@/features/recipes/types/recipe';

interface FilterContextType {
  onFiltersChange: ((filters: FilterState) => void) | null;
  recipes: Recipe[];
  showSearch: boolean;
  setFilterData: (data: {
    onFiltersChange: (filters: FilterState) => void;
    recipes: Recipe[];
  }) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const [filterData, setFilterDataState] = useState<{
    onFiltersChange: ((filters: FilterState) => void) | null;
    recipes: Recipe[];
  }>({
    onFiltersChange: null,
    recipes: [],
  });

  const setFilterData = (data: {
    onFiltersChange: (filters: FilterState) => void;
    recipes: Recipe[];
  }) => {
    setFilterDataState(data);
  };

  const value: FilterContextType = {
    onFiltersChange: filterData.onFiltersChange,
    recipes: filterData.recipes,
    showSearch: filterData.onFiltersChange !== null,
    setFilterData,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const context = useContext(FilterContext);
  return context;
}
