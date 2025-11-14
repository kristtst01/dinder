import { useState } from 'react';
import { Menu } from 'lucide-react';
import { WeekplanHeader } from '../ui/weekplan-header';
import { WeekplanTable } from '../ui/weekplan-table';
import { Navbar } from '../../../shared/navbar';
import type { MealType } from '@/lib/supabase/types';

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
  const [navOpen, setNavOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [weekplanData, setWeekplanData] = useState<WeekplanData>({
    title: 'Week 42 - Dinners',
    recipes: {},
  });

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveWeekplan = async () => {
    // TODO: Implement save logic
    console.log('Saving weekplan:', weekplanData);
  };

  const handleTitleChange = (newTitle: string) => {
    setWeekplanData((prev) => ({ ...prev, title: newTitle }));
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

        {/* Desktop Header and Content */}
        <WeekplanHeader
          isEditMode={isEditMode}
          weekplanTitle={weekplanData.title}
          onToggleEditMode={handleToggleEditMode}
          onSaveWeekplan={handleSaveWeekplan}
          onTitleChange={handleTitleChange}
        />
        <WeekplanTable isEditMode={isEditMode} weekplanData={weekplanData} />
      </div>
    </div>
  );
}
