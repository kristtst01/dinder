import { useState } from 'react';
import { Menu } from 'lucide-react';
import { WeekplanHeader } from '../components/weekplanner/weekplan-header';
import { WeekplanTableSkeleton } from '../components/weekplanner/weekplan-table';
import { Navbar } from '../components/navbar';


export default function WeekPlanner() {
    const [navOpen, setNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-x-clip">
            {/* Left Navbar */}
            <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 md:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setNavOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Menu size={24} className="text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Week Planner</h1>
                    </div>
                </header>

                {/* Desktop Header and Content */}
                <WeekplanHeader />
                <WeekplanTableSkeleton />
            </div>
        </div>
    );
}