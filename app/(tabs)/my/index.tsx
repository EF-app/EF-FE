import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView className="flex-1 bg-ef-bg items-center justify-center">
      <Text className="text-[13px] text-ef-text-muted font-sans">구현 예정 화면이에요</Text>
    </SafeAreaView>
  );
}
