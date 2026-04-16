/**
 * @file features/home/bal-game/apply/components/OptionInputCard.tsx
 * @description 선택지 A/B 입력 카드
 */

import { COLORS } from '@/constants/colors';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

interface Props {
  side: 'A' | 'B';
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  maxLength?: number;
}

const OptionInputCard: React.FC<Props> = ({
  side,
  value,
  onChangeText,
  placeholder,
  maxLength = 60,
}) => {
  const [focused, setFocused] = useState(false);
  const len = value.length;

  const countTone: 'normal' | 'warn' | 'over' =
    len >= 55 ? 'over' : len >= 45 ? 'warn' : 'normal';
  const countColor =
    countTone === 'over'
      ? COLORS.danger
      : countTone === 'warn'
        ? COLORS.amber
        : COLORS.textMuted;

  const badgeBg = side === 'A' ? COLORS.primary : 'rgba(150,134,191,0.22)';
  const badgeColor = side === 'A' ? '#fff' : COLORS.primary;

  return (
    <View
      className="bg-ef-surface rounded-[18px] px-[18px] pt-[18px] pb-[14px] mb-[14px]"
      style={{
        borderWidth: 1.5,
        borderColor: focused ? COLORS.primary : 'transparent',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between mb-[10px]">
        <View className="flex-row items-center gap-[7px]">
          <View
            className="rounded-[6px] px-2 py-[2px]"
            style={{ backgroundColor: badgeBg }}
          >
            <Text
              className="text-[9px] font-extrabold"
              style={{ color: badgeColor, letterSpacing: 0.5 }}
            >
              {side}
            </Text>
          </View>
          <Text
            className="text-[10.5px] font-bold"
            style={{
              color: COLORS.textMuted,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            선택지 {side}
          </Text>
        </View>
        <Text className="text-[10.5px] font-sans" style={{ color: countColor }}>
          {len} / {maxLength}
        </Text>
      </View>

      <TextInput
        value={value}
        onChangeText={(t) => {
          if (t.length <= maxLength) onChangeText(t);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        multiline
        textAlignVertical="top"
        className="text-[14px] font-sans text-ef-text"
        style={{
          backgroundColor: focused ? 'rgba(150,134,191,0.08)' : COLORS.bg,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          minHeight: 80,
          lineHeight: 22,
        }}
      />
    </View>
  );
};

export default OptionInputCard;
