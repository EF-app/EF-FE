/**
 * @file features/blocks/types/index.ts
 * @description 차단/차단 사유 관련 타입
 *
 * ef_schema 매핑
 * - 차단 목록 = GET /users/me/blocks (도메인은 api-spec에 미정의 — privacy 영역으로 가정)
 * - 차단 추가 = POST /users/me/blocks
 * - 차단 해제 = DELETE /users/me/blocks/:userId
 */

export type BlockReasonCode =
  | 'OFFENSIVE'   // 불쾌한 대화/행동
  | 'HATE'        // 욕설/혐오
  | 'NO_CONTACT'  // 더 이상 연락 안 함
  | 'IMPERSONATE' // 허위/사칭 의심
  | 'OTHER';

export interface BlockReason {
  code: BlockReasonCode;
  emoji: string;
  title: string;
  description: string;
}

export interface BlockedUser {
  /** ef_schema users.id */
  userId: string;
  nickname: string;
  age: number;
  region: string;
  mbti: string;
  avatarEmoji: string;
  avatarBgColor: string;
  reasonCodes: BlockReasonCode[];
  blockedAt: string;
  /** UI 토글용 (true=차단 중, false=해제됨) */
  isBlocked: boolean;
}

export interface BlockProfilePayload {
  targetUserId: string;
  reasonCodes: BlockReasonCode[];
}
