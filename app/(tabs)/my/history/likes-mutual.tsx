/**
 * @file app/(tabs)/my/history/likes-mutual.tsx
 * @description 서로 좋아요 — origin/like_both.html 변환 (방금 매칭됐어요 + 그리드)
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ScreenTopBar from '@/common/components/ScreenTopBar';
import { useMatches } from '@/features/likes/hooks/useLikes';
import { MatchSummary } from '@/features/likes/types';
import { formatRelative } from '@/features/likes/utils/time';

const { width: SW } = Dimensions.get('window');
const GRID_GAP = 12;
const SIDE_PAD = 20;
const COL_W = (SW - SIDE_PAD * 2 - GRID_GAP) / 2;

interface CardProps {
  m: MatchSummary;
}
const MatchGridCard: React.FC<CardProps> = ({ m }) => {
  const { matchedUser: u } = m;
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      className="bg-ef-surface rounded-[18px] overflow-hidden"
      style={{
        width: COL_W,
        marginBottom: GRID_GAP,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
        elevation: 3,
      }}
    >
      {/* photo */}
      <View
        className="items-center justify-center"
        style={{
          width: '100%',
          aspectRatio: 1,
          backgroundColor: u.avatarBgColor,
        }}
      >
        <Text style={{ fontSize: 80, color: 'rgba(255,255,255,0.92)' }}>
          {u.avatarEmoji}
        </Text>

        <View
          className="absolute rounded-full flex-row items-center"
          style={{
            top: 9,
            left: 9,
            backgroundColor: 'rgba(255,255,255,0.78)',
            paddingHorizontal: 7,
            paddingVertical: 3,
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 9 }}>✨</Text>
          <Text
            className="text-[9.5px] font-extrabold"
            style={{ color: COLORS.primaryDeep }}
          >
            관심사 매칭
          </Text>
        </View>

        <View
          className="absolute rounded-full"
          style={{
            top: 9,
            right: 9,
            backgroundColor: 'rgba(28,26,34,0.9)',
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text className="text-[10px] font-extrabold text-white">
            {u.matchScore}%
          </Text>
        </View>

        {u.isOnline && (
          <View
            className="absolute rounded-full flex-row items-center"
            style={{
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(255,255,255,0.9)',
              paddingHorizontal: 7,
              paddingVertical: 3,
              gap: 3,
            }}
          >
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 5,
                backgroundColor: COLORS.greenVivid,
              }}
            />
            <Text
              className="text-[9.5px] font-extrabold"
              style={{ color: COLORS.greenVivid }}
            >
              ON
            </Text>
          </View>
        )}
      </View>

      {/* body */}
      <View className="p-[12px] gap-[8px]">
        <View className="flex-row items-baseline justify-between">
          <View className="flex-row items-baseline gap-[4px] flex-shrink">
            <Text
              className="text-[14px] font-extrabold text-ef-text"
              numberOfLines={1}
              style={{ letterSpacing: -0.3 }}
            >
              {u.nickname}
            </Text>
            <Text className="text-[12px] font-bold text-ef-text-sub">{u.age}</Text>
          </View>
          <Text className="text-[10.5px] font-bold text-ef-text-muted">
            {formatRelative(m.matchedAt)}
          </Text>
        </View>

        <View className="flex-row items-center gap-[3px]">
          <Ionicons name="location-outline" size={9} color={COLORS.textMuted} />
          <Text className="text-[10.5px] text-ef-text-muted">
            {u.region} · {u.mbti}
          </Text>
        </View>

        <View className="flex-row items-center gap-[6px]">
          <View
            className="flex-1 rounded-full overflow-hidden"
            style={{ height: 5, backgroundColor: COLORS.divider }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${u.matchScore}%`,
                backgroundColor: COLORS.primary,
              }}
            />
          </View>
          <Text
            className="text-[10px] font-extrabold"
            style={{ color: COLORS.primaryDeep }}
          >
            {u.matchScore}%
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-[4px]">
          {u.tags.slice(0, 3).map(t => (
            <View
              key={t}
              className="rounded-full"
              style={{
                paddingHorizontal: 7,
                paddingVertical: 3,
                backgroundColor: COLORS.primaryTint,
              }}
            >
              <Text
                className="text-[9.5px] font-bold"
                style={{ color: COLORS.primaryDeep }}
              >
                #{t}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center gap-[6px] mt-[2px]">
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-1 flex-row items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 9,
              paddingHorizontal: 10,
              gap: 4,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.28,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={12} color="#fff" />
            <Text
              className="text-[11.5px] font-extrabold text-white"
              style={{ letterSpacing: -0.2 }}
            >
              메시지
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className="w-[34px] h-[34px] rounded-full items-center justify-center"
            style={{
              backgroundColor: m.isLiked ? COLORS.primary : COLORS.primaryTint,
            }}
          >
            <Ionicons
              name="heart"
              size={13}
              color={m.isLiked ? '#fff' : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function LikesMutualScreen() {
  const { data = [] } = useMatches();
  const fresh = useMemo(() => data.filter(d => d.isFresh), [data]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScreenTopBar title="서로 좋아요" count={`총 ${data.length}명`} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* fresh strip */}
        {fresh.length > 0 && (
          <>
            <View className="flex-row items-center justify-between px-[20px] py-[10px]">
              <Text
                className="text-[15px] font-extrabold text-ef-text"
                style={{ letterSpacing: -0.4 }}
              >
                방금 매칭됐어요 ✨
              </Text>
              <Text className="text-[11.5px] font-bold text-ef-text-muted">
                지금 대화해보세요
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 4 }}
            >
              {fresh.map(m => (
                <View key={m.matchId} className="items-center gap-[7px]">
                  <View
                    className="w-[66px] h-[66px] rounded-[18px] items-center justify-center"
                    style={{
                      backgroundColor: m.matchedUser.avatarBgColor,
                      shadowColor: COLORS.primary,
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                      elevation: 4,
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>{m.matchedUser.avatarEmoji}</Text>
                    <View
                      className="absolute rounded-full items-center justify-center"
                      style={{
                        top: -4,
                        right: -4,
                        width: 20,
                        height: 20,
                        backgroundColor: COLORS.primary,
                        borderWidth: 2,
                        borderColor: COLORS.bg,
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>
                        N
                      </Text>
                    </View>
                    {m.matchedUser.isOnline && (
                      <View
                        className="absolute rounded-full"
                        style={{
                          bottom: 4,
                          right: 4,
                          width: 10,
                          height: 10,
                          backgroundColor: COLORS.greenVivid,
                          borderWidth: 2,
                          borderColor: COLORS.surface,
                        }}
                      />
                    )}
                  </View>
                  <Text
                    className="text-[11.5px] font-bold text-ef-text"
                    style={{ letterSpacing: -0.2 }}
                  >
                    {m.matchedUser.nickname}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* mutual grid */}
        <View className="flex-row items-center justify-between px-[20px] py-[10px] mt-[8px]">
          <Text
            className="text-[15px] font-extrabold"
            style={{
              color: COLORS.primary,
              letterSpacing: -0.4,
            }}
          >
            서로 좋아요 {data.length}
          </Text>
          <TouchableOpacity
            className="flex-row items-center rounded-full"
            style={{
              backgroundColor: COLORS.primaryTint,
              paddingHorizontal: 9,
              paddingVertical: 4,
              gap: 3,
            }}
          >
            <Text
              className="text-[10.5px] font-extrabold"
              style={{ color: COLORS.primaryDeep }}
            >
              매칭순
            </Text>
            <Ionicons name="chevron-down" size={10} color={COLORS.primaryDeep} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: GRID_GAP,
            paddingHorizontal: SIDE_PAD,
          }}
        >
          {data.map(m => (
            <MatchGridCard key={m.matchId} m={m} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
