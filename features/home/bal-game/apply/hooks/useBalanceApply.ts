/**
 * @file features/home/bal-game/apply/hooks/useBalanceApply.ts
 * @description 밸런스게임 신청 TanStack Query 훅
 */

import { useMutation } from '@tanstack/react-query';

import { submitBalanceApply } from '@home/bal-game/apply/api/applyApi';

export const useSubmitBalanceApply = () =>
  useMutation({
    mutationFn: submitBalanceApply,
  });
