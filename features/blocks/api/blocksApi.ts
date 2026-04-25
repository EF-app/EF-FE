/**
 * @file features/blocks/api/blocksApi.ts
 */

import { BlockProfilePayload, BlockReason, BlockedUser } from '../types';

export const BLOCK_REASONS: BlockReason[] = [
  { code: 'OFFENSIVE',  emoji: '😤', title: '불쾌한 대화나 행동',     description: '메시지나 행동이 불편하거나 무례했어요' },
  { code: 'HATE',       emoji: '🚫', title: '욕설 · 혐오 표현',       description: '비하하거나 혐오적인 언어를 사용했어요' },
  { code: 'NO_CONTACT', emoji: '👻', title: '더 이상 연락하고 싶지 않아요', description: '이유 없이 연락을 끊고 싶어요' },
  { code: 'IMPERSONATE', emoji: '🎭', title: '허위 정보 · 사칭 의심',  description: '프로필이나 정보가 거짓인 것 같아요' },
  { code: 'OTHER',      emoji: '📋', title: '기타',                    description: '위에 해당하지 않는 다른 이유예요' },
];

export const MOCK_BLOCKED: BlockedUser[] = [
  {
    userId: 'usr_b001',
    nickname: '지수',
    age: 26,
    region: '서울 마포구',
    mbti: 'INFP',
    avatarEmoji: '🌸',
    avatarBgColor: '#D4C8F0',
    reasonCodes: ['OFFENSIVE'],
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isBlocked: true,
  },
  {
    userId: 'usr_b002',
    nickname: '하늘바람',
    age: 31,
    region: '서울 강서구',
    mbti: 'ESTJ',
    avatarEmoji: '🌬️',
    avatarBgColor: '#C8E0E8',
    reasonCodes: ['HATE', 'NO_CONTACT'],
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    isBlocked: true,
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  await delay(250);
  return MOCK_BLOCKED;
}

export async function blockUser(_payload: BlockProfilePayload) {
  await delay(200);
  return { blocked: true };
}

export async function unblockUser(_userId: string) {
  await delay(200);
  return { unblocked: true };
}
