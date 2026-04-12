/**
 * @file features/home/post-it/components/WritePostItModal.tsx
 * @description 종이비행기 작성 모달
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { COLORS } from '@/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_CHARS = 150;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string, anonymous: boolean) => void;
}

const WritePostItModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 220, useNativeDriver: true }),
      ]).start();
      setText('');
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim(), anonymous);
    onClose();
  };

  if (!visible) return null;

  const remaining = MAX_CHARS - text.length;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(28,26,31,0.45)', opacity }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
          <Animated.View
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              paddingBottom: 32,
              transform: [{ translateY }],
            }}
          >
            {/* handle */}
            <View className="items-center pt-[14px]">
              <View className="w-[36px] h-[4px] rounded-[2px] bg-ef-divider" />
            </View>

            {/* header */}
            <View className="flex-row items-center justify-between px-5 py-[14px]">
              <Text className="text-[17px] text-ef-text font-extrabold" style={{ letterSpacing: -0.4 }}>
                ✈ 종이비행기 날리기
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-[14px] text-ef-text-muted font-sans">취소</Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-ef-divider mx-5 mb-[14px]" />

            {/* textarea */}
            <View className="px-5">
              <TextInput
                className="rounded-[16px] px-[16px] py-[14px] text-[14px] font-sans text-ef-text"
                style={{
                  backgroundColor: COLORS.bg,
                  borderWidth: 1.5,
                  borderColor: COLORS.primaryBorder,
                  minHeight: 120,
                  lineHeight: 22,
                  textAlignVertical: 'top',
                }}
                value={text}
                onChangeText={t => t.length <= MAX_CHARS && setText(t)}
                placeholder="마음속 이야기를 자유롭게 날려보세요 💜"
                placeholderTextColor={COLORS.textMuted}
                multiline
                autoFocus
              />
              <Text
                className="text-[11px] font-sans text-right mt-[6px]"
                style={{ color: remaining < 20 ? COLORS.danger : COLORS.textMuted }}
              >
                {remaining}자 남음
              </Text>
            </View>

            {/* 익명 토글 */}
            <View className="flex-row items-center justify-between px-5 mt-[12px]">
              <View>
                <Text className="text-[14px] text-ef-text font-bold">익명으로 보내기</Text>
                <Text className="text-[11px] text-ef-text-muted font-sans mt-[2px]">닉네임 대신 '익명'으로 표시돼요</Text>
              </View>
              <Switch
                value={anonymous}
                onValueChange={setAnonymous}
                trackColor={{ false: COLORS.surface2, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>

            {/* 전송 버튼 */}
            <View className="px-5 mt-[16px]">
              <TouchableOpacity
                className="w-full h-[52px] rounded-[16px] items-center justify-center"
                style={{
                  backgroundColor: text.trim() ? COLORS.primary : COLORS.surface2,
                  shadowColor: text.trim() ? COLORS.primary : 'transparent',
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
                  style={{ color: text.trim() ? '#fff' : COLORS.textMuted, letterSpacing: -0.3 }}
                >
                  ✈ 날리기
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default WritePostItModal;
