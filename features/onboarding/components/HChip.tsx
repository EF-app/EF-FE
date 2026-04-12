/**
 * @file features/onboarding/components/HChip.tsx
 * @description 가로 스크롤 칩 컴포넌트 (단일 선택)
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface HChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const HChip: React.FC<HChipProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    className={`px-[14px] py-2 rounded-[20px] border-[1.5px] ${
      selected
        ? 'bg-ef-primary-tint border-ef-primary'
        : 'bg-ef-surface border-ef-primary-border'
    }`}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text className={`text-[12.5px] font-sans ${selected ? 'text-ef-primary' : 'text-ef-text-sub'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default HChip;
