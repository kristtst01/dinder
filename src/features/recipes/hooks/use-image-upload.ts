import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@/common/hooks/use-auth';
import { validateImageFile } from '../utils/image-utils';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      setError(new Error('You must be logged in to upload images'));
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Create unique file name
      const fileExt = 'jpg'; // Always use .jpg since we compress to JPEG
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('recipe-images').getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload image');
      setError(error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to delete images'));
      return false;
    }

    try {
      setError(null);

      // Extract file path from URL
      const urlParts = imageUrl.split('/recipe-images/');
      if (urlParts.length < 2) {
        throw new Error('Invalid image URL');
      }
      const filePath = urlParts[1];

      const { error: deleteError } = await supabase.storage
        .from('recipe-images')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete image');
      setError(error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
  };
}
