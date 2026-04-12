/**
 * @file features/home/post-it/types/index.ts
 * @description 종이비행기 우체통 관련 타입 정의
 */

export interface PostIt {
  id: string;
  avatarEmoji: string;
  avatarColor: string;
  nickname: string;
  timeAgo: string;
  message: string;
  likeCount: number;
  isLiked: boolean;
  isAnonymous?: boolean;
}
