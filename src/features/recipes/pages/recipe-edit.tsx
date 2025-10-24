import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/common/hooks/use-auth';
import { RecipeUploadForm } from '../components/recipe-upload-form';
import { useRecipe } from '../hooks/use-recipes';
import { useRecipeIngredients, useRecipeDirections } from '../hooks/use-recipe-details';
import { ArrowLeft } from 'lucide-react';
import type { RecipeUploadData } from '../hooks/use-recipe-upload';

export function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { recipe, loading: recipeLoading } = useRecipe(id);
  const { ingredients, loading: ingredientsLoading } = useRecipeIngredients(id);
  const { directions, loading: directionsLoading } = useRecipeDirections(id);
  const [initialData, setInitialData] = useState<
    (Partial<RecipeUploadData> & { id?: string }) | null
  >(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (!recipeLoading && recipe && recipe.createdBy !== user?.id) {
      alert('You can only edit your own recipes');
      navigate('/');
      return;
    }

    if (
      !recipeLoading &&
      !ingredientsLoading &&
      !directionsLoading &&
      recipe &&
      ingredients &&
      directions
    ) {
      const recipeData: Partial<RecipeUploadData> & { id?: string } = {
        id: recipe.id,
        name: recipe.title,
        category: recipe.category,
        area: recipe.area,
        difficulty: recipe.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard',
        time: recipe.cookingTime || 0,
        servings: recipe.servings || 1,
        image: recipe.image,
        ingredients: ingredients.map((ing) => ({
          name: ing.ingredient.name,
          amount: ing.amount,
          unit: ing.unit,
          note: ing.note || undefined,
        })),
        steps: directions.map((dir) => ({
          description: dir.description,
          image: dir.image || undefined,
        })),
      };

      setInitialData(recipeData);
    }
  }, [
    authLoading,
    user,
    recipeLoading,
    recipe,
    ingredientsLoading,
    ingredients,
    directionsLoading,
    directions,
    navigate,
  ]);

  const isLoading = authLoading || recipeLoading || ingredientsLoading || directionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!user || !recipe || !initialData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <RecipeUploadForm initialData={initialData} isEdit={true} />
      </div>
    </div>
  );
}
