import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { WeekplanHeader } from '../ui/weekplan-header';
import { WeekplanTable } from '../ui/weekplan-table';
import { Navbar } from '../../../shared/navbar';
import { RecipeSelectionModal } from '../ui/recipe-selection-modal';
import { WeekplanRepository } from '../repositories/weekplan.repository';
import type { MealType } from '@/lib/supabase/types';
import type { Recipe } from '@/features/saved-hub/types/recipe';
import { ALL_RECIPES } from '@/utils/recipe-loader';
import { useAuth } from '@common/hooks/use-auth';

interface WeekplanData {
  id?: string;
  title: string;
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

  // Mock liked recipes - in production, fetch from Supabase
  const [likedRecipes] = useState<Recipe[]>(
    ALL_RECIPES.filter((_, index) => index % 3 === 0).slice(0, 10)
  );

  // Load weekplan from Supabase
  useEffect(() => {
    const loadWeekplan = async () => {
      if (!user) return;

      try {
        setLoading(true);

        if (weekplanId) {
          // Load existing weekplan
          const { weekplan, entries } = await WeekplanRepository.getWeekplan(weekplanId);

          // Transform entries to weekplanData format
          const recipes: WeekplanData['recipes'] = {};

          entries.forEach((entry) => {
            if (!recipes[entry.day_index]) {
              recipes[entry.day_index] = {};
            }

            const recipe = ALL_RECIPES.find((r) => r.id === entry.recipe_id);
            if (recipe) {
              if (!recipes[entry.day_index][entry.meal_type]) {
                recipes[entry.day_index][entry.meal_type] = [];
              }

              recipes[entry.day_index][entry.meal_type]!.push({
                id: recipe.id,
                name: recipe.title,
                image: recipe.image,
                category: recipe.category,
                nutrition: recipe.nutrition,
              });
            }
          });

          setWeekplanData({
            id: weekplan.id,
            title: weekplan.name,
            recipes,
          });
        } else {
          // New weekplan - set default empty state
          setWeekplanData({
            title: `Week ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
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

    loadWeekplan();
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
      const { entries } = await WeekplanRepository.getWeekplan(weekplanId);
      await Promise.all(
        entries.map((entry) => WeekplanRepository.removeRecipeFromWeekplan(entry.id))
      );

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
            entriesToCreate.push({
              weekplan_id: weekplanId,
              recipe_id: recipe.id,
              day_index: parseInt(dayIndex),
              meal_type: mealType as MealType,
              sequence: index,
            });
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
            nutrition: recipe.nutrition,
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
            nutrition: recipe.nutrition,
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
                availableRecipes={ALL_RECIPES}
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
