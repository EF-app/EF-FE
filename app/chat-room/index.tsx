/**
 * @file app/chat-room/index.tsx
 * @description 채팅방 화면
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface Message {
  id: number;
  text: string;
  mine: boolean;
  time: string;
}

const MOCK_PROFILE = {
  name: '유니짜장',
  age: 27,
  loc: '서울',
  status: '방금 접속',
  emoji: '👩',
  tags: ['#여행', '#독서', '#카페', '#음식'],
  topic: '💬 [금요일 밤인데 너무 심심하다 ㅠㅠ]에 대한 채팅입니다.',
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: '안녕하세요 ㅎㅎ',     mine: true,  time: '오후 8:12' },
  { id: 2, text: '네 안녕하세요 ㅎㅎ', mine: false, time: '오후 8:13' },
  { id: 3, text: '저녁 뭐 드셨어요?',  mine: true,  time: '오후 9:45' },
  { id: 4, text: '카레 먹었어용 🍛',   mine: false, time: '오전 12:32' },
];

const TRAY_ITEMS = [
  { icon: '📷', label: '앨범',   purple: false },
  { icon: '📸', label: '카메라', purple: true  },
  { icon: '📝', label: '메모',   purple: false },
  { icon: '📍', label: '위치',   purple: true  },
  { icon: '👤', label: '연락처', purple: false },
  { icon: '📎', label: '파일',   purple: true  },
  { icon: '🎁', label: '선물',   purple: false },
];

function nowTime() {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? '오후' : '오전';
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${ap} ${hh}:${m}`;
}

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [trayOpen, setTrayOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const trayHeight  = useRef(new Animated.Value(0)).current;
  const trayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(trayHeight,  { toValue: trayOpen ? 170 : 0, duration: 280, useNativeDriver: false }),
      Animated.timing(trayOpacity, { toValue: trayOpen ? 1   : 0, duration: 200, useNativeDriver: false }),
    ]).start();
  }, [trayOpen, trayHeight, trayOpacity]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMsg = useCallback((text?: string) => {
    const txt = (text ?? input).trim();
    if (!txt) return;
    setMessages(prev => [...prev, { id: Date.now(), text: txt, mine: true, time: nowTime() }]);
    setInput('');
    setTrayOpen(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [input]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 헤더 ── */}
      <View
        className="flex-row items-center gap-[11px] px-[18px] pb-[12px] pt-[6px] border-b border-ef-divider"
        style={{ backgroundColor: COLORS.bg }}
      >
        <TouchableOpacity
          className="w-[36px] h-[36px] rounded-[12px] items-center justify-center"
          style={{
            backgroundColor: 'rgba(150,134,191,0.22)',
            borderWidth: 1,
            borderColor: 'rgba(150,134,191,0.3)',
          }}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-[17px] font-extrabold text-ef-text" style={{ letterSpacing: -0.5 }}>
            {MOCK_PROFILE.name}
          </Text>
          <Text className="text-[11.5px] font-sans" style={{ color: COLORS.primary, opacity: 0.85 }}>
            {MOCK_PROFILE.age}세 · {MOCK_PROFILE.loc} · {MOCK_PROFILE.status}
          </Text>
        </View>

        <TouchableOpacity
          className="w-[40px] h-[40px] rounded-[14px] items-center justify-center"
          style={{
            backgroundColor: 'rgba(150,134,191,0.22)',
            borderWidth: 2,
            borderColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20 }}>{MOCK_PROFILE.emoji}</Text>
        </TouchableOpacity>
      </View>

      {/* ── 태그 스트립 ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
          backgroundColor: 'rgba(150,134,191,0.15)',
          borderBottomWidth: 1.5,
          borderBottomColor: 'rgba(150,134,191,0.22)',
        }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingVertical: 8, gap: 7 }}
      >
        {MOCK_PROFILE.tags.map(tag => (
          <View
            key={tag}
            className="rounded-[20px] px-[12px] py-[4px] flex-shrink-0"
            style={{
              backgroundColor: 'rgba(150,134,191,0.28)',
              borderWidth: 1,
              borderColor: 'rgba(150,134,191,0.38)',
            }}
          >
            <Text
              className="text-[11.5px] font-extrabold"
              style={{ color: COLORS.primaryMid, letterSpacing: -0.1 }}
            >
              {tag}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* ── 채팅 영역 ── */}
      <KeyboardAvoidingView
        className="flex-1"
        style={{ flex: 1, paddingBottom: keyboardHeight }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 24}
        enabled
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 bg-ef-bg"
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 14 + keyboardHeight + Math.max(insets.bottom, 12) }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          onTouchStart={() => setTrayOpen(false)}
        >
          {/* Topic intro card */}
          <View
            className="rounded-[14px] px-[14px] py-[10px]"
            style={{
              backgroundColor: 'rgba(150,134,191,0.12)',
              borderWidth: 1,
              borderColor: 'rgba(150,134,191,0.26)',
            }}
          >
            <Text
              className="text-[12.5px] font-bold text-center"
              style={{ color: COLORS.primaryMid, lineHeight: 20 }}
            >
              {MOCK_PROFILE.topic}
            </Text>
          </View>

          {/* Date separator */}
          <View className="flex-row items-center gap-[10px]">
            <View className="flex-1 h-[1px]" style={{ backgroundColor: 'rgba(150,134,191,0.25)' }} />
            <Text className="text-[11px] font-sans" style={{ color: COLORS.primary, opacity: 0.7 }}>오늘</Text>
            <View className="flex-1 h-[1px]" style={{ backgroundColor: 'rgba(150,134,191,0.25)' }} />
          </View>

          {/* Messages */}
          {messages.map(msg => (
            <View
              key={msg.id}
              className={`flex-row items-end gap-[8px] ${msg.mine ? 'flex-row-reverse' : ''}`}
            >
              {!msg.mine && (
                <View
                  className="w-[34px] h-[34px] rounded-[12px] items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(150,134,191,0.22)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(150,134,191,0.35)',
                  }}
                >
                  <Text style={{ fontSize: 17 }}>{MOCK_PROFILE.emoji}</Text>
                </View>
              )}
              <View
                className={`gap-[3px] ${msg.mine ? 'items-end' : 'items-start'}`}
                style={{ maxWidth: '66%' }}
              >
                <View
                  className="px-[14px] py-[10px]"
                  style={{
                    backgroundColor: msg.mine ? COLORS.primary : COLORS.surface,
                    borderRadius: 18,
                    borderBottomRightRadius: msg.mine ? 5 : 18,
                    borderBottomLeftRadius:  msg.mine ? 18 : 5,
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: msg.mine ? 4 : 2 },
                    shadowOpacity: msg.mine ? 0.45 : 0.1,
                    shadowRadius: msg.mine ? 18 : 8,
                    elevation: msg.mine ? 4 : 2,
                  }}
                >
                  <Text
                    className="text-[14px] font-bold"
                    style={{ color: msg.mine ? '#fff' : COLORS.textPrimary, lineHeight: 22 }}
                  >
                    {msg.text}
                  </Text>
                </View>
                <Text className="text-[10.5px] font-sans text-ef-text-muted px-[3px]">
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ── 바텀 독 ── */}
        <View
          className="border-t border-ef-divider"
          style={{ backgroundColor: COLORS.bg, paddingBottom: Math.max(insets.bottom, 12) }}
        >
          {/* Input row */}
          <View className="px-[14px] py-[10px]">
            <View
              className="flex-row items-center gap-[8px] rounded-[24px] px-[5px] py-[5px] pl-[8px]"
              style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1.5,
                borderColor: 'rgba(150,134,191,0.32)',
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.14,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <TouchableOpacity
                className="w-[36px] h-[36px] rounded-[12px] items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: trayOpen ? 'rgba(150,134,191,0.35)' : 'rgba(150,134,191,0.22)',
                  borderWidth: 1,
                  borderColor: 'rgba(150,134,191,0.3)',
                }}
                onPress={() => setTrayOpen(o => !o)}
                activeOpacity={0.8}
              >
                <Ionicons name={trayOpen ? 'close' : 'add'} size={17} color={COLORS.primary} />
              </TouchableOpacity>

              <TextInput
                className="flex-1 text-[14px] font-bold text-ef-text"
                style={{ height: 36, textAlignVertical: 'center', paddingVertical: 0, lineHeight: 20 }}
                placeholder="메시지를 입력하세요."
                placeholderTextColor={COLORS.textMuted}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => sendMsg()}
                onFocus={() => setTrayOpen(false)}
                returnKeyType="send"
              />

              <TouchableOpacity
                className="w-[38px] h-[38px] rounded-[13px] items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: COLORS.primaryMid,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.5,
                  shadowRadius: 14,
                  elevation: 4,
                }}
                onPress={() => sendMsg()}
                activeOpacity={0.85}
              >
                <Ionicons name="send" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tray */}
          <Animated.View style={{ height: trayHeight, opacity: trayOpacity, overflow: 'hidden' }}>
            <View
              className="px-[16px] pt-[14px] pb-[10px]"
              style={{ backgroundColor: 'rgba(150,134,191,0.07)', borderTopWidth: 1, borderTopColor: COLORS.divider }}
            >
              <View className="flex-row flex-wrap gap-[10px]">
                {TRAY_ITEMS.map(item => (
                  <TouchableOpacity
                    key={item.label}
                    className="items-center gap-[7px]"
                    style={{ width: 58 }}
                    onPress={() => sendMsg(`${item.label} 파일을 전송했습니다.`)}
                    activeOpacity={0.8}
                  >
                    <View
                      className="w-[58px] h-[58px] rounded-[18px] items-center justify-center"
                      style={{
                        backgroundColor: item.purple ? 'rgba(150,134,191,0.22)' : COLORS.surface,
                        borderWidth: 1.5,
                        borderColor: item.purple ? 'rgba(150,134,191,0.3)' : COLORS.divider,
                        shadowColor: COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.14,
                        shadowRadius: 10,
                        elevation: 2,
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                    </View>
                    <Text className="text-[10.5px] font-bold text-ef-text-sub">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
