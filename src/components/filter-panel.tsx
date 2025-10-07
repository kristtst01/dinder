import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export interface FilterOptions {
  cuisine: string[];
  diet: string[];
  maxTime: number | null;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClearAll: () => void;
}

const cuisineOptions = ['Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'Thai', 'American', 'French'];
const dietOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
const timeOptions = [
  { label: 'Under 15 min', value: 15 },
  { label: 'Under 30 min', value: 30 },
  { label: 'Under 45 min', value: 45 },
  { label: 'Under 60 min', value: 60 },
];

export function FilterPanel({ filters, onChange, onClearAll }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter((c) => c !== cuisine)
      : [...filters.cuisine, cuisine];
    onChange({ ...filters, cuisine: newCuisines });
  };

  const toggleDiet = (diet: string) => {
    const newDiets = filters.diet.includes(diet)
      ? filters.diet.filter((d) => d !== diet)
      : [...filters.diet, diet];
    onChange({ ...filters, diet: newDiets });
  };

  const setMaxTime = (time: number | null) => {
    onChange({ ...filters, maxTime: time });
  };

  const hasActiveFilters = filters.cuisine.length > 0 || filters.diet.length > 0 || filters.maxTime !== null;
  const activeFilterCount = filters.cuisine.length + filters.diet.length + (filters.maxTime ? 1 : 0);

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
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Filter Panel */}
      <div
        className={`
          md:block md:relative md:bg-transparent md:p-0
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
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => toggleCuisine(cuisine)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    filters.cuisine.includes(cuisine)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Dietary Restrictions</h4>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map((diet) => (
              <button
                key={diet}
                onClick={() => toggleDiet(diet)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    filters.diet.includes(diet)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {diet}
              </button>
            ))}
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
