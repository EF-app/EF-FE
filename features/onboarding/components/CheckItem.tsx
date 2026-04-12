/**
 * @file features/onboarding/components/CheckItem.tsx
 * @description 체크박스 항목 컴포넌트 (다중 선택)
 */

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface CheckItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center gap-[10px] py-[10px] px-1"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      className={`w-5 h-5 rounded-[5px] border-[1.5px] items-center justify-center ${
        selected ? 'bg-ef-primary border-ef-primary' : 'border-ef-primary-border'
      }`}
    >
      {selected && <Text className="text-[11px] text-white">✓</Text>}
    </View>
    <Text className={`text-[13px] font-sans ${selected ? 'text-ef-primary' : 'text-ef-text-sub'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default CheckItem;
