import { Settings, BarChart3, Calendar, X, ChefHat, LogOut, User, Home, Bookmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLinkItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navLinks: NavLinkItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/saved', label: 'Saved Recipes', icon: Bookmark },
  { path: '/weekplans', label: 'Week Plans', icon: Calendar },
  { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar({ isOpen, onClose }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto
          flex flex-col shadow-lg
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="p-6 md:px-6 md:py-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <ChefHat className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dinder</h2>
              <p className="text-xs text-gray-500">Recipe Manager</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 hover:bg-orange-100 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                AR
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                  Abigail Raychielle
                </h3>
                <p className="text-sm text-gray-600 truncate">Housewife</p>
              </div>
              <User
                size={16}
                className="text-gray-400 group-hover:text-orange-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            Menu
          </div>

          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
                ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }
              `}
              onClick={onClose}
            >
              <div className={`p-1.5 rounded-lg ${isActive(path) ? 'bg-white/20' : 'bg-orange-100'}`}>
                <Icon size={20} />
              </div>
              <span className="font-medium">{label}</span>
              {isActive(path) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-3 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all group">
            <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
              <LogOut size={20} />
            </div>
            <span className="font-medium">Logout</span>
          </button>

          <div className="text-center py-2">
            <p className="text-xs text-gray-500">Dinder v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
