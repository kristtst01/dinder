import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import type { Recipe } from '../../saved-hub/types/recipe';
import { dbRecipesToRecipes, dbRecipeToRecipe } from '../utils/recipe-adapters';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;

        setRecipes(data ? dbRecipesToRecipes(data) : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
}

export function useRecipe(recipeId: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!recipeId) {
      setRecipe(null);
      setLoading(false);
      return;
    }

    async function fetchRecipe() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('uid', recipeId)
          .single();

        if (fetchError) throw fetchError;

        setRecipe(data ? dbRecipeToRecipe(data) : null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recipe'));
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  return { recipe, loading, error };
}
