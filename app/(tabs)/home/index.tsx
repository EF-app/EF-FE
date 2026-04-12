/**
 * @file app/(tabs)/home/index.tsx
 * @description 홈 메인 화면 — 밸런스 게임 + 종이비행기 우체통
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import BalanceGameCard from '@home/bal-game/components/BalanceGameCard';
import PostItCard from '@home/post-it/components/PostItCard';
import { useCurrentBalanceGame } from '@home/bal-game/hooks/useBalGame';
import { useRecentPostIts } from '@home/post-it/hooks/usePostIt';

export default function HomeScreen() {
  const router = useRouter();
  const { data: game, isLoading: gameLoading } = useCurrentBalanceGame();
  const { data: postIts, isLoading: postItsLoading } = useRecentPostIts();

  const handleChatPress = useCallback(
    (id: string) => {
      router.push(`/(tabs)/home/post-it?replyTo=${id}`);
    },
    [router],
  );

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── 헤더 ── */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-ef-bg">
        <Text
          className="text-[20px] text-ef-text font-extrabold"
          style={{ letterSpacing: -0.5 }}
        >
          이<Text className="text-ef-primary">프</Text>
        </Text>
        <View className="flex-row items-center gap-[16px]">
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="search-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => router.push('/(tabs)/noti')}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── 인사말 ── */}
        <View className="px-5 pt-5 pb-6">
          <Text
            className="text-[22px] text-ef-text font-extrabold leading-[30px]"
            style={{ letterSpacing: -0.6 }}
          >
            안녕하세요 :){'\n'}
            오늘의{' '}
            <Text className="text-ef-primary">밸런스</Text>
            에{'\n'}
            참여해볼까요?
          </Text>
        </View>

        {/* ── 밸런스 게임 카드 ── */}
        <View className="mb-7">
          <SectionHeader title="오늘의 밸런스" />
          {gameLoading ? (
            <LoadingSkeleton height={220} />
          ) : game ? (
            <BalanceGameCard game={game} />
          ) : (
            <EmptyState message="오늘의 밸런스 게임을 불러올 수 없어요" />
          )}
        </View>

        {/* ── 종이비행기 우체통 ── */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between px-5 mb-3">
            <View className="flex-row items-center gap-[8px]">
              <Text
                className="text-[16px] text-ef-text font-extrabold"
                style={{ letterSpacing: -0.4 }}
              >
                종이비행기 우체통
              </Text>
              {!postItsLoading && (postIts?.length ?? 0) > 0 && (
                <View className="bg-ef-primary-soft border border-ef-primary-border px-2 py-[2px] rounded-[10px]">
                  <Text className="text-[9px] text-ef-primary-mid font-extrabold">
                    ✉ 새 편지 도착!
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/home/post-it')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-[11px] text-ef-primary font-extrabold">전체보기 ›</Text>
            </TouchableOpacity>
          </View>

          {postItsLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5">
              {[1, 2, 3].map((i) => (
                <LoadingSkeleton key={i} height={170} width={200} className="mr-3" />
              ))}
            </ScrollView>
          ) : (postIts?.length ?? 0) > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
            >
              {postIts!.map((item) => (
                <PostItCard key={item.id} item={item} onChatPress={handleChatPress} />
              ))}
            </ScrollView>
          ) : (
            <EmptyState message="아직 종이비행기가 없어요" />
          )}
        </View>
      </ScrollView>

      {/* ── 플로팅 액션 버튼 ── */}
      <View
        className="absolute bottom-0 left-0 right-0 items-center"
        style={{ paddingBottom: Platform.OS === 'ios' ? 104 : 76 }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          className="flex-row items-center gap-[6px] bg-ef-primary rounded-[28px] px-6 py-[13px]"
          style={Platform.select({
            ios: {
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
            },
            android: { elevation: 10 },
          })}
          onPress={() => router.push('/(tabs)/home/post-it')}
          activeOpacity={0.85}
        >
          <Text className="text-[15px]">✈</Text>
          <Text className="text-[14px] text-white font-extrabold" style={{ letterSpacing: -0.3 }}>
            종이비행기 날리기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ── 공용 서브 컴포넌트 ────────────────────────────────────────────────────── */

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <View className="flex-row items-center justify-between px-5 mb-3">
    <Text
      className="text-[16px] text-ef-text font-extrabold"
      style={{ letterSpacing: -0.4 }}
    >
      {title}
    </Text>
  </View>
);

const LoadingSkeleton: React.FC<{
  height: number;
  width?: number;
  className?: string;
}> = ({ height, width, className: cls }) => (
  <View
    className={`bg-ef-surface2 rounded-[16px] ${cls ?? ''}`}
    style={{ height, width: width ?? undefined, marginHorizontal: width ? 0 : 20 }}
  >
    <ActivityIndicator
      size="small"
      color={COLORS.primary}
      style={{ flex: 1 }}
    />
  </View>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <View className="mx-5 rounded-[16px] bg-ef-surface py-8 items-center">
    <Text className="text-[13px] text-ef-text-muted font-sans">{message}</Text>
  </View>
);
