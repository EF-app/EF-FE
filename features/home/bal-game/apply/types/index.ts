/**
 * @file features/home/bal-game/apply/types/index.ts
 * @description 밸런스게임 신청 폼 관련 타입
 */

export const BALANCE_CATEGORIES = [
  { value: '일상', emoji: '☕' },
  { value: '음식', emoji: '🍜' },
  { value: '연애', emoji: '💘' },
  { value: '직장', emoji: '💼' },
  { value: '취미', emoji: '🎮' },
  { value: '여행', emoji: '✈️' },
  { value: '동물', emoji: '🐱' },
  { value: '건강', emoji: '💪' },
  { value: '기타', emoji: '✨' },
] as const;

export type BalanceCategory = (typeof BALANCE_CATEGORIES)[number]['value'];

export const BALANCE_SCOPES = [
  { value: '동네', icon: '📍', name: '내 동네', desc: '강남구·\n서초구 등' },
  { value: '서울', icon: '🏙️', name: '서울 전체', desc: '서울시\n전 지역' },
  { value: '전국', icon: '🗺️', name: '전국', desc: '모든 지역\n공개' },
] as const;

export type BalanceScope = (typeof BALANCE_SCOPES)[number]['value'];

export interface BalanceApplyInput {
  optionA: string;
  optionB: string;
  category: BalanceCategory;
  scope: BalanceScope;
}

export interface BalanceApplyResult extends BalanceApplyInput {
  id: string;
  status: 'pending';
  submittedAt: string;
  /** 공개 범위의 표시용 라벨 (예: "내 동네 (강남구)") */
  scopeLabel: string;
}
