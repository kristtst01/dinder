import { useQuery } from '@tanstack/react-query';
import { ProfileRepository } from '../repositories/profile.repository';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required for profile query');
      }
      return ProfileRepository.getProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
