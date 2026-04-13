/**
 * @file features/home/post-it/components/PostItCard.tsx
 * @description 종이비행기 우체통 개별 카드 컴포넌트
 */

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useLikePostIt } from '@home/post-it/hooks/usePostIt';
import type { PostIt } from '@home/post-it/types';

interface PostItCardProps {
  item: PostIt;
  onChatPress?: (id: string) => void;
}

const PostItCard: React.FC<PostItCardProps> = ({ item, onChatPress }) => {
  const { mutate: toggleLike } = useLikePostIt();

  const handleLike = useCallback(() => {
    toggleLike({ id: item.id, isLiked: item.isLiked });
  }, [item.id, item.isLiked, toggleLike]);

  return (
    <View
      className="w-[200px] bg-ef-surface rounded-[18px] p-4 mr-3"
      style={Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        android: { elevation: 3 },
      })}
    >
      {/* avatar + meta */}
      <View className="flex-row items-center gap-[10px] mb-3">
        <View
          className="w-[36px] h-[36px] rounded-full items-center justify-center"
          style={{ backgroundColor: item.avatarColor + '33' }}
        >
          <Text className="text-[18px]">{item.avatarEmoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[12px] text-ef-text font-extrabold" numberOfLines={1}>
            {item.nickname}
          </Text>
          <Text className="text-[10px] text-ef-text-muted font-sans">{item.timeAgo}</Text>
        </View>
      </View>

      {/* message */}
      <Text
        className="text-[12px] text-ef-text-sub font-sans leading-[18px] flex-1 mb-4"
        numberOfLines={3}
      >
        {item.message}
      </Text>

      {/* actions */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          className="flex-row items-center gap-[4px]"
          onPress={handleLike}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text className="text-[13px]">{item.isLiked ? '♥' : '♡'}</Text>
          <Text
            className="text-[11px] font-bold"
            style={{ color: item.isLiked ? COLORS.danger : COLORS.textMuted }}
          >
            {item.likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-[4px] bg-ef-primary-tint border border-ef-primary-border rounded-[12px] px-3 py-[5px]"
          onPress={() => onChatPress?.(item.id)}
          activeOpacity={0.75}
        >
          <Text className="text-[10px]">📝</Text>
          <Text className="text-[10px] text-ef-primary font-extrabold">답장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItCard;
