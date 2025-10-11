import { useState } from 'react';
import { SavedPageNavbar } from '../components/navbar';
import { WeekplanCard } from '../components/weekplan-card';

export function WeekplanPage() {
  const [navOpen, setNavOpen] = useState(false);

  const weekplans = [
    { title: 'Uke 42 – Middager', author: 'Lina' },
    { title: 'Uke 43 – Kjappe retter', author: 'Lina' },
    { title: 'Uke 44 – Vegetar', author: 'Lina' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-clip">
      {/* Left Navbar */}
      <SavedPageNavbar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Week Plans</h1>
            <p className="text-gray-600 mt-1"></p>
          </div>
        </div>

        {/* Weekplan grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {weekplans.map((plan, i) => (
            <WeekplanCard
              key={i}
              title={plan.title}
              author={plan.author}
              onClick={() => console.log('Åpne', plan.title)}
            />
          ))}
        </div>

        {/* Tom tilstand */}
        {weekplans.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            You don't have any saved week plans yet.
          </div>
        )}
      </main>
    </div>
  );
}
