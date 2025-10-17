import { useQuery } from '@tanstack/react-query';
import { PreferenceRepository } from '../repositories/preference.repository';

export function usePreferences(userId: string | undefined) {
  return useQuery({
    queryKey: ['user_preferences', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required for profile query');
      }
      return PreferenceRepository.getPreference(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
