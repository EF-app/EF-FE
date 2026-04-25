/**
 * @file app/(tabs)/my/blocked-users.tsx
 * @description 차단한 사용자 목록 — 토글로 차단/해제. block_profile과 동일한 디자인 톤.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ScreenTopBar from '@/common/components/ScreenTopBar';
import Toggle from '@/common/components/Toggle';
import NoticeList from '@/common/components/NoticeList';
import {
  useBlockedUsers,
  useReblockUser,
  useUnblockUser,
} from '@/features/blocks/hooks/useBlocks';
import { BLOCK_REASONS } from '@/features/blocks/api/blocksApi';

export default function BlockedUsersScreen() {
  const { data = [] } = useBlockedUsers();
  const unblockMut = useUnblockUser();
  const reblockMut = useReblockUser();

  const reasonTitle = (code: string) =>
    BLOCK_REASONS.find(r => r.code === code)?.title ?? '기타';

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScreenTopBar title="차단한 사용자" count={`총 ${data.length}명`} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}
      >
        {data.length === 0 ? (
          <View className="items-center py-[64px] gap-[10px]">
            <Text style={{ fontSize: 44 }}>✨</Text>
            <Text
              className="text-[15px] font-extrabold text-ef-text"
              style={{ letterSpacing: -0.3 }}
            >
              차단한 사용자가 없어요
            </Text>
            <Text className="text-[12.5px] text-ef-text-muted">
              차단한 사람은 여기서 한눈에 관리할 수 있어요
            </Text>
          </View>
        ) : (
          <>
            <View className="mt-[14px] mb-[10px]">
              <NoticeList
                accentColor={COLORS.primary}
                textColor={COLORS.primaryDeep}
                items={[
                  '토글을 끄면 차단이 즉시 해제돼요',
                  '해제 후에도 다시 토글로 차단할 수 있어요',
                ]}
              />
            </View>

            {data.map(b => (
              <View
                key={b.userId}
                className="bg-ef-surface rounded-[18px] mb-[10px] overflow-hidden"
                style={{
                  borderWidth: 1.5,
                  borderColor: b.isBlocked ? 'rgba(212,101,90,0.18)' : COLORS.divider,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 10,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center px-[14px] py-[14px] gap-[12px]">
                  <View
                    className="w-[48px] h-[48px] rounded-full items-center justify-center"
                    style={{ backgroundColor: b.avatarBgColor }}
                  >
                    <Text style={{ fontSize: 22 }}>{b.avatarEmoji}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-baseline gap-[6px]">
                      <Text
                        className="text-[14.5px] font-extrabold text-ef-text"
                        style={{ letterSpacing: -0.3 }}
                        numberOfLines={1}
                      >
                        {b.nickname}
                      </Text>
                      <Text className="text-[11.5px] font-bold text-ef-text-sub">
                        {b.age}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-[3px] mt-[2px]">
                      <Ionicons
                        name="location-outline"
                        size={10}
                        color={COLORS.textMuted}
                      />
                      <Text className="text-[11px] text-ef-text-muted">
                        {b.region} · {b.mbti}
                      </Text>
                    </View>
                  </View>

                  <Toggle
                    value={b.isBlocked}
                    activeColor={COLORS.red}
                    onChange={next =>
                      next
                        ? reblockMut.mutate({
                            targetUserId: b.userId,
                            reasonCodes: b.reasonCodes,
                          })
                        : unblockMut.mutate(b.userId)
                    }
                  />
                </View>

                <View
                  className="px-[14px] py-[10px] flex-row items-center gap-[6px]"
                  style={{
                    backgroundColor: b.isBlocked
                      ? 'rgba(212,101,90,0.06)'
                      : COLORS.bg,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.divider,
                  }}
                >
                  <Ionicons
                    name={b.isBlocked ? 'ban' : 'checkmark-circle-outline'}
                    size={12}
                    color={b.isBlocked ? COLORS.red : COLORS.greenVivid}
                  />
                  <Text
                    className="text-[11.5px] font-bold"
                    style={{
                      color: b.isBlocked ? COLORS.red : COLORS.greenVivid,
                    }}
                  >
                    {b.isBlocked
                      ? `차단 중 · 사유: ${b.reasonCodes
                          .map(reasonTitle)
                          .join(', ')}`
                      : '차단 해제됨'}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
