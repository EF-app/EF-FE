/**
 * @file features/my/api/profileApi.ts
 * @description 프로필 상세 Mock API
 */

import type { MyDetailProfile } from '@/features/my/types/profile';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const MOCK_DETAIL_PROFILE: MyDetailProfile = {
  name: '김지수',
  age: 26,
  loc: '서울 마포구',
  job: '디자이너',
  mbti: 'INFP',
  mbtiDesc: '중재자형 · 이상주의자',
  mbtiEmoji: '🌙',
  interestBadge: '💑 지인+애인',
  completion: 88,
  completionHint: '사진 1장을 더 추가하면 매칭 확률이 높아져요 ✨',
  photoDots: 3,
  keywords: [
    { title: '🌿 라이프스타일', color: 'purple', chips: ['아침형 인간', '집순이/집돌이', '반려동물', '워라밸'] },
    { title: '🎨 취미',         color: 'green',  chips: ['홈카페', '베이킹', '드로잉', '악기연주'] },
    { title: '🗺️ 외부 여가',   color: 'amber',  chips: ['맛집 탐방', '카페 투어', '사진 찍기', '국내여행'] },
    { title: '🎵 음악',         color: 'neutral', chips: ['인디음악', '시티팝', '재즈'] },
    { title: '✨ 나만의 키워드', color: 'purple', chips: ['#필름카메라', '#비오는날카페'] },
  ],
  habits: [
    { icon: '🍷', iconVariant: 'a', label: '음주',  value: '가끔 마심',  sub: '🍺 맥주 · 🍷 와인', badge: '소셜음주', badgeVariant: 'a' },
    { icon: '🌿', iconVariant: 'g', label: '흡연',  value: '비흡연자',   sub: undefined,             badge: '비흡연',   badgeVariant: 'g' },
    { icon: '🖊️', iconVariant: 'n', label: '타투', value: '없어요',    sub: undefined,             badge: '없음',     badgeVariant: 'n' },
  ],
  styleItems: [
    { emoji: '💇', label: '머리 길이', value: '긴머리' },
    { emoji: '👤', label: '체형',      value: '보통' },
    { emoji: '📏', label: '키',        value: '161~165' },
  ],
  styleTraits: [
    { label: '온깁',     selected: false },
    { label: '깁선호',   selected: true  },
    { label: '텍선호',   selected: false },
    { label: '온텍',     selected: false },
    { label: '플라토닉', selected: false },
  ],
  idealPriority: ['🌿 라이프스타일', '🎨 관심사'],
  idealItems: [
    { icon: '💇', iconBg: 'rgba(150,134,191,0.10)', key: '머리 길이', value: '중요하지 않아요' },
    { icon: '📏', iconBg: 'rgba(196,136,90,0.10)',  key: '키',        value: '171 이상' },
    { icon: '👤', iconBg: 'rgba(91,185,140,0.10)',  key: '체형',      value: '중요하지 않아요' },
    { icon: '💬', iconBg: 'rgba(150,134,191,0.10)', key: '성향',      value: '텍선호' },
  ],
  bio: '안녕하세요 👋 서울에서 디자이너로 일하고 있는 지수예요.\n\n주말엔 홈카페 만들거나 좋아하는 카페 찾아다니는 걸 즐겨요. 요즘은 필름 카메라에 빠져서 동네 골목을 찍고 다니고 있어요 📷\n\n대화가 잘 통하는 사람이 좋아요. 같이 인디밴드 공연 보러 갈 수 있는 분이면 더 좋겠어요 🎵',
};

export const fetchDetailProfile = async (): Promise<MyDetailProfile> => {
  await delay(400);
  return MOCK_DETAIL_PROFILE;
};
