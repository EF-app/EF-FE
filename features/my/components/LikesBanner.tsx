/**
 * @file features/my/components/LikesBanner.tsx
 * @description 내가 누른 / 받은 / 서로 좋아요 3분할 배너 버튼
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import {
  useMatches,
  useReceivedLikes,
  useSentLikes,
} from '@/features/likes/hooks/useLikes';

interface Props {
  sentCount?: number;
  receivedCount?: number;
  mutualCount?: number;
  onPressSent?: () => void;
  onPressReceived?: () => void;
  onPressMutual?: () => void;
}

const Divider: React.FC = () => (
  <View style={{ width: 1, height: 36, backgroundColor: COLORS.divider }} />
);

const LikesBanner: React.FC<Props> = ({
  sentCount,
  receivedCount,
  mutualCount,
  onPressSent,
  onPressReceived,
  onPressMutual,
}) => {
  const router = useRouter();
  const { data: sent } = useSentLikes();
  const { data: received } = useReceivedLikes();
  const { data: matches } = useMatches();

  const sentN = sentCount ?? sent?.length ?? 0;
  const recvN = receivedCount ?? received?.length ?? 0;
  const mutualN = mutualCount ?? matches?.length ?? 0;

  const goSent =
    onPressSent ?? (() => router.push('/(tabs)/my/history/likes-sent'));
  const goReceived =
    onPressReceived ?? (() => router.push('/(tabs)/my/history/likes-received'));
  const goMutual =
    onPressMutual ?? (() => router.push('/(tabs)/my/history/likes-mutual'));

  return (
    <View
      className="mx-[20px] mb-[12px] bg-ef-surface rounded-[16px] py-[14px] px-[8px] flex-row items-stretch"
      style={{
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      <TouchableOpacity
        className="flex-1 items-center justify-center gap-[5px] py-[2px] px-[4px]"
        activeOpacity={0.7}
        onPress={goSent}
      >
        <Text style={{ fontSize: 18 }}>💜</Text>
        <Text
          className="text-[11px] font-bold text-ef-text-sub"
          style={{ letterSpacing: -0.1 }}
        >
          내가 누른 좋아요
        </Text>
        <Text
          className="text-[14px] font-extrabold text-ef-text"
          style={{ letterSpacing: -0.3 }}
        >
          {sentN}
        </Text>
      </TouchableOpacity>

      <Divider />

      <TouchableOpacity
        className="flex-1 items-center justify-center gap-[5px] py-[2px] px-[4px]"
        activeOpacity={0.7}
        onPress={goReceived}
      >
        <Text style={{ fontSize: 18 }}>💖</Text>
        <Text
          className="text-[11px] font-bold text-ef-text-sub"
          style={{ letterSpacing: -0.1 }}
        >
          받은 좋아요
        </Text>
        <Text
          className="text-[14px] font-extrabold text-ef-text"
          style={{ letterSpacing: -0.3 }}
        >
          {recvN}
        </Text>
      </TouchableOpacity>

      <Divider />

      <TouchableOpacity
        className="flex-1 items-center justify-center gap-[5px] py-[2px] px-[4px]"
        activeOpacity={0.7}
        onPress={goMutual}
      >
        <Text style={{ fontSize: 18 }}>💘</Text>
        <Text
          className="text-[11px] font-bold text-ef-text-sub"
          style={{ letterSpacing: -0.1 }}
        >
          서로 좋아요
        </Text>
        <Text
          className="text-[14px] font-extrabold text-ef-text"
          style={{ letterSpacing: -0.3 }}
        >
          {mutualN}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LikesBanner;
