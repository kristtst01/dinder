import { Settings, BarChart3, Calendar, X, ChefHat, LogOut, User, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedPageNavbar({ isOpen, onClose }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto
          flex flex-col shadow-2xl
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 md:hidden text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="p-6 md:px-6 md:py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dinder</h2>
              <p className="text-xs text-gray-400">Recipe Manager</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/20">
                AR
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                  Abigail Raychielle
                </h3>
                <p className="text-sm text-gray-400 truncate">Housewife</p>
              </div>
              <User
                size={16}
                className="text-gray-500 group-hover:text-orange-300 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            Menu
          </div>

          <Link
            to="/"
            className={`
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
              ${
                isActive('/')
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }
            `}
            onClick={onClose}
          >
            <div className={`p-1.5 rounded-lg ${isActive('/') ? 'bg-white/20' : 'bg-white/5'}`}>
              <Home size={20} />
            </div>
            <span className="font-medium">Home</span>
            {isActive('/') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </Link>

          <Link
            to="/weekplans"
            className={`
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
              ${
                isActive('/weekplans')
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }
            `}
            onClick={onClose}
          >
            <div
              className={`p-1.5 rounded-lg ${isActive('/weekplans') ? 'bg-white/20' : 'bg-white/5'}`}
            >
              <Calendar size={20} />
            </div>
            <span className="font-medium">Week Plans</span>
            {isActive('/weekplans') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </Link>

          <Link
            to="/statistics"
            className={`
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
              ${
                isActive('/statistics')
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }
            `}
            onClick={onClose}
          >
            <div
              className={`p-1.5 rounded-lg ${isActive('/statistics') ? 'bg-white/20' : 'bg-white/5'}`}
            >
              <BarChart3 size={20} />
            </div>
            <span className="font-medium">Statistics</span>
            {isActive('/statistics') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </Link>

          <Link
            to="/settings"
            className={`
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
              ${
                isActive('/settings')
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }
            `}
            onClick={onClose}
          >
            <div
              className={`p-1.5 rounded-lg ${isActive('/settings') ? 'bg-white/20' : 'bg-white/5'}`}
            >
              <Settings size={20} />
            </div>
            <span className="font-medium">Settings</span>
            {isActive('/settings') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all group">
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
              <LogOut size={20} />
            </div>
            <span className="font-medium">Logout</span>
          </button>

          <div className="text-center py-2">
            <p className="text-xs text-gray-600">Dinder v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
