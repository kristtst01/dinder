import { supabase } from '@/lib/supabase/supabase';
import type { UserPreference, UserPreferenceFormData } from '@/lib/supabase/types';

export class PreferenceRepository {
  static async getPreference(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return this.createDefaultPreference(userId);
    }

    return data;
  }

  private static async createDefaultPreference(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        const { data: existing, error: fetchError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError) throw fetchError;
        return existing;
      }
      throw error;
    }

    return data;
  }

  static async updatePreference(
    userId: string,
    updates: UserPreferenceFormData
  ): Promise<UserPreference> {
    if (!userId) throw new Error('User ID is required');

    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}
