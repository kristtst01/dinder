import { supabase } from '@/lib/supabase/supabase';
import type { ProfileData } from '../types';

export class profileService {
  static async getProfile(userId: String) {
    if (!userId) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;

    return data;
  }

  static async updateProfile(userId: String, data: ProfileData) {
    if (!userId) return;
    const { error } = await supabase.from('profiles').upsert(data).eq('id', userId);
    if (error) throw error;
  }
}
