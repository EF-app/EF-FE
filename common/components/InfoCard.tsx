/**
 * @file common/components/InfoCard.tsx
 * @description 안내 정보 카드 컴포넌트
 */

import React from 'react';
import { View, Text } from 'react-native';

interface InfoCardProps {
  children: React.ReactNode;
  marginTop?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ children, marginTop = 24 }) => {
  return (
    <View
      className="bg-ef-surface rounded-[14px] p-4 flex-row items-start gap-[10px]"
      style={{ marginTop }}
    >
      <View className="w-[18px] h-[18px] rounded-[9px] bg-ef-primary-light items-center justify-center">
        <Text className="text-[10px] text-ef-primary">!</Text>
      </View>
      <Text className="flex-1 text-[12px] text-ef-text-sub font-sans leading-5">
        {children}
      </Text>
    </View>
  );
};

export default InfoCard;
