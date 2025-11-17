import { useAuth } from '@common/hooks/use-auth';
import { AuthModal } from '@features/login/ui/auth-modal';
import { useProfile } from '@features/profile/hooks/useProfile';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  ChefHat,
  Flame,
  Home,
  LogIn,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../common/hooks/use-theme';
import getInitials from './getInitials';

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
  { path: '/discover', label: 'Discover', icon: Flame },
  { path: '/recipe/create', label: 'Create Recipe', icon: Plus },
  { path: '/cookbook', label: 'Cookbook', icon: BookOpen },
  { path: '/weekplans', label: 'Week Plans', icon: Calendar },
  { path: '/preferences', label: 'Preferences', icon: Settings },
];

export function Navbar({ isOpen, onClose }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  // Get user display name and initials
  const userName = user?.user_metadata?.full_name || user?.email || 'Guest';
  const userInitials = getInitials(userName);
  const { data: profile, isLoading: profileLoading, error } = useProfile(user?.id);

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto
          flex flex-col shadow-lg
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="p-6 md:px-6 md:py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <ChefHat className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dinder</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recipe Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400'
                  }
                `}
                onClick={onClose}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
                {isActive(path) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transition-all mt-2"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>

        {/* Profile Section at Bottom */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="bg-orange-50 dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ) : !user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg transition-all"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                className="bg-orange-50 dark:bg-gray-800 rounded-2xl p-3 hover:bg-orange-100 dark:hover:bg-gray-700 transition-all cursor-pointer group block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {!error && !profileLoading && profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {userName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                  <User
                    size={16}
                    className="text-gray-400 dark:text-gray-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex-shrink-0"
                  />
                </div>
              </Link>

              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Dinder v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
