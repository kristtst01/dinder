import { Clock, ChefHat } from 'lucide-react';
import type { Recipe } from '@features/recipes/types/recipe';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  badge?: string;
}

export function RecipeCard({ recipe, onClick, badge }: RecipeCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
      case 'Hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-50 dark:bg-gray-900 overflow-hidden transition-all min-h-[120px] flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] w-full">
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {badge && (
          <span className="absolute top-4 right-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-3 py-1.5">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-3 overflow-x-auto">
          {recipe.cookingTime && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{recipe.cookingTime} min</span>
            </div>
          )}

          {recipe.difficulty && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 whitespace-nowrap ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
          )}

          {recipe.area && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
              <ChefHat className="w-4 h-4" />
              <span className="text-sm font-medium">{recipe.area}</span>
            </div>
          )}
        </div>

        <Link
          to={`/recipe/${recipe.id}`}
          state={{ recipe }}
          className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium py-3 px-4 rounded-full transition-colors text-center mt-auto text-sm tracking-wide">
          Check out recipe
        </Link>
      </div>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 overflow-hidden min-h-[120px] flex flex-col animate-pulse">
      <div className="aspect-[4/5] w-full bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/3" />
        <div className="h-9 bg-gray-200 dark:bg-gray-700 w-full mt-auto" />
      </div>
    </div>
  );
}
