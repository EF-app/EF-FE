/**
 * @file common/components/PhoneInputRow.tsx
 * @description 전화번호 입력 + 인증 전송 버튼 행 컴포넌트
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { formatPhone } from '@/utils/phone';

interface PhoneInputRowProps {
  value: string;
  onChangeText: (formatted: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const PhoneInputRow: React.FC<PhoneInputRowProps> = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
}) => {
  const digits = value.replace(/\D/g, '');
  const canSend = digits.length >= 10 && !disabled;

  const handleChange = (text: string) => {
    onChangeText(formatPhone(text));
  };

  return (
    <View className="flex-row gap-2">
      <View className="flex-1 bg-ef-surface rounded-[14px] px-4 py-[14px] flex-row items-center gap-[10px]">
        <Text className="text-[18px]">🇰🇷</Text>
        <View className="w-px h-4 bg-ef-surface2" />
        <TextInput
          className="flex-1 text-[14px] text-ef-text font-sans p-0"
          placeholder="010-0000-0000"
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          maxLength={13}
          editable={!disabled}
        />
      </View>
      <TouchableOpacity
        className={`bg-ef-primary rounded-[10px] px-[18px] justify-center ${!canSend ? 'opacity-50' : ''}`}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.7}
      >
        <Text className="text-[13px] text-white font-bold">인증</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhoneInputRow;
