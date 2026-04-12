/**
 * @file features/my/types/profile.ts
 * @description 프로필 상세 보기/수정 관련 타입
 */

export type ChipColor = 'purple' | 'green' | 'amber' | 'neutral';
export type BadgeColor = 'purple' | 'green' | 'amber' | 'neutral';

export interface KeywordGroup {
  title: string;
  color: ChipColor;
  chips: string[];
}

export interface HabitRow {
  icon: string;
  iconVariant: 'p' | 'g' | 'a' | 'n';  // purple / green / amber / neutral
  label: string;
  value: string;
  sub?: string;
  badge: string;
  badgeVariant: 'p' | 'g' | 'a' | 'n';
}

export interface StyleItem {
  emoji: string;
  label: string;
  value: string;
}

export interface IdealItem {
  icon: string;
  iconBg: string;
  key: string;
  value: string;
}

export interface MyDetailProfile {
  name: string;
  age: number;
  loc: string;
  job: string;
  mbti: string;
  mbtiDesc: string;
  mbtiEmoji: string;
  interestBadge: string;
  completion: number;
  completionHint: string;
  photoDots: number;
  keywords: KeywordGroup[];
  habits: HabitRow[];
  styleItems: StyleItem[];
  styleTraits: { label: string; selected: boolean }[];
  idealPriority: string[];
  idealItems: IdealItem[];
  bio: string;
}
