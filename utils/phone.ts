/**
 * @file utils/phone.ts
 * @description 전화번호 관련 유틸리티 함수 모음
 *
 * 사용 방법:
 *   import { formatPhone } from '@/utils/phone';
 *   const formatted = formatPhone('01012345678'); // '010-1234-5678'
 */

/**
 * 숫자만 입력받아 한국 휴대폰 번호 형식(010-XXXX-XXXX)으로 포맷팅
 * - 숫자 외 문자는 자동 제거
 * - 최대 11자리까지만 반영
 *
 * @param raw - 사용자가 입력한 원문 문자열 (숫자·하이픈 등 혼용 가능)
 * @returns 포맷팅된 전화번호 문자열 (예: '010-1234-5678')
 */
export const formatPhone = (raw: string): string => {
  // 숫자만 추출
  const digits = raw.replace(/\D/g, '');

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};
