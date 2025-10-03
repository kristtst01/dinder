import { Bell, Bookmark, Home, Search, User } from 'lucide-react';
import { RecipeCard } from '../components/recipe-card';
import { convertMealDBArrayToRecipes } from '../utils/meal-db-helpers';
import chickenData from '../assets/mealdb-chicken.json';
import soupData from '../assets/mealdb-soup.json';

export function HomePage() {
  const categories = [
    { icon: '🍔', label: 'Western' },
    { icon: '🍞', label: 'Bread' },
    { icon: '🥘', label: 'Western' },
    { icon: '🍲', label: 'Soup' },
    { icon: '🍨', label: 'Dessert' },
    { icon: '🍸', label: 'Coctail' },
    { icon: '🍝', label: 'Noodles' },
    { icon: '☕', label: 'Coffee' },
  ];

  const chickenRecipes = convertMealDBArrayToRecipes(chickenData.meals.slice(0, 6)).map(
    (recipe, index) => ({
      ...recipe,
      cookingTime: [30, 45, 60][index % 3],
      difficulty: (['Easy', 'Medium', 'Hard'] as const)[index % 3],
      badge: index === 0 ? 'New' : undefined,
    })
  );

  const soupRecipes = convertMealDBArrayToRecipes(soupData.meals.slice(0, 6)).map(
    (recipe, index) => ({
      ...recipe,
      cookingTime: [20, 35, 50][index % 3],
      difficulty: (['Easy', 'Medium'] as const)[index % 2],
    })
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Abigail Raychielle</h2>
              <p className="text-sm text-gray-400">Housewife</p>
            </div>
          </div>
          <button className="relative">
            <Bell className="w-7 h-7 text-gray-700" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3 font-medium">New Update 1.4</p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            What Do You Want To
            <br />
            Cook Today?
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Recipe"
            className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white px-6 py-8 mb-6 mt-6 rounded-3xl mx-4">
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <button key={index} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl hover:bg-orange-50 transition-colors shadow-sm">
                {category.icon}
              </div>
              <span className="text-xs text-gray-700 font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chicken Recipes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5 px-6 max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900">Chicken Recipes</h3>
          <button className="text-sm text-gray-500 flex items-center gap-1 font-medium">
            See More <span className="text-lg">›</span>
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide md:hidden">
          {chickenRecipes.map((recipe) => (
            <div key={recipe.id} className="flex-shrink-0 w-72">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
          {chickenRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>

      {/* Soup Recipes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5 px-6 max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900">Soup Recipes</h3>
          <button className="text-sm text-gray-500 flex items-center gap-1 font-medium">
            See More <span className="text-lg">›</span>
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide md:hidden">
          {soupRecipes.map((recipe) => (
            <div key={recipe.id} className="flex-shrink-0 w-72">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
          {soupRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 border border-gray-100">
        <button className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
          <Home className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
        <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all">
          <Search className="w-6 h-6 text-orange-500" strokeWidth={2} />
        </button>
        <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all">
          <Bookmark className="w-6 h-6 text-orange-500" strokeWidth={2} />
        </button>
        <button className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all">
          <User className="w-6 h-6 text-orange-500" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default HomePage;
