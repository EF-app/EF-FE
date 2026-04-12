/**
 * @file common/components/PasswordInputField.tsx
 * @description 비밀번호 입력 필드 컴포넌트 (눈 아이콘 + 유효성 상태 표시)
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

interface PasswordInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showPassword: boolean;
  onToggleShow: () => void;
  isValid: boolean;
  hasInput: boolean;
  showInvalidBorder?: boolean;
  style?: ViewStyle;
}

const StatusIcon: React.FC<{ isValid: boolean }> = ({ isValid }) => (
  <View
    className={`absolute right-[10px] w-7 h-7 rounded-[14px] items-center justify-center ${
      isValid ? 'bg-ef-success-tint' : 'bg-ef-danger-bg'
    }`}
  >
    <Text
      className="text-[12px] font-extrabold"
      style={{ color: isValid ? COLORS.primary : COLORS.danger }}
    >
      {isValid ? '✓' : '✕'}
    </Text>
  </View>
);

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  value,
  onChangeText,
  placeholder = '비밀번호를 입력하세요',
  showPassword,
  onToggleShow,
  isValid,
  hasInput,
  showInvalidBorder = true,
  style,
}) => {
  return (
    <View className="relative flex-row items-center" style={style}>
      <TextInput
        className={`flex-1 bg-ef-surface rounded-[14px] py-[15px] px-4 font-sans text-[14px] text-ef-text border-[1.5px] ${
          hasInput && !isValid && showInvalidBorder
            ? 'border-ef-border-invalid'
            : 'border-transparent'
        }`}
        style={{ paddingRight: 80 }}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        className="absolute right-[44px] p-1"
        onPress={onToggleShow}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text
          className="text-[14px]"
          style={{ opacity: showPassword ? 0.4 : 0.5 }}
        >
          👁
        </Text>
      </TouchableOpacity>
      {hasInput && <StatusIcon isValid={isValid} />}
    </View>
  );
};

export default PasswordInputField;
