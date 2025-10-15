import { MealBlockSkeleton } from './meal-block';

export function WeekplanColumnSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm flex flex-col gap-4">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-12 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
      </div>

      {/* Meal sections */}
      <div className="flex flex-col gap-4">
        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, i) => (
          <div key={i}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{meal}</p>
            <MealBlockSkeleton />
          </div>
        ))}
      </div>

      {/* Nutrition summary placeholder */}
      <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3 grid grid-cols-2 gap-3">
        {['Calories', 'Protein', 'Carbs', 'Fat'].map((label, i) => (
          <div key={i} className="text-center">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
            <div className="h-4 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
            <div className="h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
