import type { DBRecipe } from '@/lib/supabase/types';
import type { Recipe } from '../../saved-hub/types/recipe';

export function dbRecipeToRecipe(dbRecipe: DBRecipe): Recipe {
  return {
    id: dbRecipe.uid,
    title: dbRecipe.name,
    image: dbRecipe.image || '',
    category: dbRecipe.category,
    area: dbRecipe.area || '',
    difficulty: capitalizeFirstLetter(dbRecipe.difficulty) as 'Easy' | 'Medium' | 'Hard',
    cookingTime: dbRecipe.time,
    servings: dbRecipe.servings,
    createdBy: dbRecipe.creator || undefined,
  };
}

export function dbRecipesToRecipes(dbRecipes: DBRecipe[]): Recipe[] {
  return dbRecipes.map(dbRecipeToRecipe);
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
