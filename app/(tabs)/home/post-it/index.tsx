/**
 * @file app/(tabs)/home/post-it/index.tsx
 * @description 우편함 — 동네 편지 목록 화면
 */

import React, { useState, useMemo, useCallback } from 'react';
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
import LetterCard from '@home/post-it/components/LetterCard';
import { useLetters, useLikeLetter } from '@home/post-it/hooks/useLetters';
import type { LetterTag } from '@home/post-it/types';

const FILTER_CHIPS: { label: string; value: LetterTag }[] = [
  { label: '전체',      value: '전체' },
  { label: '✉️ 일상',  value: '일상' },
  { label: '💛 따뜻해요', value: '따뜻해요' },
  { label: '🌿 담백해요', value: '담백해요' },
  { label: '🌙 감성적이에요', value: '감성적이에요' },
  { label: '🤔 고민이에요', value: '고민이에요' },
  { label: '🎉 신나요', value: '신나요' },
  { label: '💜 그냥요', value: '그냥요' },
];

export default function PostItScreen() {
  const router = useRouter();
  const { data: letters, isLoading } = useLetters();
  const likeMutation = useLikeLetter();
  const [activeTag, setActiveTag] = useState<LetterTag>('전체');

  const filtered = useMemo(() => {
    if (!letters) return [];
    if (activeTag === '전체') return letters;
    return letters.filter(l => l.tag === activeTag);
  }, [letters, activeTag]);

  const handleLike = useCallback((id: number, liked: boolean) => {
    likeMutation.mutate({ id, liked });
  }, [likeMutation]);

  const handleReply = useCallback((id: number, nick: string) => {
    // TODO: open reply sheet
    console.log('reply to', id, nick);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 탑 네비 ── */}
      <View
        className="flex-row items-center justify-between px-[20px] py-[12px] border-b border-ef-divider"
      >
        <View className="flex-row items-center gap-[10px]">
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-full items-center justify-center bg-ef-surface-2"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text className="text-[15px] font-extrabold text-ef-text">✉️ 우편함</Text>
            <Text className="text-[10.5px] font-sans text-ef-text-muted mt-[1px]">
              강남구 · {filtered.length}개의 편지
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-[5px] rounded-[20px] px-[14px] py-[7px]"
          style={{ backgroundColor: COLORS.primary }}
          onPress={() => router.push('/(tabs)/home/post-it/write')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={11} color="#fff" />
          <Text className="text-[12px] font-bold text-white">편지 쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* ── 필터 칩 ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 7 }}
        className="border-b border-ef-divider"
        style={{ flexGrow: 0 }}
      >
        {FILTER_CHIPS.map(chip => {
          const active = activeTag === chip.value;
          return (
            <TouchableOpacity
              key={chip.value}
              className="rounded-[20px] px-[13px] py-[5px] flex-shrink-0"
              style={{
                backgroundColor: active ? COLORS.primaryTint : COLORS.surface,
                borderWidth: 1.5,
                borderColor: active ? COLORS.primary : 'transparent',
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.13,
                shadowRadius: 5,
                elevation: 1,
              }}
              onPress={() => setActiveTag(chip.value)}
              activeOpacity={0.75}
            >
              <Text
                className="text-[11.5px] font-bold"
                style={{ color: active ? COLORS.primary : COLORS.textSecondary }}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── 편지 목록 ── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-[10px]">
          <Text style={{ fontSize: 36 }}>✉️</Text>
          <Text className="text-[14px] font-bold text-ef-text-muted">
            편지가 없어요. 첫 편지를 써보세요!
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14, paddingBottom: 100, gap: 14 }}
        >
          {filtered.map(letter => (
            <LetterCard
              key={letter.id}
              letter={letter}
              onLike={handleLike}
              onReply={handleReply}
            />
          ))}
        </ScrollView>
      )}

      {/* ── FAB ── */}
      <View
        className="absolute bottom-[20px] right-[20px]"
        style={{ zIndex: 10 }}
      >
        <TouchableOpacity
          className="w-[48px] h-[48px] rounded-full items-center justify-center"
          style={{
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 20,
            elevation: 8,
          }}
          onPress={() => router.push('/(tabs)/home/post-it/write')}
          activeOpacity={0.85}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
