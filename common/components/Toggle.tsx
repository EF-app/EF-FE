/**
 * @file common/components/Toggle.tsx
 * @description on/off 토글 스위치
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/colors';

interface Props {
  value: boolean;
  onChange: (next: boolean) => void;
  size?: 'sm' | 'md';
  activeColor?: string;
}

const Toggle: React.FC<Props> = ({
  value,
  onChange,
  size = 'md',
  activeColor = COLORS.primary,
}) => {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 22 : 26;
  const ball = size === 'sm' ? 16 : 20;
  const pad = (h - ball) / 2;
  const offset = w - ball - pad * 2;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onChange(!value)}
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        backgroundColor: value ? activeColor : COLORS.divider,
        justifyContent: 'center',
        padding: pad,
      }}
    >
      <View
        style={{
          width: ball,
          height: ball,
          borderRadius: ball / 2,
          backgroundColor: '#fff',
          transform: [{ translateX: value ? offset : 0 }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 4,
          elevation: 2,
        }}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
