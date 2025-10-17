import { useEffect, useRef, useState } from 'react';

export function useDebouncedSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  delay: number = 3000,
  enabled: boolean = true
) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined); // Fix: use number for browser
  const initialDataRef = useRef<string>(JSON.stringify(data));
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      initialDataRef.current = JSON.stringify(data);
      return;
    }

    // Skip if not enabled or data hasn't changed
    if (!enabled || JSON.stringify(data) === initialDataRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      setError(null);

      try {
        await onSave(data);
        initialDataRef.current = JSON.stringify(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save preferences');
        console.error('Failed to save preferences:', err);
      } finally {
        setIsSaving(false);
      }
    }, delay) as unknown as number; // Cast for TypeScript

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled]);

  return { isSaving, error };
}
