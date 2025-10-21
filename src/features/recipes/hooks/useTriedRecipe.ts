import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@/common/hooks/use-auth';

export function useTriedRecipe(recipeId: string | undefined) {
  const { user } = useAuth();
  const [hasTriedRecipe, setHasTriedRecipe] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeId || !user) {
      setHasTriedRecipe(false);
      setLoading(false);
      return;
    }

    async function checkTriedStatus() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_tried_recipes')
          .select('user_id')
          .eq('user_id', user!.id)
          .eq('recipe_id', recipeId)
          .maybeSingle();

        if (error) throw error;

        setHasTriedRecipe(!!data);
      } catch (error) {
        console.error('Error checking tried recipe status:', error);
        setHasTriedRecipe(false);
      } finally {
        setLoading(false);
      }
    }

    checkTriedStatus();
  }, [recipeId, user]);

  const toggleTriedRecipe = useCallback(async () => {
    if (!recipeId || !user) return;

    const newTriedStatus = !hasTriedRecipe;

    try {
      if (newTriedStatus) {
        const { error } = await supabase.from('user_tried_recipes').insert({
          user_id: user.id,
          recipe_id: recipeId,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_tried_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) throw error;
      }

      setHasTriedRecipe(newTriedStatus);
    } catch (error) {
      console.error('Error toggling tried recipe:', error);
    }
  }, [recipeId, user, hasTriedRecipe]);

  return { hasTriedRecipe, toggleTriedRecipe, loading };
}
