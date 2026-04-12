/**
 * @file features/home/post-it/components/LetterCard.tsx
 * @description 우편함 편지 카드 (봉투 스타일)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import type { Letter } from '@home/post-it/types';

const SCOPE_LABEL: Record<Letter['scope'], string> = {
  동네: '📍 동네',
  서울: '🏙️ 서울',
  전국: '🗺️ 전국',
};

interface Props {
  letter: Letter;
  onLike: (id: number, currentLiked: boolean) => void;
  onReply: (id: number, nick: string) => void;
}

const LetterCard: React.FC<Props> = ({ letter, onLike, onReply }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = letter.body.length > 90;
  const signNick = letter.anon ? '익명' : letter.nick;

  return (
    <View
      className="bg-ef-surface rounded-[18px]"
      style={{
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.13,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      {/* ── 봉투 헤더 ── */}
      <View
        className="flex-row items-center justify-between px-[14px] py-[10px] rounded-t-[18px]"
        style={{ backgroundColor: 'rgba(150,134,191,0.18)' }}
      >
        <View className="flex-row items-center gap-[9px]">
          {/* Stamp */}
          <View
            className="w-[28px] items-center justify-center"
            style={{
              height: 34,
              backgroundColor: COLORS.surface,
              borderRadius: 3,
              borderWidth: 1.5,
              borderColor: 'rgba(150,134,191,0.28)',
              borderStyle: 'dashed',
            }}
          >
            <Text style={{ fontSize: 14 }}>{letter.stamp}</Text>
          </View>

          <View>
            <View className="flex-row items-center gap-[5px]">
              <Text className="text-[12.5px] font-extrabold text-ef-text">
                {letter.anon ? '익명' : letter.nick}
              </Text>
              {letter.anon ? (
                <View className="rounded-[20px] px-[6px] py-[1px]" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                  <Text className="text-[9px] font-bold text-ef-text-muted">비공개</Text>
                </View>
              ) : letter.age ? (
                <View className="rounded-[20px] px-[6px] py-[1px]" style={{ backgroundColor: 'rgba(150,134,191,0.18)' }}>
                  <Text className="text-[9px] font-bold" style={{ color: COLORS.primary }}>{letter.age}</Text>
                </View>
              ) : null}
            </View>
            <View className="flex-row items-center gap-[2px] mt-[1px]">
              <Ionicons name="location-outline" size={8} color="rgba(150,134,191,0.65)" />
              <Text className="text-[10px] font-sans" style={{ color: 'rgba(150,134,191,0.65)' }}>
                {letter.loc}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-[10px] font-sans" style={{ color: 'rgba(150,134,191,0.6)' }}>
          {letter.time}
        </Text>
      </View>

      {/* ── 본문 ── */}
      <View className="px-[16px] pt-[14px] pb-[10px]">
        <Text
          className="text-[14px] font-extrabold text-ef-text mb-[7px]"
          style={{ letterSpacing: -0.3 }}
        >
          {letter.title}
        </Text>

        <Text
          className="text-[13px] font-sans text-ef-text-sub"
          style={{ lineHeight: 22 }}
          numberOfLines={expanded ? undefined : 3}
        >
          {letter.body}
        </Text>

        {isLong && (
          <TouchableOpacity onPress={() => setExpanded(e => !e)}>
            <Text className="text-[11.5px] font-bold mt-[5px]" style={{ color: COLORS.primary }}>
              {expanded ? '접기 ↑' : '더보기 ↓'}
            </Text>
          </TouchableOpacity>
        )}

        <View className="flex-row items-center gap-[5px] mt-[10px] pb-[4px]">
          <View
            className="flex-row items-center gap-[3px] rounded-[20px] px-[9px] py-[3px]"
            style={{ backgroundColor: COLORS.primaryTint }}
          >
            <Text style={{ fontSize: 11 }}>{letter.stamp}</Text>
            <Text className="text-[10.5px] font-bold" style={{ color: COLORS.primary }}>
              {letter.tag}
            </Text>
          </View>
        </View>
      </View>

      {/* ── 서명 ── */}
      <View
        className="flex-row items-center justify-end gap-[4px] px-[16px] py-[9px]"
        style={{ borderTopWidth: 1, borderTopColor: 'rgba(150,134,191,0.2)', borderStyle: 'dashed' }}
      >
        <Text className="text-[11px] font-sans text-ef-text-muted">from.</Text>
        <Text className="text-[12px] font-extrabold" style={{ color: COLORS.primary }}>{signNick}</Text>
      </View>

      {/* ── 액션바 ── */}
      <View
        className="flex-row items-center px-[14px] pb-[11px] pt-[8px] rounded-b-[18px]"
        style={{ borderTopWidth: 1, borderTopColor: COLORS.divider }}
      >
        {/* Scope pill */}
        <View
          className="rounded-[10px] px-[9px] py-[3px]"
          style={{ backgroundColor: COLORS.surface2 }}
        >
          <Text className="text-[10px] font-bold text-ef-text-muted">
            {SCOPE_LABEL[letter.scope]}
          </Text>
        </View>

        {/* Like + Reply */}
        <View className="flex-row items-center gap-[2px] ml-auto">
          <TouchableOpacity
            className="flex-row items-center gap-[5px] rounded-[20px] px-[9px] py-[5px]"
            style={{ backgroundColor: letter.liked ? COLORS.primaryTint : 'transparent' }}
            onPress={() => onLike(letter.id, letter.liked)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={letter.liked ? 'heart' : 'heart-outline'}
              size={14}
              color={letter.liked ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              className="text-[12px] font-bold"
              style={{ color: letter.liked ? COLORS.primary : COLORS.textMuted }}
            >
              {letter.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center gap-[5px] rounded-[20px] px-[9px] py-[5px]"
            onPress={() => onReply(letter.id, signNick)}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={14} color={COLORS.textMuted} />
            <Text className="text-[12px] font-bold text-ef-text-muted">{letter.replies}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LetterCard;
