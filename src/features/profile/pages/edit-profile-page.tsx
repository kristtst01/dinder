import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@common/hooks/use-auth';
import { Navbar } from '@shared/navbar';
import { Camera, Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { profileService } from '../services/profile.service';
import type { ProfileData } from '../types';

export default function EditProfilePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProfileData>({
    email: '',
    full_name: '',
    avatar_url: null,
    username: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: '',
    },
  });

  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, error, refetch } = useProfile(user?.id);
  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setPreviewUrl(profile.avatar_url);
    }
  }, [profile]);

  const renderContent = () => {
    if (authLoading || profileLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-900 mb-2">Please sign in</p>
            <p className="text-gray-600">You need to be authenticated to edit your profile</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-2">Error loading profile</p>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
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
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
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
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
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
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
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
                    value={formData.address.postal_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, postal_code: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="12345"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={formData.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Norway">Norway</option>
                  <option value="England">England</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
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
      </>
    );
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    let avatarUrl = formData.avatar_url;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile, user.id);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      } else {
        alert('Failed to upload image. Please try again.');
        setSaving(false);
        return;
      }
    }

    try {
      await profileService.updateProfile(user.id, {
        ...formData,
        avatar_url: avatarUrl,
      });

      await refetch();

      setSelectedFile(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return (
      formData.username
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only JPG and PNG are allowed.');
        return null;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File too large. Maximum size is 5MB.');
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

  const handleCancel = () => {
    // Reset form to original profile data
    if (profile) {
      setFormData(profile);
      setPreviewUrl(profile.avatar_url);
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-clip">
      {/* Left Navbar */}
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="min-h-screen bg-gray-50 pb-20 flex-1 flex flex-col min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}
