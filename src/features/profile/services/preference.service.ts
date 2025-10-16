import { supabase } from '@/lib/supabase/supabase';
import type { UserPreference } from '@/lib/supabase/types';
import type { Settings } from '../types';

export class preferenceService {
  static async getPreference(userId: string): Promise<UserPreference> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePreference<K extends keyof Settings>(key: K, value: Settings[K]) {
    // TODO fix this function
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const dbKey = key.toString().replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    const { data, error } = await supabase
      .from('user_preferences')
      .update({ [dbKey]: value })
      .eq('user_id', user.id)
      .select();

    if (error) throw error;

    return data;
  }
}
