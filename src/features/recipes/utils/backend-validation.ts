import type { RecipeUploadData } from '../hooks/use-recipe-upload';
import {
  MAX_RECIPE_NAME_LENGTH,
  MAX_CATEGORY_LENGTH,
  MAX_CUISINE_LENGTH,
  MAX_INGREDIENT_NAME_LENGTH,
  MAX_INGREDIENT_NOTE_LENGTH,
  MAX_STEP_DESCRIPTION_LENGTH,
  normalizeUnit,
} from './recipe-constants';

export function validateRecipeData(data: RecipeUploadData): string | null {
  // Recipe name
  if (!data.name || data.name.trim().length === 0) {
    return 'Recipe name is required';
  }
  if (data.name.length > MAX_RECIPE_NAME_LENGTH) {
    return `Recipe name cannot exceed ${MAX_RECIPE_NAME_LENGTH} characters`;
  }

  // Category
  if (!data.category || data.category.trim().length === 0) {
    return 'Category is required';
  }
  if (data.category.length > MAX_CATEGORY_LENGTH) {
    return `Category cannot exceed ${MAX_CATEGORY_LENGTH} characters`;
  }

  // Cuisine
  if (!data.area || data.area.trim().length === 0) {
    return 'Cuisine is required';
  }
  if (data.area.length > MAX_CUISINE_LENGTH) {
    return `Cuisine cannot exceed ${MAX_CUISINE_LENGTH} characters`;
  }

  // Cooking time and servings (already validated in form with Math.min/max)
  if (data.time < 1 || data.time > 2147483647) {
    return 'Invalid cooking time';
  }
  if (data.servings < 1 || data.servings > 2147483647) {
    return 'Invalid servings';
  }

  // Ingredients
  if (!data.ingredients || data.ingredients.length === 0) {
    return 'At least one ingredient is required';
  }

  for (let i = 0; i < data.ingredients.length; i++) {
    const ing = data.ingredients[i];

    if (!ing.name || ing.name.trim().length === 0) {
      return `Ingredient ${i + 1}: name is required`;
    }
    if (ing.name.length > MAX_INGREDIENT_NAME_LENGTH) {
      return `Ingredient ${i + 1}: name cannot exceed ${MAX_INGREDIENT_NAME_LENGTH} characters`;
    }

    if (ing.amount <= 0) {
      return `Ingredient ${i + 1}: amount must be greater than 0`;
    }

    if (!ing.unit || ing.unit.trim().length === 0) {
      return `Ingredient ${i + 1}: unit is required`;
    }

    // Normalize unit (e.g., "grams" → "g")
    const normalizedUnit = normalizeUnit(ing.unit);
    if (!normalizedUnit) {
      return `Ingredient ${i + 1}: "${ing.unit}" is not a valid unit. Try: g, kg, ml, l, oz, cup, tbsp, tsp, etc.`;
    }
    ing.unit = normalizedUnit;

    if (ing.note && ing.note.length > MAX_INGREDIENT_NOTE_LENGTH) {
      return `Ingredient ${i + 1}: note cannot exceed ${MAX_INGREDIENT_NOTE_LENGTH} characters`;
    }
  }

  // Steps
  if (!data.steps || data.steps.length === 0) {
    return 'At least one step is required';
  }

  for (let i = 0; i < data.steps.length; i++) {
    const step = data.steps[i];

    if (!step.description || step.description.trim().length === 0) {
      return `Step ${i + 1}: description is required`;
    }
    if (step.description.length > MAX_STEP_DESCRIPTION_LENGTH) {
      return `Step ${i + 1}: description cannot exceed ${MAX_STEP_DESCRIPTION_LENGTH} characters`;
    }
  }

  return null;
}
