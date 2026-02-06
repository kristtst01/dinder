import { WeekplanColumn } from './weekplan-column';
import { WeekplanColumnMobile } from './weekplan-column-mobile';
import type { MealType } from '@/lib/supabase/types';

interface WeekplanData {
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

interface WeekplanTableProps {
  isEditMode: boolean;
  weekplanData: WeekplanData;
  onOpenRecipeModal: (dayIndex: number, dayName: string, mealType: MealType) => void;
  onRemoveRecipe: (dayIndex: number, mealType: MealType, recipeId: string) => void;
  onViewRecipe: (recipeId: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeekplanTable({
  isEditMode,
  weekplanData,
  onOpenRecipeModal,
  onRemoveRecipe,
  onViewRecipe,
}: WeekplanTableProps) {
  return (
    <section className="px-6 py-8">
      {/* Desktop View - All 7 days in horizontal scroll */}
      <div className="hidden md:block">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {DAYS.map((day, dayIndex) => (
            <div key={dayIndex} className="flex-shrink-0 w-72">
              <WeekplanColumn
                day={day}
                dayIndex={dayIndex}
                isEditMode={isEditMode}
                recipes={weekplanData.recipes[dayIndex] || {}}
                onOpenRecipeModal={onOpenRecipeModal}
                onRemoveRecipe={onRemoveRecipe}
                onViewRecipe={onViewRecipe}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - Expandable stacks per day */}
      <div className="md:hidden space-y-3">
        {DAYS.map((day, dayIndex) => (
          <WeekplanColumnMobile
            key={dayIndex}
            day={day}
            dayIndex={dayIndex}
            isEditMode={isEditMode}
            recipes={weekplanData.recipes[dayIndex] || {}}
            onOpenRecipeModal={onOpenRecipeModal}
            onRemoveRecipe={onRemoveRecipe}
            onViewRecipe={onViewRecipe}
          />
        ))}
      </div>
    </section>
  );
}
