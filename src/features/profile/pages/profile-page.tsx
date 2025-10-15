import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Download,
  Globe,
  Moon,
  Save,
  Scale,
  Sun,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../lib/supabase';

type SectionKey = 'delivery' | 'dietary' | 'price' | 'orders';

interface ExpandedSections {
  [key: string]: boolean;
}

interface Settings {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  smartSuggestions: boolean;
  measurements: string;
  defaultServings: number;
  priceRange: string;
}

interface ProfileData {
  username: string;
  email: string;
  avatarUrl: string | null;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export default function ProfilePage() {
  const [view, setView] = useState<'profile' | 'edit'>('profile');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  const [settings, setSettings] = useState<Settings | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    email: '',
    avatarUrl: null,
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Norway',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch preferences from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch preferences
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          username: profileData.username || user.email?.split('@')[0] || '',
          email: user.email || '',
          avatarUrl: profileData.avatar_url,
          address: {
            street: profileData.address?.street || '',
            city: profileData.address?.city || '',
            postalCode: profileData.address?.postal_code || '',
            country: profileData.address?.country || 'Norway',
          },
        });
        setPreviewUrl(profileData.avatar_url);
      } else {
        setProfile({
          username: user.email?.split('@')[0] || '',
          email: user.email || '',
          avatarUrl: null,
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: 'Norway',
          },
        });
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, userId: string): Promise<string | null> => {
    try {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type. Only JPG and PNG are allowed.');
        return null;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        console.error('File too large. Maximum size is 5MB.');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pic')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profile-pic').getPublicUrl(filePath);

      return `${data.publicUrl}?t=${Date.now()}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let avatarUrl = profile.avatarUrl;

      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile, user.id);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: profile.username,
        avatar_url: avatarUrl,
        address: {
          street: profile.address.street,
          city: profile.address.city,
          postal_code: profile.address.postalCode,
          country: profile.address.country,
        },
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setProfile((prev) => ({ ...prev, avatarUrl }));
      setSelectedFile(null);
      setView('profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return (
      profile.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Edit Profile View
  if (view === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={() => setView('profile')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials()}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Click the camera icon to upload a new photo
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={profile.address.street}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profile.address.city}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Oslo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={profile.address.postalCode}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, postalCode: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={profile.address.postalCode.toString()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={profile.address.country}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, country: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Norway">Norway</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Denmark">Denmark</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setView('profile');
                setPreviewUrl(profile.avatarUrl);
                setSelectedFile(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Settings View (default)
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Profile & Settings</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Info Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.username}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <button
                onClick={() => setView('edit')}
                className="mt-2 text-orange-600 font-medium text-sm hover:text-orange-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Quick Settings */}
        <section className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Quick Settings</h3>

          {/* Dark Mode */}
          <SettingRow
            icon={settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            label="Dark Mode"
            control={
              <Toggle
                enabled={settings.darkMode}
                onChange={(val) => updateSetting('darkMode', val)}
              />
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
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo'].map(
              (diet) => (
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
              )
            )}
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
  );
}

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

function ExpandableSection({ title, icon, expanded, onToggle, children }: ExpandableSectionProps) {
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
