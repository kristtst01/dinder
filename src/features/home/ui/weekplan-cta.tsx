import { useNavigate } from 'react-router-dom';

export function WeekplanCTA() {
  const navigate = useNavigate();

  return (
    <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-orange-200 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Plan Your Week</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Organize your meals and create a weekly meal plan
          </p>
        </div>
        <button
          onClick={() => navigate('/weekplans')}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all whitespace-nowrap"
        >
          Create Plan
        </button>
      </div>
    </div>
  );
}
