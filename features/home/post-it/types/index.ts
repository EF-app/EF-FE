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

export type LetterScope = '동네' | '서울' | '전국';
export type LetterTag = '전체' | '일상' | '따뜻해요' | '담백해요' | '감성적이에요' | '고민이에요' | '신나요' | '그냥요';

export interface Letter {
  id: number;
  stamp: string;
  tag: Exclude<LetterTag, '전체'>;
  scope: LetterScope;
  anon: boolean;
  nick: string;
  age: number | null;
  loc: string;
  time: string;
  title: string;
  likes: number;
  liked: boolean;
  replies: number;
  body: string;
}

export const POST_IT_COLORS = {
  yellow: '#FFF4A3',
  purple: '#E8E0FF',
  pink:   '#FFE0EF',
  mint:   '#D4F5EC',
  peach:  '#FFE8D6',
  sky:    '#D6EDFF',
} as const;
export type PostItColor = keyof typeof POST_IT_COLORS;
