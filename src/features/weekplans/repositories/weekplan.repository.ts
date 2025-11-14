import { supabase } from '@/lib/supabase/supabase';
import type {
  Weekplan,
  WeekplanEntry,
  WeekplanFormData,
  WeekplanEntryFormData,
} from '@/lib/supabase/types';

export class WeekplanRepository {
  /**
   * Get all weekplans for a specific user
   */
  static async getWeekplans(userId: string): Promise<Weekplan[]> {
    if (!userId) throw new Error('User ID is required');

    const { data, error } = await supabase
      .from('weekplans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single weekplan by ID with all its entries
   */
  static async getWeekplan(weekplanId: string): Promise<{
    weekplan: Weekplan;
    entries: WeekplanEntry[];
  }> {
    if (!weekplanId) throw new Error('Weekplan ID is required');

    // Fetch weekplan
    const { data: weekplan, error: weekplanError } = await supabase
      .from('weekplans')
      .select('*')
      .eq('id', weekplanId)
      .single();

    if (weekplanError) throw weekplanError;

    // Fetch weekplan entries
    const { data: entries, error: entriesError } = await supabase
      .from('weekplan_entries')
      .select('*')
      .eq('weekplan_id', weekplanId)
      .order('day_index', { ascending: true })
      .order('sequence', { ascending: true });

    if (entriesError) throw entriesError;

    return {
      weekplan,
      entries: entries || [],
    };
  }

  /**
   * Create a new weekplan
   */
  static async createWeekplan(data: WeekplanFormData): Promise<Weekplan> {
    if (!data.user_id) throw new Error('User ID is required');
    if (!data.name || data.name.trim() === '') throw new Error('Weekplan name is required');

    const { data: weekplan, error } = await supabase
      .from('weekplans')
      .insert({
        user_id: data.user_id,
        name: data.name.trim(),
        start_date: data.start_date,
      })
      .select()
      .single();

    if (error) throw error;
    return weekplan;
  }

  /**
   * Update an existing weekplan
   */
  static async updateWeekplan(
    weekplanId: string,
    updates: Partial<WeekplanFormData>
  ): Promise<Weekplan> {
    if (!weekplanId) throw new Error('Weekplan ID is required');
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    const { data, error } = await supabase
      .from('weekplans')
      .update(updates)
      .eq('id', weekplanId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a weekplan and all its entries
   */
  static async deleteWeekplan(weekplanId: string): Promise<void> {
    if (!weekplanId) throw new Error('Weekplan ID is required');

    // Delete entries first (if cascade delete is not set up)
    const { error: entriesError } = await supabase
      .from('weekplan_entries')
      .delete()
      .eq('weekplan_id', weekplanId);

    if (entriesError) throw entriesError;

    // Delete weekplan
    const { error } = await supabase.from('weekplans').delete().eq('id', weekplanId);

    if (error) throw error;
  }

  /**
   * Add a recipe to a weekplan
   */
  static async addRecipeToWeekplan(entry: WeekplanEntryFormData): Promise<WeekplanEntry> {
    if (!entry.weekplan_id) throw new Error('Weekplan ID is required');
    if (!entry.recipe_id) throw new Error('Recipe ID is required');
    if (entry.day_index === undefined || entry.day_index < 0 || entry.day_index > 6) {
      throw new Error('Day index must be between 0 and 6');
    }

    const { data, error } = await supabase
      .from('weekplan_entries')
      .insert({
        weekplan_id: entry.weekplan_id,
        recipe_id: entry.recipe_id,
        day_index: entry.day_index,
        meal_type: entry.meal_type,
        sequence: entry.sequence,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Add multiple recipes to a weekplan (batch operation)
   */
  static async addRecipesToWeekplan(entries: WeekplanEntryFormData[]): Promise<WeekplanEntry[]> {
    if (!entries || entries.length === 0) throw new Error('No entries provided');

    const { data, error } = await supabase
      .from('weekplan_entries')
      .insert(entries)
      .select();

    if (error) throw error;
    return data || [];
  }

  /**
   * Remove a recipe from a weekplan
   */
  static async removeRecipeFromWeekplan(entryId: string): Promise<void> {
    if (!entryId) throw new Error('Entry ID is required');

    const { error } = await supabase.from('weekplan_entries').delete().eq('id', entryId);

    if (error) throw error;
  }

  /**
   * Update the sequence/position of a recipe within a meal
   */
  static async updateRecipeSequence(
    entryId: string,
    newSequence: number
  ): Promise<WeekplanEntry> {
    if (!entryId) throw new Error('Entry ID is required');

    const { data, error } = await supabase
      .from('weekplan_entries')
      .update({ sequence: newSequence })
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Move a recipe to a different day/meal
   */
  static async moveRecipe(
    entryId: string,
    newDayIndex: number,
    newMealType: WeekplanEntryFormData['meal_type'],
    newSequence: number
  ): Promise<WeekplanEntry> {
    if (!entryId) throw new Error('Entry ID is required');

    const { data, error } = await supabase
      .from('weekplan_entries')
      .update({
        day_index: newDayIndex,
        meal_type: newMealType,
        sequence: newSequence,
      })
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Clear all recipes from a specific day/meal
   */
  static async clearMeal(
    weekplanId: string,
    dayIndex: number,
    mealType: WeekplanEntryFormData['meal_type']
  ): Promise<void> {
    if (!weekplanId) throw new Error('Weekplan ID is required');

    const { error } = await supabase
      .from('weekplan_entries')
      .delete()
      .eq('weekplan_id', weekplanId)
      .eq('day_index', dayIndex)
      .eq('meal_type', mealType);

    if (error) throw error;
  }

  /**
   * Get all entries for a specific weekplan (alternative to getWeekplan)
   */
  static async getWeekplanEntries(weekplanId: string): Promise<WeekplanEntry[]> {
    if (!weekplanId) throw new Error('Weekplan ID is required');

    const { data, error } = await supabase
      .from('weekplan_entries')
      .select('*')
      .eq('weekplan_id', weekplanId)
      .order('day_index', { ascending: true })
      .order('sequence', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
