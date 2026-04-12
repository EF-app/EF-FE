/**
 * @file app/(tabs)/my/profile/index.tsx
 * @description 내 프로필 상세 보기 화면
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useDetailProfile } from '@/features/my/hooks/useDetailProfile';
import type { HabitRow, KeywordGroup, ChipColor } from '@/features/my/types/profile';

/* ─── 색상 맵 ──────────────────────────────���──────── */
const CHIP_BG: Record<ChipColor, string> = {
  purple:  COLORS.primaryTint,
  green:   'rgba(91,185,140,0.10)',
  amber:   'rgba(196,136,90,0.10)',
  neutral: COLORS.bg,
};
const CHIP_BORDER: Record<ChipColor, string> = {
  purple:  'rgba(150,134,191,0.22)',
  green:   'rgba(91,185,140,0.20)',
  amber:   'rgba(196,136,90,0.20)',
  neutral: COLORS.divider,
};
const CHIP_TEXT: Record<ChipColor, string> = {
  purple:  COLORS.primary,
  green:   COLORS.greenVivid,
  amber:   COLORS.amber,
  neutral: COLORS.textSecondary,
};
const ICON_BG: Record<'p'|'g'|'a'|'n', string> = {
  p: COLORS.primaryTint,
  g: 'rgba(91,185,140,0.10)',
  a: 'rgba(196,136,90,0.10)',
  n: COLORS.bg,
};
const BADGE_BG: Record<'p'|'g'|'a'|'n', string> = ICON_BG;
const BADGE_TEXT: Record<'p'|'g'|'a'|'n', string> = {
  p: COLORS.primary,
  g: COLORS.greenVivid,
  a: COLORS.amber,
  n: COLORS.textMuted,
};

/* ─── 서브 컴포넌트 ────────────────────────────────── */

