import { useNavigate } from 'react-router-dom';
import type { Recipe } from '@features/recipes/types/recipe';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex items-center justify-center  p-4 md:p-6 lg:p-8"
      style={{ height: 'calc(100vh - clamp(64px, 11vh, 200px))' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0  overflow-hidden dark:border-gray-700 rounded-md  w-full max-w-7xl h-full shadow-sm">
        {/* Left side - Recipe Image */}
        <div className="relative overflow-hidden h-[200px] lg:h-auto">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          />
        </div>

        {/* Right side - Content Box */}
        <div className="bg-white dark:bg-gray-950 p-8 lg:p-16 flex flex-col justify-center">
          <p className="text-xs font-semibold text-orange-500 dark:text-orange-400 mb-3 tracking-widest uppercase">
            Recipe of the Day
          </p>

          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {recipe.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Try this amazing {recipe.category.toLowerCase()} recipe from {recipe.area} cuisine!
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700">
              {recipe.area}
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700">
              {recipe.category}
            </span>
            {recipe.difficulty && (
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700">
                {recipe.difficulty}
              </span>
            )}
          </div>

          {/* Slick Button */}
          <button
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-lg transition-colors duration-200 shadow-lg rounded-full w-full lg:w-auto"
          >
            Check It Out →
          </button>
        </div>
      </div>
    </div>
  );
}
