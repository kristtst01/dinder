import { MealBlockSkeleton } from './meal-block';

export function WeekplanColumnSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-4">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Meal sections */}
      <div className="flex flex-col gap-4">
        <MealBlockSkeleton />
        <MealBlockSkeleton />
        <MealBlockSkeleton />
      </div>

      {/* Nutrition summary placeholder */}
      <div className="mt-2 border-t border-gray-100 pt-3 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="mt-2 h-4 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="mt-2 h-1 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
