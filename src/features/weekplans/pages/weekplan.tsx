import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { WeekplanHeader } from '../ui/weekplan-header';
import { WeekplanTable } from '../ui/weekplan-table';
import { Navbar } from '../../../shared/navbar';
import { RecipeSelectionModal } from '../ui/recipe-selection-modal';
import { WeekplanRepository } from '../repositories/weekplan.repository';
import { supabase } from '@/lib/supabase/supabase';
import type { MealType, DBRecipe } from '@/lib/supabase/types';
import type { Recipe } from '@/features/recipes/types/recipe';
import { useAuth } from '@common/hooks/use-auth';

// Helper to transform DBRecipe to Recipe
const transformDBRecipeToRecipe = (dbRecipe: DBRecipe): Recipe => ({
  id: dbRecipe.uid,
  title: dbRecipe.name,
  image: dbRecipe.image || '',
  category: dbRecipe.category,
  area: dbRecipe.area || '',
  difficulty: dbRecipe.difficulty === 'easy' ? 'Easy' : dbRecipe.difficulty === 'medium' ? 'Medium' : 'Hard',
  cookingTime: dbRecipe.time,
  servings: dbRecipe.servings,
});

interface WeekplanData {
  id?: string;
  title: string;
  createdAt?: string;
  recipes: {
    [dayIndex: number]: {
      [key in MealType]?: Array<{
        id: string;
        name: string;
        image: string;
        category: string;
        nutrition?: {
          calories: number;
          protein: string;
          carbs: string;
          fat: string;
        };
      }>;
    };
  };
}

