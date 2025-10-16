import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../saved-hub/types/recipe';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="mb-8 relative rounded-2xl overflow-hidden text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="absolute inset-0">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        {/* Dark gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative p-6 md:p-8">
        <p className="text-sm font-medium text-orange-50 mb-2">RECIPE OF THE DAY</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{recipe.title}</h2>
        <p className="text-white/90 mb-4">
          Try this amazing {recipe.category.toLowerCase()} recipe from {recipe.area} cuisine!
        </p>
        <div className="flex gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">{recipe.area}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{recipe.category}</span>
          {recipe.difficulty && (
            <span className="bg-white/20 px-3 py-1 rounded-full">{recipe.difficulty}</span>
          )}
        </div>
      </div>
    </div>
  );
}
