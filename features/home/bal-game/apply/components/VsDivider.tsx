/**
 * @file features/home/bal-game/apply/components/VsDivider.tsx
 * @description A / B 사이의 VS 구분선
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

const VsDivider: React.FC = () => (
  <View className="flex-row items-center gap-[10px] my-1">
    <View className="flex-1 h-px bg-ef-divider" />
    <View
      className="rounded-[8px] px-[10px] py-1"
      style={{ backgroundColor: 'rgba(150,134,191,0.10)' }}
    >
      <Text
        className="text-[13px] font-extrabold"
        style={{ color: COLORS.primary, letterSpacing: -0.5 }}
      >
        VS
      </Text>
    </View>
    <View className="flex-1 h-px bg-ef-divider" />
  </View>
);

export default VsDivider;
