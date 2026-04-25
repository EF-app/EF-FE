/**
 * @file common/components/ReasonSelectList.tsx
 * @description 다중 선택 가능한 이모지 + 제목 + 설명 + 체크 리스트
 *              신고/차단 화면에서 공통 사용
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export interface ReasonItem<T extends string = string> {
  code: T;
  emoji: string;
  title: string;
  description: string;
}

interface Props<T extends string> {
  reasons: ReasonItem<T>[];
  selected: T[];
  onToggle: (code: T) => void;
  /** 선택된 항목의 강조 색상 (기본: red) */
  accentColor?: string;
}

function ReasonSelectList<T extends string>({
  reasons,
  selected,
  onToggle,
  accentColor = '#E84C7A',
}: Props<T>) {
  return (
    <View className="flex-col gap-[8px]">
      {reasons.map(r => {
        const on = selected.includes(r.code);
        return (
          <TouchableOpacity
            key={r.code}
            activeOpacity={0.85}
            onPress={() => onToggle(r.code)}
            className="rounded-[14px] flex-row items-center"
            style={{
              backgroundColor: on
                ? `${accentColor}14`
                : COLORS.surface,
              borderWidth: 1.5,
              borderColor: on ? accentColor : COLORS.divider,
              padding: 14,
              gap: 12,
            }}
          >
            <View
              className="w-[34px] h-[34px] rounded-[10px] items-center justify-center"
              style={{
                backgroundColor: on ? `${accentColor}1F` : COLORS.bg,
              }}
            >
              <Text style={{ fontSize: 17 }}>{r.emoji}</Text>
            </View>

            <View className="flex-1">
              <Text
                className="text-[13.5px] font-bold"
                style={{
                  color: on ? accentColor : COLORS.textPrimary,
                  letterSpacing: -0.3,
                }}
              >
                {r.title}
              </Text>
              <Text
                className="text-[11.5px] text-ef-text-muted mt-[2px]"
                style={{ lineHeight: 16 }}
              >
                {r.description}
              </Text>
            </View>

            <View
              className="w-[20px] h-[20px] rounded-full items-center justify-center"
              style={{
                borderWidth: 1.5,
                borderColor: on ? accentColor : COLORS.divider,
                backgroundColor: on ? accentColor : 'transparent',
              }}
            >
              {on && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default ReasonSelectList;
