/**
 * @file features/home/post-it/api/letterApi.ts
 * @description 우편함 편지 Mock API
 */

import type { Letter } from '@home/post-it/types';

const MOCK_LETTERS: Letter[] = [
  {
    id: 1, stamp: '💜', tag: '그냥요', scope: '동네', anon: true, nick: '익명', age: null, loc: '강남구',
    time: '방금 전', title: '오늘 하루도 수고했어요', likes: 24, liked: false, replies: 3,
    body: '오늘 지하철에서 힘들어 보이는 분이 계셨는데 말을 걸지 못했어요. 그 분도 오늘 하루 잘 마무리하셨으면 좋겠다고 생각했어요.\n\n그냥 지나가다 우연히 이 공간에 왔는데, 여기 계신 모든 분들도 오늘 하루 정말 수고하셨어요 🌙',
  },
  {
    id: 2, stamp: '💛', tag: '따뜻해요', scope: '서울', anon: false, nick: '민들레🌻', age: 29, loc: '서울 마포구',
    time: '10분 전', title: '같이 성장할 친구 찾아요!', likes: 18, liked: false, replies: 7,
    body: '안녕하세요! 요즘 투자 공부를 시작했는데, 함께 정보 공유할 친구를 찾고 있어요. 같이 성장해요 🌱\n\nETF 장기투자나 절세 방법 알고 싶으신 분 연락 주세요. 서로 배우면서 천천히 가면 좋겠어요.',
  },
  {
    id: 3, stamp: '🌿', tag: '담백해요', scope: '동네', anon: false, nick: '찻잎냄새🍃', age: 33, loc: '서울 강남구',
    time: '32분 전', title: '강남구 새벽 산책하기 좋은 곳 아시나요?', likes: 9, liked: false, replies: 12,
    body: '요즘 잠을 못 자서 새벽에 산책을 자주 하는데 좋은 코스가 있으면 알려주세요. 조용하고 사람 없는 곳 선호합니다.',
  },
  {
    id: 4, stamp: '🌙', tag: '감성적이에요', scope: '전국', anon: false, nick: '별빛수집가✨', age: 26, loc: '경기 수원시',
    time: '1시간 전', title: '첫 월급 받았는데 아무것도 하기 싫다', likes: 41, liked: true, replies: 19,
    body: '드디어 첫 월급을 받았어요. 근데 이상하게 기쁘지가 않네요. 이런 감정 느껴보신 분 계세요?\n\n열심히 일했는데 왜 이렇게 텅 빈 기분인지... 그냥 어딘가에 적고 싶었어요.',
  },
  {
    id: 5, stamp: '🎉', tag: '신나요', scope: '동네', anon: false, nick: '수달친구🦦', age: 24, loc: '서울 강남구',
    time: '2시간 전', title: '강남 맛집 오픈 소식 공유해요!', likes: 13, liked: false, replies: 5,
    body: '신사동에 어제 오픈한 스시집 다녀왔는데 진짜 맛있었어요! 런치 코스가 가성비 최고입니다. 예약 필수고 웨이팅 좀 있어요. 근데 기다릴 가치 있어요 🍣',
  },
  {
    id: 6, stamp: '🤔', tag: '고민이에요', scope: '동네', anon: true, nick: '익명', age: null, loc: '강남구',
    time: '3시간 전', title: '이직 고민 중인데 조언 구해요', likes: 28, liked: false, replies: 22,
    body: '현재 직장 3년차인데 연봉 협상이 안 되네요. 이직 준비를 해야할지 더 기다려야 할지 판단이 안 서요.\n\n같은 상황 겪어보신 분 계시면 어떻게 하셨는지 이야기 나눠요.',
  },
  {
    id: 7, stamp: '✉️', tag: '일상', scope: '동네', anon: false, nick: '뽀글이🐑', age: 31, loc: '서울 강남구',
    time: '5시간 전', title: '강남구 고양이 카페 있나요?', likes: 7, liked: false, replies: 8,
    body: '강남 쪽에 고양이 카페 추천 부탁드려요! 요즘 너무 지쳐서 고양이 보러 가고 싶어요 🐱',
  },
  {
    id: 8, stamp: '💛', tag: '따뜻해요', scope: '서울', anon: false, nick: '하품판다🐼', age: 28, loc: '서울 서초구',
    time: '어제', title: '오늘 지하철에서 좋은 일 있었어요', likes: 56, liked: false, replies: 14,
    body: '출근길에 무거운 짐 들고 힘들어하는 할머니께 자리 양보했더니 사탕을 주셨어요. 작은 일인데 하루 종일 기분이 좋았어요. 좋은 에너지 나눠드립니다 ☀️',
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const fetchLetters = async (): Promise<Letter[]> => {
  await delay(500);
  return [...MOCK_LETTERS];
};

export const toggleLetterLike = async (
  id: number,
  currentLiked: boolean,
): Promise<{ id: number; liked: boolean; likes: number }> => {
  await delay(200);
  const item = MOCK_LETTERS.find(l => l.id === id);
  if (!item) throw new Error('Letter not found');
  return {
    id,
    liked: !currentLiked,
    likes: currentLiked ? item.likes - 1 : item.likes + 1,
  };
};
