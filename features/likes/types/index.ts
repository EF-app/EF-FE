/**
 * @file features/likes/types/index.ts
 * @description 좋아요 / 매칭 요청 / 매칭 관련 타입
 *
 * ef_schema 매핑
 * - 내가 누른 좋아요 = sent match request  (GET /hi/requests/sent)
 * - 받은 좋아요     = received match request (GET /hi/requests/received)
 * - 서로 좋아요     = match                   (GET /hi/matches)
 */

export type MatchRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface UserMini {
  id: string;
  nickname: string;
  age: number;
  region: string;
  avatarEmoji: string;
  avatarBgColor: string;
  mbti: string;
  tags: string[];
  matchScore: number;
  isOnline?: boolean;
}

/** GET /hi/requests/sent · GET /hi/requests/received */
export interface MatchRequestSummary {
  requestId: string;
  message: string;
  status: MatchRequestStatus;
  createdAt: string;
  isSuper: boolean;
  /** 보낸 요청이면 toUser, 받은 요청이면 fromUser 둘 중 하나가 채워짐 */
  toUser?: UserMini;
  fromUser?: UserMini;
}

/** GET /hi/matches */
export interface MatchSummary {
  matchId: string;
  chatRoomId: string;
  matchedUser: UserMini;
  matchedAt: string;
  /** 클라이언트 확장: 새로 매칭된 항목 강조 */
  isFresh?: boolean;
  /** 즐겨찾기 (chats.isLiked와 동일 의미) */
  isLiked?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { nextCursor: string | null; hasMore: boolean };
}
