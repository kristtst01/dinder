export type Recipe = {
  id: string;
  title: string;
  chef: string;
  image: string;
  kitchen?: 'Western' | 'Asian' | 'Italian' | 'Mexican' | 'Indian' | 'Middle Eastern' | 'Other';
  vegetarian?: boolean;
  prepMinutes?: number;
};

export const ALL_RECIPES: Recipe[] = [
  {
    id: 'shrimp-delight',
    title: 'Spicy Garlic Butter Shrimp Delight',
    chef: 'Chef Emma Brown',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=640&h=480&fit=crop&auto=format',
    kitchen: 'Western',
    vegetarian: false,
    prepMinutes: 25,
  },
  {
    id: 'mushroom-risotto',
    title: 'Creamy Mushroom Risotto',
    chef: 'Chef Mario Rossi',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=640&h=480&fit=crop&auto=format',
    kitchen: 'Italian',
    vegetarian: true,
    prepMinutes: 40,
  },
  {
    id: 'grilled-salmon',
    title: 'Grilled Salmon with Herbs',
    chef: 'Chef Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=640&h=480&fit=crop&auto=format',
    kitchen: 'Western',
    vegetarian: false,
    prepMinutes: 30,
  },
  {
    id: 'pancakes-berries',
    title: 'Fluffy Pancakes with Berries',
    chef: 'Chef Michael Davis',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=640&h=480&fit=crop&auto=format',
    kitchen: 'Western',
    vegetarian: true,
    prepMinutes: 20,
  },
];
