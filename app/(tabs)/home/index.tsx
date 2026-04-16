/**
 * @file app/(tabs)/home/index.tsx
 * @description 홈 메인 — 인사말 + 오늘의 밸런스 + 포스트잇 보드
 */

import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApplyBanner from '@home/components/ApplyBanner';
import BalanceCard from '@home/components/BalanceCard';
import DashedDivider from '@home/components/DashedDivider';
import Greeting from '@home/components/Greeting';
import HomeHeader from '@home/components/HomeHeader';
import NavButtons from '@home/components/NavButtons';
import PostitSection from '@home/components/PostitSection';
import SectionTitle from '@home/components/SectionTitle';
import { useHomeFeed } from '@home/hooks/useHome';
import WritePostItModal from '@home/post-it/components/WritePostItModal';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useHomeFeed();

  const [replyModal, setReplyModal] = useState<{
    visible: boolean;
    targetNick: string;
    targetId: string | null;
  }>({ visible: false, targetNick: '', targetId: null });

  const handleReplyPress = useCallback(
    (id: string) => {
      const target = data?.postits.find((p) => p.id === id);
      setReplyModal({
        visible: true,
        targetId: id,
        targetNick: target?.nickname ?? '익명',
      });
    },
    [data?.postits],
  );

  const handleReplyClose = useCallback(() => {
    setReplyModal((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleReplySubmit = useCallback(
    (_message: string, _anonymous: boolean) => {
      handleReplyClose();
    },
    [handleReplyClose],
  );

  const goToBalGame = useCallback(() => {
    router.push('/(tabs)/home/bal-game');
  }, [router]);

  const goToApplyBalGame = useCallback(() => {
    router.push('/(tabs)/home/bal-game/apply');
  }, [router]);

  const goToPostItBoard = useCallback(() => {
    router.push('/(tabs)/home/post-it');
  }, [router]);

  const goToWritePostIt = useCallback(() => {
    router.push('/(tabs)/home/post-it/write');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <HomeHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Greeting />

        <SectionTitle
          title="⚖️ 오늘의 밸런스게임"
          tag="NEW"
          onMorePress={goToBalGame}
        />

        {isLoading ? (
          <LoadingBlock height={380} />
        ) : isError || !data ? (
          <ErrorBlock />
        ) : (
          <>
            <BalanceCard game={data.balance} onCommentsPress={goToBalGame} />
            <View className="px-[18px]">
              <NavButtons
                onNextPress={goToBalGame}
                onPopularPress={goToBalGame}
              />
              <ApplyBanner onApplyPress={goToApplyBalGame} />
            </View>
          </>
        )}

        <DashedDivider />

        {isLoading ? (
          <LoadingBlock height={260} />
        ) : isError || !data ? null : (
          <PostitSection
            items={data.postits}
            onViewAllPress={goToPostItBoard}
            onWritePress={goToWritePostIt}
            onReplyPress={handleReplyPress}
          />
        )}
      </ScrollView>

      <WritePostItModal
        visible={replyModal.visible}
        onClose={handleReplyClose}
        onSubmit={handleReplySubmit}
        replyToNick={replyModal.targetNick}
      />
    </SafeAreaView>
  );
}

const LoadingBlock: React.FC<{ height: number }> = ({ height }) => (
  <View className="mx-[22px] items-center justify-center" style={{ height }}>
    <ActivityIndicator size="small" color={COLORS.primary} />
  </View>
);

const ErrorBlock: React.FC = () => (
  <View className="mx-[22px] rounded-[18px] bg-ef-surface py-10 items-center border-[1.5px] border-ef-primary-border">
    <Text className="text-[13px] text-ef-text-sub font-sans">
      홈 피드를 불러오지 못했어요
    </Text>
  </View>
);
