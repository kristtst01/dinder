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

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DBRecipe {
  uid: string;
  name: string;
  creator: string | null;
  time: number;
  servings: number;
  category: string;
  difficulty: Difficulty;
}

export interface DBIngredient {
  uid: string;
  name: string;
}

export interface DBRecipeIngredient {
  uid: string;
  recipe_id: string;
  ingredient_id: string;
  amount: number;
  unit: string;
  note: string | null;
}

export interface DBDirection {
  uid: string;
  recipe_id: string;
  sequence: number;
  description: string;
  image: string | null;
}

export interface DBWeekplan {
  id: string;
  user_id: string;
  name: string | null;
  start_date: string | null;
  created_at: string;
}

export interface DBWeekplanEntry {
  id: string;
  weekplan_id: string;
  day_index: number;
  meal_type: MealType;
  recipe_id: string;
}
