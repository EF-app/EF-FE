/**
 * @file app/report/postit.tsx
 * @description 포스트잇(편지) 신고 — origin/report_postit.html 변환
 *              isAnonymous=1 이면 작성자 마스킹된 익명 버전 프리뷰
 *
 * 사용 예: router.push({ pathname: '/report/postit',
 *                       params: { letterId, isAnonymous: 1 } })
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import ScreenTopBar from '@/common/components/ScreenTopBar';
import ReasonSelectList from '@/common/components/ReasonSelectList';
import NoticeList from '@/common/components/NoticeList';
import DetailInput from '@/features/reports/components/DetailInput';
import ReportSubmitBar from '@/features/reports/components/ReportSubmitBar';
import { REPORT_REASONS } from '@/features/reports/api/reportsApi';
import { ReportReasonCode } from '@/features/reports/types';
import {
  usePostitPreview,
  useSubmitReport,
} from '@/features/reports/hooks/useReports';
import { formatRelative } from '@/features/likes/utils/time';

export default function ReportPostitScreen() {
  const router = useRouter();
  const { letterId, isAnonymous } = useLocalSearchParams<{
    letterId?: string;
    isAnonymous?: string;
  }>();
  const anon = isAnonymous === '1';
  const { data: postit } = usePostitPreview(letterId ?? 'ltr_default', anon);
  const submitMut = useSubmitReport();

  const [reasons, setReasons] = useState<ReportReasonCode[]>([]);
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);

  const toggleReason = (c: ReportReasonCode) =>
    setReasons(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));

  const onSubmit = async () => {
    if (reasons.length === 0) return;
    await submitMut.mutateAsync({
      targetType: 'LETTER',
      targetId: letterId ?? 'ltr_unknown',
      reasonCodes: reasons,
      detail: detail || undefined,
    });
    setDone(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <ScreenTopBar title="포스트잇 신고" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* section title */}
        <View className="px-[20px] pt-[20px]">
          <Text
            className="text-[13px] font-extrabold text-ef-text mb-[3px]"
            style={{ letterSpacing: -0.3 }}
          >
            신고할 포스트잇을 확인해 주세요
          </Text>
          <Text className="text-[12px] text-ef-text-muted">
            아래 내용이 신고 접수 시 함께 제출돼요
          </Text>
        </View>

        {/* postit preview */}
        {postit && (
          <View className="px-[20px] pt-[16px]">
            <View
              className="rounded-[4px] relative"
              style={{
                backgroundColor: '#DDD6F0',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 14,
                opacity: 0.92,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 3, height: 6 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
                elevation: 4,
              }}
            >
              <View
                className="absolute flex-row items-center rounded-full"
                style={{
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(232,76,122,0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(232,76,122,0.3)',
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                  gap: 4,
                }}
              >
                <Text
                  className="text-[10px] font-extrabold"
                  style={{ color: '#E84C7A' }}
                >
                  ⚠ 신고 대상
                </Text>
              </View>

              <View className="flex-row items-center gap-[8px] mb-[10px]">
                <View
                  className="w-[28px] h-[28px] rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(150,134,191,0.22)' }}
                >
                  <Text style={{ fontSize: 13 }}>{postit.authorAvatarEmoji}</Text>
                </View>
                <View>
                  <Text
                    className="text-[12px] font-extrabold"
                    style={{ color: '#5A5080' }}
                  >
                    {postit.showAuthor ? postit.authorNickname : '익명'}
                  </Text>
                  <Text
                    className="text-[10px]"
                    style={{ color: '#9B96B0', marginTop: 1 }}
                  >
                    {formatRelative(postit.createdAt)}
                  </Text>
                </View>
              </View>

              <Text
                className="text-[13.5px]"
                style={{
                  color: '#3D3560',
                  lineHeight: 22,
                  letterSpacing: -0.1,
                }}
              >
                {postit.body}
              </Text>
            </View>
          </View>
        )}

        {/* reasons */}
        <View className="px-[20px] pt-[22px]">
          <Text
            className="text-[13px] font-extrabold text-ef-text mb-[10px]"
            style={{ letterSpacing: -0.3 }}
          >
            신고 사유를 선택해 주세요
          </Text>
          <ReasonSelectList
            reasons={REPORT_REASONS}
            selected={reasons}
            onToggle={toggleReason}
          />
        </View>

        {/* detail */}
        <View className="px-[20px] pt-[20px]">
          <DetailInput value={detail} onChange={setDetail} />
        </View>

        {/* anonymous notice */}
        <View
          className="mx-[20px] mt-[16px] rounded-[12px] flex-row items-center"
          style={{
            backgroundColor: COLORS.primaryTint,
            borderWidth: 1,
            borderColor: 'rgba(150,134,191,0.15)',
            paddingHorizontal: 14,
            paddingVertical: 11,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16 }}>🔒</Text>
          <View className="flex-1">
            <Text
              className="text-[12px] font-bold"
              style={{ color: COLORS.primaryDeep }}
            >
              익명으로 신고돼요
            </Text>
            <Text
              className="text-[11px] mt-[1px]"
              style={{ color: COLORS.primary }}
            >
              신고자 정보는 상대방에게 절대 공개되지 않아요
            </Text>
          </View>
        </View>

        {/* notice */}
        <View className="px-[20px] pt-[14px] pb-[12px]">
          <NoticeList
            items={[
              '허위 신고는 제재 대상이 될 수 있어요',
              '신고 접수 후 24시간 이내에 검토가 시작돼요',
              '해당 포스트잇은 검토 완료 전까지 정상 노출돼요',
            ]}
          />
        </View>
      </ScrollView>

      <ReportSubmitBar
        enabled={reasons.length > 0}
        loading={submitMut.isPending}
        onSubmit={onSubmit}
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
