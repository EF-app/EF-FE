/**
 * @file features/hi/components/ChatModal.tsx
 * @description 매칭 첫 메시지 바텀시트
 *
 * WritePostItModal 방식 적용:
 *   translateY (슬라이드) + keyboardOffset (키보드) — 모두 native driver
 *   Animated.add(translateY, keyboardOffset) 으로 합산, KeyboardAvoidingView 없음
 *
 * 드라이버 분리:
 *   transform → Animated.View A (native driver)
 *   height    → Animated.View B (JS driver)  — 스냅 확장/축소 전용
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
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MatchProfile } from "../types";

interface Message {
  id: number;
  text: string;
  mine: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "안녕하세요 😊 프로필 보고 메시지 드려요!", mine: false },
];

const { height: SH } = Dimensions.get("window");
const SNAP_LOW = Math.round(SH * 0.5);
const SNAP_HIGH = Math.round(SH * 0.88);

interface Props {
  profile: MatchProfile | null;
  onClose: () => void;
  onSend?: (profileId: number) => void;
}

const ChatModal: React.FC<Props> = ({ profile, onClose, onSend }) => {
  const insets = useSafeAreaInsets();

  /* ── Animated values ── */
  const translateY = useRef(new Animated.Value(SH)).current; // native driver
  const opacity = useRef(new Animated.Value(0)).current; // native driver
  const sheetH = useRef(new Animated.Value(SNAP_LOW)).current; // JS driver

  /* ── Refs ── */
  const sheetHRef = useRef(SNAP_LOW);
  const isExpandedRef = useRef(false);
  const preferredSheetHRef = useRef(SNAP_LOW);
  const dragStartH = useRef(SNAP_LOW);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [composerHeight, setComposerHeight] = useState(60);
  const scrollRef = useRef<ScrollView>(null);

  /* JS driver 값 추적 */
  useEffect(() => {
    const id = sheetH.addListener(({ value }) => {
      sheetHRef.current = value;
    });
    return () => sheetH.removeListener(id);
  }, [sheetH]);

  /* ── 열기 / 닫기 ── */
  useEffect(() => {
    if (profile) {
      setMessages(INITIAL_MESSAGES);
      setInput("");
      setKeyboardInset(0);
      sheetH.setValue(SNAP_LOW);
      sheetHRef.current = SNAP_LOW;
      isExpandedRef.current = false;
      translateY.setValue(SH);
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
          toValue: SH,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [profile]);

  /* ── 키보드 리스너 ── */
  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const MIN_TOP = 60; // 시트 상단이 화면 위로 나가지 않을 최소 여백

    const onShow = (e: any) => {
      const kbH = e.endCoordinates.height;
      const composerLift = Platform.OS === "android"
        ? Math.max(composerHeight - Math.max(insets.bottom, 14), 0)
        : 0;
      const safeKeyboardLift = Platform.OS === "android"
        ? Math.max(kbH - insets.bottom, 0) + composerLift
        : kbH;
      const dur = Platform.OS === "ios" ? e.duration || 250 : 250;
      setKeyboardInset(safeKeyboardLift);

      // 키보드가 올라오면 입력창이 보이도록 시트를 가능한 높이까지 확장
      const maxH = SH - safeKeyboardLift - MIN_TOP;
      const keyboardTargetH = Math.min(SNAP_HIGH, maxH);
      sheetHRef.current = keyboardTargetH;
      Animated.timing(sheetH, {
        toValue: keyboardTargetH,
        duration: dur,
        useNativeDriver: false,
      }).start();

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    };

    const onHide = (e: any) => {
      const dur = Platform.OS === "ios" ? e.duration || 200 : 200;

      // 사용자가 원래 보고 있던 스냅 높이로 복원
      const targetH = preferredSheetHRef.current;
      sheetHRef.current = targetH;
      Animated.timing(sheetH, {
        toValue: targetH,
        duration: dur,
        useNativeDriver: false,
      }).start();

      setKeyboardInset(0);
    };

    const showSub = Keyboard.addListener(showEvt, onShow);
    const hideSub = Keyboard.addListener(hideEvt, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [sheetH, insets.bottom, composerHeight]);

  /* ── Snap / Dismiss (ref 패턴) ── */
  const snapHighRef = useRef<(() => void) | undefined>(undefined);
  const snapLowRef = useRef<(() => void) | undefined>(undefined);
  const dismissRef = useRef<(() => void) | undefined>(undefined);

  snapHighRef.current = () => {
    isExpandedRef.current = true;
    preferredSheetHRef.current = SNAP_HIGH;
    sheetHRef.current = SNAP_HIGH;
    Animated.spring(sheetH, {
      toValue: SNAP_HIGH,
      damping: 22,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  };

  snapLowRef.current = () => {
    isExpandedRef.current = false;
    preferredSheetHRef.current = SNAP_LOW;
    sheetHRef.current = SNAP_LOW;
    Animated.spring(sheetH, {
      toValue: SNAP_LOW,
      damping: 22,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  };

  dismissRef.current = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SH,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      translateY.setValue(SH);
      setKeyboardInset(0);
      onClose();
    });
  };

  /* ── PanResponder (핸들만) ── */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant: () => {
        sheetH.stopAnimation();
        dragStartH.current = sheetHRef.current;
      },
      onPanResponderMove: (_, { dy }) => {
        // dy < 0 = 위(확장), dy > 0 = 아래(축소/닫기)
        const newH = dragStartH.current - dy;
        const clamped = Math.max(SNAP_LOW * 0.4, Math.min(SNAP_HIGH, newH));
        sheetH.setValue(clamped);
        sheetHRef.current = clamped;
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const cur = sheetHRef.current;
        const mid = (SNAP_LOW + SNAP_HIGH) / 2;
        if (vy > 1.5 || dy > 100) {
          if (isExpandedRef.current) snapLowRef.current?.();
          else dismissRef.current?.();
        } else if (vy < -1 || cur > mid) {
          snapHighRef.current?.();
        } else if (cur < SNAP_LOW * 0.6) {
          dismissRef.current?.();
        } else {
          snapLowRef.current?.();
        }
      },
      onPanResponderTerminate: () => snapLowRef.current?.(),
    }),
  ).current;

  const handleClose = useCallback(() => dismissRef.current?.(), []);

  const sendMsg = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), text, mine: true }]);
    setInput("");
    if (profile) onSend?.(profile.id);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [input, profile, onSend]);

  const composerBottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 14 : 8);

  return (
    <Modal
      transparent
      visible={!!profile}
      onRequestClose={handleClose}
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View
        style={{ flex: 1, backgroundColor: "rgba(28,26,31,0.48)", opacity }}
      >
        {/* 배경 탭 → 닫기 */}
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        {/* ── A: 슬라이드 + 키보드 래퍼 (native driver, transform 전용) ── */}
        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
        >
          {/* ── B: 시트 높이 (JS driver, height 전용) ── */}
          <Animated.View
            style={{
              height: sheetH,
              marginBottom: keyboardInset,
              backgroundColor: COLORS.bg,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              overflow: "hidden",
            }}
          >
            {/* 핸들 */}
            <View
              style={{ alignItems: "center", paddingTop: 12, paddingBottom: 6 }}
              {...panResponder.panHandlers}
            >
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: COLORS.divider,
                }}
              />
            </View>

            {/* 헤더 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.divider,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: profile?.bgColor,
                }}
              >
                <Text style={{ fontSize: 22 }}>{profile?.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15.5,
                    fontFamily: "NanumSquareneodEb",
                    color: COLORS.textPrimary,
                    letterSpacing: -0.4,
                  }}
                >
                  {profile?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 11.5,
                    fontFamily: "NanumSquareNeoaLt",
                    color: COLORS.greenVivid,
                  }}
                >
                  방금 접속 · 활성
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: COLORS.surface2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleClose}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.textSecondary,
                    fontFamily: "NanumSquareNeocBd",
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* 메시지 목록 */}
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1, paddingHorizontal: 16 }}
              contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 14 + composerBottomInset,
                gap: 9,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: false })
              }
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={{ alignItems: msg.mine ? "flex-end" : "flex-start" }}
                >
                  <View
                    style={{
                      maxWidth: "78%",
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      backgroundColor: msg.mine
                        ? COLORS.primary
                        : COLORS.surface,
                      borderTopLeftRadius: msg.mine ? 18 : 4,
                      borderTopRightRadius: msg.mine ? 4 : 18,
                      borderBottomLeftRadius: 18,
                      borderBottomRightRadius: 18,
                      elevation: msg.mine ? 0 : 2,
                      shadowColor: COLORS.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: msg.mine ? 0 : 0.08,
                      shadowRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13.5,
                        fontFamily: "NanumSquareNeoaLt",
                        color: msg.mine ? "#fff" : COLORS.textPrimary,
                        lineHeight: 21,
                      }}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* 입력 바 */}
            <View
              onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 8,
                paddingHorizontal: 14,
                paddingTop: 10,
                paddingBottom: composerBottomInset,
                borderTopWidth: 1,
                borderTopColor: COLORS.divider,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  borderRadius: 22,
                  paddingHorizontal: 14,
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontSize: 13.5,
                  fontFamily: "NanumSquareNeoaLt",
                  color: COLORS.textPrimary,
                  backgroundColor: COLORS.surface,
                  borderWidth: 1,
                  borderColor: COLORS.divider,
                  maxHeight: 100,
                }}
                placeholder="메시지를 입력하세요..."
                placeholderTextColor={COLORS.textMuted}
                value={input}
                onChangeText={setInput}
                onFocus={() => {
                  snapHighRef.current?.();
                  setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
                }}
                onSubmitEditing={sendMsg}
                returnKeyType="send"
                multiline
              />
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: input.trim()
                    ? COLORS.primary
                    : COLORS.surface2,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: input.trim() ? 0.35 : 0,
                  shadowRadius: 12,
                  elevation: input.trim() ? 4 : 0,
                }}
                activeOpacity={0.85}
                onPress={sendMsg}
                disabled={!input.trim()}
              >
                <Text style={{ fontSize: 16 }}>↑</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ChatModal;
