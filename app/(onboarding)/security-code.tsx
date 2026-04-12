/**
 * @file app/(onboarding)/security-code.tsx
 * @description 보안코드 등록 화면 — 회원가입 완료 후 필수 설정
 *
 * 흐름: 회원가입 완료 → 이 화면 (Step 1: 설정) → Step 2: 확인 → 홈
 * Step 1: 보안코드 4자리 입력
 * Step 2: 동일 코드 재입력 (확인)
 * 불일치 시 Step 1로 돌아와 재설정
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import PinKeypad from '@/features/auth/components/PinKeypad';
import { useRegisterSecurityCode } from '@/features/auth/hooks/useSecurity';

type Step = 'set' | 'confirm';

export default function SecurityCodeRegisterScreen() {
  const router = useRouter();
  const { mutateAsync: register, isPending } = useRegisterSecurityCode();

  const [step, setStep] = useState<Step>('set');
  const [firstCode, setFirstCode] = useState('');
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /* 타이틀 / 서브 텍스트 */
  const title = step === 'set'
    ? '보안코드를\n설정해 주세요'
    : '보안코드를\n한 번 더 입력해 주세요';

  const eyebrow = step === 'set' ? '보안코드 설정' : '보안코드 확인';

  /* 숫자 입력 */
  const handleKeyPress = useCallback(
    async (key: string) => {
      if (isPending || input.length >= 4) return;
      setIsError(false);
      setErrorMsg('');
      const next = input + key;
      setInput(next);

      if (next.length === 4) {
        setTimeout(() => handleComplete(next), 120);
      }
    },
    [input, step, firstCode, isPending],
  );

  /* 삭제 */
  const handleDelete = useCallback(() => {
    setIsError(false);
    setErrorMsg('');
    setInput(prev => prev.slice(0, -1));
  }, []);

  /* 뒤로가기: Step 2 → Step 1 초기화 */
  const handleBack = () => {
    if (step === 'confirm') {
      setStep('set');
      setFirstCode('');
      setInput('');
      setIsError(false);
      setErrorMsg('');
    } else {
      router.back();
    }
  };

  /* 단계별 완료 처리 */
  const handleComplete = async (code: string) => {
    if (step === 'set') {
      /* Step 1 완료 → Step 2로 */
      setFirstCode(code);
      setInput('');
      setStep('confirm');
    } else {
      /* Step 2: 일치 여부 확인 */
      if (code === firstCode) {
        /* ✅ 일치 → 등록 → 홈 */
        await register(code);
        router.replace('/(tabs)/home');
      } else {
        /* ❌ 불일치 → 에러 후 Step 1 초기화 */
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
          setErrorMsg('보안코드가 일치하지 않습니다. 다시 설정해 주세요.');
          setTimeout(() => {
            setStep('set');
            setFirstCode('');
            setInput('');
            setErrorMsg('');
          }, 1200);
        }, 380);
      }
    }
  };

  /* 스텝 인디케이터 */
  const StepDots = () => (
    <View className="flex-row items-center gap-[6px] mb-[32px]">
      {(['set', 'confirm'] as Step[]).map((s, i) => (
        <View
          key={s}
          style={{
            width: step === s ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: step === s ? COLORS.primary : COLORS.surface2,
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top', 'bottom']}>
      {/* ── 앱 헤더 ── */}
      <View className="flex-row items-center justify-between px-[24px] pt-[14px]">
        <View className="flex-row items-center gap-[10px]">
          <View
            className="w-[34px] h-[34px] rounded-[10px] items-center justify-center"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Ionicons name="diamond-outline" size={16} color="#FFF" />
          </View>
          <Text
            className="text-[15px] font-extrabold text-ef-text"
            style={{ letterSpacing: -0.3 }}
          >
            녹차
          </Text>
        </View>

        {/* 뒤로가기 */}
        <TouchableOpacity
          className="w-[36px] h-[36px] bg-ef-surface rounded-[12px] items-center justify-center"
          style={{
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── 본문 ── */}
      <View className="flex-1 items-center px-[28px] pt-[44px]">
        {/* 타이틀 */}
        <View className="w-full mb-[32px]">
          <Text
            className="text-[11px] font-bold mb-[10px]"
            style={{ color: COLORS.primary, letterSpacing: 1.4 }}
          >
            {eyebrow}
          </Text>
          <Text
            className="text-[24px] text-ef-text mb-[20px]"
            style={{ letterSpacing: -0.4, lineHeight: 32 }}
          >
            {title}
          </Text>

          {/* 스텝 인디케이터 */}
          <StepDots />
        </View>

        {/* 키패드 + 도트 */}
        <PinKeypad
          value={input}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          isError={isError}
        />

        {/* 에러 메시지 */}
        <View className="h-[20px] mt-[14px] items-center justify-center">
          {errorMsg ? (
            <Text
              className="text-[12px] font-bold text-center"
              style={{ color: COLORS.danger }}
            >
              {errorMsg}
            </Text>
          ) : null}
        </View>

        {/* 안내 문구 (Step 1에서만) */}
        {step === 'set' && (
          <View
            className="mt-[28px] w-full rounded-[14px] px-[16px] py-[14px]"
            style={{ backgroundColor: COLORS.primaryTint }}
          >
            <Text
              className="text-[12px] text-ef-text-secondary leading-[18px]"
              style={{ letterSpacing: -0.2 }}
            >
              보안코드는 앱 실행 시마다 입력하는{'\n'}
              4자리 숫자입니다. 분실 시 본인 인증을{'\n'}
              통해 재설정할 수 있어요.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
