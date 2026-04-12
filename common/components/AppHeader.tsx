/**
 * @file common/components/AppHeader.tsx
 * @description 앱 상단 로고 헤더 컴포넌트
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="px-6 pb-2 flex-row items-center gap-[10px]"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="w-[34px] h-[34px] rounded-[10px] bg-ef-primary items-center justify-center">
        <Text className="text-white text-[14px]">◇</Text>
      </View>
      <Text className="text-[15px] text-ef-text font-extrabold">이프</Text>
    </View>
  );
};

export default AppHeader;
