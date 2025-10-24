import { X } from 'lucide-react';

export interface IngredientData {
  name: string;
  amount: number;
  unit: string;
  note?: string;
}

interface IngredientInputProps {
  ingredients: IngredientData[];
  onChange: (ingredients: IngredientData[]) => void;
}

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const addIngredient = () => {
    onChange([...ingredients, { name: '', amount: 0, unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof IngredientData, value: string | number) => {
    const updated = ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing));
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ingredients
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
        >
          + Add Ingredient
        </button>
      </div>

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount"
                value={ingredient.amount || ''}
                onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                required
                min="0"
                step="0.01"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Note (optional)"
              value={ingredient.note || ''}
              onChange={(e) => updateIngredient(index, 'note', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}

        {ingredients.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No ingredients added yet. Click "Add Ingredient" to start.
          </p>
        )}
      </div>
    </div>
  );
}
