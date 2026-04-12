/**
 * @file constants/validation.ts
 * @description 폼 입력값 검증에 사용하는 정규식·상수 모음
 *
 * 사용 방법:
 *   import { RE_PW, calcStrength } from '@/constants/validation';
 */

import { COLORS } from '@/constants/colors';

// ─── 정규식 ──────────────────────────────────────────────────────────────────

/** 아이디: 영문·숫자 4~16자 */
export const RE_ID = /^[a-zA-Z0-9]{4,16}$/;

/**
 * 비밀번호: 영문 + 숫자 + 특수문자 포함, 8자 이상
 * 허용 특수문자: !@#$%^&*()_+-=[]{};':"\\|,.<>/?
 */
export const RE_PW =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

// ─── 비밀번호 강도 ────────────────────────────────────────────────────────────

/**
 * 비밀번호 강도 점수 계산 (0~4)
 * - 8자 이상: +1
 * - 대문자 포함: +1
 * - 숫자 포함: +1
 * - 특수문자 포함: +1
 */
export const calcStrength = (pw: string): number => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) score++;
  return score;
};

/** 강도 점수(1~4)에 대응하는 바 색상 배열 */
export const STRENGTH_COLORS: string[] = [
  COLORS.danger,   // 1: 약함 (빨간 계열)
  COLORS.amber,    // 2: 보통 (주황)
  COLORS.primary,  // 3: 강함 (보라)
  COLORS.green,    // 4: 매우 강함 (초록)
];

/** 강도 점수(1~4)에 대응하는 한글 레이블 */
export const STRENGTH_LABELS: string[] = ['약함', '보통', '강함', '매우 강함'];
