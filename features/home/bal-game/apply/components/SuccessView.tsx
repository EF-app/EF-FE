/**
 * @file features/home/bal-game/apply/components/SuccessView.tsx
 * @description 신청 완료 화면
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { BalanceApplyResult } from '@home/bal-game/apply/types';

interface Props {
  result: BalanceApplyResult;
  onGoHome: () => void;
}

const SuccessView: React.FC<Props> = ({ result, onGoHome }) => (
  <View className="items-center pt-10 px-7 pb-10">
    <View
      className="w-[80px] h-[80px] rounded-[26px] items-center justify-center mb-[22px]"
      style={{ backgroundColor: 'rgba(150,134,191,0.10)' }}
    >
      <Text style={{ fontSize: 36 }}>⚖️</Text>
    </View>

    <Text
      className="text-[22px] text-ef-text font-extrabold mb-[10px]"
      style={{ letterSpacing: -0.4 }}
    >
      신청이 완료됐어요!
    </Text>

    <Text
      className="text-[13.5px] text-ef-text-sub font-sans text-center mb-8"
      style={{ lineHeight: 22 }}
    >
      검토 후 빠르게 게시해 드릴게요.{'\n'}보통{' '}
      <Text className="font-bold" style={{ color: COLORS.primary }}>
        1~2시간
      </Text>{' '}
      이내에 공개됩니다.
    </Text>

    <View
      className="w-full rounded-[14px] bg-ef-surface px-[18px] py-[14px] mb-6"
      style={{
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <MetaRow label="선택지 A" value={result.optionA} valueAlign="right" size={12} />
      <MetaRow label="선택지 B" value={result.optionB} valueAlign="right" size={12} />
      <MetaRow label="카테고리" value={result.category} highlighted />
      <MetaRow label="공개 범위" value={result.scopeLabel} highlighted />
      <MetaRow label="심사 상태" value="검토 중 ⏳" valueColor={COLORS.amber} last />
    </View>

    <TouchableOpacity
      className="w-full flex-row items-center justify-center gap-2 rounded-[14px] py-4"
      activeOpacity={0.88}
      onPress={onGoHome}
      style={{
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
      }}
    >
      <Text className="text-[15px] text-white font-extrabold">
        홈으로 돌아가기
      </Text>
      <Ionicons name="home" size={15} color="#fff" />
    </TouchableOpacity>
  </View>
);

interface MetaRowProps {
  label: string;
  value: string;
  highlighted?: boolean;
  valueColor?: string;
  valueAlign?: 'left' | 'right';
  size?: number;
  last?: boolean;
}

const MetaRow: React.FC<MetaRowProps> = ({
  label,
  value,
  highlighted,
  valueColor,
  valueAlign = 'right',
  size = 12.5,
  last,
}) => (
  <View
    className="flex-row justify-between items-center py-[6px]"
    style={{
      borderBottomWidth: last ? 0 : 1,
      borderBottomColor: COLORS.divider,
    }}
  >
    <Text className="text-[12.5px] font-sans" style={{ color: COLORS.textMuted }}>
      {label}
    </Text>
    <Text
      className="font-bold"
      numberOfLines={2}
      style={{
        color:
          valueColor ??
          (highlighted ? COLORS.primary : COLORS.textPrimary),
        fontSize: size,
        maxWidth: '60%',
        textAlign: valueAlign,
      }}
    >
      {value}
    </Text>
  </View>
);

export default SuccessView;
