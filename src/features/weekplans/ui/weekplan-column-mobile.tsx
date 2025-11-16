import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

interface WeekplanColumnMobileProps {
  day: string;
  dayIndex: number;
  isEditMode: boolean;
  recipes: {
    [key in MealType]?: Recipe[];
  };
  onOpenRecipeModal: (dayIndex: number, dayName: string, mealType: MealType) => void;
  onRemoveRecipe: (dayIndex: number, mealType: MealType, recipeId: string) => void;
}

const MEALS: { label: string; type: MealType }[] = [
  { label: 'Breakfast', type: 'breakfast' },
  { label: 'Lunch', type: 'lunch' },
  { label: 'Dinner', type: 'dinner' },
  { label: 'Snacks', type: 'snacks' },
];

export function WeekplanColumnMobile({
  day,
  dayIndex,
  isEditMode,
  recipes,
  onOpenRecipeModal,
  onRemoveRecipe,
}: WeekplanColumnMobileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Count total recipes for the day
  const totalRecipes = Object.values(recipes).reduce(
    (sum, mealRecipes) => sum + (mealRecipes?.length || 0),
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{day}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {totalRecipes} {totalRecipes === 1 ? 'recipe' : 'recipes'} • {dailyNutrition.calories}{' '}
              kcal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Meal sections */}
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
              />
            </div>
          ))}

          {/* Nutrition summary */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Calories</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {dailyNutrition.calories > 0 ? dailyNutrition.calories : '-'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Protein</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {dailyNutrition.protein > 0 ? `${dailyNutrition.protein.toFixed(0)}g` : '-'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Carbs</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {dailyNutrition.carbs > 0 ? `${dailyNutrition.carbs.toFixed(0)}g` : '-'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fat</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {dailyNutrition.fat > 0 ? `${dailyNutrition.fat.toFixed(0)}g` : '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
