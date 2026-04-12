/**
 * @file features/my/hooks/useMy.ts
 */

import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '../api/myApi';

export function useMyProfile() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 10,
  });
}
