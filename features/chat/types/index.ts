/**
 * @file features/chat/types/index.ts
 */

export interface Chat {
  id: number;
  name: string;
  emoji: string;
  gradColors: [string, string];
  time: string;
  unread: number;
  liked: boolean;
  online: boolean;
  preview: string;
  mine: boolean;
  memo?: string;
  memoDate?: string;
}

export type ChatTab = 'all' | 'unread' | 'liked';
