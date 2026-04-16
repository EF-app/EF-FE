/**
 * @file features/home/types/index.ts
 * @description 홈 화면 전용 타입 (오늘의 밸런스 + 포스트잇 보드)
 */

export interface BalanceOptionPreview {
  key: 'a' | 'b';
  emoji: string;
  scenario: string;
  label: string;
  votes: number;
}

export interface BalanceCommentPreview {
  id: string;
  avatar: string;
  nickname: string;
  message: string;
}

export interface BalanceGamePreview {
  id: string;
  participantCount: number;
  isHot: boolean;
  commentCount: number;
  optionA: BalanceOptionPreview;
  optionB: BalanceOptionPreview;
  comments: BalanceCommentPreview[];
}

export interface PostitPreview {
  id: string;
  avatar: string;
  nickname: string;
  timeAgo: string;
  message: string;
  likeCount: number;
  isLiked: boolean;
  tone: 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
}

export interface HomeFeed {
  balance: BalanceGamePreview;
  postits: PostitPreview[];
}

export type VoteSide = 'a' | 'b';
