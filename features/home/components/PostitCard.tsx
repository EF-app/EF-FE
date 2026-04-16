/**
 * @file features/home/components/PostitCard.tsx
 * @description 포스트잇 한 장 — 살짝 기울어진 스티키 노트 카드
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useLikePostit } from '@home/hooks/useHome';
import type { PostitPreview } from '@home/types';

interface Props {
  item: PostitPreview;
  onReplyPress?: (id: string) => void;
}

interface ToneStyle {
  background: string;
  tilt: string;
  stickyOpacity: number;
}

const TONES: Record<PostitPreview['tone'], ToneStyle> = {
  p1: { background: '#EEE9F6', tilt: '-1.5deg', stickyOpacity: 0.28 },
  p2: { background: '#E4DEF2', tilt: '1.2deg',  stickyOpacity: 0.32 },
  p3: { background: '#F6F3FB', tilt: '-0.8deg', stickyOpacity: 0.22 },
  p4: { background: '#E8E0EF', tilt: '1.4deg',  stickyOpacity: 0.34 },
  p5: { background: '#F2EDF6', tilt: '-1deg',   stickyOpacity: 0.24 },
};

const PostitCard: React.FC<Props> = ({ item, onReplyPress }) => {
  const { mutate: toggleLike } = useLikePostit();
  const tone = TONES[item.tone];

  const handleLike = useCallback(() => {
    toggleLike({ id: item.id, isLiked: item.isLiked });
  }, [item.id, item.isLiked, toggleLike]);

  return (
    <View
      style={{
        width: 155,
        minHeight: 190,
        backgroundColor: tone.background,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.primaryBorder,
        transform: [{ rotate: tone.tilt }],
        shadowColor: COLORS.primary,
        shadowOffset: { width: 2, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 3,
      }}
    >
      <View
        style={{
          height: 8,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          backgroundColor: `rgba(150,134,191,${tone.stickyOpacity})`,
        }}
      />

      <View style={{ flex: 1, padding: 12 }}>
        <View className="flex-row items-center gap-[6px] mb-[7px]">
          <View
            className="w-[22px] h-[22px] rounded-full items-center justify-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
          >
            <Text className="text-[11px]">{item.avatar}</Text>
          </View>
          <View className="flex-1">
            <Text
              className="text-[10.5px] text-ef-primary-deep font-extrabold"
              numberOfLines={1}
              style={{ letterSpacing: -0.2 }}
            >
              {item.nickname}
            </Text>
            <Text className="text-[9px] text-ef-text-sub font-sans mt-[1px]">
              {item.timeAgo}
            </Text>
          </View>
        </View>

        <Text
          className="text-[12px] text-ef-text font-sans mb-2"
          style={{ lineHeight: 20, letterSpacing: -0.1 }}
          numberOfLines={3}
        >
          {item.message}
        </Text>

        <View className="flex-1" />

        <View
          className="flex-row items-center justify-between pt-[7px]"
          style={{
            borderTopWidth: 1,
            borderTopColor: COLORS.primaryBorder,
            borderStyle: 'dashed',
          }}
        >
          <TouchableOpacity
            className="flex-row items-center gap-[4px] px-1 py-[2px]"
            onPress={handleLike}
            hitSlop={6}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={11}
              color={item.isLiked ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              className="text-[10px] font-bold"
              style={{
                color: item.isLiked ? COLORS.primary : COLORS.textSecondary,
              }}
            >
              {item.likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[24px] h-[24px] rounded-full items-center justify-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
            hitSlop={6}
            activeOpacity={0.7}
            onPress={() => onReplyPress?.(item.id)}
          >
            <Ionicons
              name="chatbubble-outline"
              size={10}
              color={COLORS.primaryDeep}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostitCard;
