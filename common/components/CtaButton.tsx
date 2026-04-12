/**
 * @file common/components/CtaButton.tsx
 * @description 하단 CTA 버튼 컴포넌트
 */

import React from 'react';
import { TouchableOpacity, Text, Platform, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

interface CtaButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  loading?: boolean;
  loadingLabel?: string;
  hideArrow?: boolean;
  style?: ViewStyle;
}

const CtaButton: React.FC<CtaButtonProps> = ({
  label,
  active,
  onPress,
  loading = false,
  loadingLabel = '처리 중...',
  hideArrow = false,
  style,
}) => {
  const canPress = active && !loading;

  return (
    <TouchableOpacity
      className={`w-full rounded-[14px] py-[16.5px] flex-row items-center justify-center gap-2 ${
        canPress ? 'bg-ef-primary' : 'bg-[#E8E5E1]'
      }`}
      style={[
        canPress
          ? Platform.select({
              ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 24,
              },
              android: { elevation: 8 },
            })
          : undefined,
        style,
      ]}
      disabled={!canPress}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text className={`text-[15px] font-extrabold ${canPress ? 'text-white' : 'text-[#B0ABB5]'}`}>
        {loading ? loadingLabel : label}
      </Text>
      {!hideArrow && !loading && (
        <Text className={`text-[16px] ${canPress ? 'text-white' : 'text-[#B0ABB5]'}`}>›</Text>
      )}
    </TouchableOpacity>
  );
};

export default CtaButton;
