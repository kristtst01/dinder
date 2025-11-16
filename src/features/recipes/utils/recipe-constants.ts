// Predefined units for ingredients (canonical/short forms)
export const ALLOWED_UNITS = [
  // Metric weight
  'g',
  'kg',
  'mg',
  // Metric volume
  'ml',
  'dl',
  'l',
  // Imperial weight
  'oz',
  'lb',
  // Imperial volume
  'fl oz',
  'cup',
  'cups',
  'tbsp',
  'tsp',
  'quart',
  'pint',
  'gallon',
  // Count/pieces
  'piece',
  'pieces',
  'whole',
  'slice',
  'slices',
  // Other
  'pinch',
  'handful',
  'to taste',
] as const;

export type Unit = (typeof ALLOWED_UNITS)[number];

// Unit conversion map: user input → canonical form
export const UNIT_ALIASES: Record<string, Unit> = {
  // Metric weight
  g: 'g',
  gram: 'g',
  grams: 'g',
  kg: 'kg',
  kilo: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  mg: 'mg',
  milligram: 'mg',
  milligrams: 'mg',
  // Metric volume
  ml: 'ml',
  milliliter: 'ml',
  milliliters: 'ml',
  millilitre: 'ml',
  millilitres: 'ml',
  dl: 'dl',
  deciliter: 'dl',
  deciliters: 'dl',
  decilitre: 'dl',
  decilitres: 'dl',
  l: 'l',
  liter: 'l',
  liters: 'l',
  litre: 'l',
  litres: 'l',
  // Imperial weight
  oz: 'oz',
  ounce: 'oz',
  ounces: 'oz',
  lb: 'lb',
  pound: 'lb',
  pounds: 'lb',
  lbs: 'lb',
  // Imperial volume
  'fl oz': 'fl oz',
  'fluid ounce': 'fl oz',
  'fluid ounces': 'fl oz',
  cup: 'cup',
  cups: 'cups',
  tbsp: 'tbsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tsp: 'tsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  quart: 'quart',
  quarts: 'quart',
  pint: 'pint',
  pints: 'pint',
  gallon: 'gallon',
  gallons: 'gallon',
  // Count/pieces
  piece: 'piece',
  pieces: 'pieces',
  whole: 'whole',
  slice: 'slice',
  slices: 'slices',
  // Other
  pinch: 'pinch',
  pinches: 'pinch',
  handful: 'handful',
  handfuls: 'handful',
  'to taste': 'to taste',
};

export function normalizeUnit(unit: string): Unit | null {
  const normalized = unit.toLowerCase().trim();
  return UNIT_ALIASES[normalized] || null;
}

// String length limits
export const MAX_RECIPE_NAME_LENGTH = 100;
export const MAX_CATEGORY_LENGTH = 50;
export const MAX_CUISINE_LENGTH = 50;
export const MAX_INGREDIENT_NAME_LENGTH = 50;
export const MAX_STEP_DESCRIPTION_LENGTH = 1000;
export const MAX_INGREDIENT_NOTE_LENGTH = 200;
