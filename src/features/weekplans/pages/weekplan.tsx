import { WeekplanHeader } from '../ui/weekplan-header';
import { WeekplanTableSkeleton } from '../ui/weekplan-table';
import { Navbar } from '../../../shared/navbar';

export default function WeekPlanner() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* Content */}
      <WeekplanHeader />
      <WeekplanTableSkeleton />
    </div>
  );
}
