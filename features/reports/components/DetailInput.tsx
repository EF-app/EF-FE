/**
 * @file features/reports/components/DetailInput.tsx
 * @description 신고/차단 화면 — 추가 설명 textarea + 글자수 카운터
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { COLORS } from '@/constants/colors';

interface Props {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
}

const DetailInput: React.FC<Props> = ({
  value,
  onChange,
  maxLength = 300,
  placeholder = '구체적인 내용을 입력하면 더 빠르게 처리돼요',
}) => (
  <View>
    <View className="flex-row items-center gap-[6px] mb-[8px]">
      <Text
        className="text-[13px] font-extrabold text-ef-text"
        style={{ letterSpacing: -0.3 }}
      >
        추가 설명
      </Text>
      <Text className="text-[11px] text-ef-text-muted">선택 사항</Text>
    </View>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      maxLength={maxLength}
      multiline
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: COLORS.divider,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 13,
        color: COLORS.textPrimary,
        lineHeight: 20,
      }}
    />
    <Text
      className="text-[11px] text-ef-text-muted mt-[6px]"
      style={{ textAlign: 'right' }}
    >
      {value.length} / {maxLength}
    </Text>
  </View>
);

export default DetailInput;
