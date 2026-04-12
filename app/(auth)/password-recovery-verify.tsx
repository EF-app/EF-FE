/**
 * @file app/(auth)/password-recovery-verify.tsx
 * @description 비밀번호 찾기 – 번호 인증 화면
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@components/AppHeader';
import BackButton from '@components/BackButton';
import PhoneInputRow from '@components/PhoneInputRow';
import OtpInputRow from '@components/OtpInputRow';
import InfoCard from '@components/InfoCard';
import CtaButton from '@components/CtaButton';
import { COLORS } from '@/constants/colors';

export default function PasswordRecoveryVerifyScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRef = useRef<TextInput>(null);

  const phoneDigits = phone.replace(/\D/g, '');
  const canSendCode = userId.trim().length > 0 && phoneDigits.length >= 10;

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current!); setTimerActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const sendCode = useCallback(() => {
    if (!canSendCode) return;
    setCodeSent(true); setOtpVerified(false); setOtpError(false); setOtp('');
    setTimerSeconds(179); setTimerActive(true);
    otpRef.current?.focus();
  }, [canSendCode, userId, phoneDigits]);

  const verifyOtp = useCallback(() => {
    if (otp.length !== 6) return;
    const isValid = otp === '123456';
    if (isValid) { setOtpVerified(true); setOtpError(false); clearInterval(timerRef.current!); setTimerActive(false); }
    else { setOtpError(true); setOtp(''); }
  }, [otp, userId, phoneDigits]);

  const handleNext = useCallback(() => {
    if (!otpVerified) return;
    router.push({ pathname: '/(auth)/password-reset', params: { userId, phone: phoneDigits } });
  }, [otpVerified, userId, phoneDigits, router]);

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
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <AppHeader />
          <View className="px-6 pt-4">
            <BackButton onPress={() => router.back()} />
          </View>
          <View className="px-6 pt-7">
            <Text className="text-[11px] tracking-[1.4px] text-ef-primary font-bold mb-[10px] uppercase">
              비밀번호 재설정
            </Text>
            <Text
              className="text-[24px] text-ef-text font-sans mb-[6px]"
              style={{ lineHeight: 32, letterSpacing: -0.3 }}
            >
              번호 인증으로{'\n'}본인을 확인해요
            </Text>
            <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-8">
              가입 시 등록한 아이디와 휴대폰 번호로{'\n'}본인 인증을 진행합니다.
            </Text>

            <View className="mb-[14px]">
              <Text className="text-[11px] tracking-[0.7px] text-ef-text-muted font-bold mb-2 uppercase">
                아이디
              </Text>
              <TextInput
                className="bg-ef-surface rounded-[14px] py-[15px] px-4 font-sans text-[14px] text-ef-text border-[1.5px] border-transparent"
                placeholder="가입한 아이디를 입력하세요"
                placeholderTextColor={COLORS.textMuted}
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-[14px]">
              <Text className="text-[11px] tracking-[0.7px] text-ef-text-muted font-bold mb-2 uppercase">
                휴대폰 번호
              </Text>
              <PhoneInputRow
                value={phone}
                onChangeText={setPhone}
                onSend={sendCode}
                disabled={!canSendCode || otpVerified}
              />
              {otpVerified && (
                <View className="flex-row items-center gap-[5px] mt-[7px] pl-[2px]">
                  <Text style={{ fontSize: 12, color: COLORS.green }}>✓</Text>
                  <Text className="text-[12px] text-ef-green font-bold">핸드폰 번호 인증 완료</Text>
                </View>
              )}
            </View>

            <View className="mb-[14px]">
              <Text className="text-[11px] tracking-[0.7px] text-ef-text-muted font-bold mb-2 uppercase">
                인증번호
              </Text>
              <OtpInputRow
                value={otp}
                onChangeText={(v) => { setOtp(v); setOtpError(false); }}
                onVerify={verifyOtp}
                timerSeconds={timerSeconds}
                codeSent={codeSent}
                verified={otpVerified}
                hasError={otpError}
                inputRef={otpRef}
              />
            </View>

            <InfoCard>
              <Text style={{ fontFamily: 'NanumSquareNeo-cBd', color: COLORS.textPrimary }}>
                비밀번호 재설정
              </Text>
              을 위한 휴대폰 번호 인증을 진행합니다.{'\n'}
              가입 시 사용한 아이디와 번호가 일치해야 합니다.
            </InfoCard>

            <View className="items-center mt-4">
              <Text
                className="text-[12.5px] text-ef-text-sub font-sans"
                onPress={() => router.push('/(auth)/account-recovery-verify')}
              >
                아이디를 잊으셨나요?
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          className="px-6 bg-ef-bg"
          style={{ paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 24 }}
        >
          <CtaButton label="다음으로" active={otpVerified} onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
