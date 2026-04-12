/**
 * @file app/(tabs)/chat-list/index.tsx
 * @description 채팅 목록 화면
 */

import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ChatItem from '@/features/chat/components/ChatItem';
import MemoSheet from '@/features/chat/components/MemoSheet';
import { useChats } from '@/features/chat/hooks/useChat';
import { isToday } from '@/features/chat/api/chatApi';
import { Chat, ChatTab } from '@/features/chat/types';

const TABS: { key: ChatTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'unread', label: '안읽음' },
  { key: 'liked', label: '좋아요 💜' },
];

export default function ChatListScreen() {
  const router = useRouter();
  const { data: rawChats, isLoading } = useChats();
  const [chats, setChats] = useState<Chat[]>([]);
  const [tab, setTab] = useState<ChatTab>('all');
  const [query, setQuery] = useState('');
  const [memoTarget, setMemoTarget] = useState<Chat | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  let toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync rawChats → local state (so memo updates work)
  React.useEffect(() => {
    if (rawChats) setChats(rawChats);
  }, [rawChats]);

  const filtered = useMemo(() => {
    let list = chats;
    if (tab === 'unread') list = list.filter(c => c.unread > 0);
    if (tab === 'liked')  list = list.filter(c => c.liked);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => c.name.includes(q) || c.preview.toLowerCase().includes(q));
    }
    return list;
  }, [chats, tab, query]);

  const todayChats = useMemo(() => filtered.filter(c => isToday(c.time)), [filtered]);
  const prevChats  = useMemo(() => filtered.filter(c => !isToday(c.time)), [filtered]);

  const showBothSections = todayChats.length > 0 && prevChats.length > 0;

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    Animated.timing(toastOpacity, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }, 2200);
  }, []);

  const handleChatPress = useCallback((chat: Chat) => {
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
    router.push({ pathname: '/chat-room', params: { id: chat.id } });
  }, [router]);

  const handleMemoSave = useCallback((chatId: number, memo: string) => {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChats(prev => prev.map(c =>
      c.id === chatId
        ? { ...c, memo: memo || undefined, memoDate: memo ? dateStr : undefined }
        : c,
    ));
    showToast(memo ? '💜 메모가 저장됐어요' : '메모가 삭제됐어요');
  }, [showToast]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 헤더 ── */}
      <View className="flex-row items-center justify-between px-[18px] pt-[10px] pb-[8px]">
        <Text className="text-[18px] text-ef-text font-extrabold" style={{ letterSpacing: -0.5 }}>
          채팅
        </Text>
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
          style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 }}
        >
          <Ionicons name="options-outline" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── 검색 ── */}
      <View className="px-4 pb-[4px]">
        <View
          className="flex-row items-center gap-[8px] bg-ef-surface rounded-[14px] px-[14px] py-[9px]"
          style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 }}
        >
          <Ionicons name="search-outline" size={15} color={COLORS.textMuted} />
          <TextInput
            className="flex-1 text-[13px] font-sans text-ef-text"
            placeholder="이름 또는 메시지 검색"
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* ── 탭 ── */}
      <View className="flex-row px-[18px]">
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            className="flex-1 pb-[9px] pt-[10px] items-center"
            style={{ borderBottomWidth: 2.5, borderBottomColor: tab === t.key ? COLORS.primary : 'transparent' }}
            onPress={() => setTab(t.key)}
          >
            <Text
              className="text-[13px]"
              style={{
                color: tab === t.key ? COLORS.primary : COLORS.textMuted,
                fontFamily: tab === t.key ? 'NanumSquareNeo-dEb' : 'NanumSquareNeo-cBd',
                letterSpacing: -0.2,
              }}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 목록 ── */}
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : filtered.length === 0 ? (
        <EmptyChat />
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {todayChats.length > 0 && (
            <>
              {showBothSections && <SectionLabel label="오늘" />}
              {todayChats.map((chat, i) => (
                <React.Fragment key={chat.id}>
                  <ChatItem chat={chat} onPress={handleChatPress} onMemoPress={setMemoTarget} />
                  {i < todayChats.length - 1 && <View className="h-px bg-ef-divider mx-[18px]" />}
                </React.Fragment>
              ))}
            </>
          )}
          {prevChats.length > 0 && (
            <>
              <SectionLabel label="이전" style={{ marginTop: showBothSections ? 8 : 0 }} />
              {prevChats.map((chat, i) => (
                <React.Fragment key={chat.id}>
                  <ChatItem chat={chat} onPress={handleChatPress} onMemoPress={setMemoTarget} />
                  {i < prevChats.length - 1 && <View className="h-px bg-ef-divider mx-[18px]" />}
                </React.Fragment>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* ── 메모 바텀시트 ── */}
      <MemoSheet
        chat={memoTarget}
        onClose={() => setMemoTarget(null)}
        onSave={handleMemoSave}
      />

      {/* ── 토스트 ── */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 110,
          alignSelf: 'center',
          backgroundColor: 'rgba(28,26,31,0.88)',
          borderRadius: 20,
          paddingHorizontal: 18,
          paddingVertical: 10,
          opacity: toastOpacity,
          pointerEvents: 'none',
        }}
      >
        <Text className="text-[13px] font-bold text-white">{toastMsg}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const SectionLabel: React.FC<{ label: string; style?: object }> = ({ label, style }) => (
  <View className="px-[18px] pt-[14px] pb-[6px]" style={style}>
    <Text className="text-[11px] font-extrabold text-ef-text-muted" style={{ letterSpacing: 0.4 }}>
      {label.toUpperCase()}
    </Text>
  </View>
);

const EmptyChat: React.FC = () => (
  <View className="flex-1 items-center justify-center px-[30px] gap-[12px]">
    <Text style={{ fontSize: 48 }}>💌</Text>
    <Text className="text-[16px] text-ef-text font-extrabold" style={{ letterSpacing: -0.4 }}>채팅이 없어요</Text>
    <Text className="text-[13px] text-ef-text-muted font-sans text-center" style={{ lineHeight: 22 }}>
      매칭 화면에서 마음에 드는{'\n'}분께 메시지를 보내보세요!
    </Text>
  </View>
);
