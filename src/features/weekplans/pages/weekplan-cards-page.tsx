import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeekplanCard } from '@shared/weekplan-card';
import { WeekplanRepository } from '../repositories/weekplan.repository';
import { useAuth } from '@common/hooks/use-auth';
import type { DBWeekplan } from '@/lib/supabase/types';

export function WeekplanPage() {
  const [weekplans, setWeekplans] = useState<DBWeekplan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeekplans = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await WeekplanRepository.getWeekplans(user.id);
        setWeekplans(data);
      } catch (error) {
        console.error('Error loading weekplans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeekplans();
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 lg:py-12">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                Week Plans
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                {weekplans.length} {weekplans.length === 1 ? 'plan' : 'plans'} saved
              </p>
            </div>
            <button
              onClick={() => navigate('/weekplans/new')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Create New Plan
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Weekplan grid */}
              {weekplans.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weekplans.map((plan) => (
                    <WeekplanCard
                      key={plan.id}
                      id={plan.id}
                      title={plan.name || 'Untitled Plan'}
                      createdAt={plan.created_at}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {weekplans.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No week plans yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                    Create your first week plan to get started!
                  </p>
                  <button
                    onClick={() => navigate('/weekplans/new')}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl cursor-pointer"
                  >
                    Create Week Plan
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
