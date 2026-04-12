/**
 * @file features/noti/components/NoticeCard.tsx
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { Notice, NoticeTag } from '../types';

interface TagStyle {
  bg: string;
  color: string;
  label: string;
}

const TAG_STYLES: Record<NoticeTag, TagStyle> = {
  notice: { bg: COLORS.primaryTint, color: COLORS.primary, label: '공지' },
  update: { bg: 'rgba(91,185,140,0.13)', color: COLORS.greenVivid, label: '업데이트' },
  event:  { bg: 'rgba(196,136,90,0.13)', color: COLORS.amber, label: '이벤트' },
  hot:    { bg: 'rgba(212,101,90,0.12)', color: COLORS.red, label: '중요' },
};

interface Props {
  notice: Notice;
  onPress: (notice: Notice) => void;
}

const NoticeCard: React.FC<Props> = ({ notice, onPress }) => {
  const ts = TAG_STYLES[notice.tag];

  return (
    <TouchableOpacity
      className="bg-ef-surface rounded-[18px] overflow-hidden mb-[10px]"
      style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.13, shadowRadius: 14, elevation: 3 }}
      activeOpacity={0.85}
      onPress={() => onPress(notice)}
    >
      <View className="px-[18px] pt-[16px] pb-[10px] gap-[6px]">
        <View className="flex-row items-center gap-[8px]">
          <View className="rounded-[6px] px-[8px] py-[3px]" style={{ backgroundColor: ts.bg }}>
            <Text className="text-[10px] font-extrabold" style={{ color: ts.color }}>
              {ts.label}
            </Text>
          </View>
          <Text
            className="flex-1 text-[14px] text-ef-text font-extrabold"
            style={{ letterSpacing: -0.3 }}
            numberOfLines={1}
          >
            {notice.title}
          </Text>
        </View>
        <Text className="text-[12px] text-ef-text-sub font-sans leading-[18px]" numberOfLines={2}>
          {notice.preview}
        </Text>
      </View>
      <View className="flex-row items-center justify-between px-[18px] py-[10px] border-t border-ef-divider">
        <Text className="text-[11px] text-ef-text-muted font-sans">{notice.date}</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

export default NoticeCard;
