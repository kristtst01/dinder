import { Sliders } from 'lucide-react';
import type { Recipe } from '../types/recipe';

export type Filters = {
  area: string | 'All';
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
  maxTime: number | null;
  vegetarian: boolean | 'Any';
};

export function FilterSidebar({
  recipes,
  filters,
  onChange,
}: {
  recipes: Recipe[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const areas = Array.from(new Set(recipes.map((r) => r.area))).filter(Boolean);

  return (
    <aside className="w-48 shrink-0 bg-white border border-gray-100 rounded-2xl p-4 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-3">
        <Sliders className="w-4 h-4 text-orange-500" />
        <h3 className="font-semibold text-gray-800">Filters</h3>
      </div>

      <div className="space-y-4 text-sm">
        {/* Kitchen / Area */}
        <div>
          <label className="block text-gray-600 mb-1">Kitchen</label>
          <select
            value={filters.area}
            onChange={(e) => onChange({ ...filters, area: e.target.value as Filters['area'] })}
            className="w-full border rounded-lg px-2 py-1.5 text-gray-800 bg-white"
          >
            <option value="All">All</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-gray-600 mb-1">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => onChange({ ...filters, difficulty: e.target.value as Filters['difficulty'] })}
            className="w-full border rounded-lg px-2 py-1.5 text-gray-800 bg-white"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Max Time */}
        <div>
          <label className="block text-gray-600 mb-1">Max prep time (min)</label>
          <input
            type="number"
            min={0}
            value={filters.maxTime ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              onChange({ ...filters, maxTime: v === '' ? null : Math.max(0, Number(v)) });
            }}
            placeholder="Any"
            className="w-full border rounded-lg px-2 py-1.5 text-gray-800 bg-white"
          />
        </div>

        {/* Vegetarian */}
        <div className="flex items-center justify-between">
          <label className="text-gray-600">Vegetarian</label>
          <select
            value={String(filters.vegetarian)}
            onChange={(e) =>
              onChange({ ...filters, vegetarian: (e.target.value === 'true' ? true : e.target.value === 'false' ? false : 'Any') as Filters['vegetarian'] })
            }
            className="border rounded-lg px-2 py-1.5 text-gray-800 bg-white"
          >
            <option value="Any">Any</option>
            <option value="true">Only</option>
            <option value="false">Exclude</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
