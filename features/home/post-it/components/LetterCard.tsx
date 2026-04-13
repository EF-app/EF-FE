/**
 * @file features/home/post-it/components/LetterCard.tsx
 * @description 포스트잇 메모 카드 — 보드에 붙은 포스트잇 스타일
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import type { Letter } from '@home/post-it/types';

/* ── 포스트잇 색상 팔레트 (보라 계열 + 포인트) ── */
const NOTE_PALETTE = [
  { bg: '#EDE7F6', tape: 'rgba(179,157,219,0.60)', fold: 'rgba(150,134,191,0.18)' },
  { bg: '#E8E0FF', tape: 'rgba(179,157,219,0.55)', fold: 'rgba(149,117,205,0.18)' },
  { bg: '#F3E5F5', tape: 'rgba(206,147,216,0.50)', fold: 'rgba(171,71,188,0.14)' },
  { bg: '#EEF0FF', tape: 'rgba(197,202,233,0.65)', fold: 'rgba(121,134,203,0.18)' },
  { bg: '#FFF9C4', tape: 'rgba(255,224,59,0.55)',  fold: 'rgba(241,196,15,0.18)'  },
  { bg: '#E8F5F0', tape: 'rgba(128,203,196,0.50)', fold: 'rgba(0,150,136,0.12)'   },
] as const;

const TAG_EMOJI: Record<string, string> = {
  '일상': '✉️', '따뜻해요': '💛', '담백해요': '🌿',
  '감성적이에요': '🌙', '고민이에요': '🤔', '신나요': '🎉', '그냥요': '💜',
};

const SCOPE_LABEL: Record<Letter['scope'], string> = {
  동네: '📍 동네', 서울: '🏙️ 서울', 전국: '🗺️ 전국',
};

interface Props {
  letter: Letter;
  colorIndex: number;
  onLike: (id: number, currentLiked: boolean) => void;
  onReply: (id: number, nick: string) => void;
}

const LetterCard: React.FC<Props> = ({ letter, colorIndex, onLike, onReply }) => {
  const [expanded, setExpanded] = useState(false);
  const note = NOTE_PALETTE[colorIndex % NOTE_PALETTE.length];
  const signNick = letter.anon ? '익명' : letter.nick;
  const isLong = letter.body.length > 80;
  const tagEmoji = TAG_EMOJI[letter.tag] ?? '📝';

  return (
    /* 테이프 공간 확보를 위한 외부 래퍼 */
    <View style={{ paddingTop: 14, marginBottom: 4 }}>

      {/* ── 테이프 ── */}
      <View
        style={{
          position: 'absolute',
          top: 4,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <View
          style={{
            width: 38,
            height: 16,
            borderRadius: 2,
            backgroundColor: note.tape,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 2,
            elevation: 1,
          }}
        />
      </View>

      {/* ── 포스트잇 본체 ── */}
      <View
        style={{
          backgroundColor: note.bg,
          borderRadius: 8,
          paddingHorizontal: 13,
          paddingTop: 14,
          paddingBottom: 12,
          shadowColor: '#6A579A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.13,
          shadowRadius: 10,
          elevation: 4,
          overflow: 'hidden',
        }}
      >
        {/* ── 스탬프 & 시간 ── */}
        <View className="flex-row items-center justify-between mb-[8px]">
          <View
            className="flex-row items-center gap-[4px] rounded-[12px] px-[7px] py-[2px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
          >
            <Text style={{ fontSize: 11 }}>{tagEmoji}</Text>
            <Text
              style={{ fontSize: 10, fontFamily: 'NanumSquareNeocBd', color: COLORS.textSecondary }}
            >
              {letter.tag}
            </Text>
          </View>
          <Text style={{ fontSize: 9.5, color: COLORS.textMuted, fontFamily: 'NanumSquareNeoaLt' }}>
            {letter.time}
          </Text>
        </View>

        {/* ── 제목 ── */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13.5,
            fontFamily: 'NanumSquareneodEb',
            color: COLORS.textPrimary,
            letterSpacing: -0.3,
            lineHeight: 19,
            marginBottom: 6,
          }}
        >
          {letter.title}
        </Text>

        {/* ── 본문 ── */}
        <Text
          numberOfLines={expanded ? undefined : 3}
          style={{
            fontSize: 12,
            fontFamily: 'NanumSquareNeoaLt',
            color: COLORS.textSecondary,
            lineHeight: 19,
          }}
        >
          {letter.body}
        </Text>

        {isLong && (
          <TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.7}>
            <Text
              style={{
                fontSize: 10.5,
                fontFamily: 'NanumSquareNeocBd',
                color: COLORS.primary,
                marginTop: 3,
              }}
            >
              {expanded ? '접기 ↑' : '더보기 ↓'}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── 구분선 ── */}
        <View
          style={{
            height: 1,
            backgroundColor: 'rgba(150,134,191,0.18)',
            marginTop: 10,
            marginBottom: 8,
          }}
        />

        {/* ── 하단: 작성자 + 액션 ── */}
        <View className="flex-row items-center">
          {/* 작성자 */}
          <View className="flex-1">
            <View className="flex-row items-center gap-[4px]">
              <Text style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: 'NanumSquareNeoaLt' }}>
                from.
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'NanumSquareNeocBd',
                  color: COLORS.primaryMid,
                }}
                numberOfLines={1}
              >
                {signNick}
              </Text>
              {!letter.anon && letter.age && (
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>{letter.age}</Text>
              )}
            </View>
            <Text style={{ fontSize: 9.5, color: COLORS.textMuted, fontFamily: 'NanumSquareNeoaLt', marginTop: 1 }}>
              {SCOPE_LABEL[letter.scope]}
            </Text>
          </View>

          {/* 좋아요 */}
          <TouchableOpacity
            className="flex-row items-center gap-[3px] rounded-[14px] px-[8px] py-[4px]"
            style={{ backgroundColor: letter.liked ? 'rgba(150,134,191,0.18)' : 'rgba(255,255,255,0.5)' }}
            onPress={() => onLike(letter.id, letter.liked)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={letter.liked ? 'heart' : 'heart-outline'}
              size={12}
              color={letter.liked ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'NanumSquareNeocBd',
                color: letter.liked ? COLORS.primary : COLORS.textMuted,
              }}
            >
              {letter.likes}
            </Text>
          </TouchableOpacity>

          {/* 답장 */}
          <TouchableOpacity
            className="flex-row items-center gap-[3px] rounded-[14px] px-[8px] py-[4px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)', marginLeft: 4 }}
            onPress={() => onReply(letter.id, signNick)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={12} color={COLORS.textMuted} />
            <Text
              style={{ fontSize: 11, fontFamily: 'NanumSquareNeocBd', color: COLORS.textMuted }}
            >
              {letter.replies}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── 코너 폴드 (우측 하단) ── */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderRightWidth: 20,
            borderTopWidth: 20,
            borderRightColor: 'transparent',
            borderTopColor: note.fold,
          }}
        />
      </View>
    </View>
  );
};

export default LetterCard;
