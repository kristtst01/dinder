import { MealBlock } from './meal-block';
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

interface WeekplanColumnProps {
  day: string;
  dayIndex: number;
  isEditMode: boolean;
  recipes: {
    [key in MealType]?: Recipe[];
  };
  onOpenRecipeModal: (dayIndex: number, dayName: string, mealType: MealType) => void;
  onRemoveRecipe: (dayIndex: number, mealType: MealType, recipeId: string) => void;
  onViewRecipe: (recipeId: string) => void;
}

const MEALS: { label: string; type: MealType }[] = [
  { label: 'Breakfast', type: 'breakfast' },
  { label: 'Lunch', type: 'lunch' },
  { label: 'Dinner', type: 'dinner' },
  { label: 'Snacks', type: 'snack' },
];

export function WeekplanColumn({
  day,
  dayIndex,
  isEditMode,
  recipes,
  onOpenRecipeModal,
  onRemoveRecipe,
  onViewRecipe,
}: WeekplanColumnProps) {
  // Calculate daily nutrition totals
  const dailyNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  Object.values(recipes).forEach((mealRecipes) => {
    mealRecipes?.forEach((recipe) => {
      if (recipe.nutrition) {
        dailyNutrition.calories += recipe.nutrition.calories;
        dailyNutrition.protein += parseFloat(recipe.nutrition.protein) || 0;
        dailyNutrition.carbs += parseFloat(recipe.nutrition.carbs) || 0;
        dailyNutrition.fat += parseFloat(recipe.nutrition.fat) || 0;
      }
    });
  });

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm flex flex-col gap-4">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{day}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Day {dayIndex + 1}</span>
      </div>

      {/* Meal sections */}
      <div className="flex flex-col gap-4">
        {MEALS.map((meal) => (
          <div key={meal.type}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {meal.label}
            </p>
            <MealBlock
              dayIndex={dayIndex}
              dayName={day}
              mealType={meal.type}
              recipes={recipes[meal.type] || []}
              isEditMode={isEditMode}
              onOpenRecipeModal={onOpenRecipeModal}
              onRemoveRecipe={onRemoveRecipe}
              onViewRecipe={onViewRecipe}
            />
          </div>
        ))}
      </div>

      {/* Nutrition summary */}
      <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3 grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Calories</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {dailyNutrition.calories > 0 ? dailyNutrition.calories : '-'}
          </p>
          <div className="h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Protein</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {dailyNutrition.protein > 0 ? `${dailyNutrition.protein.toFixed(0)}g` : '-'}
          </p>
          <div className="h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Carbs</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {dailyNutrition.carbs > 0 ? `${dailyNutrition.carbs.toFixed(0)}g` : '-'}
          </p>
          <div className="h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fat</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {dailyNutrition.fat > 0 ? `${dailyNutrition.fat.toFixed(0)}g` : '-'}
          </p>
          <div className="h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40" />
        </div>
      </div>
    </div>
  );
}
