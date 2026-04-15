/**
 * @file app/(tabs)/home/bal-game/index.tsx
 * @description 밸런스 게임 댓글 화면
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useCurrentBalanceGame } from '@home/bal-game/hooks/useBalGame';
import CommentItem from '@home/bal-game/components/CommentItem';
import { MOCK_COMMENTS } from '@home/bal-game/api/commentsApi';
import { Comment } from '@home/bal-game/types/comments';

const MY_USER_ID = 'me';
const NICK_POOL = [
  { nick: '졸린고양이🐱', letter: '고', avColor: 'purple' },
  { nick: '수달친구🦦',   letter: '수', avColor: 'blue'   },
  { nick: '하품판다🐼',   letter: '판', avColor: 'green'  },
  { nick: '뽀글이🐑',    letter: '뽀', avColor: 'pink'   },
  { nick: '민들레🌻',    letter: '민', avColor: 'amber'  },
];

function pickMyNick() {
  return NICK_POOL[Math.floor(Math.random() * NICK_POOL.length)];
}

export default function BalGameCommentsScreen() {
  const router = useRouter();
  const { data: game } = useCurrentBalanceGame();
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [input, setInput] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ commentId: number; nick: string } | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  let nextId = useRef(100);

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const pctA = game
    ? Math.round((game.optionA.votes / game.totalVotes) * 100)
    : 62;
  const pctB = game ? 100 - pctA : 38;

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }, 2000);
  }, []);

  const handleLike = useCallback((commentId: number) => {
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        : c,
    ));
  }, []);

  const handleReplyLike = useCallback((commentId: number, replyId: number) => {
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId
                ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                : r,
            ),
          }
        : c,
    ));
  }, []);

  const handleSetReply = useCallback((commentId: number, nick: string) => {
    setReplyTarget({ commentId, nick });
    inputRef.current?.focus();
  }, []);

  const cancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const handleDelete = useCallback((commentId: number) => {
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, deleted: true } : c,
    ));
    showToast('삭제되었습니다');
  }, [showToast]);

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const myNick = pickMyNick();

    if (replyTarget) {
      setComments(prev => prev.map(c =>
        c.id === replyTarget.commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: nextId.current++,
                  userId: MY_USER_ID,
                  nick: myNick.nick,
                  letter: myNick.letter,
                  avColor: myNick.avColor,
                  text: `@${replyTarget.nick} ${text}`,
                  time: '방금',
                  likes: 0,
                  liked: false,
                  deleted: false,
                },
              ],
            }
          : c,
      ));
      setReplyTarget(null);
    } else {
      setComments(prev => [
        ...prev,
        {
          id: nextId.current++,
          userId: MY_USER_ID,
          nick: myNick.nick,
          letter: myNick.letter,
          avColor: myNick.avColor,
          text,
          time: '방금',
          likes: 0,
          liked: false,
          deleted: false,
          replies: [],
        },
      ]);
    }

    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input, replyTarget]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 헤더 ── */}
      <View className="flex-row items-center gap-[12px] px-5 py-[10px] border-b border-ef-divider">
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-full bg-ef-surface2 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={16} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="flex-1 text-[15px] text-ef-text font-extrabold" style={{ letterSpacing: -0.3 }}>
          밸런스 게임 댓글
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-[4px] rounded-[20px] px-[12px] py-[6px]"
          style={{ backgroundColor: COLORS.primaryTint, borderWidth: 1, borderColor: COLORS.primaryBorder }}
          onPress={() => router.push('/(tabs)/home/bal-game/write')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={12} color={COLORS.primary} />
          <Text className="text-[11.5px] font-bold" style={{ color: COLORS.primary }}>만들기</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {/* ── 게임 요약 카드 ── */}
          <View
            className="mx-4 mt-[14px] rounded-[18px] overflow-hidden bg-ef-surface"
            style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.13, shadowRadius: 14, elevation: 4 }}
          >
            {/* VS row */}
            <View className="relative overflow-hidden" style={{ paddingHorizontal: 14, paddingVertical: 16 }}>
              {/* fill bars */}
              <View className="absolute top-0 left-0 bottom-0" style={{ width: `${pctA}%`, backgroundColor: 'rgba(150,134,191,0.13)' }} />
              <View className="absolute top-0 right-0 bottom-0" style={{ width: `${pctB}%`, backgroundColor: 'rgba(150,134,191,0.07)' }} />
              <View className="flex-row items-center gap-[8px] z-10">
                <Text className="flex-1 text-[12.5px] text-ef-text font-bold" style={{ lineHeight: 20 }}>
                  {game?.optionA.label ?? '출근길 지하철\n개찰구 앞에서\n교통카드\n놓고온 거 인지함'}
                </Text>
                <View className="rounded-[10px] px-[8px] py-[5px]" style={{ backgroundColor: COLORS.primaryTint }}>
                  <Text className="text-[14px] font-extrabold" style={{ color: COLORS.primary }}>VS</Text>
                </View>
                <Text className="flex-1 text-[12.5px] text-ef-text font-bold text-right" style={{ lineHeight: 20 }}>
                  {game?.optionB.label ?? '퇴근길 지하철\n개찰구 앞에서\n이어폰\n두고온 거 인지함'}
                </Text>
              </View>
            </View>

            {/* bar */}
            <View className="h-[3px] bg-ef-surface2 mx-[14px]">
              <View className="h-full" style={{ width: `${pctA}%`, backgroundColor: COLORS.primary }} />
            </View>

            {/* pcts */}
            <View className="flex-row justify-between px-[14px] pt-[4px]">
              <Text className="text-[10.5px] font-extrabold" style={{ color: COLORS.primary }}>{pctA}%</Text>
              <Text className="text-[10.5px] font-extrabold" style={{ color: COLORS.primary }}>{pctB}%</Text>
            </View>

            {/* meta */}
            <View className="flex-row items-center justify-between px-[14px] py-[10px]">
              <View className="flex-row items-center gap-[4px]">
                <Ionicons name="chatbubble-outline" size={13} color={COLORS.textMuted} />
                <Text className="text-[11.5px] font-bold text-ef-text-muted">
                  댓글 <Text className="font-extrabold">{totalCount}</Text>개
                </Text>
              </View>
              <View className="rounded-[12px] px-[10px] py-[3px]" style={{ backgroundColor: COLORS.primaryTint }}>
                <Text className="text-[10.5px] font-bold" style={{ color: COLORS.primary }}>투표 완료</Text>
              </View>
            </View>
          </View>

          {/* ── 댓글 목록 ── */}
          <View className="px-4 pt-[16px]">
            <Text className="text-[12px] font-bold text-ef-text-muted mb-[14px] pl-[2px]" style={{ letterSpacing: 0.4 }}>
              댓글
            </Text>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onReplyLike={handleReplyLike}
                onReply={handleSetReply}
                onDelete={handleDelete}
              />
            ))}
          </View>
        </ScrollView>

        {/* ── 답글 대상 바 ── */}
        {replyTarget && (
          <View
            className="flex-row items-center justify-between px-4 py-[6px] border-t border-ef-divider"
            style={{ backgroundColor: COLORS.primaryTint }}
          >
            <Text className="text-[12px] font-bold" style={{ color: COLORS.primary }}>
              @{replyTarget.nick} 에게 답글 작성 중
            </Text>
            <TouchableOpacity onPress={cancelReply}>
              <Text className="text-[11px] font-bold text-ef-text-muted">✕ 취소</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── 입력창 ── */}
        <View
          className="flex-row items-center gap-[10px] px-4 pt-[10px] pb-[16px] border-t border-ef-divider bg-ef-surface"
        >
          <View
            className="w-[32px] h-[32px] rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.primaryTint }}
          >
            <Text className="text-[11px] font-extrabold" style={{ color: COLORS.primary }}>나</Text>
          </View>
          <TextInput
            ref={inputRef}
            className="flex-1 rounded-[22px] px-[16px] py-[10px] text-[13.5px] font-sans text-ef-text"
            style={{
              backgroundColor: COLORS.bg,
              borderWidth: 1.5,
              borderColor: input ? COLORS.primary : 'transparent',
              maxHeight: 80,
            }}
            placeholder="댓글을 남겨보세요..."
            placeholderTextColor={COLORS.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
          />
          <TouchableOpacity
            className="w-[38px] h-[38px] rounded-full items-center justify-center"
            style={{ backgroundColor: input.trim() ? COLORS.primary : COLORS.surface2 }}
            onPress={handleSubmit}
            disabled={!input.trim()}
          >
            <Ionicons name="arrow-forward" size={16} color={input.trim() ? '#fff' : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── 토스트 ── */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 90,
          alignSelf: 'center',
          backgroundColor: 'rgba(28,26,31,0.85)',
          borderRadius: 20,
          paddingHorizontal: 18,
          paddingVertical: 9,
          opacity: toastOpacity,
          pointerEvents: 'none',
        }}
      >
        <Text className="text-[12px] font-bold text-white">{toastMsg}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}
