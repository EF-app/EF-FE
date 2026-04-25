/**
 * @file features/reports/api/reportsApi.ts
 */

import {
  ReportPayload,
  ReportPostitPreview,
  ReportReason,
  ReportResult,
  ReportTargetUser,
} from '../types';

export const REPORT_REASONS: ReportReason[] = [
  { code: 'HATE',        emoji: '🚫', title: '욕설 · 혐오 표현',     description: '상대방을 비하하거나 혐오하는 언어를 사용했어요' },
  { code: 'SEXUAL',      emoji: '🔞', title: '음란 · 성적 표현',     description: '부적절한 성적 메시지나 이미지를 보냈어요' },
  { code: 'SPAM',        emoji: '💸', title: '사기 · 홍보 · 스팸',   description: '금전 요구, 광고, 도배성 메시지를 보냈어요' },
  { code: 'THREAT',      emoji: '😰', title: '협박 · 위협',          description: '불안감을 유발하거나 위협적인 행동을 했어요' },
  { code: 'IMPERSONATE', emoji: '🎭', title: '허위 정보 · 사칭',     description: '다른 사람을 사칭하거나 거짓 정보를 올렸어요' },
  { code: 'OTHER',       emoji: '📋', title: '기타',                 description: '위에 해당하지 않는 다른 문제가 있어요' },
];

export const MOCK_REPORT_TARGET: ReportTargetUser = {
  userId: 'usr_t001',
  nickname: '수달친구🦦',
  age: 28,
  region: '서울 강남구',
  avatarEmoji: '🦦',
  avatarBgColor: '#8BBFA8',
};

export const MOCK_POSTIT_PREVIEW: ReportPostitPreview = {
  letterId: 'ltr_t001',
  showAuthor: true,
  authorNickname: '달빛여행자',
  authorAvatarEmoji: '🌙',
  body: '오늘 하루도 수고했어요.\n내일은 분명 더 좋은 일이\n기다리고 있을 거예요 🌿',
  createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
};

export const MOCK_POSTIT_PREVIEW_ANON: ReportPostitPreview = {
  ...MOCK_POSTIT_PREVIEW,
  showAuthor: false,
  authorNickname: '익명의 별',
  authorAvatarEmoji: '🌙',
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchReportTarget(_userId: string): Promise<ReportTargetUser> {
  await delay(200);
  return MOCK_REPORT_TARGET;
}

export async function fetchPostitPreview(letterId: string, isAnonymous: boolean): Promise<ReportPostitPreview> {
  await delay(200);
  return isAnonymous
    ? { ...MOCK_POSTIT_PREVIEW_ANON, letterId }
    : { ...MOCK_POSTIT_PREVIEW,      letterId };
}

export async function submitReport(payload: ReportPayload): Promise<ReportResult> {
  await delay(300);
  return {
    reportId: `rpt_${Date.now()}`,
    receivedAt: new Date().toISOString(),
  };
}
