import { useNavigate } from 'react-router-dom';
import type { Recipe } from '@features/recipes/types/recipe';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="mb-8 relative overflow-hidden text-white border border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-95 transition-opacity min-h-[500px] md:min-h-[500px]"
    >
      <div className="absolute inset-0">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        {/* Dark gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative p-6 md:p-8 flex flex-col justify-end h-full">
        <p className="text-xs font-medium text-gray-300 mb-2 tracking-wider">RECIPE OF THE DAY</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{recipe.title}</h2>
        <p className="text-white/90 mb-4">
          Try this amazing {recipe.category.toLowerCase()} recipe from {recipe.area} cuisine!
        </p>
        <div className="flex gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1.5 border border-white/30">{recipe.area}</span>
          <span className="bg-white/20 px-3 py-1.5 border border-white/30">{recipe.category}</span>
          {recipe.difficulty && (
            <span className="bg-white/20 px-3 py-1.5 border border-white/30">{recipe.difficulty}</span>

)}
        </div>
      </div>
    </div>
  );
}
