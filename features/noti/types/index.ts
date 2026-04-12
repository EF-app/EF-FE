/**
 * @file features/noti/types/index.ts
 */

export type NoticeTag = 'notice' | 'update' | 'event' | 'hot';

export interface Notice {
  id: string;
  tag: NoticeTag;
  title: string;
  preview: string;
  date: string;
  body: string;
}
