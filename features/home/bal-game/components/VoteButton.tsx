/**
 * @file features/home/bal-game/components/VoteButton.tsx
 * @description 밸런스 게임 투표 버튼 (선택 전/후 상태 포함)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';

interface VoteButtonProps {
  emoji: string;
  label: string;
  percent: number;
  voted: boolean;
  isMyChoice: boolean;
  onPress: () => void;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  emoji,
  label,
  percent,
  voted,
  isMyChoice,
  onPress,
}) => {
  if (!voted) {
    return (
      <TouchableOpacity
        className="flex-1 rounded-[14px] py-[15px] items-center justify-center border-[1.5px] border-ef-primary-border bg-ef-surface"
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Text className="text-[22px] mb-[4px]">{emoji}</Text>
        <Text className="text-[13px] text-ef-text font-extrabold">{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      className="flex-1 rounded-[14px] overflow-hidden"
      style={{
        borderWidth: isMyChoice ? 2 : 1.5,
        borderColor: isMyChoice ? COLORS.primary : COLORS.borderDefault,
      }}
    >
      {/* fill bar */}
      <View
        className="absolute top-0 left-0 bottom-0 rounded-[12px]"
        style={{
          width: `${percent}%`,
          backgroundColor: isMyChoice
            ? 'rgba(150,134,191,0.18)'
            : 'rgba(150,134,191,0.07)',
        }}
      />
      <View className="py-[15px] items-center justify-center">
        <Text className="text-[22px] mb-[3px]">{emoji}</Text>
        <Text
          className="text-[13px] font-extrabold"
          style={{ color: isMyChoice ? COLORS.primary : COLORS.textPrimary }}
        >
          {label}
        </Text>
        <Text
          className="text-[12px] font-bold mt-[2px]"
          style={{ color: isMyChoice ? COLORS.primaryMid : COLORS.textMuted }}
        >
          {percent}%
        </Text>
      </View>
    </View>
  );
};

export default VoteButton;
