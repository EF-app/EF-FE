/**
 * @file features/home/components/ApplyBanner.tsx
 * @description "나도 밸런스 주제 올려보기" 신청 배너
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onApplyPress?: () => void;
}

const ApplyBanner: React.FC<Props> = ({ onApplyPress }) => (
  <View
    className="flex-row items-center justify-between gap-3 mt-3 rounded-[20px] px-[18px] py-4"
    style={{
      backgroundColor: COLORS.primaryLight,
      borderWidth: 1.5,
      borderColor: 'rgba(150,134,191,0.22)',
      overflow: 'hidden',
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: -4,
        right: 14,
        opacity: 0.55,
      }}
    >
      <Text style={{ fontSize: 34 }}>✨</Text>
    </View>

    <View className="flex-1">
      <Text
        className="text-[13px] text-ef-text font-extrabold"
        style={{ letterSpacing: -0.3 }}
      >
        나도 밸런스 주제 올려보기
      </Text>
      <Text className="text-[11px] text-ef-text-sub font-bold mt-[2px]">
        선정되면 메인에 등장해요!
      </Text>
    </View>

    <TouchableOpacity
      className="bg-ef-primary rounded-[14px] px-[18px] py-[11px]"
      activeOpacity={0.88}
      onPress={onApplyPress}
    >
      <Text
        className="text-[12px] text-white font-extrabold"
        style={{ letterSpacing: -0.2 }}
      >
        신청하기
      </Text>
    </TouchableOpacity>
  </View>
);

export default ApplyBanner;
