/**
 * @file features/likes/utils/time.ts
 * @description ISO 시각 → "방금 전", "10분 전", "어제" 등 상대시간 한국어 표시
 */

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export function formatRelative(iso: string, suffix = ''): string {
  const diff = Date.now() - new Date(iso).getTime();
  const tail = suffix ? ` ${suffix}` : '';

  if (diff < MIN)        return `방금 전${tail}`;
  if (diff < HOUR)       return `${Math.floor(diff / MIN)}분 전${tail}`;
  if (diff < DAY)        return `${Math.floor(diff / HOUR)}시간 전${tail}`;
  if (diff < DAY * 2)    return `어제${tail}`;
  if (diff < DAY * 7)    return `${Math.floor(diff / DAY)}일 전${tail}`;

  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}${tail}`;
}
