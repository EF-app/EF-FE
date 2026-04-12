/**
 * @file features/onboarding/components/SLabel.tsx
 * @description 섹션 레이블 컴포넌트 (왼쪽 보라 점 + 텍스트)
 */

import React from 'react';
import { View, Text } from 'react-native';

interface SLabelProps {
  label: string;
}

const SLabel: React.FC<SLabelProps> = ({ label }) => (
  <View className="flex-row items-center gap-[6px] mb-[10px] mt-[6px]">
    <View className="w-[5px] h-[5px] rounded-[2.5px] bg-ef-primary" />
    <Text className="text-[12px] text-ef-primary font-extrabold" style={{ letterSpacing: 0.3 }}>
      {label}
    </Text>
  </View>
);

export default SLabel;
