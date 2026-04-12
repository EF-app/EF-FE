/**
 * @file features/hi/types/index.ts
 */

export type MatchType = 'interest' | 'ideal' | 'attraction' | 'random';

export interface MatchProfile {
  id: number;
  type: MatchType;
  name: string;
  age: number;
  loc: string;
  mbti: string;
  emoji: string;
  bgColor: string;
  tags: string[];
  bio: string;
  match: number;
}

export const TYPE_META: Record<
  MatchType,
  { label: string; tagBg: string; barColor: string; scoreColor: string }
> = {
  interest:   { label: '🔮 관심사 매칭', tagBg: 'rgba(150,134,191,0.88)', barColor: '#9686BF', scoreColor: '#9686BF' },
  ideal:      { label: '💜 이상형 매칭',  tagBg: 'rgba(91,185,140,0.88)',  barColor: '#5BB98C', scoreColor: '#5BB98C' },
  attraction: { label: '✨ 끌림 매칭',    tagBg: 'rgba(196,136,90,0.88)',  barColor: '#C4885A', scoreColor: '#C4885A' },
  random:     { label: '🌟 우연한 만남',  tagBg: 'rgba(100,130,180,0.88)', barColor: '#6482B4', scoreColor: '#6482B4' },
};
