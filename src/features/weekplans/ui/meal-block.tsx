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
  onViewRecipe: (recipeId: string) => void;
}

export function MealBlock({
  dayIndex,
  dayName,
  mealType,
  recipes,
  isEditMode,
  onOpenRecipeModal,
  onRemoveRecipe,
  onViewRecipe,
}: MealBlockProps) {
  const handleAddRecipe = () => {
    onOpenRecipeModal(dayIndex, dayName, mealType);
  };

  return (
    <>
      {/* Recipe cards - full replacement of the dashed box */}
      {recipes.length > 0 ? (
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onViewRecipe(recipe.id)}
              className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 flex items-center gap-3 h-[120px] hover:shadow-md transition cursor-pointer"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-16 h-16 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {recipe.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {recipe.category}
                </p>
              </div>
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecipe(dayIndex, mealType, recipe.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  aria-label="Remove recipe"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty state - dashed box only shows when no recipes */
        <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 h-[120px] flex flex-col">
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
            {isEditMode ? 'Drop recipe here' : 'No recipes'}
          </div>

          {/* Plus icon in edit mode */}
          {isEditMode && (
            <button
              onClick={handleAddRecipe}
              className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition"
            >
              <Plus size={16} />
              Add Recipe
            </button>
          )}
        </div>
      )}

      {/* Replace button when recipe exists in edit mode */}
      {isEditMode && recipes.length > 0 && (
        <button
          onClick={handleAddRecipe}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition mt-2"
        >
          <Plus size={16} />
          {mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner'
            ? 'Replace Recipe'
            : 'Add Recipe'}
        </button>
      )}
    </>
  );
}
