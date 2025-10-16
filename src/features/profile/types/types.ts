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
  username: string;
  email: string;
  avatarUrl: string | null;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface ExpandedSections {
  [key: string]: boolean;
}
