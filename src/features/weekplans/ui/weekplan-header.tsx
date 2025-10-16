import { Calendar, Share2, ShoppingBag, Pencil } from 'lucide-react';
import { useAuth } from '@common/hooks/use-auth';

export function WeekplanHeader() {
  const { user, loading } = useAuth();

  // --- mock data ---
  const plan = {
    title: 'Week 42 - Dinners',
    createdAt: 'Created Oct 8, 2025',
    nutrition: {
      kcal: 11250,
      protein: 480,
      carbs: 950,
      fat: 400,
    },
  };

  // Get user display name and avatar
  const userName = user?.user_metadata?.full_name || user?.email || 'User';
  const userInitial = userName[0]?.toUpperCase() || 'U';

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      {/* Top row: title + meta + actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: profile + title + meta */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
            {userInitial}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{userName}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden />
                <span>{plan.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: actions (mobile stacks underneath) */}
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
            aria-label="Share week plan"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
            aria-label="Order week plan"
          >
            <ShoppingBag className="h-4 w-4" />
            Order
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-md transition flex items-center gap-2"
            aria-label="Edit week plan"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Weekly nutrition summary (compact, orange-accented) */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Calories" value={`${plan.nutrition.kcal.toLocaleString()} kcal`} />
        <StatCard label="Protein" value={`${plan.nutrition.protein} g`} />
        <StatCard label="Carbs" value={`${plan.nutrition.carbs} g`} />
        <StatCard label="Fat" value={`${plan.nutrition.fat} g`} />
      </div>
    </header>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-gray-900 dark:text-white">{value}</p>
      {/* subtle theme accent */}
      <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
    </div>
  );
}
