/**
 * @file features/likes/api/likesApi.ts
 * @description Mock fetcher — 백엔드 연결 전 initialData/placeholderData로 사용
 */

import {
  MatchRequestSummary,
  MatchSummary,
  UserMini,
} from '../types';

const u = (
  id: string,
  nickname: string,
  age: number,
  region: string,
  emoji: string,
  bg: string,
  mbti: string,
  tags: string[],
  matchScore: number,
  isOnline = false,
): UserMini => ({
  id,
  nickname,
  age,
  region,
  avatarEmoji: emoji,
  avatarBgColor: bg,
  mbti,
  tags,
  matchScore,
  isOnline,
});

/* ─────────────── 내가 보낸 좋아요 (sent) ─────────────── */
export const MOCK_SENT: MatchRequestSummary[] = [
  {
    requestId: 'mreq_s_101',
    message: '같이 전시 보러 가요',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isSuper: true,
    toUser: u('usr_s101', '윤슬', 26, '강남구', '🌙', '#9686BF', 'INFP', ['전시', '감성적이에요', '차분해요'], 80, true),
  },
  {
    requestId: 'mreq_s_102',
    message: '카페 투어 같이 해요! ☕',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isSuper: true,
    toUser: u('usr_s102', '리아', 28, '성수동', '☕', '#E8A4B8', 'ENFJ', ['커피☕', '홈카페', '일상'], 72),
  },
  {
    requestId: 'mreq_s_001',
    message: '오늘 하루도 수고했어요',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    isSuper: false,
    toUser: u('usr_s001', '수달친구🦦', 28, '강남구', '🦦', '#8BBFA8', 'INFP', ['새벽감성🌙', '산책', '고양이집사🐱'], 75, true),
  },
  {
    requestId: 'mreq_s_002',
    message: 'ETF 투자 같이 공부할 분',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isSuper: false,
    toUser: u('usr_s002', '민들레🌻', 29, '마포구', '🌻', '#9686BF', 'ENFP', ['투자공부', 'ETF', '성장마인드'], 68, true),
  },
  {
    requestId: 'mreq_s_003',
    message: '새벽 감성 포스트잇',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isSuper: false,
    toUser: u('usr_s003', '별빛수집가✨', 26, '서초구', '✨', '#A8C4E0', 'INFJ', ['새벽감성🌙', '드로잉', '음악감상'], 62),
  },
  {
    requestId: 'mreq_s_004',
    message: '강남구 새벽 산책 코스',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isSuper: false,
    toUser: u('usr_s004', '찻잎냄새🍃', 33, '강남구', '🍃', '#9686BF', 'ISTJ', ['담백해요', '산책', '고민이에요'], 58),
  },
  {
    requestId: 'mreq_s_005',
    message: '말차 라떼 만들었어요',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isSuper: false,
    toUser: u('usr_s005', '하품판다🐼', 28, '용산구', '🐼', '#8BBFA8', 'ISFP', ['홈카페', '일상'], 55, true),
  },
];

