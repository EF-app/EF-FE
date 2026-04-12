/**
 * @file features/my/api/myApi.ts
 */

import { UserProfile, MenuSection } from '../types';

export const MOCK_PROFILE: UserProfile = {
  name: '김녹차',
  initial: '김',
  bio: '차 한 잔의 여유를 찾는 사람 🍵',
  location: '서울',
  joinedDate: '2023.03',
  badges: [
    { label: '✦ 전문가', variant: 'expert' },
    { label: 'Lv.24',   variant: 'level' },
    { label: '🔥 Top 3%', variant: 'hot' },
  ],
  stats: [
    { label: '작성 글',   value: '47' },
    { label: '받은 공감', value: '1,204' },
    { label: '포인트',    value: '328' },
    { label: '팔로워',    value: '89' },
  ],
  activity: [
    { icon: '📝', value: '47',  label: '내 글' },
    { icon: '💬', value: '183', label: '댓글' },
    { icon: '❤️', value: '92',  label: '스크랩' },
    { icon: '🏆', value: '5',   label: '배지' },
  ],
  points: 328,
  level: 24,
};

export const MENU_SECTIONS: MenuSection[] = [
  {
    label: '계정',
    items: [
      { icon: '👤', iconBg: 'rgba(150,134,191,0.10)', title: '계정 관리',    sub: '이메일 · 비밀번호 · 연동', rightType: 'chevron' },
      { icon: '🔔', iconBg: 'rgba(91,185,140,0.12)',  title: '알림 설정',    sub: '댓글, 공감, 공지 알림',   rightType: 'badge', rightValue: 'ON', rightBadgeVariant: 'purple' },
      { icon: '🔒', iconBg: 'rgba(196,136,90,0.12)',  title: '개인정보 보호', sub: '공개 범위 · 차단 관리',  rightType: 'chevron' },
      { icon: '🚫', iconBg: 'rgba(82,160,210,0.12)',  title: '차단한 사용자',                              rightType: 'value', rightValue: '2명' },
    ],
  },
  {
    label: '앱 설정',
    items: [
      { icon: '🌙', iconBg: 'rgba(173,168,178,0.14)', title: '다크 모드',      rightType: 'toggle', toggleKey: 'darkMode' },
      { icon: '🔤', iconBg: 'rgba(173,168,178,0.14)', title: '글꼴 크기',      rightType: 'value', rightValue: '기본' },
      { icon: '📶', iconBg: 'rgba(91,185,140,0.12)',  title: '데이터 절약 모드', rightType: 'toggle', toggleKey: 'dataSaver' },
      { icon: '🌐', iconBg: 'rgba(196,136,90,0.12)',  title: '언어',           rightType: 'value', rightValue: '한국어' },
    ],
  },
  {
    label: '고객 지원',
    items: [
      { icon: '❓', iconBg: 'rgba(150,134,191,0.10)', title: '도움말 · FAQ',  rightType: 'chevron' },
      { icon: '💬', iconBg: 'rgba(196,136,90,0.12)',  title: '1:1 문의하기',  rightType: 'badge', rightValue: '빠른 답변', rightBadgeVariant: 'green' },
      { icon: '⭐', iconBg: 'rgba(91,185,140,0.12)',  title: '앱 평가하기',   rightType: 'chevron' },
      { icon: '📄', iconBg: 'rgba(173,168,178,0.14)', title: '약관 및 정책',  rightType: 'chevron' },
      { icon: '🔢', iconBg: 'rgba(173,168,178,0.14)', title: '버전 정보',     rightType: 'value', rightValue: 'v2.4.1' },
    ],
  },
];

export async function fetchMyProfile(): Promise<UserProfile> {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_PROFILE;
}
