import type { UserPreferenceFormData } from '@/lib/supabase/types';
import { useAuth } from '@common/hooks/use-auth';
import { useTheme } from '@common/hooks/use-theme';
import { Navbar } from '@shared/navbar';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Download,
  Globe,
  Loader2,
  Menu,
  Moon,
  Scale,
  Sun,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import type { ExpandedSections } from '../../profile/types';
import { useDebouncedSave } from '../hooks/useDebounceSave';
import { usePreferences } from '../hooks/usePreferences';
import { PreferenceRepository } from '../repositories/preference.repository';

type SectionKey = 'delivery' | 'dietary' | 'price' | 'orders';

export default function SettingsPage() {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  const { theme, toggleTheme } = useTheme();
  const [navOpen, setNavOpen] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { data: preferences, isLoading: preferenceLoading, error } = usePreferences(user?.id);

  const [formData, setFormData] = useState<UserPreferenceFormData>({
    language: 'NB',
    notifications: true,
    smart_suggestions: true,
    measurements: 'metric',
    default_servings: 4,
    price_range: 'medium',
    dietary_preferences: [],
  });

  // Load preferences into form when available
  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  // Debounced save function
  const savePreferences = useCallback(
    async (data: UserPreferenceFormData) => {
      if (!user?.id) return;
      await PreferenceRepository.updatePreference(user.id, data);
    },
    [user?.id]
  );

  const { isSaving, error: saveError } = useDebouncedSave(
    formData,
    savePreferences,
    3000,
    !!user?.id && !preferenceLoading
  );

  // Helper function to update form data
  const updateFormData = useCallback((updates: Partial<UserPreferenceFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const renderContent = () => {
    if (authLoading || preferenceLoading) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading preferences...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading preferences. Please try again.</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Please sign in to view your profile.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Save Status Indicator */}
        <SaveStatusIndicator isSaving={isSaving} error={saveError} />

        <div className="w-full max-w-2xl lg:max-w-none lg:w-[50%] mx-auto px-4 py-8 space-y-6">
          {/* Quick Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">
              Quick Settings
            </h3>

            {/* Dark Mode */}
            <SettingRow
              icon={theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              label="Dark Mode"
              control={<Toggle enabled={theme === 'dark'} onChange={() => toggleTheme()} />}
            />

            {/* Notifications */}
            <SettingRow
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              control={
                <Toggle
                  enabled={formData.notifications}
                  onChange={(val) => updateFormData({ notifications: val })}
                />
              }
            />

            {/* Smart Suggestions */}
            <SettingRow
              icon={<Zap className="w-5 h-5" />}
              label="Smart Suggestions"
              subtitle="Get push notifications about leftovers"
              control={
                <Toggle
                  enabled={formData.smart_suggestions}
                  onChange={(val) => updateFormData({ smart_suggestions: val })}
                />
              }
            />
          </section>

          {/* Preferences */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">
              Preferences
            </h3>

            {/* Language */}
            <SettingRow
              icon={<Globe className="w-5 h-5" />}
              label="Language"
              control={
                <select
                  value={formData.language}
                  onChange={(e) => updateFormData({ language: e.target.value })}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="NB">Norsk</option>
                  <option value="EN">English</option>
                </select>
              }
            />

            {/* Measurements */}
            <SettingRow
              icon={<Scale className="w-5 h-5" />}
              label="Default Measurements"
              subtitle="How ingredients are displayed"
              control={
                <select
                  value={formData.measurements}
                  onChange={(e) => updateFormData({ measurements: e.target.value })}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              }
            />

            {/* Default Servings */}
            <SettingRow
              icon={<Users className="w-5 h-5" />}
              label="Default Serving Size"
              control={
                <select
                  value={formData.default_servings}
                  onChange={(e) => updateFormData({ default_servings: parseInt(e.target.value) })}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="1">1 serving</option>
                  <option value="2">2 servings</option>
                  <option value="4">4 servings</option>
                  <option value="6">6 servings</option>
                  <option value="8">8 servings</option>
                </select>
              }
            />
          </section>

          {/* Dietary Preferences */}
          <ExpandableSection
            title="Dietary Preferences"
            icon={<span className="text-lg">🥗</span>}
            expanded={expandedSections.dietary}
            onToggle={() => toggleSection('dietary')}
          >
            <div className="space-y-2">
              {[
                'Vegetarian',
                'Vegan',
                'Gluten-Free',
                'Dairy-Free',
                'Nut-Free',
                'Keto',
                'Paleo',
              ].map((diet) => (
                <label
                  key={diet}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.dietary_preferences?.includes(diet)}
                    onChange={(e) => {
                      const newDietary = e.target.checked
                        ? [...(formData.dietary_preferences || []), diet]
                        : (formData.dietary_preferences || []).filter((d) => d !== diet);
                      updateFormData({ dietary_preferences: newDietary });
                    }}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700 dark:text-white">{diet}</span>
                </label>
              ))}
            </div>
          </ExpandableSection>

          {/* Price Range / Budget */}
          <ExpandableSection
            title="Preferred Price Range"
            icon={<DollarSign className="w-5 h-5" />}
            expanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Budget-Friendly</span>
                <span>Premium</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={
                  formData.price_range === 'low' ? 1 : formData.price_range === 'medium' ? 3 : 5
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const range = val <= 2 ? 'low' : val <= 4 ? 'medium' : 'high';
                  updateFormData({ price_range: range });
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$</span>
                <span>$$</span>
                <span>$$$</span>
                <span>$$$$</span>
                <span>$$$$$</span>
              </div>
            </div>
          </ExpandableSection>

          {/* Previous Grocery Orders */}
          <ExpandableSection
            title="Previous Grocery Orders"
            icon={<span className="text-lg">🛒</span>}
            expanded={expandedSections.orders}
            onToggle={() => toggleSection('orders')}
          >
            <div className="space-y-3">
              {[1, 2, 3].map((order) => (
                <div key={order} className=""></div>
              ))}
              <button className="w-full text-center text-orange-600 font-medium text-sm hover:text-orange-700 py-2">
                View All Orders
              </button>
            </div>
          </ExpandableSection>

          {/* Data & Privacy */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">
              Data & Privacy
            </h3>

            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">Download My Data</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg text-left mt-2">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="font-medium text-red-600 dark:text-red-400">Delete Account</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </section>

          {/* App Info */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>Recipe App v1.4</p>
            <p className="mt-1">Made with ❤️ for food lovers</p>
          </div>
        </div>
      </>
    );
  };

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Reusable Components
  interface SettingRowProps {
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    control: React.ReactNode;
  }

  function SettingRow({ icon, label, subtitle, control }: SettingRowProps) {
    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          <div className="text-gray-600 dark:text-white">{icon}</div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{label}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div>{control}</div>
      </div>
    );
  }

  interface ToggleProps {
    enabled: boolean;
    onChange: (value: boolean) => void;
  }

  function Toggle({ enabled, onChange }: ToggleProps) {
    return (
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  }

  interface ExpandableSectionProps {
    title: string;
    icon: React.ReactNode;
    expanded?: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }

  function ExpandableSection({
    title,
    icon,
    expanded,
    onToggle,
    children,
  }: ExpandableSectionProps) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="text-gray-600 dark:text-white">{icon}</div>
            <span className="font-bold text-gray-900 dark:text-white">{title}</span>
          </div>
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expanded && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
            <div className="pt-4">{children}</div>
          </div>
        )}
      </section>
    );
  }

  function SaveStatusIndicator({ isSaving, error }: { isSaving: boolean; error: string | null }) {
    if (!isSaving && !error) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
        {isSaving && (
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Saving...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNavOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h1>
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}
