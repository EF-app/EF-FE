/**
 * @file app/(tabs)/home/bal-game/index.tsx
 * @description 밸런스 게임 댓글 화면 (구현 예정)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export default function BalGameScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-ef-bg">
      <View className="flex-row items-center px-4 py-3 border-b border-ef-divider">
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[16px] text-ef-text font-extrabold" style={{ letterSpacing: -0.3 }}>
          밸런스 게임
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[13px] text-ef-text-muted font-sans">구현 예정 화면이에요</Text>
      </View>
    </SafeAreaView>
  );
}
