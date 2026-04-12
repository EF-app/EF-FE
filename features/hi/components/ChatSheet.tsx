/**
 * @file features/hi/components/ChatSheet.tsx
 * @description Bottom sheet for sending a message to a matched profile
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { MatchProfile } from '../types';

interface Message {
  id: number;
  text: string;
  mine: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: '안녕하세요 😊 프로필 보고 메시지 드려요!', mine: false },
];

const SH = Dimensions.get('window').height;

interface Props {
  profile: MatchProfile | null;
  onClose: () => void;
}

const ChatSheet: React.FC<Props> = ({ profile, onClose }) => {
  const translateY = useRef(new Animated.Value(SH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (profile) {
      setMessages(INITIAL_MESSAGES);
      setInput('');
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SH, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [profile]);

  const sendMsg = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), text, mine: true }]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  if (!profile) return null;

  return (
    <Animated.View
      className="absolute inset-0 z-50"
      style={{ opacity: overlayOpacity, backgroundColor: 'rgba(28,26,31,0.48)' }}
    >
      <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />

      <Animated.View
        className="bg-ef-bg rounded-t-[26px] flex-col"
        style={{ maxHeight: SH * 0.75, transform: [{ translateY }] }}
      >
        {/* Handle */}
        <View className="items-center pt-[12px] pb-[4px]">
          <View className="w-[36px] h-[4px] rounded-[2px] bg-ef-divider" />
        </View>

        {/* Header */}
        <View
          className="flex-row items-center gap-[12px] px-[18px] py-[12px] border-b border-ef-divider"
        >
          <View
            className="w-[44px] h-[44px] rounded-full items-center justify-center flex-shrink-0"
            style={{ backgroundColor: profile.bgColor }}
          >
            <Text style={{ fontSize: 22 }}>{profile.emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[15.5px] font-extrabold text-ef-text" style={{ letterSpacing: -0.4 }}>
              {profile.name}
            </Text>
            <Text className="text-[11.5px] font-sans" style={{ color: COLORS.greenVivid }}>
              방금 접속 · 활성
            </Text>
          </View>
          <TouchableOpacity
            className="w-[30px] h-[30px] rounded-full bg-ef-divider items-center justify-center"
            onPress={onClose}
          >
            <Text className="text-[13px] text-ef-text-sub font-bold">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-[16px]"
          contentContainerStyle={{ paddingVertical: 14, gap: 9 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              className={msg.mine ? 'items-end' : 'items-start'}
            >
              <View
                className="max-w-[78%] px-[14px] py-[10px]"
                style={{
                  backgroundColor: msg.mine ? COLORS.primary : COLORS.surface,
                  borderRadius: msg.mine ? 18 : undefined,
                  borderTopLeftRadius: msg.mine ? 18 : 4,
                  borderTopRightRadius: msg.mine ? 4 : 18,
                  borderBottomLeftRadius: 18,
                  borderBottomRightRadius: 18,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: msg.mine ? 0 : 0.08,
                  shadowRadius: 8,
                  elevation: msg.mine ? 0 : 2,
                }}
              >
                <Text
                  className="text-[13.5px] font-sans"
                  style={{ color: msg.mine ? '#fff' : COLORS.textPrimary, lineHeight: 21 }}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input row */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            className="flex-row items-end gap-[8px] px-[14px] py-[10px] border-t border-ef-divider"
            style={{ paddingBottom: Platform.OS === 'ios' ? 28 : 14 }}
          >
            <TextInput
              className="flex-1 rounded-[22px] px-[14px] py-[10px] text-[13.5px] font-sans text-ef-text bg-ef-surface border border-ef-divider"
              placeholder="메시지를 입력하세요..."
              placeholderTextColor={COLORS.textMuted}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMsg}
              returnKeyType="send"
              multiline
            />
            <TouchableOpacity
              className="w-[40px] h-[40px] rounded-full items-center justify-center"
              style={{
                backgroundColor: COLORS.primary,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 4,
              }}
              activeOpacity={0.85}
              onPress={sendMsg}
            >
              <Text style={{ fontSize: 16 }}>↑</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
};

export default ChatSheet;
