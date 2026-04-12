/**
 * @file features/home/bal-game/types/index.ts
 * @description 밸런스 게임 관련 타입 정의
 */

export interface BalGameOption {
  emoji: string;
  label: string;
  votes: number;
}

export interface BalanceGame {
  id: string;
  question: string;
  optionA: BalGameOption;
  optionB: BalGameOption;
  totalVotes: number;
  commentCount: number;
  participantCount: number;
}

export type VoteChoice = 'A' | 'B' | null;
