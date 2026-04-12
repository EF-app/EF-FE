/**
 * @file features/hi/hooks/useHi.ts
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProfiles } from '../api/hiApi';

export function useProfiles() {
  return useQuery({
    queryKey: ['hi-profiles'],
    queryFn: fetchProfiles,
    staleTime: 1000 * 60 * 5,
  });
}
