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
  Search,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../common/hooks/use-theme';
import getInitials from './getInitials';
import { FilterPanel, type FilterState } from './filter-panel';
import type { Recipe } from '@features/recipes/types/recipe';

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
];

interface NavbarProps {
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  recipes?: Recipe[];
  showSearch?: boolean;
}

export function Navbar({ filters, onFiltersChange, recipes = [], showSearch = false }: NavbarProps = {}) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const userName = user?.user_metadata?.full_name || user?.email || 'Guest';
  const userInitials = getInitials(userName);
  const { data: profile, isLoading: profileLoading, error } = useProfile(user?.id);

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <nav
        className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm shrink-0"
      >
        <div className="flex items-center gap-6 px-6" style={{ height: 'clamp(64px, 11vh, 200px)', fontSize: 'clamp(13px, 1.6vh, 20px)' }}>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div
              className="aspect-square bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center"
              style={{ height: 'clamp(28px, 5vh, 56px)' }}
            >
              <ChefHat className="text-white w-[60%] h-[60%]" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(18px, 2.2vh, 28px)' }}>Dinder</span>
          </Link>

          {/* Nav Links */}
          <div className="@container/nav flex items-center gap-0.5 flex-1 min-w-0">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <div key={path} className="relative group flex-1 min-w-0">
                <Link
                  to={path}
                  className={`
                    w-full overflow-hidden flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all
                    ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm cursor-pointer'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400'
                    }
                  `}
                  style={{ padding: 'clamp(6px, 1vh, 12px) clamp(6px, 1vh, 12px)' }}
                >
                  <Icon className="shrink-0" style={{ width: 'clamp(14px, 2vh, 24px)', height: 'clamp(14px, 2vh, 24px)' }} />
                  <span className="hidden @[700px]/nav:inline whitespace-nowrap">{label}</span>
                </Link>
                <span className="invisible group-hover:visible absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-40 @[700px]/nav:hidden">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Right side: search, theme toggle + profile/auth */}
          <div className="flex items-center gap-2 shrink-0">
            {showSearch && filters && onFiltersChange && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-lg font-medium transition-all ${
                  showFilters
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
                style={{ padding: 'clamp(6px, 1vh, 12px)' }}
              >
                <Search style={{ width: 'clamp(16px, 2vh, 24px)', height: 'clamp(16px, 2vh, 24px)' }} />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="rounded-lg text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              style={{ padding: 'clamp(6px, 1vh, 12px)' }}
            >
              {theme === 'dark' ? <Sun style={{ width: 'clamp(16px, 2vh, 24px)', height: 'clamp(16px, 2vh, 24px)' }} /> : <Moon style={{ width: 'clamp(16px, 2vh, 24px)', height: 'clamp(16px, 2vh, 24px)' }} />}
            </button>

            {loading ? (
              <div className="rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" style={{ width: 'clamp(28px, 4vh, 44px)', height: 'clamp(28px, 4vh, 44px)' }} />
            ) : !user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium hover:shadow-md transition-all cursor-pointer"
                style={{ padding: 'clamp(6px, 1vh, 12px) clamp(12px, 1.8vh, 24px)' }}
              >
                <LogIn style={{ width: 'clamp(14px, 2vh, 24px)', height: 'clamp(14px, 2vh, 24px)' }} />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition-all group"
                  style={{ padding: 'clamp(4px, 0.7vh, 10px) clamp(6px, 1vh, 14px)' }}
                >
                  <div
                    className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold overflow-hidden"
                    style={{ width: 'clamp(28px, 4vh, 44px)', height: 'clamp(28px, 4vh, 44px)', fontSize: 'clamp(11px, 1.4vh, 18px)' }}
                  >
                    {!error && !profileLoading && profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {userName}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  style={{ padding: 'clamp(6px, 1vh, 12px)' }}
                >
                  <LogOut style={{ width: 'clamp(14px, 2vh, 24px)', height: 'clamp(14px, 2vh, 24px)' }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showSearch && filters && onFiltersChange && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 ${
              showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 py-4">
              <FilterPanel
                filters={filters}
                onChange={onFiltersChange}
                recipes={recipes}
                showFilters={true}
                onToggleFilters={setShowFilters}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
