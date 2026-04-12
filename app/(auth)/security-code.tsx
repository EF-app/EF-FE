/**
 * @file app/(auth)/security-code.tsx
 * @description 보안코드 입력 화면 — 앱 재실행 시 로그인 유지 사용자에게 표시
 *
 * 흐름: 앱 실행 → (로그인 상태 확인) → 이 화면 → 홈
 * 5회 실패 시 키패드 잠금 + 고객센터 안내
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import PinKeypad from '@/features/auth/components/PinKeypad';
import { useVerifySecurityCode } from '@/features/auth/hooks/useSecurity';

const MAX_FAIL = 5;

export default function SecurityCodeScreen() {
  const router = useRouter();
  const { mutateAsync: verify, isPending } = useVerifySecurityCode();

  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /* 숫자 입력 */
  const handleKeyPress = useCallback(
    async (key: string) => {
      if (isLocked || isPending || input.length >= 4) return;
      setIsError(false);
      setErrorMsg('');
      const next = input + key;
      setInput(next);

      if (next.length === 4) {
        /* 120 ms 후 자동 검증 */
        setTimeout(() => runVerify(next), 120);
      }
    },
    [input, isLocked, isPending],
  );

  /* 삭제 */
  const handleDelete = useCallback(() => {
    if (isLocked) return;
    setIsError(false);
    setErrorMsg('');
    setInput(prev => prev.slice(0, -1));
  }, [isLocked]);

  /* 검증 실행 */
  const runVerify = async (code: string) => {
    const res = await verify(code);
    if (res.success) {
      /* ✅ 성공 → 홈 */
      router.replace('/(tabs)/home');
    } else {
      /* ❌ 실패 */
      const nextFail = failCount + 1;
      setFailCount(nextFail);
      setIsError(true);

      setTimeout(() => {
        setIsError(false);
        if (nextFail >= MAX_FAIL) {
          setIsLocked(true);
          setErrorMsg('5회 실패로 잠겼습니다. 고객센터에 문의해 주세요.');
        } else {
          setErrorMsg(`보안코드가 틀렸습니다  ${nextFail}/${MAX_FAIL}`);
          setInput('');
        }
      }, 380);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top', 'bottom']}>
      {/* ── 앱 헤더 ── */}
      <View className="flex-row items-center gap-[10px] px-[24px] pt-[14px] pb-[0px]">
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

      {/* ── 본문 ── */}
      <View className="flex-1 items-center px-[28px] pt-[44px]">
        {/* 상단 타이틀 */}
        <View className="w-full mb-[40px]">
          <Text
            className="text-[11px] font-bold mb-[10px]"
            style={{ color: COLORS.primary, letterSpacing: 1.4 }}
          >
            보안코드
          </Text>
          <Text
            className="text-[24px] text-ef-text"
            style={{ letterSpacing: -0.4, lineHeight: 32 }}
          >
            보안코드를{'\n'}입력해 주세요
          </Text>
        </View>

        {/* 키패드 + 도트 */}
        <PinKeypad
          value={input}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          isError={isError}
          isLocked={isLocked}
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

        {/* 하단 링크 */}
        <View className="items-center gap-y-[14px] mt-[32px]">
          <TouchableOpacity
            onPress={() => {
              /* 실제 서비스: 핸드폰 번호 재인증 후 보안코드 재설정 */
            }}
            activeOpacity={0.7}
          >
            <Text
              className="text-[12.5px] text-ef-text-secondary"
              style={{ letterSpacing: -0.2 }}
            >
              보안코드를 잊으셨나요?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center gap-[5px] border rounded-[20px] px-[14px] py-[7px]"
            style={{ borderColor: COLORS.divider }}
            onPress={() =>
              Linking.openURL('mailto:support@nokcha.app?subject=보안코드%20문의')
            }
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={13} color={COLORS.textMuted} />
            <Text
              className="text-[11.5px] text-ef-text-muted"
              style={{ letterSpacing: -0.1 }}
            >
              고객센터
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
