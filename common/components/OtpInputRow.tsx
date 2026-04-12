/**
 * @file common/components/OtpInputRow.tsx
 * @description OTP(인증번호) 입력 + 확인 버튼 + 타이머 행 컴포넌트
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';

interface OtpInputRowProps {
  value: string;
  onChangeText: (value: string) => void;
  onVerify: () => void;
  timerSeconds: number;
  codeSent: boolean;
  verified: boolean;
  hasError: boolean;
  inputRef?: React.RefObject<TextInput>;
}

const formatTimer = (seconds: number): string => {
  if (seconds <= 0) return '만료됨';
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const OtpInputRow: React.FC<OtpInputRowProps> = ({
  value,
  onChangeText,
  onVerify,
  timerSeconds,
  codeSent,
  verified,
  hasError,
  inputRef,
}) => {
  const canVerify = value.length === 6 && !verified;

  return (
    <View
      className={!codeSent ? 'opacity-[0.35]' : ''}
      pointerEvents={codeSent ? 'auto' : 'none'}
    >
      <View className="flex-row gap-2">
        <View
          className={`flex-1 bg-ef-surface rounded-[14px] px-4 py-[14px] flex-row items-center border-[1.5px] ${
            verified
              ? 'border-ef-green'
              : hasError
              ? 'border-ef-border-invalid'
              : 'border-transparent'
          }`}
        >
          <TextInput
            ref={inputRef}
            className="flex-1 text-[14px] text-ef-text font-sans p-0"
            placeholder="6자리 입력"
            placeholderTextColor={COLORS.textMuted}
            value={value}
            onChangeText={(t) => onChangeText(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
        <TouchableOpacity
          className="bg-ef-primary-light rounded-[10px] px-[18px] justify-center"
          onPress={onVerify}
          disabled={!canVerify}
          activeOpacity={0.7}
        >
          <Text className="text-[13px] text-ef-primary font-bold">확인</Text>
        </TouchableOpacity>
      </View>

      {codeSent && timerSeconds > 0 && !verified && (
        <View className="flex-row items-center gap-1 mt-[7px] pl-[2px]">
          <Text className="text-[12px]">⏱</Text>
          <Text className="text-[12px] text-ef-primary font-bold">{formatTimer(timerSeconds)}</Text>
        </View>
      )}

      {hasError && (
        <View className="flex-row items-center gap-[6px] mt-2 pl-[2px]">
          <Text className="text-[13px] text-ef-danger">⚠</Text>
          <Text className="text-[12px] text-ef-danger font-bold">인증번호가 틀렸습니다. 다시 확인해주세요.</Text>
        </View>
      )}
    </View>
  );
};

export default OtpInputRow;
