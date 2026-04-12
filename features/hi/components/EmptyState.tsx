/**
 * @file features/hi/components/EmptyState.tsx
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';

interface Props {
  onRefresh: () => void;
}

const EmptyState: React.FC<Props> = ({ onRefresh }) => (
  <View className="flex-1 items-center justify-center px-6 gap-[0px]">
    <Text style={{ fontSize: 52, marginBottom: 18 }}>🌿</Text>
    <Text
      className="text-[18px] font-extrabold text-ef-text mb-[8px]"
      style={{ letterSpacing: -0.5 }}
    >
      오늘 매칭이 모두 끝났어요
    </Text>
    <Text
      className="text-[13px] font-sans text-ef-text-muted text-center mb-[24px]"
      style={{ lineHeight: 22 }}
    >
      새로고침하면 패스하지 않은{'\n'}프로필을 다시 볼 수 있어요
    </Text>
    <TouchableOpacity
      className="rounded-[16px] px-[28px] py-[13px]"
      style={{
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.36,
        shadowRadius: 22,
        elevation: 8,
      }}
      activeOpacity={0.85}
      onPress={onRefresh}
    >
      <Text className="text-[14px] font-extrabold text-white" style={{ letterSpacing: -0.3 }}>
        다시 보기
      </Text>
    </TouchableOpacity>
  </View>
);

export default EmptyState;
