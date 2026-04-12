/**
 * @file features/home/post-it/hooks/useLetters.ts
 * @description 우편함 편지 TanStack Query 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLetters, toggleLetterLike } from '@home/post-it/api/letterApi';
import type { Letter } from '@home/post-it/types';

export const LETTER_KEYS = {
  all: ['letters'] as const,
};

export const useLetters = () =>
  useQuery({
    queryKey: LETTER_KEYS.all,
    queryFn: fetchLetters,
    staleTime: 1000 * 60 * 3,
  });

export const useLikeLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      toggleLetterLike(id, liked),
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: LETTER_KEYS.all });
      const previous = queryClient.getQueryData<Letter[]>(LETTER_KEYS.all);
      queryClient.setQueryData<Letter[]>(LETTER_KEYS.all, (old) =>
        old?.map(l =>
          l.id === id
            ? { ...l, liked: !liked, likes: liked ? l.likes - 1 : l.likes + 1 }
            : l,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(LETTER_KEYS.all, ctx.previous);
      }
    },
  });
};
