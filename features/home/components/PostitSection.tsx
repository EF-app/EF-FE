/**
 * @file features/home/components/PostitSection.tsx
 * @description 포스트잇 섹션 — 헤더, 안내, 가로 스크롤 보드, 쓰기 버튼
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import type { PostitPreview } from '@home/types';
import PostitCard from './PostitCard';
import PostitIntro from './PostitIntro';

interface Props {
  items: PostitPreview[];
  onViewAllPress?: () => void;
  onWritePress?: () => void;
  onReplyPress?: (id: string) => void;
}

const PostitSection: React.FC<Props> = ({
  items,
  onViewAllPress,
  onWritePress,
  onReplyPress,
}) => (
  <View>
    {/* Header */}
    <View className="flex-row items-center justify-between px-6 pb-3">
      <View className="flex-row items-center gap-[8px]">
        <View
          className="w-[26px] h-[26px] rounded-[9px] bg-ef-surface items-center justify-center"
          style={{ borderWidth: 1.5, borderColor: COLORS.primaryBorder }}
        >
          <Text style={{ fontSize: 14 }}>📌</Text>
        </View>
        <Text
          className="text-[16px] text-ef-text font-extrabold"
          style={{ letterSpacing: -0.4 }}
        >
          포스트잇
        </Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center gap-[3px] rounded-full bg-ef-surface"
        style={{
          borderWidth: 1.5,
          borderColor: COLORS.primaryBorder,
          paddingHorizontal: 12,
          paddingVertical: 5,
        }}
        activeOpacity={0.75}
        onPress={onViewAllPress}
      >
        <Text className="text-[11.5px] text-ef-text-sub font-bold">
          전체보기
        </Text>
        <Ionicons name="chevron-forward" size={10} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>

    {/* Intro */}
    <PostitIntro />

    {/* Board (horizontal scroll) */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 22,
        paddingVertical: 14,
        gap: 14,
        alignItems: 'flex-start',
      }}
    >
      {items.map((item) => (
        <PostitCard key={item.id} item={item} onReplyPress={onReplyPress} />
      ))}
    </ScrollView>

    {/* Write button */}
    <TouchableOpacity
      className="flex-row items-center justify-center gap-2 mx-[18px] rounded-[18px] py-[14px] mt-1"
      activeOpacity={0.88}
      onPress={onWritePress}
      style={{
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primaryDeep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
      }}
    >
      <Ionicons name="add" size={16} color="#fff" />
      <Text
        className="text-[13px] text-white font-extrabold"
        style={{ letterSpacing: -0.3 }}
      >
        포스트잇 붙이기
      </Text>
    </TouchableOpacity>
  </View>
);

export default PostitSection;
