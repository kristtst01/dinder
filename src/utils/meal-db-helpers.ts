import type { MealDBRecipe, Recipe } from '../types/recipe';

export function convertMealDBToRecipe(meal: MealDBRecipe): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
  };
}

export function convertMealDBArrayToRecipes(meals: MealDBRecipe[]): Recipe[] {
  return meals.map(convertMealDBToRecipe);
}
