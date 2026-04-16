/**
 * @file features/home/hooks/useHome.ts
 * @description 홈 화면용 TanStack Query 훅 — 피드 조회, 투표, 포스트잇 좋아요
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  fetchHomeFeed,
  togglePostitLike,
  voteBalance,
} from '@home/api/homeApi';
import type {
  BalanceGamePreview,
  HomeFeed,
  VoteSide,
} from '@home/types';

export const HOME_KEYS = {
  feed: ['home', 'feed'] as const,
};

export const useHomeFeed = () =>
  useQuery({
    queryKey: HOME_KEYS.feed,
    queryFn: fetchHomeFeed,
    staleTime: 1000 * 60 * 2,
  });

export const useVoteBalance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, side }: { gameId: string; side: VoteSide }) =>
      voteBalance(gameId, side),
    onSuccess: (updated: BalanceGamePreview) => {
      qc.setQueryData<HomeFeed | undefined>(HOME_KEYS.feed, (prev) =>
        prev ? { ...prev, balance: updated } : prev,
      );
    },
  });
};

export const useLikePostit = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: { id: string; isLiked: boolean }) =>
      togglePostitLike(id, isLiked),
    onMutate: async ({ id, isLiked }) => {
      await qc.cancelQueries({ queryKey: HOME_KEYS.feed });
      const prev = qc.getQueryData<HomeFeed>(HOME_KEYS.feed);
      qc.setQueryData<HomeFeed | undefined>(HOME_KEYS.feed, (old) => {
        if (!old) return old;
        return {
          ...old,
          postits: old.postits.map((p) =>
            p.id === id
              ? {
                  ...p,
                  isLiked: !isLiked,
                  likeCount: isLiked ? p.likeCount - 1 : p.likeCount + 1,
                }
              : p,
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(HOME_KEYS.feed, ctx.prev);
    },
  });
};
