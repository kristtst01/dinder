import type { Recipe } from '../features/saved-hub/types/recipe';

export function convertMealDBToRecipe(meal: any): Recipe {
  // Parse ingredients from strIngredient1-20 and strMeasure1-20
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const measureText = measure && measure.trim() ? measure.trim() : '';
      ingredients.push(measureText ? `${measureText} ${ingredient}` : ingredient);
    }
  }

  // Parse steps from strInstructions (split by newlines or periods)
  const instructions = meal.strInstructions || '';
  const steps = instructions
    .split(/\r?\n/)
    .map((step: string) => step.trim())
    .filter((step: string) => step.length > 0);

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    ingredients,
    steps,
  };
}

export function convertMealDBArrayToRecipes(meals: any[]): Recipe[] {
  return meals.map(convertMealDBToRecipe);
}
