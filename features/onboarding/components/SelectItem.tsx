/**
 * @file features/onboarding/components/SelectItem.tsx
 * @description 단일 선택 항목 행 컴포넌트 (라디오 버튼 스타일)
 */

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface SelectItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const SelectItem: React.FC<SelectItemProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between rounded-[12px] py-[14px] px-4 mb-[6px] border-[1.5px] ${
      selected
        ? 'bg-ef-primary-tint border-ef-primary'
        : 'bg-ef-surface border-transparent'
    }`}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text className={`text-[13px] font-sans ${selected ? 'text-ef-primary' : 'text-ef-text-sub'}`}>
      {label}
    </Text>
    <View
      className={`w-5 h-5 rounded-[10px] border-[1.5px] items-center justify-center ${
        selected ? 'bg-ef-primary border-ef-primary' : 'border-ef-primary-border'
      }`}
    >
      {selected && <Text className="text-[11px] text-white font-extrabold">✓</Text>}
    </View>
  </TouchableOpacity>
);

export default SelectItem;
