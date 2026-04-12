/**
 * @file app/(tabs)/my/premium.tsx
 * @description 프리미엄 멤버십 구독 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

type PlanKey = 'month' | 'quarter' | 'year';

const PLANS: Record<PlanKey, {
  label: string;
  price: string;
  was: string | null;
  save: string | null;
  cta: string;
  savePill: string | null;
}> = {
  month:   { label: '월간',  price: '14,900', was: null,           save: null,                       cta: '월 14,900원',    savePill: null },
  quarter: { label: '3개월', price: '11,900', was: '월 14,900원',  save: '3개월 구독 시 9,000원 절약', cta: '3개월 35,700원', savePill: '20%↓' },
  year:    { label: '연간',  price: '8,900',  was: '월 14,900원',  save: '연간 구독 시 72,000원 절약', cta: '연간 106,800원', savePill: '40%↓' },
};

const BENEFITS = [
  {
    icon: 'people-outline' as const,
    name: '하루 최대 30명과 매칭 연결',
    desc: '매일 새로운 인연을 만날 기회를 드려요',
    tag: '인기', tagStyle: 'hot' as const,
  },
  {
    icon: 'search-outline' as const,
    name: '나이·거리 키워드 필터 검색',
    desc: '원하는 조건에 맞는 상대를 빠르게 찾아요',
    tag: 'NEW', tagStyle: 'new' as const,
  },
  {
    icon: 'star-outline' as const,
    name: '내 키워드 프로필에 선공개',
    desc: '먼저 어필하면 매칭 성사율이 3배 높아요',
    tag: '전용', tagStyle: 'only' as const,
  },
  {
    icon: 'chatbubble-outline' as const,
    name: '받은 채팅 답변 개수 제한 없음',
    desc: '무제한 대화로 깊은 인연을 만들어 보세요',
    tag: null, tagStyle: null,
  },
  {
    icon: 'grid-outline' as const,
    name: '프리미엄 전용 라운지 입장 가능',
    desc: '검증된 멤버끼리 모이는 프라이빗 공간',
    tag: '전용', tagStyle: 'only' as const,
  },
] as const;

const TAG_STYLES = {
  hot:  { bg: 'rgba(191,150,150,0.15)', color: '#9a5454' },
  new:  { bg: 'rgba(139,191,168,0.14)', color: '#4a9477' },
  only: { bg: COLORS.primaryTint,       color: COLORS.primaryMid },
};

export default function PremiumScreen() {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanKey>('month');
  const current = PLANS[plan];

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── 페이지 헤더 ── */}
        <View className="flex-row items-center justify-between px-[22px] pt-[8px] pb-[4px]">
          <TouchableOpacity
            className="w-[36px] h-[36px] rounded-full items-center justify-center"
            style={{
              backgroundColor: COLORS.primaryTint,
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <Text className="text-[16px] font-extrabold text-ef-text" style={{ letterSpacing: -0.02 * 16 }}>
            녹<Text style={{ color: COLORS.primary }}>차</Text>
          </Text>

          <TouchableOpacity
            className="w-[36px] h-[36px] rounded-full items-center justify-center"
            style={{
              backgroundColor: COLORS.primaryTint,
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ── 타이틀 블록 ── */}
        <View className="items-center px-[22px] pt-[22px] pb-[24px]">
          <View
            className="flex-row items-center gap-[5px] rounded-[20px] px-[14px] py-[5px] mb-[16px]"
            style={{
              backgroundColor: COLORS.primaryTint,
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
          >
            <Text className="text-[10px] font-extrabold" style={{ color: COLORS.primaryMid, letterSpacing: 1 }}>
              ✦  PREMIUM
            </Text>
          </View>

          <Text
            className="text-[28px] font-extrabold text-ef-text text-center mb-[10px]"
            style={{ letterSpacing: -0.04 * 28, lineHeight: 34 }}
          >
            프리미엄으로{'\n'}
            <Text style={{ color: COLORS.primary }}>더 넓은 세계로</Text>
          </Text>

          <Text className="text-[13px] font-sans text-ef-text-sub text-center" style={{ lineHeight: 23 }}>
            지금 이 순간, 당신을 기다리는{'\n'}
            <Text className="font-bold" style={{ color: COLORS.primaryMid }}>특별한 인연</Text>
            이 있어요. 먼저 손 내밀어 보세요.
          </Text>
        </View>

        {/* ── 스탯 행 ── */}
        <View
          className="flex-row mx-[20px] mb-[20px] rounded-[18px] overflow-hidden bg-ef-surface"
          style={{
            borderWidth: 1,
            borderColor: COLORS.primaryBorder,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          {[
            { num: '30', sup: '명',  label: '일일 매칭' },
            { num: '무', sup: '제한', label: '키워드 필터' },
            { num: '1',  sup: '위',  label: '프로필 노출' },
          ].map((stat, i) => (
            <View
              key={stat.label}
              className="flex-1 items-center gap-[3px] py-[14px] px-[8px]"
              style={i > 0 ? { borderLeftWidth: 1, borderLeftColor: COLORS.divider } : undefined}
            >
              <Text
                className="text-[18px] font-extrabold"
                style={{ color: COLORS.primaryMid, letterSpacing: -0.03 * 18 }}
              >
                {stat.num}
                <Text style={{ fontSize: 11, fontWeight: '700' }}>{stat.sup}</Text>
              </Text>
              <Text className="text-[10px] font-sans text-ef-text-muted">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── 혜택 섹션 ── */}
        <View className="px-[20px]">
          {/* Section label */}
          <View className="flex-row items-center gap-[6px] mb-[12px]">
            <Text
              className="text-[11px] font-extrabold"
              style={{ color: COLORS.primary, letterSpacing: 0.06 * 11 }}
            >
              프리미엄 혜택
            </Text>
            <View className="flex-1 h-[1px]" style={{ backgroundColor: COLORS.primaryBorder }} />
          </View>

          {/* Benefits card */}
          <View
            className="bg-ef-surface rounded-[20px] overflow-hidden mb-[14px]"
            style={{
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.28,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            {/* Top accent line */}
            <View
              className="h-[3px]"
              style={{ backgroundColor: COLORS.primaryDeep }}
            />
            <View className="p-[20px]">
              {BENEFITS.map((b, i) => (
                <View
                  key={b.name}
                  className="flex-row items-center gap-[13px] py-[12px]"
                  style={i < BENEFITS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: COLORS.divider } : { paddingBottom: 0 }}
                >
                  <View
                    className="w-[34px] h-[34px] rounded-[11px] items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: COLORS.primaryTint }}
                  >
                    <Ionicons name={b.icon} size={17} color={COLORS.primary} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-[13px] font-extrabold text-ef-text mb-[2px]"
                      style={{ letterSpacing: -0.02 * 13 }}
                    >
                      {b.name}
                    </Text>
                    <Text className="text-[11px] font-sans text-ef-text-muted" style={{ lineHeight: 17 }}>
                      {b.desc}
                    </Text>
                  </View>
                  {b.tag && b.tagStyle && (
                    <View
                      className="rounded-[8px] px-[9px] py-[3px] flex-shrink-0"
                      style={{ backgroundColor: TAG_STYLES[b.tagStyle].bg }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{ color: TAG_STYLES[b.tagStyle].color }}
                      >
                        {b.tag}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* ── 요금제 섹션 ── */}
          <View className="flex-row items-center gap-[6px] mb-[12px]">
            <Text
              className="text-[11px] font-extrabold"
              style={{ color: COLORS.primary, letterSpacing: 0.06 * 11 }}
            >
              요금제 선택
            </Text>
            <View className="flex-1 h-[1px]" style={{ backgroundColor: COLORS.primaryBorder }} />
          </View>

          <View
            className="bg-ef-surface rounded-[20px] overflow-hidden mb-[14px]"
            style={{
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.28,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            <View className="h-[3px]" style={{ backgroundColor: COLORS.primaryDeep }} />
            <View className="p-[20px]">
              {/* Plan toggle */}
              <View
                className="flex-row gap-[4px] rounded-[14px] p-[4px] mb-[18px]"
                style={{
                  backgroundColor: COLORS.bg,
                  borderWidth: 1,
                  borderColor: COLORS.divider,
                }}
              >
                {(Object.keys(PLANS) as PlanKey[]).map(key => (
                  <TouchableOpacity
                    key={key}
                    className="flex-1 items-center py-[9px] rounded-[10px]"
                    style={{
                      backgroundColor: plan === key ? COLORS.primary : 'transparent',
                      shadowColor: plan === key ? COLORS.primary : 'transparent',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: plan === key ? 0.28 : 0,
                      shadowRadius: 14,
                      elevation: plan === key ? 4 : 0,
                    }}
                    onPress={() => setPlan(key)}
                    activeOpacity={0.8}
                  >
                    <Text
                      className="text-[12px] font-bold"
                      style={{ color: plan === key ? '#fff' : COLORS.textMuted }}
                    >
                      {PLANS[key].label}
                    </Text>
                    {PLANS[key].savePill && (
                      <View
                        className="absolute top-[-9px] right-[-2px] rounded-[8px] px-[6px] py-[2px]"
                        style={{ backgroundColor: COLORS.amber }}
                      >
                        <Text className="text-[9px] font-extrabold text-white">{PLANS[key].savePill}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price */}
              <View className="flex-row items-end gap-[6px] mb-[4px]">
                <Text
                  className="text-[38px] font-extrabold text-ef-text"
                  style={{ letterSpacing: -0.045 * 38, lineHeight: 44 }}
                >
                  {current.price}
                </Text>
                <Text
                  className="text-[13px] font-bold text-ef-text-sub mb-[5px]"
                >
                  원 / 월
                </Text>
              </View>

              {current.was && (
                <Text
                  className="text-[13px] font-sans text-ef-text-muted mb-[8px]"
                  style={{ textDecorationLine: 'line-through' }}
                >
                  {current.was}
                </Text>
              )}

              {current.save && (
                <View
                  className="self-start flex-row items-center gap-[4px] rounded-[10px] px-[11px] py-[4px] mb-[14px]"
                  style={{
                    backgroundColor: 'rgba(196,136,90,0.12)',
                    borderWidth: 1,
                    borderColor: 'rgba(196,136,90,0.25)',
                  }}
                >
                  <Ionicons name="star" size={11} color={COLORS.amber} />
                  <Text className="text-[11px] font-extrabold" style={{ color: COLORS.amber }}>
                    {current.save}
                  </Text>
                </View>
              )}

              <Text className="text-[11px] font-sans text-ef-text-muted" style={{ lineHeight: 19 }}>
                <Text className="font-bold text-ef-text-sub">첫 달 무료</Text> · 언제든 해지 가능 · 자동 갱신
              </Text>
            </View>
          </View>

          {/* ── 후기 섹션 ── */}
          <View className="flex-row items-center gap-[6px] mb-[12px]">
            <Text
              className="text-[11px] font-extrabold"
              style={{ color: COLORS.primary, letterSpacing: 0.06 * 11 }}
            >
              실제 후기
            </Text>
            <View className="flex-1 h-[1px]" style={{ backgroundColor: COLORS.primaryBorder }} />
          </View>

          <View
            className="flex-row gap-[13px] items-start bg-ef-surface rounded-[18px] px-[18px] py-[16px] mb-[14px]"
            style={{
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.28,
              shadowRadius: 18,
              elevation: 4,
            }}
          >
            <View
              className="w-[40px] h-[40px] rounded-full items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: COLORS.primary,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.28,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <Text className="text-[14px] font-extrabold text-white">김</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[12px] font-extrabold text-ef-text mb-[2px]">김민준 · 28세 · 서울</Text>
              <Text className="text-[11px] mb-[5px]" style={{ color: COLORS.amber }}>★★★★★</Text>
              <Text className="text-[12px] font-sans text-ef-text-sub" style={{ lineHeight: 20 }}>
                "프리미엄 쓰고 나서 진짜 달라졌어요. 필터 덕분에 딱 맞는 사람 바로 찾고 한 달 만에 소개팅 성사됐어요 😊"
              </Text>
            </View>
          </View>
        </View>

        {/* ── CTA ── */}
        <View className="px-[20px] pt-[4px]">
          <View
            className="self-start flex-row items-center gap-[5px] rounded-[20px] px-[16px] py-[6px] mb-[12px]"
            style={{
              backgroundColor: COLORS.primaryTint,
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
          >
            <Text className="text-[12px] font-extrabold" style={{ color: COLORS.primaryMid }}>
              🪄 첫 달 무료 체험
            </Text>
          </View>

          <TouchableOpacity
            className="w-full flex-row items-center justify-center gap-[8px] rounded-[16px] py-[16px] mb-[12px]"
            style={{
              backgroundColor: COLORS.primaryDeep,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 28,
              elevation: 8,
            }}
            activeOpacity={0.88}
          >
            <Ionicons name="star" size={17} color="#fff" />
            <Text className="text-[15px] font-extrabold text-white" style={{ letterSpacing: -0.02 * 15 }}>
              지금 시작하기
            </Text>
          </TouchableOpacity>

          <Text
            className="text-center text-[11px] font-sans text-ef-text-muted mb-[8px]"
            style={{ lineHeight: 19 }}
          >
            첫 달 무료 후 {current.cta} 자동 청구돼요.{'\n'}
            <Text style={{ color: COLORS.primary }}>구독 취소</Text> 및{' '}
            <Text style={{ color: COLORS.primary }}>환불 정책</Text>은 언제든지 확인 가능해요.
          </Text>

          <View className="flex-row justify-center gap-[18px] py-[6px] pb-[12px]">
            {['이용약관', '개인정보처리방침', '구독 안내'].map(link => (
              <TouchableOpacity key={link} activeOpacity={0.7}>
                <Text
                  className="text-[10px] font-sans text-ef-text-muted"
                  style={{ textDecorationLine: 'underline' }}
                >
                  {link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
