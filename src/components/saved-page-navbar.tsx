import { Settings, BarChart3, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SavedPageNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedPageNavbar({ isOpen, onClose }: SavedPageNavbarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto
          flex flex-col shadow-lg
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 md:hidden text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={20} />
        </button>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
              AR
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Abigail Raychielle</h3>
              <p className="text-sm text-gray-500">Housewife</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <Settings size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Settings</span>
          </Link>

          <Link
            to="/statistics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <BarChart3 size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Statistics</span>
          </Link>

          <Link
            to="/weekplans"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <Calendar size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Week Plans</span>
          </Link>
        </nav>

        {/* Bottom Section (Optional - for future use like logout, version, etc) */}
        <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">Dinder v1.0</p>
        </div>
      </div>
    </>
  );
}
