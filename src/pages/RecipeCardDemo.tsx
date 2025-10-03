import { RecipeCard, RecipeCardSkeleton } from '../components/RecipeCard';
import { convertMealDBArrayToRecipes } from '../utils/mealDbHelpers';
import chickenData from '../assets/mealdb-chicken.json';

export function RecipeCardDemo() {
  const recipes = convertMealDBArrayToRecipes(chickenData.meals.slice(0, 9));

  const recipesWithMockData = recipes.map((recipe, index) => ({
    ...recipe,
    cookingTime: [15, 30, 45, 60][index % 4],
    difficulty: (['Easy', 'Medium', 'Hard'] as const)[index % 3],
    badge: index === 0 ? 'New' : index === 1 ? 'Saved' : undefined,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recipe Card Demo</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Responsive Grid Layout
          </h2>
          <p className="text-gray-600 mb-6">
            Single column on mobile, 2 columns on tablet, 3 columns on desktop
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesWithMockData.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => console.log('Clicked:', recipe.title)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skeleton Loading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Minimal Data (No Time/Difficulty)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.slice(0, 3).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">With Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCard
              recipe={recipesWithMockData[0]}
              badge="New"
              onClick={() => console.log('New recipe clicked')}
            />
            <RecipeCard
              recipe={recipesWithMockData[1]}
              badge="Saved"
              onClick={() => console.log('Saved recipe clicked')}
            />
            <RecipeCard
              recipe={recipesWithMockData[2]}
              badge="Popular"
              onClick={() => console.log('Popular recipe clicked')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
