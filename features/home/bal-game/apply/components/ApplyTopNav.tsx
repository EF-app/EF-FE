/**
 * @file features/home/bal-game/apply/components/ApplyTopNav.tsx
 * @description 밸런스게임 신청 상단 네비 (뒤로가기 + 타이틀 + Step 인디케이터)
 */

import BackButton from '@components/BackButton';
import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  currentStep: number | '✓';
  totalSteps: number;
  onBackPress: () => void;
}

const ApplyTopNav: React.FC<Props> = ({ currentStep, totalSteps, onBackPress }) => (
  <View
    className="flex-row items-center justify-between px-5 pt-[14px] pb-3 bg-ef-bg"
    style={{ borderBottomWidth: 1, borderBottomColor: COLORS.divider }}
  >
    <View className="flex-row items-center gap-3">
      <BackButton onPress={onBackPress} />
      <Text
        className="text-[16px] text-ef-text font-extrabold"
        style={{ letterSpacing: -0.3 }}
      >
        밸런스게임 신청
      </Text>
    </View>

    <View className="bg-ef-surface2 rounded-full px-[10px] py-1">
      <Text
        className="text-[11px] font-bold"
        style={{ color: COLORS.textMuted, letterSpacing: 0.3 }}
      >
        Step <Text style={{ color: COLORS.primary }}>{currentStep}</Text> / {totalSteps}
      </Text>
    </View>
  </View>
);

export default ApplyTopNav;
