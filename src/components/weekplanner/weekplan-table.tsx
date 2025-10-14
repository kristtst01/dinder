import { WeekplanColumnSkeleton } from './weekplan-column';

export function WeekplanTableSkeleton() {
  return (
    <section className="px-6 py-8">
      {/* Week title */}
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6 mx-auto" />

      {/* Table grid: responsive columns */}
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-72">
            <WeekplanColumnSkeleton />
          </div>
        ))}
      </div>

      {/* Weekly totals summary (bottom bar) */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Calories', 'Protein', 'Carbs', 'Fat'].map((label, i) => (
            <div key={i} className="text-center">
              {/* Static label */}
              <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
              {/* Skeleton value */}
              <div className="h-5 w-20 mx-auto bg-gray-200 rounded animate-pulse mb-1" />
              {/* Placeholder progress bar */}
              <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-orange-600 opacity-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
