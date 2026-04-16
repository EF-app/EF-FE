/**
 * @file features/home/components/PostitIntro.tsx
 * @description 포스트잇 섹션 안내 카드
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

const PostitIntro: React.FC = () => (
  <View
    className="flex-row items-center gap-3 mx-[18px] mb-[14px] rounded-[16px] bg-ef-surface px-4 py-[14px] border-[1.5px] border-ef-primary-border"
    style={{
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    }}
  >
    <View
      className="w-[42px] h-[42px] rounded-[14px] items-center justify-center bg-ef-primary-light"
    >
      <Text style={{ fontSize: 22 }}>📝</Text>
    </View>

    <View className="flex-1">
      <Text
        className="text-[13px] text-ef-text font-extrabold"
        style={{ letterSpacing: -0.2 }}
      >
        포스트잇을 붙여보세요
      </Text>
      <Text className="text-[11.5px] text-ef-text-sub font-sans mt-[3px]">
        마음을 담은 글이 누군가에게 닿아요
      </Text>
    </View>
  </View>
);

export default PostitIntro;
