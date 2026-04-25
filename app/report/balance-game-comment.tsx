/**
 * @file app/report/balance-game-comment.tsx
 * @description 밸런스 게임 댓글 신고 — origin/report_anon.html / report_with_nick.html 통합
 *              isAnonymous=1 이면 작성자 노출 없음, 아니면 닉네임 카드 + 차단 토글 노출
 *
 * 사용 예: router.push({ pathname: '/report/balance-game-comment',
 *                       params: { commentId, targetUserId, isAnonymous: 1 } })
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import ScreenTopBar from '@/common/components/ScreenTopBar';
import ReasonSelectList from '@/common/components/ReasonSelectList';
import NoticeList from '@/common/components/NoticeList';
import Toggle from '@/common/components/Toggle';
import DetailInput from '@/features/reports/components/DetailInput';
import ReportSubmitBar from '@/features/reports/components/ReportSubmitBar';
import { REPORT_REASONS } from '@/features/reports/api/reportsApi';
import { ReportReasonCode } from '@/features/reports/types';
import { useReportTarget, useSubmitReport } from '@/features/reports/hooks/useReports';
import { useBlockUser } from '@/features/blocks/hooks/useBlocks';

export default function ReportBalanceGameCommentScreen() {
  const router = useRouter();
  const { commentId, targetUserId, isAnonymous } = useLocalSearchParams<{
    commentId?: string;
    targetUserId?: string;
    isAnonymous?: string;
  }>();
  const anon = isAnonymous === '1';
  const { data: target } = useReportTarget(targetUserId);
  const submitMut = useSubmitReport();
  const blockMut = useBlockUser();

  const [reasons, setReasons] = useState<ReportReasonCode[]>([]);
  const [detail, setDetail] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [done, setDone] = useState(false);

  const toggleReason = (c: ReportReasonCode) =>
    setReasons(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));

  const onSubmit = async () => {
    if (reasons.length === 0) return;
    await submitMut.mutateAsync({
      targetType: 'BALANCE_GAME_COMMENT',
      targetId: commentId ?? 'cmt_unknown',
      reasonCodes: reasons,
      detail: detail || undefined,
      alsoBlock: !anon && alsoBlock,
    });
    if (!anon && alsoBlock && target) {
      blockMut.mutate({ targetUserId: target.userId, reasonCodes: [] });
    }
    setDone(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScreenTopBar title="신고하기" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {anon ? (
          /* 익명 신고 안내 배너 */
          <View
            className="mx-[20px] mt-[18px] rounded-[14px] flex-row items-start"
            style={{
              backgroundColor: COLORS.primaryTint,
              borderWidth: 1,
              borderColor: 'rgba(150,134,191,0.18)',
              paddingHorizontal: 14,
              paddingVertical: 12,
              gap: 10,
            }}
          >
            <View
              className="w-[32px] h-[32px] rounded-[10px] items-center justify-center"
              style={{ backgroundColor: 'rgba(150,134,191,0.18)' }}
            >
              <Text style={{ fontSize: 16 }}>🔒</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-[12.5px] font-extrabold mb-[2px]"
                style={{ color: COLORS.primaryDeep, letterSpacing: -0.3 }}
              >
                익명으로 신고돼요
              </Text>
              <Text
                className="text-[11.5px]"
                style={{ color: COLORS.primary, lineHeight: 17 }}
              >
                신고자의 정보는 상대방에게 절대 공개되지 않아요
              </Text>
            </View>
          </View>
        ) : (
          /* 닉네임 노출 — 신고 대상 카드 */
          target && (
            <View
              className="mx-[20px] mt-[18px] bg-ef-surface rounded-[18px] flex-row items-center"
              style={{
                paddingHorizontal: 18,
                paddingVertical: 16,
                gap: 14,
                borderWidth: 1,
                borderColor: COLORS.divider,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View
                className="w-[48px] h-[48px] rounded-full items-center justify-center"
                style={{
                  backgroundColor: target.avatarBgColor,
                  borderWidth: 2,
                  borderColor: 'rgba(139,191,168,0.3)',
                }}
              >
                <Text style={{ fontSize: 19 }}>{target.avatarEmoji}</Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-[10.5px] font-bold text-ef-text-muted mb-[2px]"
                  style={{ letterSpacing: 0.4 }}
                >
                  신고 대상
                </Text>
                <View className="flex-row items-center gap-[7px]">
                  <Text
                    className="text-[15px] font-extrabold text-ef-text"
                    style={{ letterSpacing: -0.3 }}
                  >
                    {target.nickname}
                  </Text>
                  <Text
                    className="text-[10px] font-bold"
                    style={{
                      color: COLORS.primary,
                      backgroundColor: COLORS.primaryTint,
                      paddingHorizontal: 7,
                      paddingVertical: 1,
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  >
                    {target.age}
                  </Text>
                </View>
                <View className="flex-row items-center gap-[3px] mt-[3px]">
                  <Ionicons name="location-outline" size={10} color={COLORS.textMuted} />
                  <Text className="text-[11.5px] text-ef-text-muted">
                    {target.region}
                  </Text>
                </View>
              </View>
              <View
                className="rounded-full flex-row items-center"
                style={{
                  backgroundColor: 'rgba(232,76,122,0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(232,76,122,0.18)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 11 }}>⚠️</Text>
                <Text
                  className="text-[11px] font-extrabold"
                  style={{ color: '#C0305A' }}
                >
                  신고
                </Text>
              </View>
            </View>
          )
        )}

        {/* reasons */}
        <View className="px-[20px] pt-[22px]">
          <Text
            className="text-[13px] font-extrabold text-ef-text mb-[4px]"
            style={{ letterSpacing: -0.3 }}
          >
            신고 사유를 선택해 주세요
          </Text>
          <Text className="text-[12px] text-ef-text-muted mb-[10px]">
            해당하는 항목을 모두 선택할 수 있어요
          </Text>
          <ReasonSelectList
            reasons={REPORT_REASONS}
            selected={reasons}
            onToggle={toggleReason}
          />
        </View>

        {/* detail */}
        <View className="px-[20px] pt-[20px]">
          <DetailInput
            value={detail}
            onChange={setDetail}
            placeholder={
              anon
                ? '구체적인 내용을 입력하면 더 빠르게 처리돼요'
                : `${target?.nickname ?? ''} 님에 대한 구체적인 내용을 입력해 주세요`
            }
          />
        </View>

        {/* also-block toggle (with-nick only) */}
        {!anon && target && (
          <View
            className="mx-[20px] mt-[18px] bg-ef-surface rounded-[14px] flex-row items-center"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              gap: 12,
              borderWidth: 1.5,
              borderColor: COLORS.divider,
            }}
          >
            <View
              className="w-[34px] h-[34px] rounded-[10px] items-center justify-center"
              style={{ backgroundColor: COLORS.bg }}
            >
              <Text style={{ fontSize: 17 }}>🚷</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-[13px] font-bold text-ef-text"
                style={{ letterSpacing: -0.2 }}
              >
                {target.nickname} 님 차단하기
              </Text>
              <Text className="text-[11.5px] text-ef-text-muted mt-[2px]">
                신고와 동시에 이 이웃을 차단해요
              </Text>
            </View>
            <Toggle value={alsoBlock} onChange={setAlsoBlock} />
          </View>
        )}

        {/* notice */}
        <View className="px-[20px] pt-[18px] pb-[12px]">
          <NoticeList
            items={[
              ...(anon
                ? []
                : ['신고자의 정보는 상대방에게 공개되지 않아요']),
              '허위 신고는 제재 대상이 될 수 있어요',
              '신고 접수 후 24시간 이내에 검토가 시작돼요',
              '긴급 상황이라면 고객센터로 직접 연락해 주세요',
            ]}
          />
        </View>
      </ScrollView>

      <ReportSubmitBar
        enabled={reasons.length > 0}
        loading={submitMut.isPending}
        onSubmit={onSubmit}
        onCancel={anon ? undefined : () => router.back()}
      />

      <Modal visible={done} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-[36px]"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <View
            className="bg-ef-surface rounded-[20px] items-center px-[28px] py-[28px]"
            style={{ width: '100%', maxWidth: 320, gap: 10 }}
          >
            <Text style={{ fontSize: 44 }}>✅</Text>
            <Text
              className="text-[18px] font-extrabold text-ef-text text-center"
              style={{ letterSpacing: -0.4 }}
            >
              신고가 접수되었어요
            </Text>
            <Text
              className="text-[12.5px] text-ef-text-muted text-center"
              style={{ lineHeight: 20 }}
            >
              검토 후 처리 결과를 알려드릴게요
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setDone(false);
                router.back();
              }}
              className="w-full rounded-[14px] items-center justify-center mt-[8px]"
              style={{ backgroundColor: COLORS.primary, paddingVertical: 13 }}
            >
              <Text className="text-[13.5px] font-extrabold text-white">확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
