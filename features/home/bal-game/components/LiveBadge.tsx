/**
 * @file features/home/bal-game/components/LiveBadge.tsx
 * @description 실시간 참여 현황 뱃지
 */

import React from 'react';
import { View, Text } from 'react-native';

interface LiveBadgeProps {
  participantCount: number;
}

const LiveBadge: React.FC<LiveBadgeProps> = ({ participantCount }) => (
  <View className="flex-row items-center gap-[6px]">
    <View className="flex-row items-center gap-[4px] bg-ef-danger-bg px-[8px] py-[3px] rounded-[10px]">
      <View className="w-[6px] h-[6px] rounded-full bg-ef-red" />
      <Text className="text-[10px] text-ef-red font-extrabold">LIVE</Text>
    </View>
    <Text className="text-[11px] text-ef-text-muted font-sans">
      {participantCount.toLocaleString()}명 참여중
    </Text>
  </View>
);

export default LiveBadge;
