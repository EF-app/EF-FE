/**
 * @file common/components/ScreenTopBar.tsx
 * @description 뒤로가기 + 가운데 타이틀(+선택적 카운트) + 우측 슬롯
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface Props {
  title: string;
  count?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

const ScreenTopBar: React.FC<Props> = ({ title, count, onBack, rightSlot }) => {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <View className="flex-row items-center justify-between px-[20px] pt-[12px] pb-[6px]">
      <TouchableOpacity
        className="w-[36px] h-[36px] rounded-full items-center justify-center"
        style={{ backgroundColor: COLORS.divider }}
        activeOpacity={0.85}
        onPress={handleBack}
      >
        <Ionicons name="chevron-back" size={18} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <View className="items-center">
        <Text
          className="text-[16px] font-extrabold text-ef-text"
          style={{ letterSpacing: -0.5 }}
        >
          {title}
        </Text>
        {!!count && (
          <Text className="text-[11px] font-bold text-ef-text-muted mt-[1px]">
            {count}
          </Text>
        )}
      </View>

      <View className="w-[36px] items-end">{rightSlot}</View>
    </View>
  );
};

export default ScreenTopBar;
