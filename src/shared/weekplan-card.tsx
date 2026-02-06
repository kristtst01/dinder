import { Link } from 'react-router-dom';
import { Calendar, DollarSign } from 'lucide-react';
import { getInitials } from './getInitials';

interface WeekplanCardProps {
  id: string;
  title: string;
  createdAt: string;
  type?: 'paleo' | 'vegan' | 'keto' | 'protein';
  budget?: 'low' | 'medium' | 'high';
  userProfile?: {
    name: string;
    avatar?: string;
  };
}

export function WeekplanCard({
  id,
  title,
  createdAt,
  type,
  budget,
  userProfile,
}: WeekplanCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'paleo':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      case 'vegan':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'keto':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      case 'protein':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  const getBudgetLabel = (budget?: string) => {
    switch (budget) {
      case 'low':
        return '$';
      case 'medium':
        return '$$';
      case 'high':
        return '$$$';
      default:
        return null;
    }
  };

  return (
    <div className=" dark:bg-gray-900 overflow-hidden transition-all min-h-[120px] flex flex-col h-full">
      <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800">
        {/* User Profile Circle on the right */}
        {userProfile && (
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-lg flex items-center justify-center overflow-hidden">
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {getInitials(userProfile.name)}
              </span>
            )}
          </div>
        )}

        {/* Weekplan Title Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h3 className="text-2xl font-bold text-white text-center line-clamp-3 drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDate(createdAt)}</span>
          </div>

          {/* Type Badge */}
          {type && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 whitespace-nowrap capitalize ${getTypeColor(type)}`}
            >
              {type}
            </span>
          )}

          {/* Budget */}
          {budget && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">{getBudgetLabel(budget)}</span>
            </div>
          )}
        </div>

        <Link
          to={`/weekplans/${id}`}
          className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium py-3 px-4 rounded-full transition-colors text-center mt-auto text-sm tracking-wide"
        >
          View Week Plan
        </Link>
      </div>
    </div>
  );
}
