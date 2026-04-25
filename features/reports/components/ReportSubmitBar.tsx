/**
 * @file features/reports/components/ReportSubmitBar.tsx
 * @description 신고 화면 하단 고정 버튼 영역 (제출 + 선택적 취소)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  enabled: boolean;
  loading?: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const ReportSubmitBar: React.FC<Props> = ({
  enabled,
  loading,
  onSubmit,
  onCancel,
  submitLabel = '신고 접수하기',
}) => (
  <View
    className="px-[20px] pt-[12px] pb-[24px]"
    style={{
      backgroundColor: COLORS.bg,
      borderTopWidth: 1,
      borderTopColor: COLORS.divider,
      gap: 9,
    }}
  >
    <TouchableOpacity
      activeOpacity={enabled ? 0.85 : 1}
      onPress={() => enabled && !loading && onSubmit()}
      className="flex-row items-center justify-center rounded-[14px]"
      style={{
        backgroundColor: '#E84C7A',
        paddingVertical: 15,
        gap: 8,
        opacity: enabled ? 1 : 0.4,
        shadowColor: '#E84C7A',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: enabled ? 0.3 : 0,
        shadowRadius: 18,
        elevation: enabled ? 6 : 0,
      }}
    >
      <Ionicons name="alert-circle-outline" size={16} color="#fff" />
      <Text
        className="text-[14px] font-extrabold text-white"
        style={{ letterSpacing: -0.3 }}
      >
        {loading ? '제출 중…' : submitLabel}
      </Text>
    </TouchableOpacity>

    {onCancel && (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onCancel}
        className="rounded-[14px] items-center justify-center"
        style={{
          backgroundColor: COLORS.surface,
          paddingVertical: 13,
          borderWidth: 1.5,
          borderColor: COLORS.divider,
        }}
      >
        <Text
          className="text-[13.5px] font-bold"
          style={{ color: COLORS.textSecondary }}
        >
          취소
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default ReportSubmitBar;
