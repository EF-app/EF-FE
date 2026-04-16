/**
 * @file features/home/components/SectionTitle.tsx
 * @description 홈 섹션 타이틀 — 제목 + 태그 칩 + 더보기 버튼
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  tag?: string;
  moreLabel?: string;
  onMorePress?: () => void;
}

const SectionTitle: React.FC<Props> = ({
  title,
  tag,
  moreLabel = '더보기 ›',
  onMorePress,
}) => (
  <View className="flex-row items-center justify-between px-[22px] pt-7 pb-3">
    <View className="flex-row items-center gap-[7px]">
      <Text
        className="text-[16px] text-ef-text font-extrabold"
        style={{ letterSpacing: -0.4 }}
      >
        {title}
      </Text>
      {tag && (
        <View className="bg-ef-primary-light px-2 py-[3px] rounded-[8px]">
          <Text
            className="text-[10.5px] text-ef-primary-deep font-extrabold"
            style={{ letterSpacing: 0.2 }}
          >
            {tag}
          </Text>
        </View>
      )}
    </View>

    {onMorePress && (
      <TouchableOpacity onPress={onMorePress} hitSlop={8} activeOpacity={0.7}>
        <Text className="text-[12px] text-ef-text-sub font-bold">
          {moreLabel}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default SectionTitle;
