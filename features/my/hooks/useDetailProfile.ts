/**
 * @file features/my/hooks/useDetailProfile.ts
 * @description 프로필 상세 TanStack Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { fetchDetailProfile } from '@/features/my/api/profileApi';

export const useDetailProfile = () =>
  useQuery({
    queryKey: ['my', 'detail-profile'],
    queryFn: fetchDetailProfile,
    staleTime: 1000 * 60 * 10,
  });
