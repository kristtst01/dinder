import { useAuth } from '@common/hooks/use-auth';
import { AuthModal } from '@features/login/ui/auth-modal';
import { useProfile } from '@features/profile/hooks/useProfile';
import { useFilters } from '@/common/contexts/filter-context';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  ChefHat,
  Home,
  LogIn,
  LogOut,
  Moon,
  Plus,
  Search,
  Sun,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTheme } from '../common/hooks/use-theme';
import getInitials from './getInitials';
import { FilterPanel, type FilterState } from './filter-panel';

interface NavLinkItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navLinks: NavLinkItem[] = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/recipe/create', label: 'Create Recipe', icon: Plus },
  { path: '/cookbook', label: 'Cookbook', icon: BookOpen },
  { path: '/weekplans', label: 'Week Plans', icon: Calendar },
];

export function Navbar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/home';

  // Get filter context (only use on home page)
  const filterContext = useFilters();

  // Read filters from URL (same logic as HomePage)
  const filters: FilterState = useMemo(
    () => ({
      kitchen: searchParams.get('kitchen') || 'all',
      difficulty: (searchParams.get('difficulty') || 'all') as FilterState['difficulty'],
      maxPrepTime: searchParams.get('maxPrepTime') ? parseInt(searchParams.get('maxPrepTime')!) : undefined,
      vegetarian: (searchParams.get('vegetarian') || 'any') as FilterState['vegetarian'],
      searchQuery: searchParams.get('q') || '',
    }),
    [searchParams]
  );

  const userName = user?.user_metadata?.full_name || user?.email || 'Guest';
  const userInitials = getInitials(userName);
  const { data: profile, isLoading: profileLoading, error } = useProfile(user?.id);

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="h-16 lg:h-20 flex items-center gap-4 lg:gap-6 px-4 lg:px-6 text-sm lg:text-base">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <ChefHat className="text-white w-[60%] h-[60%]" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg lg:text-xl">
              Dinder
            </span>
          </Link>

          {/* Nav Links */}
          <div className="@container/nav flex items-center gap-0.5 flex-1 min-w-0">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <div key={path} className="relative group flex-1 min-w-0">
                <Link
                  to={path}
                  className={`
                    w-full overflow-hidden flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all px-2 py-2 lg:px-3 lg:py-2.5
                    ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm cursor-pointer'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400'
                    }
                  `}
                >
                  <Icon className="shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
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
            {isHomePage && filterContext && filterContext.onFiltersChange && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 lg:p-2.5 rounded-lg font-medium transition-all ${
                  showFilters
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <Search className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 lg:p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </button>

            {loading ? (
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
            ) : !user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium hover:shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1.5 lg:px-2.5 lg:py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition-all group"
                >
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold overflow-hidden text-xs lg:text-sm">
                    {!error && !profileLoading && profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
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
                  className="p-2 lg:p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {isHomePage && filterContext && filterContext.onFiltersChange && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 ${
              showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 lg:px-6 py-4">
              <FilterPanel
                filters={filters}
                onChange={filterContext.onFiltersChange}
                recipes={filterContext.recipes}
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
