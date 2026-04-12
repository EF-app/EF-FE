/**
 * @file features/onboarding/components/ToggleSection.tsx
 * @description 접힘/펼침 섹션 컴포넌트 (아코디언 토글)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ToggleSectionProps {
  emoji: string;
  label: string;
  children: React.ReactNode;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ emoji, label, children }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View className="mb-[6px]">
      <TouchableOpacity
        className={`flex-row items-center justify-between rounded-[10px] py-3 px-[14px] mb-[6px] ${
          open ? 'bg-ef-primary-tint' : 'bg-ef-surface2'
        }`}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-[7px]">
          <Text className="text-[14px]">{emoji}</Text>
          <Text className={`text-[13px] font-bold ${open ? 'text-ef-primary' : 'text-ef-text-sub'}`}>
            {label}
          </Text>
        </View>
        <Text
          className={`text-[14px] ${open ? 'text-ef-primary' : 'text-ef-text-muted'}`}
          style={open ? { transform: [{ rotate: '180deg' }] } : undefined}
        >
          ▾
        </Text>
      </TouchableOpacity>

      {open && (
        <View className="pt-3 pb-1">
          {children}
        </View>
      )}
    </View>
  );
};

export default ToggleSection;
