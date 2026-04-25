/**
 * @file features/blocks/hooks/useBlocks.ts
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  blockUser,
  fetchBlockedUsers,
  MOCK_BLOCKED,
  unblockUser,
} from '../api/blocksApi';
import { BlockProfilePayload, BlockedUser } from '../types';

export function useBlockedUsers() {
  return useQuery({
    queryKey: ['blocked-users'],
    queryFn: fetchBlockedUsers,
    initialData: MOCK_BLOCKED,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlockProfilePayload) => blockUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blocked-users'] }),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: (_, userId) => {
      qc.setQueryData<BlockedUser[]>(['blocked-users'], (prev = []) =>
        prev.map(b => (b.userId === userId ? { ...b, isBlocked: false } : b)),
      );
    },
  });
}

export function useReblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlockProfilePayload) => blockUser(payload),
    onSuccess: (_, payload) => {
      qc.setQueryData<BlockedUser[]>(['blocked-users'], (prev = []) =>
        prev.map(b =>
          b.userId === payload.targetUserId ? { ...b, isBlocked: true } : b,
        ),
      );
    },
  });
}
