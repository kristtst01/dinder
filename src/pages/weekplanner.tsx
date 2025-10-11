
import { WeekplanHeader } from '../components/weekplanner/weekplan-header';
import { WeekplanTableSkeleton } from '../components/weekplanner/weekplan-table';



export default function WeekPlanner() {
    return (
        <div>
            <WeekplanHeader />
            <div>Week Planner Page</div>
            <WeekplanTableSkeleton />
        </div>
    );
}