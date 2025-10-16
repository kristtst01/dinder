import { useAuth } from '@common/hooks/use-auth';
import { useTheme } from '@common/hooks/use-theme';
import getInitials from '@shared/getInitials';
import { Navbar } from '@shared/navbar';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Download,
  Globe,
  Moon,
  Scale,
  Sun,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/supabase';
import type { ExpandedSections, Settings } from '../types';

type SectionKey = 'delivery' | 'dietary' | 'price' | 'orders';

export default function SettingsPage() {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const { toggleTheme } = useTheme();

  const { user } = useAuth();

  const [navOpen, setNavOpen] = useState(false);
  const userName = user?.user_metadata?.full_name || user?.email || 'Guest';
  const email = user?.email || '';
  const userInitials = getInitials(userName);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefsData) {
        setSettings({
          darkMode: prefsData.dark_mode,
          language: prefsData.language,
          notifications: prefsData.notifications,
          smartSuggestions: prefsData.smart_suggestions,
          measurements: prefsData.measurements,
          defaultServings: prefsData.default_servings,
          priceRange: prefsData.price_range,
        });
      } else if (!prefsError || prefsError.code === 'PGRST116') {
        const defaults = {
          user_id: user.id,
          dark_mode: false,
          language: 'NB',
          notifications: true,
          smart_suggestions: true,
          measurements: 'metric',
          default_servings: 4,
          price_range: 'medium',
          dietary_preferences: [],
        };

        await supabase.from('user_preferences').insert([defaults]);

        setSettings({
          darkMode: defaults.dark_mode,
          language: defaults.language,
          notifications: defaults.notifications,
          smartSuggestions: defaults.smart_suggestions,
          measurements: defaults.measurements,
          defaultServings: defaults.default_servings,
          priceRange: defaults.price_range,
        });
      }
    }
    setLoading(false);

    fetchData();
  }, []);

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  function switchTheme(val: boolean) {
    toggleTheme();
    updateSetting('darkMode', val);
  }

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setSettings((prev) => (prev ? { ...prev, [key]: value } : null));

    const dbKey = key.toString().replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    const { error } = await supabase
      .from('user_preferences')
      .update({ [dbKey]: value })
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update:', error);
    }
  };

  // Edit Profile View

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />
      {loading ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading preferences...</p>
          </div>
        </div>
      ) : !settings ? (
        <div className="flex-1 flex flex-col min-w-0 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to view your profile.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Profile & Settings
              </h1>
              <div className="w-16"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Profile Info Section */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userInitials}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>
            </section>

            {/* Quick Settings */}
            <section className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Quick Settings</h3>

              {/* Dark Mode */}
              <SettingRow
                icon={
                  settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
                }
                label="Dark Mode"
                control={
                  <Toggle enabled={settings.darkMode} onChange={(val) => switchTheme(val)} />
                }
              />

              {/* Notifications */}
              <SettingRow
                icon={<Bell className="w-5 h-5" />}
                label="Notifications"
                control={
                  <Toggle
                    enabled={settings.notifications}
                    onChange={(val) => updateSetting('notifications', val)}
                  />
                }
              />

              {/* Smart Suggestions */}
              <SettingRow
                icon={<Zap className="w-5 h-5" />}
                label="Smart Suggestions"
                subtitle="Get push notifications about leftovers & recipe ideas"
                control={
                  <Toggle
                    enabled={settings.smartSuggestions}
                    onChange={(val) => updateSetting('smartSuggestions', val)}
                  />
                }
              />
            </section>

            {/* Preferences */}
            <section className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Preferences</h3>

              {/* Language */}
              <SettingRow
                icon={<Globe className="w-5 h-5" />}
                label="Language"
                control={
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    value={settings.measurements}
                    onChange={(e) => updateSetting('measurements', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    value={settings.defaultServings}
                    onChange={(e) => updateSetting('defaultServings', parseInt(e.target.value))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700">{diet}</span>
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
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Budget-Friendly</span>
                  <span>Premium</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
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
                  <div
                    key={order}
                    className="p-3 border border-gray-200 rounded-lg hover:border-orange-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">Order #{1000 + order}</p>
                        <p className="text-sm text-gray-600">Oct {order * 3}, 2025</p>
                      </div>
                      <span className="text-sm font-semibold text-orange-600">
                        ${(45.5 + order * 12).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">15 items • Delivered</p>
                  </div>
                ))}
                <button className="w-full text-center text-orange-600 font-medium text-sm hover:text-orange-700 py-2">
                  View All Orders
                </button>
              </div>
            </ExpandableSection>

            {/* Data & Privacy */}
            <section className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Data & Privacy</h3>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Download My Data</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg text-left mt-2">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-600">Delete Account</span>
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
        </div>
      )}
    </div>
  );

  // Reusable Components
  interface SettingRowProps {
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    control: React.ReactNode;
  }

  function SettingRow({ icon, label, subtitle, control }: SettingRowProps) {
    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          <div className="text-gray-600">{icon}</div>
          <div>
            <p className="font-medium text-gray-900">{label}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
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
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <div className="text-gray-600">{icon}</div>
            <span className="font-bold text-gray-900">{title}</span>
          </div>
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4">{children}</div>
          </div>
        )}
      </section>
    );
  }
}
