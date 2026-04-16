/**
 * @file features/home/components/NavButtons.tsx
 * @description 밸런스 하단 다음/인기 게임 버튼
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onNextPress?: () => void;
  onPopularPress?: () => void;
}

const NavButtons: React.FC<Props> = ({ onNextPress, onPopularPress }) => (
  <View className="flex-row gap-2 mt-[10px]">
    <NavButton
      variant="default"
      icon="arrow-forward"
      label="다음 게임"
      onPress={onNextPress}
    />
    <NavButton
      variant="primary"
      icon="star"
      label="인기 게임"
      onPress={onPopularPress}
    />
  </View>
);

interface NavButtonProps {
  variant: 'default' | 'primary';
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  variant,
  icon,
  label,
  onPress,
}) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      className="flex-1 flex-row items-center justify-center gap-[6px] rounded-[14px] py-[11px] px-[10px] border-[1.5px]"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: isPrimary ? COLORS.primary : COLORS.surface,
        borderColor: isPrimary ? COLORS.primary : COLORS.primaryBorder,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Ionicons
        name={icon}
        size={14}
        color={isPrimary ? '#fff' : COLORS.textPrimary}
      />
      <Text
        className="text-[12px] font-extrabold"
        style={{
          color: isPrimary ? '#fff' : COLORS.textPrimary,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default NavButtons;
