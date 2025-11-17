import { useState } from 'react';
import { X, Search, Heart } from 'lucide-react';
import type { Recipe } from '@/features/recipes/types/recipe';
import type { MealType } from '@/lib/supabase/types';

interface RecipeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  dayName: string;
  mealType: MealType;
  availableRecipes: Recipe[];
  likedRecipes: Recipe[];
  currentRecipes: Array<{
    id: string;
    name: string;
    image: string;
    category: string;
  }>;
}

export function RecipeSelectionModal({
  isOpen,
  onClose,
  onSelectRecipe,
  dayName,
  mealType,
  availableRecipes,
  likedRecipes,
  currentRecipes,
}: RecipeSelectionModalProps) {
  const [activeTab, setActiveTab] = useState<'liked' | 'discover'>('liked');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const displayRecipes = activeTab === 'liked' ? likedRecipes : availableRecipes;

  const filteredRecipes = displayRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipeClick = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    onClose();
  };

  const mealTypeLabel = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  }[mealType];

  const isSlotFull =
    (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') &&
    currentRecipes.length > 0;
  const allowsMultiple = mealType === 'snack';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col m-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Recipe</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {dayName} • {mealTypeLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === 'liked'
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart size={16} />
              <span>Liked Recipes ({likedRecipes.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === 'discover'
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span>Discover All ({availableRecipes.length})</span>
          </button>
        </div>

        {/* Warning banner if slot is full */}
        {isSlotFull && (
          <div className="mx-6 mt-4 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
              This slot already has a recipe. Selecting a new recipe will replace the existing one.
            </p>
          </div>
        )}

        {allowsMultiple && currentRecipes.length > 0 && (
          <div className="mx-6 mt-4 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              ℹ️ You can add multiple snacks to this slot.
            </p>
          </div>
        )}

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe)}
                  className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-orange-500 text-left"
                >
                  <div className="relative aspect-video w-full">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {recipe.cookingTime && <span>{recipe.cookingTime} min</span>}
                      {recipe.difficulty && (
                        <>
                          <span>•</span>
                          <span>{recipe.difficulty}</span>
                        </>
                      )}
                    </div>
                    {recipe.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        {recipe.category}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No recipes found</p>
              <p className="text-sm mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
