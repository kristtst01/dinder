export interface UserPreference {
  id: string;
  user_id: string;
  dark_mode: boolean;
  language: string;
  notifications: boolean;
  smart_suggestions: boolean;
  measurements: string;
  default_servings: number;
  price_range: string;
  dietary_preferences: string[];
  created_at: string;
  updated_at: string;
}

export type UserPreferenceUpdate = Partial<
  Omit<UserPreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;
