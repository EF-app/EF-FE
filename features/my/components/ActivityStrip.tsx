/**
 * @file features/my/components/ActivityStrip.tsx
 */

import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
import { UserProfile } from '../types';

interface Props {
  activity: UserProfile['activity'];
}

const ActivityStrip: React.FC<Props> = ({ activity }) => (
  <View
    className="mx-[20px] mb-[20px] bg-ef-surface rounded-[18px] px-[20px] py-[16px]"
    style={{
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.09,
      shadowRadius: 20,
      elevation: 3,
    }}
  >
    <Text
      className="text-[12px] font-extrabold text-ef-text-muted mb-[12px]"
      style={{ letterSpacing: 1.2 }}
    >
      내 활동 요약
    </Text>
    <View className="flex-row gap-[10px]">
      {activity.map(item => (
        <View
          key={item.label}
          className="flex-1 rounded-[14px] py-[12px] px-[10px] items-center gap-[5px] bg-ef-bg"
        >
          <Text style={{ fontSize: 18 }}>{item.icon}</Text>
          <Text className="text-[15px] font-extrabold text-ef-text" style={{ letterSpacing: -0.4 }}>
            {item.value}
          </Text>
          <Text className="text-[9px] font-sans text-ef-text-muted text-center">{item.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default ActivityStrip;
