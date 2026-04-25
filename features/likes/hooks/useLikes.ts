/**
 * @file features/likes/hooks/useLikes.ts
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptReceivedLike,
  cancelSentLike,
  fetchMatches,
  fetchReceivedLikes,
  fetchSentLikes,
  MOCK_MATCHES,
  MOCK_RECEIVED,
  MOCK_SENT,
  passReceivedLike,
} from '../api/likesApi';

const STALE_5M = 1000 * 60 * 5;

/** 내가 누른 좋아요 (sent) */
export function useSentLikes() {
  return useQuery({
    queryKey: ['likes', 'sent'],
    queryFn: fetchSentLikes,
    initialData: MOCK_SENT,
    staleTime: STALE_5M,
  });
}

/** 받은 좋아요 (received) */
export function useReceivedLikes() {
  return useQuery({
    queryKey: ['likes', 'received'],
    queryFn: fetchReceivedLikes,
    initialData: MOCK_RECEIVED,
    staleTime: STALE_5M,
  });
}

/** 서로 좋아요 (matches) */
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    initialData: MOCK_MATCHES,
    staleTime: STALE_5M,
  });
}

/* ─── mutations ─── */

export function useCancelSentLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => cancelSentLike(requestId),
    onSuccess: (_, requestId) => {
      qc.setQueryData(['likes', 'sent'], (prev: any[] = []) =>
        prev.filter(p => p.requestId !== requestId),
      );
    },
  });
}

export function useAcceptReceivedLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => acceptReceivedLike(requestId),
    onSuccess: (_, requestId) => {
      qc.setQueryData(['likes', 'received'], (prev: any[] = []) =>
        prev.filter(p => p.requestId !== requestId),
      );
      qc.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function usePassReceivedLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => passReceivedLike(requestId),
    onSuccess: (_, requestId) => {
      qc.setQueryData(['likes', 'received'], (prev: any[] = []) =>
        prev.filter(p => p.requestId !== requestId),
      );
    },
  });
}
