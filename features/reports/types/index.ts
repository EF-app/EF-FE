/**
 * @file features/reports/types/index.ts
 * @description 신고 관련 타입
 *
 * ef_schema 매핑
 * - 댓글 신고:  POST /balance-games/:gameId/comments/:commentId/report
 * - 포스트잇(편지) 신고: POST /letters/:letterId/report
 * - 답장 신고:  POST /letters/:letterId/replies/:replyId/report
 */

export type ReportTargetType =
  | 'BALANCE_GAME_COMMENT'
  | 'BALANCE_GAME_REPLY'
  | 'LETTER'
  | 'LETTER_REPLY';

export type ReportReasonCode =
  | 'HATE'         // 욕설 · 혐오 표현
  | 'SEXUAL'       // 음란 · 성적 표현
  | 'SPAM'         // 사기 · 홍보 · 스팸
  | 'THREAT'       // 협박 · 위협
  | 'IMPERSONATE'  // 허위 정보 · 사칭
  | 'OTHER';

export interface ReportReason {
  code: ReportReasonCode;
  emoji: string;
  title: string;
  description: string;
}

/** 신고 대상 미니 정보 (작성자 노출 모드일 때만 사용) */
export interface ReportTargetUser {
  userId: string;
  nickname: string;
  age: number;
  region: string;
  avatarEmoji: string;
  avatarBgColor: string;
}

/** 포스트잇 / 편지 프리뷰 (report_postit) */
export interface ReportPostitPreview {
  letterId: string;
  /** false면 익명 버전 (닉네임/아바타 마스킹) */
  showAuthor: boolean;
  authorNickname: string;
  authorAvatarEmoji: string;
  body: string;
  createdAt: string;
}

export interface ReportPayload {
  targetType: ReportTargetType;
  targetId: string;
  reasonCodes: ReportReasonCode[];
  detail?: string;
  /** report_with_nick — 신고와 동시 차단 옵션 */
  alsoBlock?: boolean;
}

export interface ReportResult {
  reportId: string;
  receivedAt: string;
}
