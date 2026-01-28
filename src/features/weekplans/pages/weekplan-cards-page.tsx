import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@shared/navbar';
import { WeekplanCard } from '@shared/weekplan-card';
import { WeekplanRepository } from '../repositories/weekplan.repository';
import { useAuth } from '@common/hooks/use-auth';
import type { DBWeekplan } from '@/lib/supabase/types';

export function WeekplanPage() {
  const [navOpen, setNavOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar/>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="p-4 py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Week Plans</h1>
            <p className="text-gray-600 dark:text-white mt-1">
              {weekplans.length} {weekplans.length === 1 ? 'plan' : 'plans'}
            </p>
          </div>
          <button
            onClick={() => navigate('/weekplans/new')}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition text-sm tracking-wide uppercase"
          >
            Create New Plan +
          </button>
        </header>

        {/* Loading State */}
        <div className="p-6 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : (
            <>
              {/* Weekplan grid */}
              {weekplans.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No week plans yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create your first week plan to get started!
                  </p>
                  <button
                    onClick={() => navigate('/weekplans/new')}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
                  >
                    + Create Week Plan
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
