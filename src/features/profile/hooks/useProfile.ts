import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId as string),
    enabled: !!userId,
  });
}
