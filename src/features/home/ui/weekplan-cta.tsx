import { useNavigate } from 'react-router-dom';

export function WeekplanCTA() {
  const navigate = useNavigate();

  return (
    <div className="mb-8 bg-gray-100 dark:bg-gray-800 p-6 md:p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Plan Your Week</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Organize your meals and create a weekly meal plan
          </p>
        </div>
        <button
          onClick={() => navigate('/weekplans')}
          className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors whitespace-nowrap text-sm tracking-wide uppercase"
        >
          Create Plan
        </button>
      </div>
    </div>
  );
}
