export interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  strYoutube: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  area: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cookingTime?: number;
  badge?: string;
}
