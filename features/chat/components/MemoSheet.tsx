/**
 * @file features/chat/components/MemoSheet.tsx
 * @description 채팅 메모 바텀시트
 */

import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { Chat } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  chat: Chat | null;
  onClose: () => void;
  onSave: (chatId: number, memo: string) => void;
}

const MemoSheet: React.FC<Props> = ({ chat, onClose, onSave }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState('');

  useEffect(() => {
    if (chat) {
      setText(chat.memo ?? '');
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [chat]);

  if (!chat) return null;

  const handleSave = () => {
    onSave(chat.id, text.trim());
    onClose();
  };

  return (
    <Modal transparent visible={!!chat} onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(20,16,36,0.42)', opacity }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
          <Animated.View
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              paddingBottom: 24,
              transform: [{ translateY }],
            }}
          >
            {/* handle */}
            <View className="items-center pt-[14px] pb-0">
              <View className="w-[36px] h-[4px] rounded-[2px] bg-ef-divider" />
            </View>

            {/* header */}
            <View className="flex-row items-center justify-between px-5 py-[14px]">
              <View className="flex-row items-center gap-[10px]">
                <View
                  className="w-[38px] h-[38px] rounded-full items-center justify-center"
                  style={{ backgroundColor: chat.gradColors[1] }}
                >
                  <Text style={{ fontSize: 20 }}>{chat.emoji}</Text>
                </View>
                <View>
                  <Text className="text-[14px] text-ef-text font-extrabold" style={{ letterSpacing: -0.3 }}>
                    {chat.name}
                  </Text>
                  <Text className="text-[11px] text-ef-text-muted font-sans mt-[1px]">나만 보이는 메모</Text>
                </View>
              </View>
              <TouchableOpacity
                className="w-[30px] h-[30px] rounded-full bg-ef-divider items-center justify-center"
                onPress={onClose}
              >
                <Text className="text-[14px] text-ef-text-sub">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-ef-divider mx-5" />

            {/* textarea */}
            <View className="px-5 pt-[14px] pb-0">
              <Text className="text-[11px] font-extrabold mb-[8px]" style={{ color: COLORS.primary, letterSpacing: 0.3 }}>
                ✏ 메모
              </Text>
              <TextInput
                className="rounded-[16px] px-[16px] py-[14px] text-[13.5px] font-sans text-ef-text"
                style={{
                  backgroundColor: COLORS.primaryLight,
                  borderWidth: 1.5,
                  borderColor: 'transparent',
                  minHeight: 110,
                  lineHeight: 22,
                  textAlignVertical: 'top',
                }}
                value={text}
                onChangeText={setText}
                placeholder={`이 분에 대해 기억하고 싶은 것을 적어두세요 💜\n예) 취미, 대화 소재, 느낀 점 등`}
                placeholderTextColor={COLORS.textMuted}
                multiline
                returnKeyType="default"
              />
              {chat.memoDate && (
                <Text className="text-[11px] text-ef-text-muted font-sans text-right mt-[6px]">
                  마지막 수정: {chat.memoDate}
                </Text>
              )}
            </View>

            {/* actions */}
            <View className="flex-row gap-[8px] px-5 pt-[12px]">
              <TouchableOpacity
                className="flex-1 h-[46px] rounded-[14px] items-center justify-center border-[1.5px] border-ef-divider"
                onPress={onClose}
              >
                <Text className="text-[14px] font-bold text-ef-text-sub">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="h-[46px] rounded-[14px] items-center justify-center"
                style={{
                  flex: 2,
                  backgroundColor: COLORS.primary,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.36,
                  shadowRadius: 16,
                  elevation: 6,
                }}
                onPress={handleSave}
              >
                <Text className="text-[14px] font-extrabold text-white">저장하기</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MemoSheet;
