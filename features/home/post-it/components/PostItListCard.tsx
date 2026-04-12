/**
 * @file features/home/post-it/components/PostItListCard.tsx
 * @description 종이비행기 우체통 목록용 전체너비 카드
 */

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useLikePostIt } from '@home/post-it/hooks/usePostIt';
import type { PostIt } from '@home/post-it/types';

interface Props {
  item: PostIt;
  onReplyPress: (id: string) => void;
}

const PostItListCard: React.FC<Props> = ({ item, onReplyPress }) => {
  const { mutate: toggleLike } = useLikePostIt();

  const handleLike = useCallback(() => {
    toggleLike({ id: item.id, isLiked: item.isLiked });
  }, [item.id, item.isLiked, toggleLike]);

  return (
    <View
      className="mx-4 mb-3 bg-ef-surface rounded-[18px] p-[16px]"
      style={Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.09,
          shadowRadius: 12,
        },
        android: { elevation: 3 },
      })}
    >
      {/* 헤더 */}
      <View className="flex-row items-center gap-[10px] mb-[10px]">
        <View
          className="w-[40px] h-[40px] rounded-full items-center justify-center"
          style={{ backgroundColor: item.avatarColor + '33' }}
        >
          <Text style={{ fontSize: 20 }}>{item.avatarEmoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[13px] text-ef-text font-extrabold" numberOfLines={1}>
            {item.isAnonymous ? '익명' : item.nickname}
          </Text>
          <Text className="text-[10px] text-ef-text-muted font-sans">{item.timeAgo}</Text>
        </View>
        {item.isAnonymous && (
          <View className="rounded-[8px] px-[7px] py-[2px]" style={{ backgroundColor: COLORS.surface2 }}>
            <Text className="text-[9px] font-bold text-ef-text-muted">익명</Text>
          </View>
        )}
      </View>

      {/* 내용 */}
      <Text
        className="text-[13px] text-ef-text-sub font-sans mb-[14px]"
        style={{ lineHeight: 20 }}
        numberOfLines={4}
      >
        {item.message}
      </Text>

      {/* 하단 액션 */}
      <View className="flex-row items-center justify-between pt-[12px] border-t border-ef-divider">
        <TouchableOpacity
          className="flex-row items-center gap-[5px]"
          onPress={handleLike}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={16}
            color={item.isLiked ? COLORS.danger : COLORS.textMuted}
          />
          <Text
            className="text-[12px] font-bold"
            style={{ color: item.isLiked ? COLORS.danger : COLORS.textMuted }}
          >
            {item.likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-[5px] rounded-[14px] px-[14px] py-[7px]"
          style={{ backgroundColor: COLORS.primaryTint, borderWidth: 1, borderColor: COLORS.primaryBorder }}
          onPress={() => onReplyPress(item.id)}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 11 }}>✈</Text>
          <Text className="text-[11px] font-extrabold" style={{ color: COLORS.primary }}>답장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItListCard;
