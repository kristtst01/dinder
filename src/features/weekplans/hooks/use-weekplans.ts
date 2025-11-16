import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import type { DBWeekplan, DBWeekplanEntry } from '@/lib/supabase/types';

export function useWeekplans(userId: string | undefined) {
  const [weekplans, setWeekplans] = useState<DBWeekplan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setWeekplans([]);
      setLoading(false);
      return;
    }

    async function fetchWeekplans() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('weekplans')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setWeekplans(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch weekplans'));
        setWeekplans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWeekplans();
  }, [userId]);

  return { weekplans, loading, error };
}

export function useWeekplan(weekplanId: string | undefined) {
  const [weekplan, setWeekplan] = useState<DBWeekplan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!weekplanId) {
      setWeekplan(null);
      setLoading(false);
      return;
    }

    async function fetchWeekplan() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('weekplans')
          .select('*')
          .eq('id', weekplanId)
          .single();

        if (fetchError) throw fetchError;

        setWeekplan(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch weekplan'));
        setWeekplan(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeekplan();
  }, [weekplanId]);

  return { weekplan, loading, error };
}

export function useWeekplanEntries(weekplanId: string | undefined) {
  const [entries, setEntries] = useState<DBWeekplanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!weekplanId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    async function fetchEntries() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('weekplan_entries')
          .select('*')
          .eq('weekplan_id', weekplanId)
          .order('day_index')
          .order('meal_type');

        if (fetchError) throw fetchError;

        setEntries(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch weekplan entries'));
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [weekplanId]);

  return { entries, loading, error };
}
