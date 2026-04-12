/**
 * @file common/components/BackButton.tsx
 * @description 뒤로가기 버튼 컴포넌트
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="w-9 h-9 rounded-[18px] bg-ef-surface2 items-center justify-center"
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text className="text-[22px] font-bold text-ef-text" style={{ marginTop: -2 }}>
        ‹
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;
