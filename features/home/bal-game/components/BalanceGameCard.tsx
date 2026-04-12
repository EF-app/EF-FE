/**
 * @file features/home/bal-game/components/BalanceGameCard.tsx
 * @description 홈 화면에 표시되는 오늘의 밸런스 게임 카드
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import LiveBadge from './LiveBadge';
import VoteButton from './VoteButton';
import type { BalanceGame, VoteChoice } from '@home/bal-game/types';
import { useVoteBalanceGame } from '@home/bal-game/hooks/useBalGame';

interface BalanceGameCardProps {
  game: BalanceGame;
}

const BalanceGameCard: React.FC<BalanceGameCardProps> = ({ game }) => {
  const router = useRouter();
  const { mutate: vote } = useVoteBalanceGame();
  const [myVote, setMyVote] = useState<VoteChoice>(null);

  const totalVotes = game.optionA.votes + game.optionB.votes;
  const percentA = totalVotes > 0 ? Math.round((game.optionA.votes / totalVotes) * 100) : 50;
  const percentB = 100 - percentA;

  const handleVote = useCallback(
    (choice: 'A' | 'B') => {
      if (myVote !== null) return;
      setMyVote(choice);
      vote({ gameId: game.id, choice });
    },
    [myVote, game.id, vote],
  );

  return (
    <View
      className="bg-ef-surface rounded-[20px] mx-5 overflow-hidden"
      style={Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        },
        android: { elevation: 4 },
      })}
    >
      {/* card header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-ef-divider">
        <LiveBadge participantCount={game.participantCount} />
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/home/bal-game')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-[11px] text-ef-primary font-extrabold">전체보기 ›</Text>
        </TouchableOpacity>
      </View>

      {/* question */}
      <View className="px-4 pt-4 pb-3">
        <Text
          className="text-[15px] text-ef-text font-extrabold leading-[22px] text-center"
          style={{ letterSpacing: -0.4 }}
        >
          {game.question}
        </Text>
      </View>

      {/* vote buttons */}
      <View className="flex-row gap-3 px-4 pb-4">
        <VoteButton
          emoji={game.optionA.emoji}
          label={game.optionA.label}
          percent={percentA}
          voted={myVote !== null}
          isMyChoice={myVote === 'A'}
          onPress={() => handleVote('A')}
        />
        <VoteButton
          emoji={game.optionB.emoji}
          label={game.optionB.label}
          percent={percentB}
          voted={myVote !== null}
          isMyChoice={myVote === 'B'}
          onPress={() => handleVote('B')}
        />
      </View>

      {/* footer */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-[5px] py-[10px] border-t border-ef-divider"
        onPress={() => router.push('/(tabs)/home/bal-game')}
        activeOpacity={0.7}
      >
        <Text className="text-[12px] text-ef-text-muted font-sans">
          💬 댓글 {game.commentCount.toLocaleString()}개 보기
        </Text>
      </TouchableOpacity>

      {/* submit banner */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-[6px] bg-ef-primary-tint py-[10px] border-t border-ef-primary-border"
        activeOpacity={0.8}
      >
        <Text className="text-[11px] text-ef-primary-mid font-extrabold">
          ✏ 나도 밸런스 주제 올려보기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BalanceGameCard;
