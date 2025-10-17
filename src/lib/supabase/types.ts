export interface UserPreference {
  id: string;
  user_id: string;
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

export interface PublicProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  username: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

export type UserPreferenceFormData = Omit<
  UserPreference,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type PublicProfileFormData = Omit<PublicProfile, 'id' | 'created_at' | 'updated_at'>;
