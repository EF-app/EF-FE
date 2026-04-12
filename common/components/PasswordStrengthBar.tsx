/**
 * @file common/components/PasswordStrengthBar.tsx
 * @description 비밀번호 강도 시각화 바 컴포넌트
 */

import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
import {
  calcStrength,
  STRENGTH_COLORS,
  STRENGTH_LABELS,
} from '@/constants/validation';

interface PasswordStrengthBarProps {
  password: string;
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const strength = password ? calcStrength(password) : 0;
  const activeColor = strength > 0 ? STRENGTH_COLORS[strength - 1] : undefined;
  const label = password && strength > 0 ? STRENGTH_LABELS[strength - 1] : '—';

  return (
    <View className="mb-7">
      <View className="flex-row items-center gap-[10px] mb-3">
        <View className="flex-1 h-px bg-ef-divider" />
        <Text className="text-[11px] text-ef-text-muted font-sans">비밀번호 강도</Text>
        <View className="flex-1 h-px bg-ef-divider" />
      </View>

      <View className="items-end mb-[6px]">
        <Text
          className="text-[12px] font-bold"
          style={{ color: activeColor ?? COLORS.textMuted }}
        >
          {label}
        </Text>
      </View>

      <View className="flex-row gap-1">
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            className="flex-1 h-[3px] rounded-[2px]"
            style={{
              backgroundColor:
                password && index < strength ? activeColor : COLORS.divider,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default PasswordStrengthBar;
