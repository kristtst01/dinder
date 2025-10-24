import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@/common/hooks/use-auth';
import { validateRecipeData } from '../utils/backend-validation';

export interface RecipeUploadData {
  name: string;
  category: string;
  area: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time: number;
  servings: number;
  image?: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    note?: string;
  }>;
  steps: Array<{
    description: string;
    image?: string;
  }>;
}

export function useRecipeUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const uploadRecipe = async (recipeData: RecipeUploadData): Promise<string | null> => {
    if (!user) {
      setError(new Error('You must be logged in to create a recipe'));
      return null;
    }

    // Validate recipe data
    const validationError = validateRecipeData(recipeData);
    if (validationError) {
      setError(new Error(validationError));
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Insert recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          name: recipeData.name,
          creator: user.id,
          time: recipeData.time,
          servings: recipeData.servings,
          category: recipeData.category,
          difficulty: recipeData.difficulty,
          image: recipeData.image,
          area: recipeData.area,
        })
        .select('uid')
        .single();

      if (recipeError) throw recipeError;
      if (!recipe) throw new Error('Failed to create recipe');

      const recipeId = recipe.uid;

      // Insert ingredients
      for (const ingredient of recipeData.ingredients) {
        // First, check if ingredient exists
        const { data: existingIngredient, error: ingredientSearchError } = await supabase
          .from('ingredients')
          .select('uid')
          .eq('name', ingredient.name.toLowerCase())
          .maybeSingle();

        if (ingredientSearchError) {
          throw ingredientSearchError;
        }

        let ingredientId: string;

        if (existingIngredient) {
          ingredientId = existingIngredient.uid;
        } else {
          // Create new ingredient
          const { data: newIngredient, error: createIngredientError } = await supabase
            .from('ingredients')
            .insert({ name: ingredient.name.toLowerCase() })
            .select('uid')
            .single();

          if (createIngredientError) throw createIngredientError;
          if (!newIngredient) throw new Error('Failed to create ingredient');

          ingredientId = newIngredient.uid;
        }

        // Link ingredient to recipe
        const { error: linkError } = await supabase.from('recipe_ingredients').insert({
          recipe_id: recipeId,
          ingredient_id: ingredientId,
          amount: ingredient.amount,
          unit: ingredient.unit,
          note: ingredient.note || null,
        });

        if (linkError) throw linkError;
      }

      // Insert directions
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        const { error: directionError } = await supabase.from('directions').insert({
          recipe_id: recipeId,
          sequence: i + 1,
          description: step.description,
          image: step.image || null,
        });

        if (directionError) throw directionError;
      }

      return recipeId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload recipe');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (recipeId: string, recipeData: RecipeUploadData): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to update a recipe'));
      return false;
    }

    // Validate recipe data
    const validationError = validateRecipeData(recipeData);
    if (validationError) {
      setError(new Error(validationError));
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          name: recipeData.name,
          time: recipeData.time,
          servings: recipeData.servings,
          category: recipeData.category,
          difficulty: recipeData.difficulty,
          image: recipeData.image,
          area: recipeData.area,
        })
        .eq('uid', recipeId)
        .eq('creator', user.id);

      if (recipeError) throw recipeError;

      // Delete existing ingredients and directions
      await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId);
      await supabase.from('directions').delete().eq('recipe_id', recipeId);

      // Re-insert ingredients
      for (const ingredient of recipeData.ingredients) {
        const { data: existingIngredient, error: ingredientSearchError } = await supabase
          .from('ingredients')
          .select('uid')
          .eq('name', ingredient.name.toLowerCase())
          .maybeSingle();

        if (ingredientSearchError) {
          throw ingredientSearchError;
        }

        let ingredientId: string;

        if (existingIngredient) {
          ingredientId = existingIngredient.uid;
        } else {
          const { data: newIngredient, error: createIngredientError } = await supabase
            .from('ingredients')
            .insert({ name: ingredient.name.toLowerCase() })
            .select('uid')
            .single();

          if (createIngredientError) throw createIngredientError;
          if (!newIngredient) throw new Error('Failed to create ingredient');

          ingredientId = newIngredient.uid;
        }

        const { error: linkError } = await supabase.from('recipe_ingredients').insert({
          recipe_id: recipeId,
          ingredient_id: ingredientId,
          amount: ingredient.amount,
          unit: ingredient.unit,
          note: ingredient.note || null,
        });

        if (linkError) throw linkError;
      }

      // Re-insert directions
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        const { error: directionError } = await supabase.from('directions').insert({
          recipe_id: recipeId,
          sequence: i + 1,
          description: step.description,
          image: step.image || null,
        });

        if (directionError) throw directionError;
      }

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update recipe');
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId: string): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to delete a recipe'));
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('uid', recipeId)
        .eq('creator', user.id);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete recipe');
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadRecipe,
    updateRecipe,
    deleteRecipe,
    loading,
    error,
  };
}
