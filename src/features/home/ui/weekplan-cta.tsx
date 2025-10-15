import { useNavigate } from 'react-router-dom';

export function WeekplanCTA() {
  const navigate = useNavigate();

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Plan Your Week</h3>
          <p className="text-sm text-gray-600">Organize your meals and create a weekly meal plan</p>
        </div>
        <button
          onClick={() => navigate('/weekplans')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all whitespace-nowrap"
        >
          Create Plan
        </button>
      </div>
    </div>
  );
}
