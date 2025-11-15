import { Plus, X } from 'lucide-react';
import type { MealType } from '@/lib/supabase/types';

interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface MealBlockProps {
  dayIndex: number;
  dayName: string;
  mealType: MealType;
  recipes: Recipe[];
  isEditMode: boolean;
  onOpenRecipeModal: (dayIndex: number, dayName: string, mealType: MealType) => void;
  onRemoveRecipe: (dayIndex: number, mealType: MealType, recipeId: string) => void;
}

export function MealBlock({
  dayIndex,
  dayName,
  mealType,
  recipes,
  isEditMode,
  onOpenRecipeModal,
  onRemoveRecipe,
}: MealBlockProps) {
  const handleAddRecipe = () => {
    onOpenRecipeModal(dayIndex, dayName, mealType);
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 min-h-[100px] flex flex-col gap-2">
      {/* Recipe cards */}
      {recipes.length > 0 ? (
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 flex items-center gap-2"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {recipe.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{recipe.category}</p>
              </div>
              {isEditMode && (
                <button
                  onClick={() => onRemoveRecipe(dayIndex, mealType, recipe.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  aria-label="Remove recipe"
                >
                  <X size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
          {isEditMode ? 'Drop recipe here' : 'No recipes'}
        </div>
      )}

      {/* Plus icon in edit mode */}
      {isEditMode && (
        <button
          onClick={handleAddRecipe}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition"
        >
          <Plus size={16} />
          {(mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') &&
          recipes.length > 0
            ? 'Replace Recipe'
            : 'Add Recipe'}
        </button>
      )}
    </div>
  );
}
