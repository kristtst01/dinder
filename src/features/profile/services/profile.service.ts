import { supabase } from '@/lib/supabase/supabase';

export class profileService {
  static async getProfile(userId: String) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;

    return data;
  }
}
