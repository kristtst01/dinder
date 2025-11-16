import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import type { DBDirection, DBRecipeIngredient, DBIngredient } from '@/lib/supabase/types';

export interface RecipeIngredientWithDetails extends DBRecipeIngredient {
  ingredient: DBIngredient;
}

export function useRecipeIngredients(recipeId: string | undefined) {
  const [ingredients, setIngredients] = useState<RecipeIngredientWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!recipeId) {
      setIngredients([]);
      setLoading(false);
      return;
    }

    async function fetchIngredients() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('recipe_ingredients')
          .select(
            `
            *,
            ingredient:ingredients(*)
          `
          )
          .eq('recipe_id', recipeId);

        if (fetchError) throw fetchError;

        setIngredients(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch ingredients'));
        setIngredients([]);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, [recipeId]);

  return { ingredients, loading, error };
}

export function useRecipeDirections(recipeId: string | undefined) {
  const [directions, setDirections] = useState<DBDirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!recipeId) {
      setDirections([]);
      setLoading(false);
      return;
    }

    async function fetchDirections() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('directions')
          .select('*')
          .eq('recipe_id', recipeId)
          .order('sequence');

        if (fetchError) throw fetchError;

        setDirections(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch directions'));
        setDirections([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDirections();
  }, [recipeId]);

  return { directions, loading, error };
}
