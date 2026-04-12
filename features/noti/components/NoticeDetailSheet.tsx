/**
 * @file features/noti/components/NoticeDetailSheet.tsx
 * @description 공지 상세 바텀시트
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Dimensions,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { Notice, NoticeTag } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TAG_STYLES: Record<NoticeTag, { bg: string; color: string; label: string }> = {
  notice: { bg: COLORS.primaryTint, color: COLORS.primary, label: '공지' },
  update: { bg: 'rgba(91,185,140,0.13)', color: COLORS.greenVivid, label: '업데이트' },
  event:  { bg: 'rgba(196,136,90,0.13)', color: COLORS.amber, label: '이벤트' },
  hot:    { bg: 'rgba(212,101,90,0.12)', color: COLORS.red, label: '중요' },
};

interface Props {
  notice: Notice | null;
  onClose: () => void;
}

const NoticeDetailSheet: React.FC<Props> = ({ notice, onClose }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (notice) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [notice]);

  if (!notice) return null;

  const ts = TAG_STYLES[notice.tag];

  return (
    <Modal transparent visible={!!notice} onRequestClose={onClose} statusBarTranslucent>
      <Animated.View
        style={{ flex: 1, backgroundColor: 'rgba(28,26,31,0.45)', opacity }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <Animated.View
          style={{
            backgroundColor: COLORS.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            maxHeight: SCREEN_HEIGHT * 0.8,
            transform: [{ translateY }],
          }}
        >
          {/* handle */}
          <View className="items-center py-3">
            <View className="w-[38px] h-[4px] rounded-[2px] bg-ef-divider" />
          </View>

          <ScrollView
            className="px-[22px] pb-2"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* tag */}
            <View className="inline-flex self-start rounded-[6px] px-[8px] py-[3px] mb-[10px]" style={{ backgroundColor: ts.bg }}>
              <Text className="text-[10px] font-extrabold" style={{ color: ts.color }}>{ts.label}</Text>
            </View>

            {/* title */}
            <Text
              className="text-[20px] text-ef-text font-extrabold mb-[10px]"
              style={{ letterSpacing: -0.6, lineHeight: 28 }}
            >
              {notice.title}
            </Text>

            {/* date */}
            <Text className="text-[11px] text-ef-text-muted font-sans mb-[18px]">{notice.date}</Text>

            {/* divider */}
            <View className="h-px bg-ef-divider mb-[18px]" />

            {/* body */}
            <Text
              className="text-[14px] text-ef-text-sub font-sans mb-8"
              style={{ lineHeight: 24 }}
            >
              {notice.body}
            </Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default NoticeDetailSheet;
