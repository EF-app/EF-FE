/**
 * @file features/my/types/index.ts
 */

export interface UserProfile {
  name: string;
  initial: string;
  bio: string;
  location: string;
  joinedDate: string;
  badges: { label: string; variant: 'expert' | 'level' | 'hot' }[];
  stats: { label: string; value: string }[];
  activity: { icon: string; value: string; label: string }[];
  points: number;
  level: number;
}

export interface MenuItem {
  icon: string;
  iconBg: string;
  title: string;
  sub?: string;
  rightType: 'chevron' | 'badge' | 'value' | 'toggle';
  rightValue?: string;
  rightBadgeVariant?: 'purple' | 'green' | 'danger';
  toggleKey?: string;
  /** Stack route to navigate to on press (e.g., '/(tabs)/my/blocked-users') */
  href?: string;
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}
