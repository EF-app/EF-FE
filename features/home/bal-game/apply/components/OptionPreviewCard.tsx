/**
 * @file features/home/bal-game/apply/components/OptionPreviewCard.tsx
 * @description 실시간 미리보기 카드
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  optionA: string;
  optionB: string;
}

const OptionPreviewCard: React.FC<Props> = ({ optionA, optionB }) => {
  const aFilled = optionA.trim().length > 0;
  const bFilled = optionB.trim().length > 0;

  return (
    <View
      className="bg-ef-primary-tint rounded-[18px] overflow-hidden mb-[14px]"
      style={{
        borderWidth: 1.5,
        borderColor: 'rgba(150,134,191,0.35)',
        borderStyle: 'dashed',
      }}
    >
      <View className="flex-row items-center gap-[6px] px-4 pt-[10px]">
        <Ionicons name="time-outline" size={11} color={COLORS.primary} />
        <Text
          className="text-[10px] text-ef-primary font-bold"
          style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}
        >
          실시간 미리보기
        </Text>
      </View>

      <View
        className="flex-row items-center px-[14px] py-3"
        style={{ minHeight: 80, gap: 8 }}
      >
        <View className="flex-1">
          <PreviewText value={optionA} filled={aFilled} align="left" />
        </View>

        <View
          className="rounded-[8px] px-2 py-[5px]"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Text className="text-[13px] font-extrabold text-white">VS</Text>
        </View>

        <View className="flex-1">
          <PreviewText value={optionB} filled={bFilled} align="right" />
        </View>
      </View>
    </View>
  );
};

interface PreviewTextProps {
  value: string;
  filled: boolean;
  align: 'left' | 'right';
}

const PreviewText: React.FC<PreviewTextProps> = ({ value, filled, align }) => (
  <Text
    className="font-bold"
    style={{
      color: filled ? COLORS.textPrimary : COLORS.primary,
      fontSize: filled ? 13 : 11.5,
      lineHeight: filled ? 20 : 17,
      opacity: filled ? 1 : 0.5,
      fontWeight: filled ? '700' : '400',
      textAlign: align,
    }}
  >
    {filled
      ? value
      : align === 'left'
        ? '선택지 A를 입력하면\n여기에 표시돼요'
        : '선택지 B를 입력하면\n여기에 표시돼요'}
  </Text>
);

export default OptionPreviewCard;
