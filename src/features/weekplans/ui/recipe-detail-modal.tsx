import { useState, useEffect } from 'react';
import { X, Heart, Share2, Clock, Users, ChefHat, Flame, Check, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '@/features/recipes/hooks/use-recipes';
import { useRecipeIngredients, useRecipeDirections } from '@/features/recipes/hooks/use-recipe-details';
import { useSavedRecipesContext } from '@/features/recipes/context/SavedRecipesContext';
import { useRecipeShare } from '@/features/recipes/hooks/use-recipe-share';
import { useCookMode } from '@/features/recipes/hooks/useCookMode';
import { useTriedRecipe } from '@/features/recipes/hooks/useTriedRecipe';
import { useAuth } from '@/common/hooks/use-auth';
import { useRecipeUpload } from '@/features/recipes/hooks/use-recipe-upload';

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
}

export function RecipeDetailModal({ isOpen, onClose, recipeId }: RecipeDetailModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSaved, toggle } = useSavedRecipesContext();
  const { deleteRecipe, loading: deleteLoading } = useRecipeUpload();

  // State for interactive features
  const [servings, setServings] = useState(4);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  // Custom hooks for feature logic
  const { cookMode, toggleCookMode } = useCookMode();
  const { hasTriedRecipe, toggleTriedRecipe } = useTriedRecipe(recipeId);
  const { handleShare } = useRecipeShare();

  // Fetch recipe and its details from database
  const { recipe, loading: recipeLoading, error: recipeError } = useRecipe(recipeId);
  const { ingredients: dbIngredients, loading: ingredientsLoading } = useRecipeIngredients(recipeId);
  const { directions: dbDirections, loading: directionsLoading } = useRecipeDirections(recipeId);

  const loading = recipeLoading || ingredientsLoading || directionsLoading;
  const error = recipeError;

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings ?? 4);
    }
  }, [recipe]);

  // Generic toggle function for Set state
  const toggleInSet = (
    setter: React.Dispatch<React.SetStateAction<Set<number>>>,
    index: number
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleStep = (index: number) => toggleInSet(setCheckedSteps, index);
  const toggleIngredient = (index: number) => toggleInSet(setCheckedIngredients, index);

  const handleDelete = async () => {
    if (!recipeId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this recipe? This action cannot be undone.'
    );
    if (!confirmed) return;

    const success = await deleteRecipe(recipeId);
    if (success) {
      onClose();
      navigate('/');
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error ? 'Error loading recipe' : 'Recipe not found'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && recipe.createdBy === user.id;
  const baseServings = recipe.servings ?? 4;
  const difficulty = recipe.difficulty || 'Medium';
  const cookingTime = recipe.cookingTime || 30;
  const scaleFactor = servings / baseServings;

  // Format ingredients from database into display strings
  const ingredients = dbIngredients.map((ing) => {
    const amount = ing.amount * scaleFactor;
    const unit = ing.unit;
    const name = ing.ingredient.name;
    const note = ing.note;

    let displayText = `${amount} ${unit} ${name}`;
    if (note) {
      displayText += ` (${note})`;
    }
    return displayText;
  });

  // Get steps from directions (sorted by sequence)
  const steps = dbDirections.map((dir) => dir.description);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col m-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header - sticky with actions */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-700 dark:text-gray-200" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 truncate">
            {recipe.title}
          </h1>

          {/* Cook Mode Toggle */}
          <button
            onClick={toggleCookMode}
            aria-pressed={cookMode}
            className={`
              p-2 rounded-lg transition-colors
              ${cookMode ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}
            `}
            aria-label={cookMode ? 'Exit cook mode' : 'Enter cook mode'}
          >
            <Flame size={20} />
          </button>

          {/* Edit and Delete buttons - only visible to recipe owner */}
          {isOwner && (
            <>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/recipe/edit/${recipeId}`);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Edit recipe"
              >
                <Edit size={20} className="text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Delete recipe"
              >
                <Trash2 size={20} className="text-red-600 dark:text-red-400" />
              </button>
            </>
          )}

          <button
            onClick={() => recipe && handleShare(recipe.title, `${window.location.origin}/recipe/${recipeId}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Share recipe"
          >
            <Share2 size={20} className="text-gray-700 dark:text-gray-200" />
          </button>
          <button
            onClick={() => toggle(recipe.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={isSaved(recipe.id) ? 'Unsave recipe' : 'Save recipe'}
          >
            <Heart
              size={20}
              className={isSaved(recipe.id) ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}
              fill={isSaved(recipe.id) ? 'currentColor' : 'none'}
            />
          </button>
        </header>

        {/* Cook Mode Banner */}
        {cookMode && (
          <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
            Cook Mode Active - Screen will stay on
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          <div className="relative">
            <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Title & Meta */}
          <div className="px-4 py-4 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{recipe.title}</h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <Clock size={20} className="text-orange-600 dark:text-orange-400 mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Time</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {cookingTime}m
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <Users size={20} className="text-orange-600 dark:text-orange-400 mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Servings</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{servings}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <ChefHat size={20} className="text-orange-600 dark:text-orange-400 mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Level</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <section className="px-4 py-5 bg-white dark:bg-gray-800 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ingredients</h3>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="px-3 py-1 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Decrease servings"
                >
                  -
                </button>
                <span className="px-2 text-sm font-medium text-gray-900 dark:text-white">
                  {servings} servings
                </span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="px-3 py-1 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Increase servings"
                >
                  +
                </button>
              </div>
            </div>

            <ul className="space-y-3">
              {ingredients.map((ingredient, index) => {
                const displayIngredient =
                  scaleFactor !== 1 ? `${ingredient} (×${scaleFactor.toFixed(1)})` : ingredient;

                return (
                  <li key={index} className="flex items-start gap-3">
                    <button
                      onClick={() => toggleIngredient(index)}
                      className={`
                        mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors
                        ${
                          checkedIngredients.has(index)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                        }
                      `}
                      aria-label={`Mark ingredient ${index + 1} as ${checkedIngredients.has(index) ? 'unchecked' : 'checked'}`}
                    >
                      {checkedIngredients.has(index) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-base ${checkedIngredients.has(index) ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {displayIngredient}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Instructions Section */}
          <section className="px-4 py-5 bg-white dark:bg-gray-800 mt-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Instructions</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <button
                    onClick={() => toggleStep(index)}
                    className={`
                      mt-0.5 w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors
                      ${
                        checkedSteps.has(index)
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                      }
                    `}
                    aria-label={`Mark step ${index + 1} as ${checkedSteps.has(index) ? 'incomplete' : 'complete'}`}
                  >
                    {checkedSteps.has(index) && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-7 h-7 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p
                        className={`flex-1 text-base leading-relaxed ${checkedSteps.has(index) ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <section className="px-4 py-5 bg-white dark:bg-gray-800 mt-2">
            <button
              onClick={toggleTriedRecipe}
              className={`
                w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2
                ${
                  hasTriedRecipe
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                }
              `}
            >
              <Check size={20} strokeWidth={2.5} />
              {hasTriedRecipe ? "You've Tried This Recipe!" : 'Mark as Tried'}
            </button>
            {hasTriedRecipe && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                You have tried this recipe before.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
