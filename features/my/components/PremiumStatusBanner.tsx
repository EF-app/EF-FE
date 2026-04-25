/**
 * @file features/my/components/PremiumStatusBanner.tsx
 * @description 프리미엄 멤버십 만료일 + 잉크 잔량을 보여주는 상태 배너
 */

import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/colors';

interface Props {
  expiry?: string;
  inkDrops?: number;
}

const PremiumStatusBanner: React.FC<Props> = ({
  expiry = '2026.05.24',
  inkDrops = 12,
}) => (
  <View
    className="mx-[20px] mb-[12px] bg-ef-surface rounded-[16px] px-[18px] py-[14px] flex-row items-center"
    style={{
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.09,
      shadowRadius: 20,
      elevation: 3,
    }}
  >
    <View className="flex-1 items-center justify-center gap-[4px]">
      <Text
        className="text-[10px] font-bold text-ef-text-muted"
        style={{ letterSpacing: 0.2 }}
      >
        프리미엄 멤버십
      </Text>
      <Text
        className="text-[13px] font-extrabold"
        style={{ color: COLORS.primary, letterSpacing: -0.3 }}
      >
        {expiry}까지
      </Text>
    </View>

    <View
      style={{ width: 1, height: 28, backgroundColor: COLORS.divider }}
    />

    <View className="flex-1 items-center justify-center gap-[4px]">
      <Text
        className="text-[10px] font-bold text-ef-text-muted"
        style={{ letterSpacing: 0.2 }}
      >
        잉크
      </Text>
      <View className="flex-row items-center gap-[4px]">
        <Text style={{ fontSize: 13 }}>💧</Text>
        <Text
          className="text-[13px] font-extrabold text-ef-text"
          style={{ letterSpacing: -0.3 }}
        >
          {inkDrops}방울
        </Text>
      </View>
    </View>
  </View>
);

export default PremiumStatusBanner;
