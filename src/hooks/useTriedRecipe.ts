import { useState, useEffect } from 'react';

export function useTriedRecipe(recipeId: string | undefined) {
  const [hasTriedRecipe, setHasTriedRecipe] = useState(false);

  // Load "tried" status from localStorage
  useEffect(() => {
    if (recipeId) {
      const tried = localStorage.getItem(`recipe_tried_${recipeId}`);
      setHasTriedRecipe(tried === 'true');
    }
  }, [recipeId]);

  const toggleTriedRecipe = () => {
    const newTriedStatus = !hasTriedRecipe;
    setHasTriedRecipe(newTriedStatus);
    if (recipeId) {
      localStorage.setItem(`recipe_tried_${recipeId}`, String(newTriedStatus));
    }
  };

  return { hasTriedRecipe, toggleTriedRecipe };
}
