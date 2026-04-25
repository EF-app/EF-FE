/**
 * @file app/block-profile.tsx
 * @description 프로필 차단하기 — origin/block_profile.html 변환
 *              (tabs) 밖에 두어 풀스크린으로 표시 (탭바 숨김)
 *
 * 사용 예: router.push({ pathname: '/block-profile', params: { userId: 'usr_xxx' } })
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ScreenTopBar from '@/common/components/ScreenTopBar';
import ReasonSelectList from '@/common/components/ReasonSelectList';
import NoticeList from '@/common/components/NoticeList';
import { BLOCK_REASONS } from '@/features/blocks/api/blocksApi';
import { BlockReasonCode } from '@/features/blocks/types';
import { useBlockUser } from '@/features/blocks/hooks/useBlocks';
import { useReportTarget } from '@/features/reports/hooks/useReports';

export default function BlockProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const { data: target } = useReportTarget(userId ?? 'usr_default');
  const blockMut = useBlockUser();

  const [reasons, setReasons] = useState<BlockReasonCode[]>([]);
  const [done, setDone] = useState(false);

  const toggleReason = (code: BlockReasonCode) =>
    setReasons(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code],
    );

  const onConfirm = async () => {
    if (!target) return;
    await blockMut.mutateAsync({
      targetUserId: target.userId,
      reasonCodes: reasons,
    });
    setDone(true);
  };

  const targetName = target?.nickname ?? '이 사용자';

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScreenTopBar title="차단하기" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* profile mini card */}
        {target && (
          <View
            className="mx-[18px] mt-[16px] bg-ef-surface rounded-[22px] overflow-hidden"
            style={{
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 3,
            }}
          >
            <View
              className="items-center justify-center"
              style={{
                height: 148,
                backgroundColor: target.avatarBgColor,
              }}
            >
              <Text style={{ fontSize: 56 }}>{target.avatarEmoji}</Text>

              <View
                className="absolute flex-row items-center rounded-full"
                style={{
                  top: 10,
                  left: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  gap: 5,
                  backgroundColor: 'rgba(212,101,90,0.88)',
                }}
              >
                <Ionicons name="ban" size={11} color="#fff" />
                <Text className="text-[11px] font-extrabold text-white">
                  차단 예정
                </Text>
              </View>

              <View
                className="absolute rounded-[13px]"
                style={{
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(0,0,0,0.42)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text className="text-[12px] font-extrabold text-white">78%</Text>
              </View>
            </View>

            <View className="px-[16px] py-[14px]">
              <View className="flex-row items-baseline gap-[7px] mb-[3px]">
                <Text
                  className="text-[20px] font-extrabold text-ef-text"
                  style={{ letterSpacing: -0.5 }}
                >
                  {target.nickname}
                </Text>
                <Text className="text-[14px] font-bold text-ef-text-sub">
                  {target.age}세
                </Text>
              </View>
              <View className="flex-row items-center gap-[5px] mb-[8px]">
                <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
                <Text className="text-[11.5px] text-ef-text-muted">
                  {target.region}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* reasons */}
        <View className="px-[18px] pt-[22px]">
          <Text
            className="text-[13px] font-extrabold text-ef-text mb-[4px]"
            style={{ letterSpacing: -0.3 }}
          >
            차단 사유를 선택해 주세요
          </Text>
          <Text className="text-[12px] text-ef-text-muted mb-[12px]">
            선택하지 않아도 차단할 수 있어요
          </Text>
          <ReasonSelectList
            reasons={BLOCK_REASONS}
            selected={reasons}
            onToggle={toggleReason}
            accentColor={COLORS.red}
          />
        </View>

        {/* notice */}
        <View className="px-[18px] pt-[20px]">
          <NoticeList
            accentColor={COLORS.red}
            backgroundColor="#FEF3F2"
            textColor="#9A4040"
            items={[
              `${targetName} 님이 내 프로필을 볼 수 없어요`,
              '서로 메시지를 주고받을 수 없어요',
              '설정에서 언제든 차단을 해제할 수 있어요',
            ]}
          />
        </View>
      </ScrollView>

      {/* bottom buttons */}
      <View
        style={{
          paddingHorizontal: 18,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: COLORS.bg,
          borderTopWidth: 1,
          borderTopColor: COLORS.divider,
          gap: 6,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onConfirm}
          disabled={blockMut.isPending}
          className="flex-row items-center justify-center rounded-[12px]"
          style={{
            backgroundColor: COLORS.red,
            paddingVertical: 11,
            gap: 7,
            shadowColor: COLORS.red,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <Ionicons name="ban" size={14} color="#fff" />
          <Text
            className="font-extrabold text-white"
            style={{ fontSize: 13, letterSpacing: -0.3 }}
          >
            {targetName} 님 차단하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          className="rounded-[12px] items-center justify-center"
          style={{
            backgroundColor: COLORS.surface,
            paddingVertical: 9,
            borderWidth: 1.5,
            borderColor: COLORS.divider,
          }}
        >
          <Text
            className="font-bold"
            style={{ fontSize: 12.5, color: COLORS.textSecondary }}
          >
            취소
          </Text>
        </TouchableOpacity>
      </View>

      {/* done overlay */}
      <Modal visible={done} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-[36px]"
          style={{ backgroundColor: COLORS.bg, gap: 12 }}
        >
          <Text style={{ fontSize: 52 }}>🔒</Text>
          <Text
            className="text-[21px] font-extrabold text-ef-text text-center"
            style={{ letterSpacing: -0.5, lineHeight: 28 }}
          >
            차단이{'\n'}완료되었어요
          </Text>
          <Text
            className="text-[13.5px] text-ef-text-muted text-center"
            style={{ lineHeight: 22 }}
          >
            {targetName} 님이 더 이상{'\n'}내 프로필을 볼 수 없어요
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setDone(false);
              router.back();
            }}
            className="w-full rounded-[14px] items-center justify-center mt-[10px]"
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 15,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.38,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Text className="text-[14px] font-extrabold text-white">확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
