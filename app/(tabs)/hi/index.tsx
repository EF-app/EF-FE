/**
 * @file app/(tabs)/hi/index.tsx
 * @description 매칭 스와이프 화면
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import SwipeCard from '@/features/hi/components/SwipeCard';
import EmptyState from '@/features/hi/components/EmptyState';
import ChatModal from '@/features/hi/components/ChatModal';
import MatchResultPopup from '@/features/hi/components/MatchResultPopup';
import { useProfiles } from '@/features/hi/hooks/useHi';
import { MatchProfile } from '@/features/hi/types';
import { MatchSummary } from '@/features/likes/types';

const { width: SW } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

export default function HiScreen() {
  const router = useRouter();
  const { data: rawProfiles, isLoading, refetch } = useProfiles();
  const [moreOpen, setMoreOpen] = useState(false);

  const [queue, setQueue] = useState<MatchProfile[]>([]);
  const [curIdx, setCurIdx] = useState(0);
  const [lastPassed, setLastPassed] = useState<MatchProfile | null>(null);
  const [chatTarget, setChatTarget] = useState<MatchProfile | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [messagedIds, setMessagedIds] = useState<Set<number>>(new Set());
  const [isUndoVisible, setIsUndoVisible] = useState(false);
  const [matchedPopup, setMatchedPopup] = useState<MatchSummary | null>(null);

  // 패스한 프로필 ID를 세션 동안 영구 보관 (refetch 후에도 유지)
  const passedIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (rawProfiles) {
      // 이미 패스한 프로필은 제외하고 큐 구성
      const filtered = rawProfiles.filter(p => !passedIds.current.has(p.id));
      setQueue(filtered);
      setCurIdx(0);
    }
  }, [rawProfiles]);

  const pan = useRef(new Animated.ValueXY()).current;
  const undoHeight = useRef(new Animated.Value(0)).current;
  const undoOpacity = useRef(new Animated.Value(0)).current;
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest state in refs so panResponder callbacks see current values
  const swipingRef = useRef(false);
  const curIdxRef = useRef(curIdx);
  const queueRef = useRef(queue);
  curIdxRef.current = curIdx;
  queueRef.current = queue;

  const showUndoBar = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setIsUndoVisible(true);
    Animated.parallel([
      Animated.timing(undoHeight, { toValue: 52, duration: 280, useNativeDriver: false }),
      Animated.timing(undoOpacity, { toValue: 1, duration: 220, useNativeDriver: false }),
    ]).start();
    undoTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(undoHeight, { toValue: 0, duration: 220, useNativeDriver: false }),
        Animated.timing(undoOpacity, { toValue: 0, duration: 180, useNativeDriver: false }),
      ]).start(() => {
        setIsUndoVisible(false);
        setLastPassed(null);
      });
    }, 3000);
  }, [undoHeight, undoOpacity]);

  const hideUndoBar = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    Animated.parallel([
      Animated.timing(undoHeight, { toValue: 0, duration: 220, useNativeDriver: false }),
      Animated.timing(undoOpacity, { toValue: 0, duration: 180, useNativeDriver: false }),
    ]).start(() => {
      setIsUndoVisible(false);
      setLastPassed(null);
    });
  }, [undoHeight, undoOpacity]);

  // Ref-stable flyOut that always sees latest queue/idx
  const flyOutRef = useRef<((dir: 1 | -1) => void) | null>(null);
  flyOutRef.current = (dir: 1 | -1) => {
    if (swipingRef.current) return;
    swipingRef.current = true;
    setIsSwiping(true);

    const passed = dir === -1 ? queueRef.current[curIdxRef.current] : null;
    const liked  = dir ===  1 ? queueRef.current[curIdxRef.current] : null;

    Animated.timing(pan, {
      toValue: { x: dir * SW * 1.6, y: dir * -50 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      setCurIdx(c => c + 1);
      swipingRef.current = false;
      setIsSwiping(false);

      if (dir === -1 && passed) {
        passedIds.current.add(passed.id);  // 패스 목록에 등록
        setLastPassed(passed);
        showUndoBar();
      } else {
        hideUndoBar();
      }

      // mock — 좋아요 시 30% 확률로 양쪽 매칭 팝업 표시
      if (dir === 1 && liked && Math.random() < 0.3) {
        setMatchedPopup({
          matchId: `mtch_${liked.id}`,
          chatRoomId: `chat_${liked.id}`,
          matchedAt: new Date().toISOString(),
          isFresh: true,
          matchedUser: {
            id: `usr_hi_${liked.id}`,
            nickname: liked.name,
            age: liked.age,
            region: liked.loc,
            mbti: liked.mbti,
            avatarEmoji: liked.emoji,
            avatarBgColor: liked.bgColor,
            tags: liked.tags,
            matchScore: liked.match,
            isOnline: true,
          },
        });
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        !swipingRef.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dx }) => {
        pan.flattenOffset();
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          flyOutRef.current?.(dx > 0 ? 1 : -1);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current;

  const doRefresh = useCallback(() => {
    refetch(); // useEffect가 새 데이터 수신 후 passedIds 필터링 + setCurIdx(0) 처리
  }, [refetch]);

  const doUndo = useCallback(() => {
    if (!lastPassed || curIdx <= 0) return;
    passedIds.current.delete(lastPassed.id); // 되돌리기 시 패스 목록에서 제거
    hideUndoBar();
    pan.setValue({ x: 0, y: 0 });
    setCurIdx(c => c - 1);
    setLastPassed(null);
  }, [lastPassed, curIdx, hideUndoBar, pan]);

  const rotate = pan.x.interpolate({
    inputRange: [-SW, 0, SW],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const current = queue[curIdx];
  const next    = queue[curIdx + 1];
  const next2   = queue[curIdx + 2];
  const remaining = Math.max(0, queue.length - curIdx);
  const isEmpty   = !isLoading && queue.length > 0 && curIdx >= queue.length;


  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-ef-bg items-center justify-center" edges={['top', 'bottom']}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-ef-bg"
      edges={['top']}
    >
      {/* ── 탑바 ── */}
      <View className="flex-row items-center justify-between px-[18px] py-[12px]">
        {/* Logo */}
        <View className="flex-row items-center gap-[8px]">
          <View
            className="w-[32px] h-[32px] rounded-[10px] items-center justify-center"
            style={{
              backgroundColor: COLORS.primary,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Ionicons name="heart" size={16} color="#fff" />
          </View>
          <Text className="text-[20px] font-extrabold text-ef-text" style={{ letterSpacing: -0.6 }}>
            녹<Text style={{ color: COLORS.primary }}>차</Text>
          </Text>
        </View>

        {/* Right: counter + refresh */}
        <View className="flex-row items-center gap-[8px]">
          <View
            className="rounded-[20px] px-[11px] py-[5px] bg-ef-surface"
            style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 }}
          >
            <Text className="text-[11.5px] font-extrabold text-ef-text-muted">
              {remaining}명 남음
            </Text>
          </View>
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
            style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 }}
            activeOpacity={0.8}
            onPress={doRefresh}
          >
            <Ionicons name="refresh" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
            style={{ shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 }}
            activeOpacity={0.8}
            onPress={() => setMoreOpen(true)}
            disabled={!current}
          >
            <Ionicons name="ellipsis-vertical" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="flex-1 relative"
        style={{ paddingBottom: !isEmpty ? 92 : 0 }}
      >
        {/* ── Card stage ── */}
        <Animated.View
          className="flex-1 mx-[14px] mt-[10px] mb-[2px] relative"
          style={{ minHeight: 0 }}
        >
          {isEmpty ? (
            <EmptyState onRefresh={doRefresh} />
          ) : (
            <>
              {next2 && <SwipeCard profile={next2} behind={2} />}
              {next && <SwipeCard profile={next} behind={1} />}
              {current && (
                <Animated.View
                  className="absolute inset-0"
                  style={{ transform: [{ translateX: pan.x }, { rotate }] }}
                  {...panResponder.panHandlers}
                >
                  <SwipeCard profile={current} panX={pan.x} compact={isUndoVisible} />
                </Animated.View>
              )}
            </>
          )}
        </Animated.View>

        {/* ── Undo bar ── */}
        {!isEmpty && (
          <Animated.View
            pointerEvents={lastPassed ? 'auto' : 'none'}
            style={{
              height: undoHeight,
              opacity: undoOpacity,
              overflow: 'hidden',
              paddingHorizontal: 14,
              marginBottom: 8,
            }}
          >
            <View
              className="flex-row items-center justify-between rounded-[16px] px-[16px] py-[9px]"
              style={{ backgroundColor: 'rgba(28,26,31,0.86)' }}
            >
              <Text className="text-[12.5px] font-bold" style={{ color: 'rgba(255,255,255,0.82)' }}>
                <Text className="text-white font-extrabold">{lastPassed?.name}</Text>님을 패스했어요
              </Text>
              <TouchableOpacity
                className="rounded-[12px] px-[14px] py-[6px]"
                style={{
                  backgroundColor: COLORS.primary,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                activeOpacity={0.85}
                onPress={doUndo}
              >
                <Text className="text-[12px] font-extrabold text-white">되돌리기</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

      {/* ── Actions ── */}
      {!isEmpty && (
        <View
          className="absolute left-0 right-0 bottom-0 flex-row items-center justify-center gap-[12px] px-[20px] pt-[8px]"
          style={{
            bottom: 8,
            paddingBottom: 0,
            backgroundColor: COLORS.bg,
            zIndex: 20,
          }}
        >
          {/* Pass */}
          <View className="items-center gap-[4px]">
            <TouchableOpacity
              className="w-[58px] h-[58px] rounded-full items-center justify-center"
              style={{ borderWidth: 2, borderColor: COLORS.red }}
              activeOpacity={0.8}
              onPress={() => flyOutRef.current?.(-1)}
              disabled={isSwiping || isEmpty}
            >
              <Ionicons name="close" size={22} color={COLORS.red} />
            </TouchableOpacity>
            <Text className="text-[10.5px] font-bold text-ef-text-muted">패스</Text>
          </View>

          {/* Message — center primary CTA */}
          <View className="flex-1 max-w-[190px] items-center gap-[4px]">
            {current && messagedIds.has(current.id) ? (
              <>
                <View
                  className="w-full h-[58px] rounded-[30px] flex-row items-center justify-center gap-[8px]"
                  style={{
                    backgroundColor: COLORS.primaryTint,
                    borderWidth: 1.5,
                    borderColor: COLORS.primary,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                  <Text
                    className="text-[14.5px] font-extrabold"
                    style={{ color: COLORS.primary, letterSpacing: -0.3 }}
                  >
                    메시지 보냄
                  </Text>
                </View>
                <Text className="text-[10.5px] font-bold text-ef-text-muted">
                  답장을 기다리는 중이에요
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  className="w-full h-[58px] rounded-[30px] flex-row items-center justify-center gap-[8px]"
                  style={{
                    backgroundColor: COLORS.primary,
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.36,
                    shadowRadius: 20,
                    elevation: 8,
                  }}
                  activeOpacity={0.85}
                  onPress={() => current && setChatTarget(current)}
                  disabled={isEmpty}
                >
                  <Ionicons name="chatbubble" size={18} color="#fff" />
                  <Text className="text-[15px] font-extrabold text-white" style={{ letterSpacing: -0.3 }}>
                    메시지 보내기
                  </Text>
                </TouchableOpacity>
                <Text className="text-[10.5px] font-bold" style={{ color: COLORS.primary }}>
                  대화 시작하기
                </Text>
              </>
            )}
          </View>

          {/* Like */}
          <View className="items-center gap-[4px]">
            <TouchableOpacity
              className="w-[58px] h-[58px] rounded-full items-center justify-center"
              style={{ borderWidth: 2, borderColor: COLORS.primary }}
              activeOpacity={0.8}
              onPress={() => flyOutRef.current?.(1)}
              disabled={isSwiping || isEmpty}
            >
              <Ionicons name="heart" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <Text className="text-[10.5px] font-bold text-ef-text-muted">좋아요</Text>
          </View>
        </View>
      )}
    </View>

      {/* ── More menu (신고 / 차단) ── */}
      <Modal
        visible={moreOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMoreOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)' }}
          onPress={() => setMoreOpen(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: 56,
              right: 18,
              backgroundColor: COLORS.surface,
              borderRadius: 14,
              paddingVertical: 6,
              minWidth: 168,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
              elevation: 10,
              borderWidth: 1,
              borderColor: COLORS.divider,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setMoreOpen(false);
                if (!current) return;
                router.push({
                  pathname: '/report/balance-game-comment',
                  params: {
                    targetUserId: `usr_hi_${current.id}`,
                    isAnonymous: '0',
                  },
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 10,
              }}
            >
              <Ionicons
                name="flag-outline"
                size={16}
                color={COLORS.red}
              />
              <Text
                style={{
                  fontSize: 13.5,
                  fontWeight: '700',
                  color: COLORS.textPrimary,
                  letterSpacing: -0.2,
                }}
              >
                신고하기
              </Text>
            </TouchableOpacity>

            <View
              style={{
                height: 1,
                backgroundColor: COLORS.divider,
                marginHorizontal: 12,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setMoreOpen(false);
                if (!current) return;
                router.push({
                  pathname: '/block-profile',
                  params: { userId: `usr_hi_${current.id}` },
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 10,
              }}
            >
              <Ionicons name="ban-outline" size={16} color={COLORS.red} />
              <Text
                style={{
                  fontSize: 13.5,
                  fontWeight: '700',
                  color: COLORS.textPrimary,
                  letterSpacing: -0.2,
                }}
              >
                차단하기
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ── Match popup ── */}
      <MatchResultPopup
        match={matchedPopup}
        onClose={() => setMatchedPopup(null)}
      />

      {/* ── Chat Sheet ── */}
      <ChatModal
        profile={chatTarget}
        onClose={() => setChatTarget(null)}
        onSend={(id) =>
          setMessagedIds((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
          })
        }
      />
    </SafeAreaView>
  );
}
