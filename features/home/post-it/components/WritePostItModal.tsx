/**
 * @file features/home/post-it/components/WritePostItModal.tsx
 * @description 포스트잇 / 답장 작성 모달 — 키보드 올라올 때 시트 함께 올라감
 */

import { COLORS } from "@/constants/colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_CHARS = 150;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string, anonymous: boolean) => void;
  replyToNick?: string;
}

const WritePostItModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  replyToNick,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  /* ── 열기 / 닫기 애니메이션 ── */
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      setText("");
      setAnonymous(false);
    }
  }, [visible]);

  /* ── 키보드 리스너: 시트 전체를 위/아래로 ── */
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      Animated.timing(keyboardOffset, {
        toValue: -e.endCoordinates.height,
        duration: Platform.OS === "ios" ? e.duration : 250,
        useNativeDriver: true,
      }).start();
    };
    const onHide = (e: any) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 200,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  /* ── 드래그로 닫기 ── */
  const dismissByDrag = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(SCREEN_HEIGHT);
      keyboardOffset.setValue(0);
      onClose();
    });
  }, [translateY, keyboardOffset, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 5,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, { dy }) => {
        translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 80 || vy > 1.2) {
          dismissByDrag();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            damping: 22,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,
          stiffness: 220,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;
    onSubmit(text.trim(), anonymous);
    handleClose();
  }, [text, anonymous, onSubmit, handleClose]);

  if (!visible) return null;

  const remaining = MAX_CHARS - text.length;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View
        style={{ flex: 1, backgroundColor: "rgba(28,26,31,0.45)", opacity }}
      >
        {/* 배경 탭 → 닫기 */}
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        {/* 시트 — translateY(열기/닫기) + keyboardOffset(키보드) 합산 */}
        <Animated.View
          style={{
            backgroundColor: COLORS.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            paddingBottom: Platform.OS === "ios" ? 34 : 24,
            transform: [
              { translateY: Animated.add(translateY, keyboardOffset) },
            ],
          }}
        >
          {/* 핸들 — 드래그 */}
          <View
            className="items-center pt-[14px] pb-[6px]"
            {...panResponder.panHandlers}
          >
            <View className="w-[36px] h-[4px] rounded-[2px] bg-ef-divider" />
          </View>

          {/* 헤더 */}
          <View className="flex-row items-center justify-between px-5 py-[14px]">
            <View>
              <Text
                className="text-[17px] text-ef-text font-extrabold"
                style={{ letterSpacing: -0.4 }}
              >
                {replyToNick ? "💬 답장 남기기" : "📝 포스트잇 남기기"}
              </Text>
              {replyToNick && (
                <Text
                  className="text-[11px] font-sans mt-[2px]"
                  style={{ color: COLORS.primaryMid }}
                >
                  {replyToNick}님의 메모에 답장해요
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-[14px] text-ef-text-muted font-sans">
                취소
              </Text>
            </TouchableOpacity>
          </View>

          <View className="h-px bg-ef-divider mx-5 mb-[14px]" />

          {/* 텍스트 입력 */}
          <View className="px-5">
            <TextInput
              className="rounded-[16px] px-[16px] py-[14px] text-[14px] font-sans text-ef-text"
              style={{
                backgroundColor: COLORS.bg,
                borderWidth: 1.5,
                borderColor: COLORS.primaryBorder,
                minHeight: 110,
                maxHeight: 160,
                lineHeight: 22,
                textAlignVertical: "top",
              }}
              value={text}
              onChangeText={(t) => t.length <= MAX_CHARS && setText(t)}
              placeholder={
                replyToNick
                  ? `${replyToNick}님께 답장을 보내요 💜`
                  : "마음속 이야기를 자유롭게 남겨봐요 💜"
              }
              placeholderTextColor={COLORS.textMuted}
              multiline
              autoFocus
            />
            <Text
              className="text-[11px] font-sans text-right mt-[6px]"
              style={{
                color: remaining < 20 ? COLORS.danger : COLORS.textMuted,
              }}
            >
              {remaining}자 남음
            </Text>
          </View>

          {/* 익명 토글 */}
          <View className="flex-row items-center justify-between px-5 mt-[10px]">
            <View>
              <Text className="text-[14px] text-ef-text font-bold">
                익명으로 보내기
              </Text>
              <Text className="text-[11px] text-ef-text-muted font-sans mt-[2px]">
                닉네임 대신 '익명'으로 표시돼요
              </Text>
            </View>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              trackColor={{ false: COLORS.surface2, true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>

          {/* 전송 버튼 */}
          <View className="px-5 mt-[14px]">
            <TouchableOpacity
              className="w-full h-[52px] rounded-[16px] items-center justify-center"
              style={{
                backgroundColor: text.trim() ? COLORS.primary : COLORS.surface2,
                shadowColor: text.trim() ? COLORS.primary : "transparent",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: text.trim() ? 6 : 0,
              }}
              onPress={handleSubmit}
              disabled={!text.trim()}
              activeOpacity={0.85}
            >
              <Text
                className="text-[15px] font-extrabold"
                style={{
                  color: text.trim() ? "#fff" : COLORS.textMuted,
                  letterSpacing: -0.3,
                }}
              >
                💜 남기기
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default WritePostItModal;
