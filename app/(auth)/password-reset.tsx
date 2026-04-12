/**
 * @file app/(auth)/password-reset.tsx
 * @description 비밀번호 재설정 화면
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@components/AppHeader';
import PasswordInputField from '@components/PasswordInputField';
import PasswordStrengthBar from '@components/PasswordStrengthBar';
import { COLORS } from '@/constants/colors';
import { RE_PW } from '@/constants/validation';

export default function PasswordResetScreen() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const pwValid = RE_PW.test(password);

  const pwHint = useMemo((): { text: string; type: 'ok' | 'err' } | null => {
    if (!password) return null;
    if (pwValid) return { text: '사용 가능한 비밀번호입니다', type: 'ok' };
    return { text: '영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요', type: 'err' };
  }, [password, pwValid]);

  const pw2Match = passwordConfirm.length > 0 && passwordConfirm === password;
  const pw2Valid = pw2Match && pwValid;

  const matchHint = useMemo((): { text: string; type: 'ok' | 'err' } | null => {
    if (!passwordConfirm) return null;
    if (pw2Match) return { text: '비밀번호가 일치합니다', type: 'ok' };
    return { text: '비밀번호가 일치하지 않습니다', type: 'err' };
  }, [passwordConfirm, pw2Match]);

  const canProceed = pwValid && pw2Valid;

  const handleSubmit = useCallback(async () => {
    if (!canProceed) return;
    setIsComplete(true);
    setTimeout(() => router.replace('/(auth)/login'), 1500);
  }, [canProceed, password, router]);

  const btnClass = isComplete
    ? 'bg-ef-green'
    : canProceed
    ? 'bg-ef-primary'
    : 'bg-[#E8E5E1]';

  return (
    <View className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <AppHeader />
          <View className="px-7 pt-8">
            <Text className="text-[11px] tracking-[1.4px] text-ef-primary font-bold mb-[10px] uppercase">
              비밀번호 재설정
            </Text>
            <Text
              className="text-[26px] text-ef-text font-sans mb-[6px]"
              style={{ letterSpacing: -0.5, lineHeight: 31 }}
            >
              새 비밀번호 설정
            </Text>
            <Text className="text-[13.5px] text-ef-text-sub font-sans leading-[22px] mb-8">
              안전한 비밀번호로 변경해 주세요
            </Text>

            <View className="mb-[18px]">
              <Text className="text-[11px] text-ef-text-muted font-bold tracking-[0.6px] mb-2 uppercase">
                새 비밀번호
              </Text>
              <PasswordInputField
                value={password}
                onChangeText={setPassword}
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                showPassword={showPw}
                onToggleShow={() => setShowPw(!showPw)}
                isValid={pwValid}
                hasInput={password.length > 0}
              />
              {pwHint && (
                <Text className={`text-[11.5px] font-sans mt-[6px] pl-[2px] ${pwHint.type === 'ok' ? 'text-ef-primary' : 'text-ef-danger'}`}>
                  {pwHint.text}
                </Text>
              )}
            </View>

            <PasswordStrengthBar password={password} />

            <View className="mb-[18px]">
              <Text className="text-[11px] text-ef-text-muted font-bold tracking-[0.6px] mb-2 uppercase">
                새 비밀번호 재입력
              </Text>
              <PasswordInputField
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="비밀번호를 다시 입력하세요"
                showPassword={showPw2}
                onToggleShow={() => setShowPw2(!showPw2)}
                isValid={pw2Valid}
                hasInput={passwordConfirm.length > 0}
                showInvalidBorder={false}
              />
              {matchHint && (
                <Text className={`text-[12px] font-bold mt-2 pl-[2px] ${matchHint.type === 'ok' ? 'text-ef-primary' : 'text-ef-danger'}`}>
                  {matchHint.text}
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`w-full ${btnClass} rounded-[14px] py-[16.5px] flex-row items-center justify-center gap-2 mt-2`}
              style={(canProceed || isComplete) ? Platform.select({
                ios: {
                  shadowColor: isComplete ? COLORS.green : COLORS.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: isComplete ? 0.35 : 0.3,
                  shadowRadius: 24,
                },
                android: { elevation: 8 },
              }) : undefined}
              disabled={!canProceed || isComplete}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text
                className="text-[15px] font-extrabold"
                style={{ color: (canProceed || isComplete) ? '#fff' : '#B0ABB5', letterSpacing: 0.2 }}
              >
                {isComplete ? '완료! ✓' : '비밀번호 변경'}
              </Text>
              {!isComplete && (
                <Text style={{ color: canProceed ? '#fff' : '#B0ABB5', fontSize: 16 }}>›</Text>
              )}
            </TouchableOpacity>

            <Text className="text-center text-[13px] text-ef-text-muted font-sans mt-5 leading-[21px]">
              비밀번호가 기억나셨나요?{' '}
              <Text
                className="text-ef-primary font-bold"
                onPress={() => router.replace('/(auth)/login')}
              >
                로그인
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
