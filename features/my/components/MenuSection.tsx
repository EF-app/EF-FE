/**
 * @file features/my/components/MenuSection.tsx
 * @description Section group label + menu card with rows
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { MenuSection as MenuSectionType, MenuItem } from '../types';

const BADGE_BG: Record<'purple' | 'green' | 'danger', string> = {
  purple: COLORS.primaryTint,
  green:  'rgba(91,185,140,0.12)',
  danger: 'rgba(212,101,90,0.10)',
};
const BADGE_COLOR: Record<'purple' | 'green' | 'danger', string> = {
  purple: COLORS.primary,
  green:  COLORS.greenVivid,
  danger: COLORS.red,
};

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ on, onToggle }) => (
  <TouchableOpacity
    className="w-[40px] h-[24px] rounded-[12px] relative flex-shrink-0"
    style={{ backgroundColor: on ? COLORS.primary : COLORS.divider }}
    activeOpacity={0.8}
    onPress={onToggle}
  >
    <View
      className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white"
      style={{
        right: on ? 3 : undefined,
        left: on ? undefined : 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      }}
    />
  </TouchableOpacity>
);

interface MenuRowProps {
  item: MenuItem;
  isFirst: boolean;
  toggleState: boolean;
  onToggle: () => void;
}

const MenuRow: React.FC<MenuRowProps> = ({ item, isFirst, toggleState, onToggle }) => {
  const router = useRouter();
  const onPress =
    item.rightType === 'toggle'
      ? onToggle
      : item.href
      ? () => router.push(item.href as any)
      : undefined;
  return (
  <TouchableOpacity
    className="flex-row items-center px-[18px] py-[15px] gap-[14px] relative"
    activeOpacity={0.7}
    onPress={onPress}
  >
    {/* Divider (not on first row) */}
    {!isFirst && (
      <View
        className="absolute top-0 right-[18px] h-[1px] bg-ef-divider"
        style={{ left: 52 }}
        pointerEvents="none"
      />
    )}

    {/* Icon */}
    <View
      className="w-[36px] h-[36px] rounded-[12px] items-center justify-center flex-shrink-0"
      style={{ backgroundColor: item.iconBg }}
    >
      <Text style={{ fontSize: 16 }}>{item.icon}</Text>
    </View>

    {/* Text */}
    <View className="flex-1">
      <Text className="text-[14px] font-bold text-ef-text" style={{ letterSpacing: -0.2 }}>
        {item.title}
      </Text>
      {item.sub && (
        <Text className="text-[11px] font-sans text-ef-text-muted mt-[2px]">{item.sub}</Text>
      )}
    </View>

    {/* Right element */}
    <View className="flex-row items-center gap-[6px]">
      {item.rightType === 'value' && (
        <Text className="text-[12px] font-bold text-ef-text-muted">{item.rightValue}</Text>
      )}
      {item.rightType === 'badge' && item.rightBadgeVariant && (
        <View
          className="rounded-[7px] px-[8px] py-[2px]"
          style={{ backgroundColor: BADGE_BG[item.rightBadgeVariant] }}
        >
          <Text className="text-[10px] font-extrabold" style={{ color: BADGE_COLOR[item.rightBadgeVariant] }}>
            {item.rightValue}
          </Text>
        </View>
      )}
      {item.rightType === 'toggle' && (
        <Toggle on={toggleState} onToggle={onToggle} />
      )}
      {(item.rightType === 'chevron' || item.rightType === 'value') && (
        <Text className="text-[14px] font-light text-ef-text-muted">›</Text>
      )}
    </View>
  </TouchableOpacity>
  );
};

interface Props {
  section: MenuSectionType;
  toggles: Record<string, boolean>;
  onToggle: (key: string) => void;
}

const MenuSection: React.FC<Props> = ({ section, toggles, onToggle }) => (
  <View className="mb-[12px]">
    <Text
      className="px-[26px] mb-[8px] text-[11px] font-extrabold text-ef-text-muted"
      style={{ letterSpacing: 1.2 }}
    >
      {section.label.toUpperCase()}
    </Text>
    <View
      className="mx-[20px] bg-ef-surface rounded-[18px] overflow-hidden"
      style={{
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      {section.items.map((item, i) => (
        <MenuRow
          key={item.title}
          item={item}
          isFirst={i === 0}
          toggleState={item.toggleKey ? (toggles[item.toggleKey] ?? false) : false}
          onToggle={() => item.toggleKey && onToggle(item.toggleKey)}
        />
      ))}
    </View>
  </View>
);

export default MenuSection;
