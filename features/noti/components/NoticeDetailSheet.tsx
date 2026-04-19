/**
 * @file features/noti/components/NoticeDetailSheet.tsx
 * @description 공지 상세 바텀시트 (드래그 & 스냅 인터랙션, 콘텐츠 길이 기반 기본 높이)
 */

import { COLORS } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Notice, NoticeTag } from "../types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// 시트의 최대 확장 높이 = 화면의 86%
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.86;

// 핸들 영역을 조금 넓혀서 위로 끌어올리기 쉽게 조정
const HANDLE_AREA = 40;

// 고정 스냅 포인트
const SNAP_FULL = 0; // 완전히 확장 (화면 80%)
const SNAP_CLOSED = SHEET_HEIGHT; // 닫힘

const SPRING = { damping: 22, stiffness: 220, mass: 0.8 };

const TAG_STYLES: Record<
  NoticeTag,
  { bg: string; color: string; label: string }
> = {
  notice: { bg: COLORS.primaryTint, color: COLORS.primary, label: "공지" },
  update: {
    bg: "rgba(91,185,140,0.13)",
    color: COLORS.greenVivid,
    label: "업데이트",
  },
  event: { bg: "rgba(196,136,90,0.13)", color: COLORS.amber, label: "이벤트" },
  hot: { bg: "rgba(212,101,90,0.12)", color: COLORS.red, label: "중요" },
};

interface Props {
  notice: Notice | null;
  onClose: () => void;
}

const NoticeDetailSheet: React.FC<Props> = ({ notice, onClose }) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SNAP_CLOSED);
  const startY = useSharedValue(SNAP_CLOSED);

  // 콘텐츠 길이에 따라 동적으로 결정되는 기본(half) 스냅
  // 값이 작을수록 시트가 더 많이 노출됨. 측정 전에는 닫힘 상태로 둔다.
  const halfSnap = useSharedValue(SNAP_CLOSED);
  const [measured, setMeasured] = useState(false);

  // 새 공지가 열릴 때 측정 상태 초기화
  useEffect(() => {
    if (notice) {
      setMeasured(false);
      halfSnap.value = SNAP_CLOSED;
    }
  }, [notice?.id]);

  // 닫힘 트리거: notice가 null이 되면 아래로 슬라이드
  useEffect(() => {
    if (!notice) {
      translateY.value = withTiming(SNAP_CLOSED, { duration: 220 });
    }
  }, [notice]);

  // ScrollView 콘텐츠 크기가 측정되면 half 스냅 계산 후 최초 한 번 열기 애니메이션 실행
  const handleContentSize = (_w: number, h: number) => {
    const total = Math.min(h + HANDLE_AREA, SHEET_HEIGHT);
    const hs = Math.max(SNAP_FULL, SHEET_HEIGHT - total);
    halfSnap.value = hs;
    if (!measured && notice) {
      setMeasured(true);
      translateY.value = withSpring(hs, SPRING);
    }
  };

  const close = () => {
    translateY.value = withTiming(
      SNAP_CLOSED,
      { duration: 220 },
      (finished) => {
        if (finished) runOnJS(onClose)();
      },
    );
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const next = startY.value + e.translationY;
      translateY.value = Math.max(SNAP_FULL, Math.min(SNAP_CLOSED, next));
    })
    .onEnd((e) => {
      const y = translateY.value;
      const v = e.velocityY;
      const half = halfSnap.value;

      let target: number;

      if (v < -700) {
        target = SNAP_FULL;
      } else if (v > 900) {
        target = SNAP_CLOSED;
      } else {
        // 손가락을 뗀 위치에서 가장 가까운 스냅 포인트 선택 (자석 효과)
        const dFull = Math.abs(y - SNAP_FULL);
        const dHalf = Math.abs(y - half);
        const dClose = Math.abs(y - SNAP_CLOSED);
        if (dFull <= dHalf && dFull <= dClose) target = SNAP_FULL;
        else if (dHalf <= dClose) target = half;
        else target = SNAP_CLOSED;
      }

      translateY.value = withSpring(target, SPRING, (finished) => {
        if (finished && target === SNAP_CLOSED) {
          runOnJS(onClose)();
        }
      });
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [SNAP_CLOSED, halfSnap.value],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  if (!notice) return null;

  const ts = TAG_STYLES[notice.tag];

  return (
    <Modal
      transparent
      visible={!!notice}
      onRequestClose={close}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(28,26,31,0.45)" },
            backdropStyle,
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={close} />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: SHEET_HEIGHT,
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
            },
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={panGesture}>
            <View>
              <View className="items-center py-3">
                <View className="w-[38px] h-[4px] rounded-[2px] bg-ef-divider" />
              </View>
            </View>
          </GestureDetector>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 22,
              paddingBottom: Math.max(insets.bottom, 16) + 24,
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
            onContentSizeChange={handleContentSize}
          >
            {/* tag */}
            <View
              className="inline-flex self-start rounded-[6px] px-[8px] py-[3px] mb-[10px]"
              style={{ backgroundColor: ts.bg }}
            >
              <Text
                className="text-[10px] font-extrabold"
                style={{ color: ts.color }}
              >
                {ts.label}
              </Text>
            </View>

            {/* title */}
            <Text
              className="text-[20px] text-ef-text font-extrabold mb-[10px]"
              style={{ letterSpacing: -0.6, lineHeight: 28 }}
            >
              {notice.title}
            </Text>

            {/* date */}
            <Text className="text-[11px] text-ef-text-muted font-sans mb-[18px]">
              {notice.date}
            </Text>

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
      </GestureHandlerRootView>
    </Modal>
  );
};

export default NoticeDetailSheet;
