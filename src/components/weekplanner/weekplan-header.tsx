import { Calendar, Share2, ShoppingBag, Pencil } from "lucide-react";

export function WeekplanHeader() {
  // --- mock data ---
  const user = {
    name: "Lina Berg",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  };

  const plan = {
    title: "Week 42 – Dinners",
    createdAt: "Created Oct 8, 2025",
    nutrition: {
      kcal: 11250,
      protein: 480,
      carbs: 950,
      fat: 400,
    },
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Top row: title + meta + actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: profile + title + meta */}
        <div className="flex items-start gap-4">
          <img
            src={user.avatar}
            alt={`${user.name} avatar`}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{user.name}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" aria-hidden />
                <span>{plan.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: actions (mobile stacks underneath) */}
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2"
            aria-label="Share week plan"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2"
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
    <div className="rounded-2xl border border-gray-200 p-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
      {/* subtle theme accent */}
      <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
    </div>
  );
}
