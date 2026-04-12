/**
 * @file features/onboarding/components/Pill.tsx
 * @description 선택 가능한 태그 칩 컴포넌트 (다중 선택)
 */

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface PillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const Pill: React.FC<PillProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    className={`px-3 py-[6px] rounded-[20px] border ${
      selected
        ? 'bg-ef-primary-tint border-ef-primary'
        : 'bg-ef-surface border-ef-primary-border'
    }`}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text className={`text-[12px] font-sans ${selected ? 'text-ef-primary' : 'text-ef-text-sub'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default Pill;

/** Pill 목록을 감싸는 flex-wrap 컨테이너 className */
export const pillsWrapStyle = { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 6 };
