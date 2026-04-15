/**
 * @file app/(auth)/account-recovery-verify.tsx
 * @description 계정 찾기 – 번호 인증 화면
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@components/AppHeader';
import BackButton from '@components/BackButton';
import PhoneInputRow from '@components/PhoneInputRow';
import OtpInputRow from '@components/OtpInputRow';
import InfoCard from '@components/InfoCard';
import CtaButton from '@components/CtaButton';
import { COLORS } from '@/constants/colors';

export default function AccountRecoveryVerifyScreen() {
  const router = useRouter();

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
    if (phoneDigits.length < 10) return;
    setCodeSent(true); setOtpVerified(false); setOtpError(false); setOtp('');
    setTimerSeconds(179); setTimerActive(true);
    otpRef.current?.focus();
  }, [phoneDigits]);

  const verifyOtp = useCallback(() => {
    if (otp.length !== 6) return;
    const isValid = otp === '123456';
    if (isValid) { setOtpVerified(true); setOtpError(false); clearInterval(timerRef.current!); setTimerActive(false); }
    else { setOtpError(true); setOtp(''); }
  }, [otp, phoneDigits]);

  const handleNext = useCallback(() => {
    if (!otpVerified) return;
    router.push({ pathname: '/(auth)/account-recovery-result', params: { phone: phoneDigits } });
  }, [otpVerified, phoneDigits, router]);

  return (
    <View className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
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
              계정 정보 확인
            </Text>
            <Text
              className="text-[24px] text-ef-text font-sans mb-[6px]"
              style={{ lineHeight: 32, letterSpacing: -0.3 }}
            >
              본인 확인을 위해{'\n'}번호를 인증해요
            </Text>
            <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-8">
              계정 정보를 확인하기 위하여{'\n'}핸드폰 번호 인증을 진행합니다.
            </Text>

            <View className="mb-[14px]">
              <Text className="text-[11px] tracking-[0.7px] text-ef-text-muted font-bold mb-2 uppercase">
                휴대폰 번호
              </Text>
              <PhoneInputRow
                value={phone}
                onChangeText={(formatted) => { setPhone(formatted); if (otpVerified) setOtpVerified(false); }}
                onSend={sendCode}
                disabled={otpVerified}
              />
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
              가입 시 등록한 번호로 인증을 진행합니다.{'\n'}
              <Text style={{ fontFamily: 'NanumSquareNeo-cBd', color: COLORS.textPrimary }}>
                번호가 변경된 경우
              </Text>{' '}
              고객센터로 문의해 주세요.
            </InfoCard>
          </View>
        </ScrollView>

        <View
          className="px-6 bg-ef-bg"
          style={{ paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 24 }}
        >
          <CtaButton label="다음" active={otpVerified} onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