/* ─────────────── 받은 좋아요 (received) ─────────────── */
export const MOCK_RECEIVED: MatchRequestSummary[] = [
  {
    requestId: 'mreq_r_101',
    message: '책과 산책을 좋아해요',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    isSuper: true,
    fromUser: u('usr_r101', '지우', 27, '강남구', '📚', '#9686BF', 'INFP', ['책📚', '산책', '차분해요'], 78, true),
  },
  {
    requestId: 'mreq_r_102',
    message: '같이 커피 한 잔 어때요? ☕',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isSuper: true,
    fromUser: u('usr_r102', '해인', 25, '마포구', '☕', '#8BBFA8', 'ESFP', ['커피☕', '홈카페', '일상'], 71, true),
  },
  {
    requestId: 'mreq_r_103',
    message: '영화 이야기 나누고 싶어요 🎬',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isSuper: true,
    fromUser: u('usr_r103', '도윤', 30, '성동구', '🎬', '#E8A4B8', 'INFJ', ['영화🎬', '감성적이에요', '음악감상'], 66),
  },
  {
    requestId: 'mreq_r_001',
    message: '오늘 하루도 수고했어요',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    isSuper: false,
    fromUser: u('usr_r001', '수달친구🦦', 28, '강남구', '🦦', '#8BBFA8', 'INFP', ['새벽감성🌙', '산책', '고양이집사🐱'], 75, true),
  },
  {
    requestId: 'mreq_r_002',
    message: 'ETF 투자 같이 공부',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    isSuper: false,
    fromUser: u('usr_r002', '민들레🌻', 29, '마포구', '🌻', '#9686BF', 'ENFP', ['투자공부', 'ETF', '성장마인드'], 68, true),
  },
  {
    requestId: 'mreq_r_003',
    message: '새벽 감성 포스트잇',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isSuper: false,
    fromUser: u('usr_r003', '별빛수집가✨', 26, '서초구', '✨', '#A8C4E0', 'INFJ', ['새벽감성🌙', '드로잉', '음악감상'], 62),
  },
  {
    requestId: 'mreq_r_004',
    message: '봄이 왔어요. 벚꽃 같이 보러 갈 분 🌸',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isSuper: false,
    fromUser: u('usr_r004', '토끼귀🐰', 26, '마포구', '🐰', '#E8A4B8', 'INFP', ['산책', '감성적이에요', '드로잉'], 52),
  },
  {
    requestId: 'mreq_r_005',
    message: '카페라떼 마시면서 보내는 오후 🤍',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isSuper: false,
    fromUser: u('usr_r005', '뽀글이🐑', 31, '강남구', '🐑', '#E8C4A4', 'ISFJ', ['커피☕', '일상', '담백해요'], 48),
  },
];

/* ─────────────── 서로 좋아요 (matches) ─────────────── */
export const MOCK_MATCHES: MatchSummary[] = [
  {
    matchId: 'mtch_001',
    chatRoomId: 'chat_001',
    matchedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isFresh: true,
    matchedUser: u('usr_m001', '지수', 26, '서울 마포구', '지', '#C8B6E8', 'INFP', ['홈카페', '전시회', '인디음악'], 78, true),
  },
  {
    matchId: 'mtch_002',
    chatRoomId: 'chat_002',
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isFresh: true,
    isLiked: true,
    matchedUser: u('usr_m002', '준서', 30, '서울 용산', '준', '#F0D4B8', 'ENTJ', ['러닝', '커리어개발', '와인'], 91, true),
  },
  {
    matchId: 'mtch_003',
    chatRoomId: 'chat_003',
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    matchedUser: u('usr_m003', '민재', 29, '서울 성수', '민', '#B8E0C8', 'ENFP', ['캠핑', '등산', '재즈'], 88, true),
  },
  {
    matchId: 'mtch_004',
    chatRoomId: 'chat_004',
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.2).toISOString(),
    isLiked: true,
    matchedUser: u('usr_m004', '예나', 25, '서울 강남', '예', '#F0B8C8', 'ISFJ', ['베이킹', '요가', '책'], 85),
  },
  {
    matchId: 'mtch_005',
    chatRoomId: 'chat_005',
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    matchedUser: u('usr_m005', '수호', 30, '서울 송파', '수', '#B8D0E8', 'INTJ', ['영화', '테니스', '위스키'], 82),
  },
  {
    matchId: 'mtch_006',
    chatRoomId: 'chat_006',
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isLiked: true,
    matchedUser: u('usr_m006', '지안', 27, '서울 종로', '지', '#D4C0E8', 'ENFJ', ['사진', '여행', '맛집탐방'], 78, true),
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchSentLikes(): Promise<MatchRequestSummary[]> {
  await delay(300);
  return MOCK_SENT;
}

export async function fetchReceivedLikes(): Promise<MatchRequestSummary[]> {
  await delay(300);
  return MOCK_RECEIVED;
}

export async function fetchMatches(): Promise<MatchSummary[]> {
  await delay(300);
  return MOCK_MATCHES;
}

export async function cancelSentLike(_requestId: string) {
  await delay(150);
  return { canceled: true };
}

export async function acceptReceivedLike(_requestId: string) {
  await delay(150);
  return { matched: true };
}

export async function passReceivedLike(_requestId: string) {
  await delay(150);
  return { passed: true };
}
