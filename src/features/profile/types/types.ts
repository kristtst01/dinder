export interface Settings {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  smartSuggestions: boolean;
  measurements: string;
  defaultServings: number;
  priceRange: string;
}

export interface ProfileData {
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
}

export interface ExpandedSections {
  [key: string]: boolean;
}
