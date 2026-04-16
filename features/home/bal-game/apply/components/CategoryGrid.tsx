/**
 * @file features/home/bal-game/apply/components/CategoryGrid.tsx
 * @description 카테고리 선택 3x3 그리드
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  BALANCE_CATEGORIES,
  type BalanceCategory,
} from '@home/bal-game/apply/types';

interface Props {
  value: BalanceCategory;
  onChange: (next: BalanceCategory) => void;
}

const CategoryGrid: React.FC<Props> = ({ value, onChange }) => {
  const rows: (typeof BALANCE_CATEGORIES)[number][][] = [];
  for (let i = 0; i < BALANCE_CATEGORIES.length; i += 3) {
    rows.push(BALANCE_CATEGORIES.slice(i, i + 3) as unknown as typeof rows[number]);
  }

  return (
    <View className="mb-[14px]">
      {rows.map((row, rowIdx) => (
        <View
          key={rowIdx}
          className="flex-row gap-2"
          style={{ marginTop: rowIdx === 0 ? 0 : 8 }}
        >
          {row.map((cat) => {
            const selected = cat.value === value;
            return (
              <TouchableOpacity
                key={cat.value}
                className={`flex-1 items-center gap-[5px] rounded-[14px] py-3 px-2 ${
                  selected ? 'bg-ef-primary-tint' : 'bg-ef-surface'
                }`}
                activeOpacity={0.82}
                onPress={() => onChange(cat.value)}
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
                <Text style={{ fontSize: 20, lineHeight: 22 }}>{cat.emoji}</Text>
                <Text
                  className="text-[11px] font-bold"
                  style={{
                    color: selected ? COLORS.primary : COLORS.textSecondary,
                    letterSpacing: -0.2,
                  }}
                >
                  {cat.value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default CategoryGrid;
