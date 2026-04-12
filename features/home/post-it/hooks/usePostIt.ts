/**
 * @file features/home/post-it/hooks/usePostIt.ts
 * @description 종이비행기 우체통 TanStack Query 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRecentPostIts, togglePostItLike } from '@home/post-it/api/postItApi';
import type { PostIt } from '@home/post-it/types';

export const POST_IT_KEYS = {
  recent: ['post-it', 'recent'] as const,
};

export const useRecentPostIts = () =>
  useQuery({
    queryKey: POST_IT_KEYS.recent,
    queryFn: fetchRecentPostIts,
    staleTime: 1000 * 60 * 2,
  });

export const useLikePostIt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: { id: string; isLiked: boolean }) =>
      togglePostItLike(id, isLiked),
    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: POST_IT_KEYS.recent });
      const previous = queryClient.getQueryData<PostIt[]>(POST_IT_KEYS.recent);
      queryClient.setQueryData<PostIt[]>(POST_IT_KEYS.recent, (old) =>
        old?.map((p) =>
          p.id === id
            ? { ...p, isLiked: !isLiked, likeCount: isLiked ? p.likeCount - 1 : p.likeCount + 1 }
            : p,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(POST_IT_KEYS.recent, ctx.previous);
      }
    },
  });
};
