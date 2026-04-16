/**
 * @file features/home/components/BalanceOption.tsx
 * @description 밸런스 게임 A/B 선택지 버튼
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { BalanceOptionPreview } from '@home/types';

type State = 'idle' | 'voted' | 'faded';

interface Props {
  option: BalanceOptionPreview;
  percent: number;
  state: State;
  onPress: () => void;
}

const BalanceOption: React.FC<Props> = ({ option, percent, state, onPress }) => {
  const isVoted = state === 'voted';
  const isFaded = state === 'faded';
  const isIdle = state === 'idle';

  const background =
    isVoted
      ? COLORS.primaryMid
      : option.key === 'a'
        ? 'rgba(150,134,191,0.14)'
        : 'rgba(150,134,191,0.22)';

  const borderColor =
    isVoted
      ? COLORS.primary
      : option.key === 'a'
        ? 'rgba(150,134,191,0.2)'
        : 'rgba(150,134,191,0.25)';

  return (
    <TouchableOpacity
      className="flex-1 rounded-[18px] items-center px-[10px] py-[14px]"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: background,
        borderWidth: 2,
        borderColor,
        opacity: isFaded ? 0.55 : 1,
        transform: [{ translateY: isVoted ? -2 : 0 }],
        shadowColor: isVoted ? COLORS.primary : 'transparent',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isVoted ? 0.3 : 0,
        shadowRadius: 12,
        elevation: isVoted ? 4 : 0,
      }}
    >
      <Text className="text-[24px] mb-[6px]">{option.emoji}</Text>
      <Text
        className="text-[9.5px] text-center font-bold"
        style={{
          color: isVoted ? 'rgba(255,255,255,0.75)' : COLORS.primaryMid,
          lineHeight: 14,
          letterSpacing: -0.1,
        }}
      >
        {option.scenario}
      </Text>

      <Text
        className="text-[12px] font-extrabold text-center mt-[5px]"
        style={{
          color: isVoted ? '#fff' : COLORS.primaryDeep,
          lineHeight: 18,
          letterSpacing: -0.2,
        }}
      >
        {option.label}
      </Text>

      <Text
        className="text-[11px] font-extrabold mt-[6px]"
        style={{
          color: isVoted ? '#fff' : COLORS.primaryDeep,
          opacity: isIdle ? 0 : 1,
        }}
      >
        {percent}%
      </Text>
    </TouchableOpacity>
  );
};

export default BalanceOption;