export default function WeekPlanner() {
  const { id: weekplanId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weekplanData, setWeekplanData] = useState<WeekplanData>({
    title: 'New Weekplan',
    recipes: {},
  });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    dayIndex: number;
    dayName: string;
    mealType: MealType;
  } | null>(null);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);



  // Load recipes and weekplan from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Load all recipes from Supabase
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('*');

        if (recipesError) throw recipesError;

        const allRecipes = (recipesData || []).map(transformDBRecipeToRecipe);
        setAvailableRecipes(allRecipes);
        setLikedRecipes(allRecipes.slice(0, 10)); // TODO: Filter by user's liked recipes

        if (weekplanId) {
          // Load existing weekplan
          const { weekplan, entries } = await WeekplanRepository.getWeekplan(weekplanId);

          // Transform entries to weekplanData format
          const recipes: WeekplanData['recipes'] = {};

          entries.forEach((entry) => {
            if (!recipes[entry.day_index]) {
              recipes[entry.day_index] = {};
            }

            const recipe = allRecipes.find((r: Recipe) => r.id === entry.recipe_id);
            if (recipe) {
              const mealType = entry.meal_type as MealType;
              if (!recipes[entry.day_index][mealType]) {
                recipes[entry.day_index][mealType] = [];
              }

              recipes[entry.day_index][mealType]!.push({
                id: recipe.id,
                name: recipe.title,
                image: recipe.image,
                category: recipe.category,
              });
            }
          });

          setWeekplanData({
            id: weekplan.id,
            title: weekplan.name || 'Untitled Weekplan',
            createdAt: weekplan.created_at,
            recipes,
          });
        } else {
          // New weekplan - set default empty state
          setWeekplanData({
            title: `Week ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            createdAt: new Date().toISOString(),
            recipes: {},
          });
          setIsEditMode(true); // Start in edit mode for new weekplan
        }
      } catch (error) {
        console.error('Error loading weekplan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [weekplanId, user]);

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveWeekplan = async () => {
    if (!user) {
      alert('You must be logged in to save a weekplan');
      return;
    }

    if (!weekplanData.title.trim()) {
      alert('Please enter a weekplan title');
      return;
    }

    try {
      setSaving(true);

      let weekplanId = weekplanData.id;

      // Create or update weekplan
      if (!weekplanId) {
        const newWeekplan = await WeekplanRepository.createWeekplan({
          user_id: user.id,
          name: weekplanData.title,
          start_date: new Date().toISOString().split('T')[0],
        });
        weekplanId = newWeekplan.id;
        setWeekplanData((prev) => ({ ...prev, id: weekplanId }));
      } else {
        await WeekplanRepository.updateWeekplan(weekplanId, {
          name: weekplanData.title,
        });
      }

      // Delete all existing entries and recreate
      if (weekplanId) {
        const { entries } = await WeekplanRepository.getWeekplan(weekplanId);
        await Promise.all(
          entries.map((entry) => WeekplanRepository.removeRecipeFromWeekplan(entry.id))
        );
      }

      // Create new entries from current state
      const entriesToCreate: Array<{
        weekplan_id: string;
        recipe_id: string;
        day_index: number;
        meal_type: MealType;
        sequence: number;
      }> = [];
      for (const [dayIndex, dayRecipes] of Object.entries(weekplanData.recipes)) {
        for (const [mealType, recipes] of Object.entries(dayRecipes)) {
          recipes.forEach((recipe, index) => {
            if (weekplanId) {
              entriesToCreate.push({
                weekplan_id: weekplanId,
                recipe_id: recipe.id,
                day_index: parseInt(dayIndex),
                meal_type: mealType as MealType,
                sequence: index,
              });
            }
          });
        }
      }

      if (entriesToCreate.length > 0) {
        await WeekplanRepository.addRecipesToWeekplan(entriesToCreate);
      }

      // Navigate to the saved weekplan if it was a new one
      if (!weekplanData.id) {
        navigate(`/weekplans/${weekplanId}`);
      }

      setIsEditMode(false);
      alert('Weekplan saved successfully!');
    } catch (error) {
      console.error('Error saving weekplan:', error);
      alert('Failed to save weekplan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setWeekplanData((prev) => ({ ...prev, title: newTitle }));
  };

  const handleOpenRecipeModal = (dayIndex: number, dayName: string, mealType: MealType) => {
    setModalState({ isOpen: true, dayIndex, dayName, mealType });
  };

  const handleCloseRecipeModal = () => {
    setModalState(null);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!modalState) return;

    const { dayIndex, mealType } = modalState;

    setWeekplanData((prev) => {
      const newRecipes = { ...prev.recipes };
      const dayRecipes = { ...newRecipes[dayIndex] };
      const mealRecipes = dayRecipes[mealType] || [];

      // For breakfast, lunch, dinner: only one recipe allowed (replace existing)
      // For snacks: allow multiple recipes
      if (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') {
        dayRecipes[mealType] = [
          {
            id: recipe.id,
            name: recipe.title,
            image: recipe.image,
            category: recipe.category,
          },
        ];
      } else {
        // Snacks: allow multiple
        dayRecipes[mealType] = [
          ...mealRecipes,
          {
            id: recipe.id,
            name: recipe.title,
            image: recipe.image,
            category: recipe.category,
          },
        ];
      }

      newRecipes[dayIndex] = dayRecipes;
      return { ...prev, recipes: newRecipes };
    });
  };

  const handleRemoveRecipe = (dayIndex: number, mealType: MealType, recipeId: string) => {
    setWeekplanData((prev) => {
      const newRecipes = { ...prev.recipes };
      const dayRecipes = { ...newRecipes[dayIndex] };
      const mealRecipes = dayRecipes[mealType] || [];
      dayRecipes[mealType] = mealRecipes.filter((r) => r.id !== recipeId);
      newRecipes[dayIndex] = dayRecipes;
      return { ...prev, recipes: newRecipes };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNavOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Week Planner</h1>
          </div>
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading weekplan...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Header and Content */}
            <WeekplanHeader
              isEditMode={isEditMode}
              weekplanTitle={weekplanData.title}
              onToggleEditMode={handleToggleEditMode}
              onSaveWeekplan={handleSaveWeekplan}
              onTitleChange={handleTitleChange}
              saving={saving}
              createdAt={weekplanData.createdAt}
            />
            <WeekplanTable
              isEditMode={isEditMode}
              weekplanData={weekplanData}
              onOpenRecipeModal={handleOpenRecipeModal}
              onRemoveRecipe={handleRemoveRecipe}
            />

            {/* Recipe Selection Modal */}
            {modalState && (
              <RecipeSelectionModal
                isOpen={modalState.isOpen}
                onClose={handleCloseRecipeModal}
                onSelectRecipe={handleSelectRecipe}
                dayName={modalState.dayName}
                mealType={modalState.mealType}
                availableRecipes={availableRecipes}
                likedRecipes={likedRecipes}
                currentRecipes={
                  weekplanData.recipes[modalState.dayIndex]?.[modalState.mealType] || []
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
