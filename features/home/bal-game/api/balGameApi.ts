/**
 * @file features/home/bal-game/api/balGameApi.ts
 * @description 밸런스 게임 Mock API (백엔드 연결 전 임시 데이터)
 */

import type { BalanceGame } from '@home/bal-game/types';

const MOCK_BALANCE_GAME: BalanceGame = {
  id: 'bal-001',
  question: '평생 여름만 있는 나라 vs 평생 겨울만 있는 나라',
  optionA: { emoji: '🌴', label: '여름나라', votes: 540 },
  optionB: { emoji: '❄️', label: '겨울나라', votes: 460 },
  totalVotes: 1000,
  commentCount: 328,
  participantCount: 2431,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCurrentBalanceGame = async (): Promise<BalanceGame> => {
  await delay(600);
  return MOCK_BALANCE_GAME;
};

export const submitVote = async (
  gameId: string,
  choice: 'A' | 'B',
): Promise<BalanceGame> => {
  await delay(400);
  const delta = choice === 'A' ? 1 : 0;
  return {
    ...MOCK_BALANCE_GAME,
    id: gameId,
    optionA: { ...MOCK_BALANCE_GAME.optionA, votes: MOCK_BALANCE_GAME.optionA.votes + delta },
    optionB: { ...MOCK_BALANCE_GAME.optionB, votes: MOCK_BALANCE_GAME.optionB.votes + (1 - delta) },
    totalVotes: MOCK_BALANCE_GAME.totalVotes + 1,
    participantCount: MOCK_BALANCE_GAME.participantCount + 1,
  };
};
