/**
 * @file features/home/bal-game/hooks/useBalGame.ts
 * @description 밸런스 게임 TanStack Query 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentBalanceGame, submitVote } from '@home/bal-game/api/balGameApi';

export const BAL_GAME_KEYS = {
  current: ['bal-game', 'current'] as const,
};

export const useCurrentBalanceGame = () =>
  useQuery({
    queryKey: BAL_GAME_KEYS.current,
    queryFn: fetchCurrentBalanceGame,
    staleTime: 1000 * 60 * 5,
  });

export const useVoteBalanceGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, choice }: { gameId: string; choice: 'A' | 'B' }) =>
      submitVote(gameId, choice),
    onSuccess: (updatedGame) => {
      queryClient.setQueryData(BAL_GAME_KEYS.current, updatedGame);
    },
  });
};
