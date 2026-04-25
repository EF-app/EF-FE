/**
 * @file app/(tabs)/my/history/likes-sent.tsx
 * @description 내가 누른 좋아요 — origin/I_like.html 변환
 */

import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ScreenTopBar from '@/common/components/ScreenTopBar';
import LikeRequestCard from '@/features/likes/components/LikeRequestCard';
import SuperLikeCard from '@/features/likes/components/SuperLikeCard';
import {
  useCancelSentLike,
  useSentLikes,
} from '@/features/likes/hooks/useLikes';

type Filter = 'all' | 'recent' | 'near' | 'high';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',    label: '전체' },
  { key: 'recent', label: '🆕 최근' },
  { key: 'near',   label: '📍 가까운' },
  { key: 'high',   label: '✨ 높은매칭' },
];

export default function LikesSentScreen() {
  const { data = [] } = useSentLikes();
  const cancelMut = useCancelSentLike();
  const [filter, setFilter] = useState<Filter>('all');

  const supers = useMemo(() => data.filter(d => d.isSuper), [data]);
  const regular = useMemo(() => data.filter(d => !d.isSuper), [data]);

  const filteredRegular = useMemo(() => {
    let arr = [...regular];
    if (filter === 'recent') arr = arr.slice(0, 4);
    if (filter === 'near')
      arr = arr.filter(r => ['강남구', '서초구'].includes(r.toUser?.region ?? ''));
    if (filter === 'high')
      arr = arr.filter(r => (r.toUser?.matchScore ?? 0) >= 60);
    return arr;
  }, [regular, filter]);

  const total = data.length;

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScreenTopBar
        title="내가 좋아요"
        count={`총 ${total}명`}
        rightSlot={
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.primaryTint }}
          >
            <Ionicons name="options-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      {/* filters */}
      <View style={{ flexShrink: 0 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            gap: 6,
            alignItems: 'center',
          }}
        >
          {FILTERS.map(f => {
            const on = f.key === filter;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.85}
                onPress={() => setFilter(f.key)}
                style={{
                  flexShrink: 0,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: on ? COLORS.primary : COLORS.surface,
                  borderWidth: 1.5,
                  borderColor: on ? COLORS.primary : COLORS.divider,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: on ? '#fff' : COLORS.textSecondary,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* banner */}
        <View
          className="bg-ef-surface rounded-[16px] flex-row items-center mb-[14px]"
          style={{
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 12,
            borderWidth: 1,
            borderColor: 'rgba(150,134,191,0.12)',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <View
            className="w-[38px] h-[38px] rounded-[12px] items-center justify-center"
            style={{ backgroundColor: COLORS.primaryTint }}
          >
            <Ionicons name="paper-plane" size={18} color={COLORS.primary} />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] font-extrabold text-ef-text"
              style={{ letterSpacing: -0.2 }}
            >
              내가 보낸 좋아요{' '}
              <Text style={{ color: COLORS.primaryDeep }}>{total}명</Text>
            </Text>
            <Text className="text-[11px] text-ef-text-muted">
              오늘 {Math.min(2, total)}명 · 이번주 {total}명
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
        </View>

        {/* supers */}
        {supers.length > 0 && (
          <View className="mb-[18px]">
            <View className="flex-row items-center justify-between mb-[10px] px-[4px]">
              <View className="flex-row items-center gap-[7px]">
                <View
                  className="rounded-full flex-row items-center"
                  style={{
                    backgroundColor: 'rgba(150,134,191,0.14)',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    gap: 4,
                  }}
                >
                  <Ionicons name="star" size={10} color={COLORS.primaryDeep} />
                  <Text
                    className="text-[11px] font-extrabold"
                    style={{ color: COLORS.primaryDeep }}
                  >
                    보낸 슈퍼 좋아요
                  </Text>
                </View>
                <Text className="text-[12px] font-extrabold text-ef-text">
                  {supers.length}명
                </Text>
              </View>
              <Text className="text-[10.5px] font-bold text-ef-text-muted">
                답장을 기다리는 중
              </Text>
            </View>
            {supers.map(s => (
              <SuperLikeCard
                key={s.requestId}
                request={s}
                variant="sent"
                onCancel={id => cancelMut.mutate(id)}
              />
            ))}
          </View>
        )}

        {/* regular list */}
        <Text
          className="text-[11px] font-extrabold text-ef-text-muted px-[4px] py-[10px]"
          style={{ letterSpacing: 0.6 }}
        >
          보낸 좋아요
        </Text>

        {filteredRegular.length === 0 ? (
          <View className="items-center py-[48px] gap-[10px]">
            <Text style={{ fontSize: 44 }}>🔍</Text>
            <Text className="text-[16px] font-extrabold text-ef-text">
              해당 조건의 매칭이 없어요
            </Text>
            <Text className="text-[13px] text-ef-text-muted">
              필터를 바꿔보세요
            </Text>
          </View>
        ) : (
          filteredRegular.map(r => (
            <LikeRequestCard
              key={r.requestId}
              request={r}
              variant="sent"
              onCancel={id => cancelMut.mutate(id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
