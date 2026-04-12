/**
 * @file features/noti/hooks/useNoti.ts
 */

import { useQuery } from '@tanstack/react-query';
import { fetchNotices } from '../api/notiApi';

export function useNotices() {
  return useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices,
    staleTime: 1000 * 60 * 5,
  });
}
