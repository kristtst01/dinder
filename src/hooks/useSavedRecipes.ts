import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'saved_recipes';

export type SavedSet = Set<string>;

function readFromStorage(): SavedSet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function writeToStorage(ids: SavedSet) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    return true;
  } catch (err) {
    // Quota exceeded or storage disabled
    console.warn('Failed saving to localStorage', err);
    return false;
  }
}

export function useSavedRecipes() {
  const [saved, setSaved] = useState<SavedSet>(() => readFromStorage());

  useEffect(() => {
    writeToStorage(saved);
  }, [saved]);

  const isSaved = useCallback((id: string) => saved.has(id), [saved]);

  const save = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unsave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  return useMemo(() => ({ saved, isSaved, save, unsave, toggle }), [saved, isSaved, save, unsave, toggle]);
}

export { STORAGE_KEY };
