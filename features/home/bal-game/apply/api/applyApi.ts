/**
 * @file features/home/bal-game/apply/api/applyApi.ts
 * @description 밸런스게임 신청 Mock API (백엔드 연결 전)
 */

import type {
  BalanceApplyInput,
  BalanceApplyResult,
  BalanceScope,
} from '@home/bal-game/apply/types';

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const MY_DISTRICT = '강남구';

const scopeToLabel = (scope: BalanceScope): string => {
  switch (scope) {
    case '동네':
      return `내 동네 (${MY_DISTRICT})`;
    case '서울':
      return '서울 전체';
    case '전국':
      return '전국';
  }
};

export const submitBalanceApply = async (
  input: BalanceApplyInput,
): Promise<BalanceApplyResult> => {
  await delay(900);

  return {
    ...input,
    optionA: input.optionA.trim(),
    optionB: input.optionB.trim(),
    id: `apply-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    scopeLabel: scopeToLabel(input.scope),
  };
};
