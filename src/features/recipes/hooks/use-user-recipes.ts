import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@/common/hooks/use-auth';
import type { Recipe } from '../../saved-hub/types/recipe';
import { dbRecipesToRecipes } from '../utils/recipe-adapters';

export function useUserRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const userId = user.id;

    async function fetchUserRecipes() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('creator', userId)
          .order('name');

        if (fetchError) throw fetchError;

        setRecipes(data ? dbRecipesToRecipes(data) : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user recipes'));
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRecipes();
  }, [user]);

  return { recipes, loading, error };
}
