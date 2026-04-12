/**
 * @file constants/typography.ts
 * @description EF 앱 전체에서 사용하는 폰트 관련 상수
 *
 * 나눔스퀘어 Neo 5단계:
 *   FONT_LIGHT   → NanumSquareNeo-aLt  (Light)
 *   FONT_FAMILY  → NanumSquareNeo-bRg  (Regular, 기본값)
 *   FONT_BOLD    → NanumSquareNeo-cBd  (Bold)
 *   FONT_EXTRABOLD → NanumSquareNeo-dEb (ExtraBold)
 *   FONT_HEAVY   → NanumSquareNeo-eHv  (Heavy)
 *
 * 사용 방법:
 *   import { FONT_FAMILY, FONT_BOLD } from '@/constants/typography';
 *   <Text style={{ fontFamily: FONT_BOLD }} />
 */

export const FONT_LIGHT     = 'NanumSquareNeo-aLt';
export const FONT_FAMILY    = 'NanumSquareNeo-bRg';
export const FONT_BOLD      = 'NanumSquareNeo-cBd';
export const FONT_EXTRABOLD = 'NanumSquareNeo-dEb';
export const FONT_HEAVY     = 'NanumSquareNeo-eHv';
