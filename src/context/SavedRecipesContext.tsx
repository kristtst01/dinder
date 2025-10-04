import { createContext, useContext, type ReactNode } from 'react';
import { useSavedRecipes } from '../hooks/useSavedRecipes';

type Ctx = ReturnType<typeof useSavedRecipes>;

const SavedRecipesContext = createContext<Ctx | null>(null);

export function SavedRecipesProvider({ children }: { children: ReactNode }) {
  const value = useSavedRecipes();
  return <SavedRecipesContext.Provider value={value}>{children}</SavedRecipesContext.Provider>;
}

export function useSavedRecipesContext() {
  const ctx = useContext(SavedRecipesContext);
  if (!ctx) throw new Error('useSavedRecipesContext must be used within SavedRecipesProvider');
  return ctx;
}
