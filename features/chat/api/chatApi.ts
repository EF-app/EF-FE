/**
 * @file features/chat/api/chatApi.ts
 */

import { Chat } from '../types';

export const MOCK_CHATS: Chat[] = [
  { id: 1,  name: '지수',  emoji: '🌸', gradColors: ['#C5BAE0', '#9686BF'], time: '방금',   unread: 3, liked: true,  online: true,  preview: '오늘 홍대 어때요? 같이 가요!',     mine: false },
  { id: 2,  name: '준서',  emoji: '🦁', gradColors: ['#F0E0C0', '#D4A060'], time: '2분 전', unread: 0, liked: true,  online: true,  preview: '맞아요 저도 러닝 좋아해요 😊',      mine: false },
  { id: 3,  name: '아린',  emoji: '🌌', gradColors: ['#B8C8F0', '#6B87D4'], time: '14분 전',unread: 1, liked: true,  online: false, preview: '그 전시 같이 가실래요?',            mine: false },
  { id: 4,  name: '하준',  emoji: '🌿', gradColors: ['#A8D5BA', '#5BB98C'], time: '1시간',  unread: 0, liked: false, online: false, preview: '네 알겠어요~',                    mine: true  },
  { id: 5,  name: '나연',  emoji: '🛡️',gradColors: ['#E8D8F0', '#B090D0'], time: '어제',   unread: 7, liked: false, online: false, preview: '뜨개질 배워보고 싶어요!',            mine: false },
  { id: 6,  name: '태양',  emoji: '🦅', gradColors: ['#3A4A6A', '#6A9ACA'], time: '어제',   unread: 0, liked: true,  online: true,  preview: '독특한 취향이신가봐요 ㅎㅎ',         mine: true  },
  { id: 7,  name: '소연',  emoji: '🌺', gradColors: ['#F0D5C0', '#C4885A'], time: '2일 전', unread: 0, liked: false, online: false, preview: '캠핑 일정 잡았어요!',               mine: false },
  { id: 8,  name: '채원',  emoji: '🦋', gradColors: ['#F0D0E8', '#C870A8'], time: '3일 전', unread: 0, liked: false, online: false, preview: '춤 같이 배워봐요 💃',              mine: false },
  { id: 9,  name: '유나',  emoji: '🌟', gradColors: ['#F8F0B8', '#D4C040'], time: '3일 전', unread: 0, liked: false, online: true,  preview: '페스티벌 같이 가요!!',              mine: false },
  { id: 10, name: '민준',  emoji: '⚡', gradColors: ['#B8D4F0', '#6499D4'], time: '4일 전', unread: 0, liked: false, online: false, preview: 'ㅎㅎ 나중에 얘기해요',              mine: true  },
];

const TODAY_TIMES = new Set(['방금', '2분 전', '14분 전', '1시간']);

export function isToday(time: string): boolean {
  return TODAY_TIMES.has(time);
}

export async function fetchChats(): Promise<Chat[]> {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_CHATS;
}
