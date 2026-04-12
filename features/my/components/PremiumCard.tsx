/**
 * @file features/my/components/PremiumCard.tsx
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const PremiumCard: React.FC = () => {
  const router = useRouter();
  return (
  <TouchableOpacity
    onPress={() => router.push('/(tabs)/my/premium')}
    className="mx-[20px] mb-[12px] rounded-[20px] flex-row items-center gap-[14px] px-[20px] py-[18px] overflow-hidden"
    style={{
      backgroundColor: COLORS.primary,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.30,
      shadowRadius: 28,
      elevation: 8,
    }}
    activeOpacity={0.88}
  >
    {/* Decorative circle */}
    <View
      className="absolute top-[-30px] right-[-20px] w-[110px] h-[110px] rounded-full"
      style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
    />

    {/* Icon */}
    <View
      className="w-[44px] h-[44px] rounded-[16px] items-center justify-center flex-shrink-0"
      style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
    >
      <Text style={{ fontSize: 22 }}>👑</Text>
    </View>

    {/* Text */}
    <View className="flex-1">
      <Text className="text-[14px] font-extrabold text-white mb-[3px]" style={{ letterSpacing: -0.3 }}>
        프리미엄 멤버십
      </Text>
      <Text className="text-[11px] font-sans" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 16 }}>
        광고 없이, 더 많은 혜택을{'\n'}무제한으로 즐기세요
      </Text>
    </View>

    {/* Arrow */}
    <View
      className="w-[30px] h-[30px] rounded-[10px] items-center justify-center flex-shrink-0"
      style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
    >
      <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.9)" />
    </View>
  </TouchableOpacity>
  );
};

export default PremiumCard;
