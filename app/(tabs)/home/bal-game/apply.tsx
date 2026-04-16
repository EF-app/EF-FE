/**
 * @file app/(tabs)/home/bal-game/apply.tsx
 * @description 밸런스게임 신청 화면 — 2-step 폼 + 성공 뷰
 */

import BackButton from '@components/BackButton';
import CtaButton from '@components/CtaButton';
import InfoCard from '@components/InfoCard';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApplyTopNav from '@home/bal-game/apply/components/ApplyTopNav';
import CategoryGrid from '@home/bal-game/apply/components/CategoryGrid';
import OptionInputCard from '@home/bal-game/apply/components/OptionInputCard';
import OptionPreviewCard from '@home/bal-game/apply/components/OptionPreviewCard';
import ScopeSelector from '@home/bal-game/apply/components/ScopeSelector';
import StepHeader from '@home/bal-game/apply/components/StepHeader';
import StepProgressBar from '@home/bal-game/apply/components/StepProgressBar';
import SuccessView from '@home/bal-game/apply/components/SuccessView';
import VsDivider from '@home/bal-game/apply/components/VsDivider';
import { useSubmitBalanceApply } from '@home/bal-game/apply/hooks/useBalanceApply';
import type {
  BalanceApplyResult,
  BalanceCategory,
  BalanceScope,
} from '@home/bal-game/apply/types';

type ScreenStep = 1 | 2;

export default function BalGameApplyScreen() {
  const router = useRouter();
  const { mutate: submit, isPending } = useSubmitBalanceApply();

  const [step, setStep] = useState<ScreenStep>(1);
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [category, setCategory] = useState<BalanceCategory>('일상');
  const [scope, setScope] = useState<BalanceScope>('동네');
  const [result, setResult] = useState<BalanceApplyResult | null>(null);

  const trimmedA = optionA.trim();
  const trimmedB = optionB.trim();
  const canProceedStep1 = trimmedA.length > 0 && trimmedB.length > 0;

  const goStep2 = useCallback(() => {
    if (!canProceedStep1) return;
    setStep(2);
  }, [canProceedStep1]);

  const goStep1 = useCallback(() => setStep(1), []);

  const handleBack = useCallback(() => {
    if (result) {
      router.back();
      return;
    }
    if (step === 2) {
      goStep1();
      return;
    }
    router.back();
  }, [step, result, router, goStep1]);

  const handleSubmit = useCallback(() => {
    submit(
      { optionA: trimmedA, optionB: trimmedB, category, scope },
      { onSuccess: (res) => setResult(res) },
    );
  }, [submit, trimmedA, trimmedB, category, scope]);

  const handleGoHome = useCallback(() => {
    router.replace('/(tabs)/home');
  }, [router]);

  const stepIndicator: number | '✓' = result ? '✓' : step;

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ApplyTopNav
        currentStep={stepIndicator}
        totalSteps={2}
        onBackPress={handleBack}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40,
          }}
        >
          {result ? (
            <SuccessView result={result} onGoHome={handleGoHome} />
          ) : step === 1 ? (
            <>
              <StepProgressBar total={2} current={1} />
              <StepHeader
                eyebrow="Step 1 — 주제 작성"
                title={
                  <Text>
                    두 가지{' '}
                    <Text style={{ color: COLORS.primary }}>선택지</Text>를
                    {'\n'}
                    입력해 주세요
                  </Text>
                }
                description="재미있고 공감되는 상황일수록 좋아요. 최대 60자"
              />

              <OptionInputCard
                side="A"
                value={optionA}
                onChangeText={setOptionA}
                placeholder={
                  '예) 출근길 지하철 개찰구 앞에서\n교통카드 놓고온 거 인지함'
                }
              />

              <VsDivider />

              <OptionInputCard
                side="B"
                value={optionB}
                onChangeText={setOptionB}
                placeholder={
                  '예) 퇴근길 지하철 개찰구 앞에서\n이어폰 두고온 거 인지함'
                }
              />

              <OptionPreviewCard optionA={optionA} optionB={optionB} />

              <CtaButton
                label="다음 단계"
                active={canProceedStep1}
                onPress={goStep2}
              />
            </>
          ) : (
            <>
              <StepProgressBar total={2} current={2} />
              <StepHeader
                eyebrow="Step 2 — 상세 설정"
                title={
                  <Text>
                    <Text style={{ color: COLORS.primary }}>카테고리</Text>와
                    {'\n'}
                    공개 범위를 선택해요
                  </Text>
                }
                description="비슷한 주제끼리 묶여 더 많은 사람에게 노출돼요"
              />

              <SectionLabel text="카테고리" />
              <CategoryGrid value={category} onChange={setCategory} />

              <SectionLabel text="공개 범위" />
              <ScopeSelector value={scope} onChange={setScope} />

              <InfoCard marginTop={0}>
                심사 후 게시됩니다.{' '}
                <Text className="font-bold" style={{ color: COLORS.primary }}>
                  욕설, 혐오 표현, 특정인 비하
                </Text>
                {' 등 부적절한 내용은 거부될 수 있어요.\n동일 내용 중복 신청은 제한될 수 있습니다.'}
              </InfoCard>

              <View className="flex-row items-center gap-2 mt-5">
                <BackButton onPress={goStep1} />
                <View className="flex-1">
                  <CtaButton
                    label="신청 완료"
                    loadingLabel="신청 중…"
                    active
                    loading={isPending}
                    hideArrow
                    onPress={handleSubmit}
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <Text
    className="text-[10.5px] font-bold mb-[10px]"
    style={{
      color: COLORS.textMuted,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    }}
  >
    {text}
  </Text>
);
