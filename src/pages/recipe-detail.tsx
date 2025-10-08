import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Users,
  ChefHat,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ALL_RECIPES } from '../utils/recipe-loader';
import { useSavedRecipesContext } from '../context/SavedRecipesContext';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSavedRecipesContext();

  // State for interactive features
  const [servings, setServings] = useState(4);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [nutritionOpen, setNutritionOpen] = useState(false);

  // Find recipe by id from sample data
  const recipe = useMemo(() => ALL_RECIPES.find((r) => r.id === id), [id]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg">Recipe not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Mock data for demo (would come from API/data in production)
  const baseServings = 4;
  const rating = 4.5;
  const difficulty = recipe.difficulty || 'Medium';
  const cookingTime = recipe.cookingTime || 30;
  const chef = `Chef from ${recipe.area}`; // Use area as chef attribution

  // Scale ingredients based on servings
  const scaleFactor = servings / baseServings;
  const ingredients = [
    '2 cups flour',
    '1 cup sugar',
    '3 eggs',
    '1/2 cup butter',
    '1 tsp vanilla extract',
    '1/4 tsp salt',
  ];

  const steps = [
    'Preheat oven to 350°F (175°C). Grease and flour a 9-inch round pan.',
    'In a large bowl, cream together butter and sugar until light and fluffy.',
    'Beat in eggs one at a time, then stir in vanilla extract.',
    'Combine flour and salt; gradually blend into the creamed mixture.',
    'Pour batter into prepared pan and smooth the top.',
    'Bake for 30-35 minutes, or until a toothpick inserted into center comes out clean.',
    'Cool in pan for 10 minutes, then turn out onto a wire rack to cool completely.',
  ];

  const nutrition = {
    calories: 320,
    protein: '6g',
    carbs: '45g',
    fat: '14g',
    fiber: '2g',
    sugar: '22g',
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed - silently handle
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header - sticky with actions */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1 truncate">Recipe</h1>
        <button
          onClick={handleShare}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Share recipe"
        >
          <Share2 size={20} className="text-gray-700" />
        </button>
        <button
          onClick={() => toggle(recipe.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isSaved(recipe.id) ? 'Unsave recipe' : 'Save recipe'}
        >
          <Heart
            size={20}
            className={isSaved(recipe.id) ? 'text-red-500' : 'text-gray-700'}
            fill={isSaved(recipe.id) ? 'currentColor' : 'none'}
          />
        </button>
      </header>

      {/* Hero Image */}
      <div className="relative">
        <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Title & Meta */}
      <div className="px-4 py-4 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
        <div className="flex items-center gap-2 mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chef)}&background=f97316&color=fff&size=32`}
            alt={chef}
            className="w-8 h-8 rounded-full"
          />
          <p className="text-sm text-gray-600">By {chef}</p>
        </div>

        {/* Quick Stats - Large, readable */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
            <Clock size={20} className="text-orange-600 mb-1" />
            <span className="text-xs text-gray-600">Time</span>
            <span className="text-sm font-semibold text-gray-900">{cookingTime}m</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
            <Users size={20} className="text-orange-600 mb-1" />
            <span className="text-xs text-gray-600">Servings</span>
            <span className="text-sm font-semibold text-gray-900">{servings}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
            <ChefHat size={20} className="text-orange-600 mb-1" />
            <span className="text-xs text-gray-600">Level</span>
            <span className="text-sm font-semibold text-gray-900">{difficulty}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
            <Star size={20} className="text-orange-600 mb-1" />
            <span className="text-xs text-gray-600">Rating</span>
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
          </div>
        </div>
      </div>

      {/* Ingredients Section - with scaling */}
      <section className="px-4 py-5 bg-white mt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Ingredients</h3>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="px-3 py-1 text-gray-700 hover:bg-white rounded transition-colors"
              aria-label="Decrease servings"
            >
              −
            </button>
            <span className="px-2 text-sm font-medium text-gray-900">{servings} servings</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="px-3 py-1 text-gray-700 hover:bg-white rounded transition-colors"
              aria-label="Increase servings"
            >
              +
            </button>
          </div>
        </div>

        <ul className="space-y-3">
          {ingredients.map((ingredient, index) => {
            // Simple scaling display (in production, parse and scale quantities properly)
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
                        : 'border-gray-300 hover:border-orange-400'
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
                  className={`text-base text-gray-700 ${checkedIngredients.has(index) ? 'line-through text-gray-400' : ''}`}
                >
                  {displayIngredient}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Instructions Section - with checkboxes for cooking mode */}
      <section className="px-4 py-5 bg-white mt-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>
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
                      : 'border-gray-300 hover:border-orange-400'
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
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p
                    className={`flex-1 text-base leading-relaxed ${checkedSteps.has(index) ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                  >
                    {step}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition Info - collapsible */}
      <section className="px-4 py-4 bg-white mt-2">
        <button
          onClick={() => setNutritionOpen(!nutritionOpen)}
          className="w-full flex items-center justify-between"
          aria-expanded={nutritionOpen}
        >
          <h3 className="text-lg font-bold text-gray-900">Nutrition Information</h3>
          {nutritionOpen ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {nutritionOpen && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Calories</p>
              <p className="text-lg font-semibold text-gray-900">{nutrition.calories}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Protein</p>
              <p className="text-lg font-semibold text-gray-900">{nutrition.protein}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Carbs</p>
              <p className="text-lg font-semibold text-gray-900">{nutrition.carbs}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Fat</p>
              <p className="text-lg font-semibold text-gray-900">{nutrition.fat}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Fiber</p>
              <p className="text-lg font-semibold text-gray-900">{nutrition.fiber}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Sugar</p>
              <p className="text-lg font-semibold text-gray-900">{nutrition.sugar}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
