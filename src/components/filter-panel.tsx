import { X, SlidersHorizontal, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export interface FilterOptions {
  cuisine: string[];
  diet: string[];
  maxTime: number | null;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClearAll: () => void;
  availableCuisines: string[];
  availableDiets: string[];
}

const timeOptions = [
  { label: 'Under 15 min', value: 15 },
  { label: 'Under 30 min', value: 30 },
  { label: 'Under 45 min', value: 45 },
  { label: 'Under 60 min', value: 60 },
];

export function FilterPanel({
  filters,
  onChange,
  onClearAll,
  availableCuisines,
  availableDiets,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [dietSearch, setDietSearch] = useState('');

  const filteredCuisines = useMemo(() => {
    if (!cuisineSearch) return availableCuisines;
    return availableCuisines.filter((c) => c.toLowerCase().startsWith(cuisineSearch.toLowerCase()));
  }, [cuisineSearch, availableCuisines]);

  const filteredDiets = useMemo(() => {
    if (!dietSearch) return availableDiets;
    return availableDiets.filter((d) => d.toLowerCase().startsWith(dietSearch.toLowerCase()));
  }, [dietSearch, availableDiets]);

  const addCuisine = (cuisine: string) => {
    if (!filters.cuisine.includes(cuisine)) {
      onChange({ ...filters, cuisine: [...filters.cuisine, cuisine] });
    }
    setCuisineSearch('');
  };

  const removeCuisine = (cuisine: string) => {
    onChange({ ...filters, cuisine: filters.cuisine.filter((c) => c !== cuisine) });
  };

  const addDiet = (diet: string) => {
    if (!filters.diet.includes(diet)) {
      onChange({ ...filters, diet: [...filters.diet, diet] });
    }
    setDietSearch('');
  };

  const removeDiet = (diet: string) => {
    onChange({ ...filters, diet: filters.diet.filter((d) => d !== diet) });
  };

  const setMaxTime = (time: number | null) => {
    onChange({ ...filters, maxTime: time });
  };

  const hasActiveFilters =
    filters.cuisine.length > 0 || filters.diet.length > 0 || filters.maxTime !== null;
  const activeFilterCount =
    filters.cuisine.length + filters.diet.length + (filters.maxTime ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-700 font-medium"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`
          md:block md:static md:bg-white md:rounded-2xl md:p-4 md:shadow-sm
          fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-h-[80vh] overflow-y-auto
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        `}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onClearAll();
              setIsOpen(false);
            }}
            className="mb-6 text-sm text-orange-500 font-medium hover:text-orange-600"
          >
            Clear all filters
          </button>
        )}

        {/* Cuisine Type */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Cuisine Type</h4>

          {/* Selected Cuisines */}
          {filters.cuisine.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.cuisine.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => removeCuisine(cuisine)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  {cuisine}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              value={cuisineSearch}
              onChange={(e) => setCuisineSearch(e.target.value)}
              placeholder="Search cuisines..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Dropdown Results */}
            {cuisineSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                {filteredCuisines.length > 0 ? (
                  filteredCuisines.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => addCuisine(cuisine)}
                      disabled={filters.cuisine.includes(cuisine)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cuisine}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-500">No cuisines found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Dietary Restrictions</h4>

          {/* Selected Diets */}
          {filters.diet.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.diet.map((diet) => (
                <button
                  key={diet}
                  onClick={() => removeDiet(diet)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  {diet}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              value={dietSearch}
              onChange={(e) => setDietSearch(e.target.value)}
              placeholder="Search dietary restrictions..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Dropdown Results */}
            {dietSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                {filteredDiets.length > 0 ? (
                  filteredDiets.map((diet) => (
                    <button
                      key={diet}
                      onClick={() => addDiet(diet)}
                      disabled={filters.diet.includes(diet)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {diet}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-500">
                    No dietary restrictions found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prep Time */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Prep Time</h4>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMaxTime(filters.maxTime === option.value ? null : option.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    filters.maxTime === option.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Apply Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}
