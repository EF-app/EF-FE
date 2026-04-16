/**
 * @file features/home/components/BalanceCard.tsx
 * @description 오늘의 밸런스 게임 카드 — 라이브 태그, 선택지, 결과, 댓글 미리보기
 */

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';

import { useVoteBalance } from '@home/hooks/useHome';
import type { BalanceGamePreview, VoteSide } from '@home/types';
import BalanceOption from './BalanceOption';
import VoteModal from './VoteModal';

interface Props {
  game: BalanceGamePreview;
  onCommentsPress?: () => void;
}

const BalanceCard: React.FC<Props> = ({ game, onCommentsPress }) => {
  const { mutate: vote } = useVoteBalance();
  const [myVote, setMyVote] = useState<VoteSide | null>(null);
  const [pending, setPending] = useState<VoteSide | null>(null);
  const fillA = useRef(new Animated.Value(0)).current;
  const fillB = useRef(new Animated.Value(0)).current;

  const totalVotes = game.optionA.votes + game.optionB.votes;
  const percentA =
    totalVotes > 0 ? Math.round((game.optionA.votes / totalVotes) * 100) : 50;
  const percentB = 100 - percentA;

  useEffect(() => {
    if (myVote) {
      Animated.parallel([
        Animated.timing(fillA, {
          toValue: percentA,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(fillB, {
          toValue: percentB,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [myVote, percentA, percentB, fillA, fillB]);

  const handleOpenVote = useCallback(
    (side: VoteSide) => {
      if (myVote) return;
      setPending(side);
    },
    [myVote],
  );

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    setMyVote(pending);
    vote({ gameId: game.id, side: pending });
    setPending(null);
  }, [pending, vote, game.id]);

  const pendingOption = pending === 'a' ? game.optionA : pending === 'b' ? game.optionB : null;

  return (
    <View className="px-[18px]">
      <View
        className="bg-ef-surface rounded-[24px] px-[18px] pt-5 pb-4 border-[1.5px] border-ef-primary-border relative"
        style={{
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.14,
          shadowRadius: 18,
          elevation: 4,
        }}
      >
        {/* 상단 리본 장식 */}
        <View
          style={{
            position: 'absolute',
            top: -6,
            left: 24,
            width: 36,
            height: 14,
            backgroundColor: COLORS.primary,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: -6,
            left: 62,
            width: 36,
            height: 14,
            backgroundColor: '#B4A8D6',
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        />

        {/* LIVE 태그 */}
        <View
          className="self-start flex-row items-center gap-[6px] mt-[6px] px-3 py-[6px] rounded-full"
          style={{ backgroundColor: 'rgba(150,134,191,0.18)' }}
        >
          <LivePulseDot />
          <Text
            className="text-[11px] font-extrabold"
            style={{ color: COLORS.primaryDeep, letterSpacing: -0.1 }}
          >
            LIVE · {game.participantCount.toLocaleString()}명 참여중
          </Text>
        </View>

        {/* 선택지 */}
        <View className="flex-row items-stretch gap-[10px] mt-4">
          <BalanceOption
            option={game.optionA}
            percent={percentA}
            state={
              myVote === 'a' ? 'voted' : myVote === 'b' ? 'faded' : 'idle'
            }
            onPress={() => handleOpenVote('a')}
          />

          <View className="self-center">
            <View
              className="w-[28px] h-[28px] rounded-full items-center justify-center"
              style={{
                backgroundColor: COLORS.primary,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Text className="text-[12px] font-extrabold text-white">VS</Text>
            </View>
          </View>

          <BalanceOption
            option={game.optionB}
            percent={percentB}
            state={
              myVote === 'b' ? 'voted' : myVote === 'a' ? 'faded' : 'idle'
            }
            onPress={() => handleOpenVote('b')}
          />
        </View>

        {/* 결과 바 */}
        {myVote && (
          <View className="mt-[14px]">
            <View
              className="flex-row h-[8px] rounded-[6px] overflow-hidden"
              style={{ backgroundColor: '#EDEAE6' }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  backgroundColor: COLORS.primary,
                  width: fillA.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                }}
              />
              <Animated.View
                style={{
                  height: '100%',
                  backgroundColor: '#B4A8D6',
                  width: fillB.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                }}
              />
            </View>
            <View className="flex-row justify-between mt-[6px]">
              <Text className="text-[10.5px] font-extrabold text-ef-text-sub">
                {game.optionA.label.replace(/\n/g, ' ')} {percentA}%
              </Text>
              <Text className="text-[10.5px] font-extrabold text-ef-text-sub">
                {percentB}% {game.optionB.label.replace(/\n/g, ' ')}
              </Text>
            </View>
          </View>
        )}

        {/* 댓글 프리뷰 */}
        <View
          className="mt-[14px] rounded-[14px] p-3 border-[1.5px] border-ef-primary-border"
          style={{ backgroundColor: COLORS.bg }}
        >
          {game.comments.map((c, idx) => (
            <View
              key={c.id}
              className="flex-row items-start gap-2"
              style={{ marginTop: idx === 0 ? 0 : 7 }}
            >
              <View
                className="w-[22px] h-[22px] rounded-full items-center justify-center bg-ef-surface"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                }}
              >
                <Text className="text-[11px]">{c.avatar}</Text>
              </View>
              <Text
                className="flex-1 text-[11.5px] text-ef-text-sub font-sans"
                style={{ lineHeight: 17 }}
                numberOfLines={2}
              >
                <Text className="text-ef-text font-extrabold">
                  {c.nickname}{' '}
                </Text>
                {c.message}
              </Text>
            </View>
          ))}
        </View>

        {/* 하단 바 */}
        <View
          className="flex-row items-center justify-between mt-[14px] pt-3"
          style={{ borderTopWidth: 1.5, borderTopColor: 'rgba(150,134,191,0.18)', borderStyle: 'dashed' }}
        >
          <TouchableOpacity
            className="flex-row items-center gap-[5px]"
            onPress={onCommentsPress}
            hitSlop={6}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={13} color={COLORS.textSecondary} />
            <Text className="text-[12px] text-ef-text-sub font-bold">
              댓글 {game.commentCount}개 모두 보기 →
            </Text>
          </TouchableOpacity>

          {game.isHot && (
            <View className="bg-ef-primary px-[10px] py-1 rounded-[10px]">
              <Text className="text-[10.5px] font-extrabold text-white">🔥 HOT</Text>
            </View>
          )}
        </View>
      </View>

      <VoteModal
        visible={pending !== null}
        emoji={pendingOption?.emoji ?? ''}
        choiceLabel={pendingOption?.label.replace(/\n/g, ' ') ?? ''}
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />
    </View>
  );
};

/** LIVE 점 애니메이션 */
const LivePulseDot: React.FC = () => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        opacity: pulse,
        transform: [
          {
            scale: pulse.interpolate({
              inputRange: [0.4, 1],
              outputRange: [1.2, 1],
            }),
          },
        ],
      }}
    />
  );
};

export default BalanceCard;
