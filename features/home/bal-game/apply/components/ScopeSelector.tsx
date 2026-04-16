/**
 * @file features/home/bal-game/apply/components/ScopeSelector.tsx
 * @description 공개 범위 선택 (동네/서울/전국)
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { BALANCE_SCOPES, type BalanceScope } from '@home/bal-game/apply/types';

interface Props {
  value: BalanceScope;
  onChange: (next: BalanceScope) => void;
}

const ScopeSelector: React.FC<Props> = ({ value, onChange }) => (
  <View className="flex-row gap-2 mb-[14px]">
    {BALANCE_SCOPES.map((scope) => {
      const selected = scope.value === value;
      return (
        <TouchableOpacity
          key={scope.value}
          className={`flex-1 items-center gap-[4px] rounded-[14px] px-[10px] py-[13px] ${
            selected ? 'bg-ef-primary-tint' : 'bg-ef-surface'
          }`}
          activeOpacity={0.82}
          onPress={() => onChange(scope.value)}
          style={{
            borderWidth: 1.5,
            borderColor: selected ? COLORS.primary : 'transparent',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.16,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 20 }}>{scope.icon}</Text>
          <Text
            className="text-[12px] font-extrabold"
            style={{
              color: selected ? COLORS.primary : COLORS.textPrimary,
            }}
          >
            {scope.name}
          </Text>
          <Text
            className="text-[10px] font-sans text-center"
            style={{ color: COLORS.textMuted, lineHeight: 13 }}
          >
            {scope.desc}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default ScopeSelector;
