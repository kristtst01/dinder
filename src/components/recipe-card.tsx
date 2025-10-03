import { Clock, ChefHat } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  badge?: string;
}

export function RecipeCard({ recipe, onClick, badge }: RecipeCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer min-h-[120px] flex flex-col"
    >
      <div className="relative aspect-video w-full">
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {badge && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-3 flex-wrap">
          {recipe.cookingTime && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{recipe.cookingTime} min</span>
            </div>
          )}

          {recipe.difficulty && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
          )}

          {recipe.area && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <ChefHat className="w-4 h-4" />
              <span className="text-sm font-medium">{recipe.area}</span>
            </div>
          )}
        </div>

        {recipe.category && (
          <span className="text-xs text-gray-500 font-medium mt-auto">{recipe.category}</span>
        )}
      </div>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md min-h-[120px] flex flex-col animate-pulse">
      <div className="aspect-video w-full bg-gray-200" />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto" />
      </div>
    </div>
  );
}
