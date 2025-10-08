import chickenData from '../assets/mealdb-chicken.json';
import pastaData from '../assets/mealdb-pasta.json';
import soupData from '../assets/mealdb-soup.json';
import { convertMealDBArrayToRecipes } from './meal-db-helpers';
import type { Recipe } from '../types/recipe';

// Combine all meal data from MealDB JSON files
const allMeals = [
  ...(chickenData.meals || []),
  ...(pastaData.meals || []),
  ...(soupData.meals || []),
];

// Convert to Recipe format (from types/recipe.ts) and add random difficulty/cooking time for demo
export const ALL_RECIPES: Recipe[] = convertMealDBArrayToRecipes(allMeals).map((recipe) => ({
  ...recipe,
  difficulty: (['Easy', 'Medium', 'Hard'] as const)[Math.floor(Math.random() * 3)],
  cookingTime: Math.floor(Math.random() * 60) + 15, // Random 15-75 minutes
}));