function SectionHeader({ label, onEdit }: { label: string; onEdit?: () => void }) {
  return (
    <View className="flex-row items-center justify-between mb-[10px]">
      <View className="flex-row items-center gap-[5px]">
        <View className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: COLORS.primary }} />
        <Text
          className="text-[11px] font-bold text-ef-text-muted"
          style={{ letterSpacing: 0.05 * 11 }}
        >
          {label.toUpperCase()}
        </Text>
      </View>
      {onEdit && (
        <TouchableOpacity
          className="flex-row items-center gap-[3px]"
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil-outline" size={11} color={COLORS.primary} />
          <Text className="text-[12px] font-bold" style={{ color: COLORS.primary }}>수정</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function Chip({ label, color }: { label: string; color: ChipColor }) {
  return (
    <View
      className="rounded-[20px] px-[11px] py-[5px]"
      style={{
        backgroundColor: CHIP_BG[color],
        borderWidth: 1,
        borderColor: CHIP_BORDER[color],
      }}
    >
      <Text className="text-[12px] font-bold" style={{ color: CHIP_TEXT[color] }}>{label}</Text>
    </View>
  );
}

function KeywordCard({ groups }: { groups: KeywordGroup[] }) {
  return (
    <View
      className="bg-ef-surface rounded-[18px] px-[16px] py-[15px]"
      style={cardShadow}
    >
      {groups.map((g, i) => (
        <View key={g.title} style={i > 0 ? { marginTop: 14 } : undefined}>
          <Text className="text-[11px] font-bold text-ef-text-muted mb-[8px]" style={{ letterSpacing: 0.04 * 11 }}>
            {g.title}
          </Text>
          <View className="flex-row flex-wrap gap-[6px]">
            {g.chips.map(chip => <Chip key={chip} label={chip} color={g.color} />)}
          </View>
        </View>
      ))}
    </View>
  );
}

function HabitCard({ rows }: { rows: HabitRow[] }) {
  return (
    <View className="bg-ef-surface rounded-[18px] overflow-hidden" style={cardShadow}>
      {rows.map((row, i) => (
        <React.Fragment key={row.label}>
          {i > 0 && <View className="h-[1px] bg-ef-divider mx-[16px]" />}
          <View className="flex-row items-center gap-[12px] px-[16px] py-[13px]">
            <View
              className="w-[36px] h-[36px] rounded-[10px] items-center justify-center flex-shrink-0"
              style={{ backgroundColor: ICON_BG[row.iconVariant] }}
            >
              <Text style={{ fontSize: 17 }}>{row.icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-bold text-ef-text-muted mb-[2px]" style={{ letterSpacing: 0.03 * 11 }}>
                {row.label}
              </Text>
              <Text className="text-[13.5px] font-extrabold text-ef-text" style={{ letterSpacing: -0.02 * 13 }}>
                {row.value}
              </Text>
              {row.sub && (
                <Text className="text-[11.5px] font-sans text-ef-text-sub mt-[1px]">{row.sub}</Text>
              )}
            </View>
            <View
              className="rounded-[20px] px-[9px] py-[4px] flex-shrink-0"
              style={{ backgroundColor: BADGE_BG[row.badgeVariant] }}
            >
              <Text className="text-[11px] font-bold" style={{ color: BADGE_TEXT[row.badgeVariant] }}>
                {row.badge}
              </Text>
            </View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const cardShadow = {
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 2,
};

/* ─── 메인 화면 ────────────────────────────────────── */
export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useDetailProfile();

  if (isLoading || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-ef-bg items-center justify-center" edges={['top']}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 탑 네비 ── */}
      <View className="flex-row items-center justify-between px-[20px] py-[12px]">
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
          style={cardShadow}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Text className="text-[19px] font-extrabold text-ef-text" style={{ letterSpacing: -0.04 * 19 }}>
          내 프로<Text style={{ color: COLORS.primary }}>필</Text>
        </Text>

        <View className="flex-row gap-[8px]">
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
            style={cardShadow}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
            style={cardShadow}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── 완성도 바 ── */}
        <View
          className="mx-[18px] mb-[14px] bg-ef-surface rounded-[12px] px-[16px] py-[13px]"
          style={cardShadow}
        >
          <View className="flex-row items-center justify-between mb-[8px]">
            <Text className="text-[12px] font-bold text-ef-text-sub">프로필 완성도</Text>
            <Text
              className="text-[18px] font-extrabold"
              style={{ color: COLORS.primary, letterSpacing: -0.04 * 18 }}
            >
              {profile.completion}%
            </Text>
          </View>
          <View className="h-[5px] rounded-[3px] bg-ef-divider overflow-hidden mb-[6px]">
            <View
              className="h-full rounded-[3px]"
              style={{ width: `${profile.completion}%`, backgroundColor: COLORS.primary }}
            />
          </View>
          <Text className="text-[11px] font-sans text-ef-text-muted">
            <Text className="font-bold" style={{ color: COLORS.amber }}>
              {profile.completionHint.split('을 더')[0]}
            </Text>
            을 더{profile.completionHint.split('을 더')[1]}
          </Text>
        </View>

        {/* ── 히어로 사진 ── */}
        <View
          className="mx-[18px] mb-[14px] rounded-[18px] overflow-hidden"
          style={{
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.14,
            shadowRadius: 28,
            elevation: 6,
          }}
        >
          {/* Photo area */}
          <View
            className="w-full items-end justify-end"
            style={{ height: 280, backgroundColor: COLORS.primary }}
          >
            {/* Interest badge */}
            <View
              className="absolute top-[13px] left-[13px] flex-row items-center gap-[5px] rounded-[20px] px-[11px] py-[5px]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.22)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.28)',
              }}
            >
              <Text className="text-[11px] font-bold text-white">{profile.interestBadge}</Text>
            </View>

            {/* Edit photo button */}
            <TouchableOpacity
              className="absolute top-[13px] right-[13px] w-[32px] h-[32px] rounded-full items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.22)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={13} color="#fff" />
            </TouchableOpacity>

            {/* Initials watermark */}
            <Text
              className="absolute font-extrabold"
              style={{
                bottom: 12, right: 16,
                fontSize: 64,
                color: 'rgba(255,255,255,0.18)',
                letterSpacing: -0.04 * 64,
              }}
            >
              {profile.name.slice(1)}
            </Text>

            {/* Photo dots */}
            <View className="absolute bottom-[14px] left-[16px] flex-row gap-[5px]">
              {Array.from({ length: profile.photoDots }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === 0 ? 18 : 6,
                    height: 6,
                    borderRadius: i === 0 ? 3 : 3,
                    backgroundColor: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Info row */}
          <View className="bg-ef-surface px-[18px] pt-[15px] pb-[16px]">
            <View className="flex-row items-center justify-between mb-[6px]">
              <View className="flex-row items-baseline gap-[5px]">
                <Text
                  className="text-[21px] font-extrabold text-ef-text"
                  style={{ letterSpacing: -0.04 * 21 }}
                >
                  {profile.name}
                </Text>
                <Text className="text-[14px] font-sans text-ef-text-muted">{profile.age}세</Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center gap-[5px] rounded-[20px] px-[12px] py-[6px]"
                style={{
                  backgroundColor: COLORS.primaryTint,
                  borderWidth: 1,
                  borderColor: COLORS.primaryBorder,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="pencil-outline" size={11} color={COLORS.primary} />
                <Text className="text-[12px] font-bold" style={{ color: COLORS.primary }}>수정</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center flex-wrap gap-[10px]">
              {[
                { icon: 'location-outline' as const, label: profile.loc },
                { icon: 'desktop-outline' as const,  label: profile.job },
                { icon: 'person-outline' as const,   label: profile.mbti },
              ].map((meta, i) => (
                <React.Fragment key={meta.label}>
                  {i > 0 && (
                    <View className="w-[3px] h-[3px] rounded-full bg-ef-divider" />
                  )}
                  <View className="flex-row items-center gap-[4px]">
                    <Ionicons name={meta.icon} size={12} color={COLORS.textMuted} />
                    <Text className="text-[12px] font-bold text-ef-text-sub">{meta.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        {/* ── 관심사 키워드 ── */}
        <View className="mx-[18px] mb-[12px]">
          <SectionHeader label="관심사 키워드" onEdit={() => {}} />
          <KeywordCard groups={profile.keywords} />
        </View>

        {/* ── 생활 습관 ── */}
        <View className="mx-[18px] mb-[12px]">
          <SectionHeader label="생활 습관" onEdit={() => {}} />
          <HabitCard rows={profile.habits} />
        </View>

        {/* ── 내 스타일 ── */}
        <View className="mx-[18px] mb-[12px]">
          <SectionHeader label="내 스타일" onEdit={() => {}} />
          <View className="bg-ef-surface rounded-[18px] overflow-hidden" style={cardShadow}>
            <View className="p-[16px]">
              {/* 3-col grid */}
              <View className="flex-row gap-[8px] mb-[14px]">
                {profile.styleItems.map(item => (
                  <View
                    key={item.label}
                    className="flex-1 items-center gap-[4px] rounded-[12px] py-[12px] px-[10px]"
                    style={{
                      backgroundColor: COLORS.primaryTint,
                      borderWidth: 1,
                      borderColor: COLORS.primaryBorder,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                    <Text className="text-[10px] font-bold text-ef-text-muted" style={{ letterSpacing: 0.03 * 10 }}>
                      {item.label}
                    </Text>
                    <Text
                      className="text-[12.5px] font-extrabold"
                      style={{ color: COLORS.primary, letterSpacing: -0.02 * 12 }}
                    >
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 성향 */}
              <Text className="text-[11px] font-bold text-ef-text-muted mb-[8px]" style={{ letterSpacing: 0.03 * 11 }}>
                성향
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {profile.styleTraits.map(trait => (
                  <View
                    key={trait.label}
                    className="flex-shrink-0 rounded-[20px] px-[14px] py-[7px]"
                    style={{
                      backgroundColor: trait.selected ? COLORS.primaryTint : COLORS.surface,
                      borderWidth: 1.5,
                      borderColor: trait.selected ? COLORS.primary : COLORS.divider,
                    }}
                  >
                    <Text
                      className="text-[12.5px] font-bold"
                      style={{ color: trait.selected ? COLORS.primary : COLORS.textSecondary }}
                    >
                      {trait.label}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className="h-[1px] bg-ef-divider mx-[16px]" />

            {/* MBTI 카드 */}
            <View className="p-[16px] pt-[14px]">
              <View
                className="rounded-[18px] px-[18px] py-[16px] overflow-hidden"
                style={{
                  backgroundColor: COLORS.primary,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.28,
                  shadowRadius: 20,
                  elevation: 4,
                }}
              >
                {/* Decorative circles */}
                <View
                  className="absolute rounded-full"
                  style={{
                    top: -30, right: -30,
                    width: 90, height: 90,
                    backgroundColor: 'rgba(255,255,255,0.07)',
                  }}
                />
                <View
                  className="absolute rounded-full"
                  style={{
                    bottom: -20, left: 20,
                    width: 60, height: 60,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                />

                <Text
                  className="text-[10px] font-bold mb-[4px]"
                  style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 0.06 * 10 }}
                >
                  MBTI
                </Text>
                <Text
                  className="text-[30px] font-extrabold text-white mb-[2px]"
                  style={{ letterSpacing: -0.04 * 30 }}
                >
                  {profile.mbti}
                </Text>
                <Text className="text-[12px] font-sans" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {profile.mbtiDesc}
                </Text>

                <Text
                  className="absolute"
                  style={{ right: 18, top: '50%', fontSize: 36, marginTop: -20 }}
                >
                  {profile.mbtiEmoji}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 이상형 ── */}
        <View className="mx-[18px] mb-[12px]">
          <SectionHeader label="이상형" onEdit={() => {}} />
          <View className="bg-ef-surface rounded-[18px] p-[16px]" style={cardShadow}>
            {/* Priority chips */}
            <Text className="text-[11px] font-bold text-ef-text-muted mb-[8px]" style={{ letterSpacing: 0.03 * 11 }}>
              가장 중요한 포인트
            </Text>
            <View className="flex-row flex-wrap gap-[6px] mb-[16px]">
              {profile.idealPriority.map(p => <Chip key={p} label={p} color="purple" />)}
            </View>

            {/* Ideal rows */}
            <View>
              {profile.idealItems.map((item, i) => (
                <View
                  key={item.key}
                  className="flex-row items-center gap-[10px] py-[12px]"
                  style={i < profile.idealItems.length - 1 ? { borderBottomWidth: 1, borderBottomColor: COLORS.divider } : { paddingBottom: 0 }}
                >
                  <View
                    className="w-[32px] h-[32px] rounded-[9px] items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <Text style={{ fontSize: 15 }}>{item.icon}</Text>
                  </View>
                  <Text className="flex-1 text-[12.5px] font-bold text-ef-text-sub">{item.key}</Text>
                  <Text className="text-[12.5px] font-extrabold text-ef-text">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 나에 대해 ── */}
        <View className="mx-[18px] mb-[12px]">
          <SectionHeader label="나에 대해" onEdit={() => {}} />
          <View className="bg-ef-surface rounded-[18px] px-[16px] py-[15px]" style={cardShadow}>
            <Text
              className="text-[13.5px] font-sans text-ef-text"
              style={{ lineHeight: 24, letterSpacing: -0.01 * 13 }}
            >
              {profile.bio}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
