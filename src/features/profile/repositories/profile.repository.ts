import { supabase } from '@/lib/supabase/supabase';
import type { PublicProfile, PublicProfileFormData } from '@/lib/supabase/types';

export class ProfileRepository {
  static async getProfile(userId: string): Promise<PublicProfile> {
    if (!userId) throw new Error('User ID is required');

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) throw error;
    return data;
  }

  static async updateProfile(
    userId: string,
    updates: PublicProfileFormData
  ): Promise<PublicProfile> {
    if (!userId) throw new Error('User ID is required');
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
