/**
 * @file features/home/components/HomeHeader.tsx
 * @description 홈 상단 헤더 — 로고 + 검색/알림 아이콘
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  hasUnreadNotifications?: boolean;
  onSearchPress?: () => void;
}

const HomeHeader: React.FC<Props> = ({
  hasUnreadNotifications = true,
  onSearchPress,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-[22px] pt-[14px] pb-3 bg-ef-bg">
      <View className="flex-row items-center gap-[8px]">
        <View
          className="w-[22px] h-[22px] bg-ef-primary items-center justify-center"
          style={{
            borderTopLeftRadius: 11,
            borderTopRightRadius: 11,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 11,
            transform: [{ rotate: '-45deg' }],
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 3,
          }}
        />
        <Text
          className="text-[21px] text-ef-text font-heavy"
          style={{ letterSpacing: -0.8 }}
        >
          paperly
        </Text>
      </View>

      <View className="flex-row gap-[10px]">
        <IconButton icon="search" onPress={onSearchPress} />
        <IconButton
          icon="notifications-outline"
          hasBadge={hasUnreadNotifications}
          onPress={() => router.push('/(tabs)/noti')}
        />
      </View>
    </View>
  );
};

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  hasBadge?: boolean;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, hasBadge, onPress }) => (
  <TouchableOpacity
    className="w-[40px] h-[40px] rounded-[14px] bg-ef-surface border-[1.5px] border-ef-primary-border items-center justify-center"
    activeOpacity={0.75}
    onPress={onPress}
    style={{
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    }}
  >
    <Ionicons name={icon} size={18} color={COLORS.textPrimary} />
    {hasBadge && (
      <View
        className="absolute top-[8px] right-[8px] w-[7px] h-[7px] rounded-full bg-ef-primary"
        style={{ borderWidth: 1.5, borderColor: COLORS.surface }}
      />
    )}
  </TouchableOpacity>
);

export default HomeHeader;
