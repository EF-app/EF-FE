/**
 * @file features/onboarding/components/MBTIDrum.tsx
 * @description MBTI 축 스크롤 드럼 선택 컴포넌트
 */

import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { COLORS } from '@/constants/colors';

const ITEM_H = 40;

interface MBTIDrumProps {
  items: string[];
  selectedIndex: number;
  onSelect: (idx: number) => void;
}

const MBTIDrum: React.FC<MBTIDrumProps> = ({ items, selectedIndex, onSelect }) => {
  const scrollRef = useRef<ScrollView>(null);
  const isSet = selectedIndex > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
  }, [selectedIndex]);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      if (clamped !== selectedIndex) onSelect(clamped);
    },
    [items.length, selectedIndex, onSelect],
  );

  return (
    <View
      className={`flex-1 rounded-[14px] overflow-hidden relative border-[1.5px] ${
        isSet
          ? 'bg-ef-primary-tint border-ef-primary'
          : 'bg-ef-surface border-ef-primary-border'
      }`}
      style={{ height: ITEM_H * 3 }}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        nestedScrollEnabled={true}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_H }}
        style={{ height: ITEM_H * 3 }}
      >
        {items.map((item, idx) => (
          <View
            key={idx}
            style={{ height: ITEM_H }}
            className="items-center justify-center"
          >
            <Text
              style={{
                fontSize: idx === selectedIndex ? 24 : 20,
                color:
                  idx === selectedIndex && isSet
                    ? COLORS.primary
                    : idx === selectedIndex
                    ? COLORS.textPrimary
                    : COLORS.textMuted,
                fontFamily: 'NanumSquareNeo-bRg',
                letterSpacing: -0.4,
              }}
            >
              {item || '﹣'}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 선택 영역 상하 구분선 */}
      <View
        className="absolute left-2 right-2 h-[1.5px] bg-ef-primary opacity-25"
        style={{ top: ITEM_H }}
        pointerEvents="none"
      />
      <View
        className="absolute left-2 right-2 h-[1.5px] bg-ef-primary opacity-25"
        style={{ bottom: ITEM_H }}
        pointerEvents="none"
      />

      {/* fade overlays */}
      <View
        className={`absolute left-0 right-0 ${isSet ? 'bg-ef-primary-tint' : 'bg-ef-surface'}`}
        style={{ top: 0, height: ITEM_H, opacity: 0.85 }}
        pointerEvents="none"
      />
      <View
        className={`absolute left-0 right-0 ${isSet ? 'bg-ef-primary-tint' : 'bg-ef-surface'}`}
        style={{ bottom: 0, height: ITEM_H, opacity: 0.85 }}
        pointerEvents="none"
      />
    </View>
  );
};

export default MBTIDrum;
