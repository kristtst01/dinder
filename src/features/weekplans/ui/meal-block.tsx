export function MealBlockSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
      {/* Meal title */}
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />

      {/* Recipe card placeholders */}
      <div className="space-y-3">
        <div className="h-24 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
}
