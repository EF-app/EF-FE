/**
 * @file app/(onboarding)/phone-verification.tsx
 * @description 회원가입 2단계 – 본인 인증
 */

import { COLORS } from "@/constants/colors";
import BackButton from "@components/BackButton";
import CtaButton from "@components/CtaButton";
import InfoCard from "@components/InfoCard";
import OtpInputRow from "@components/OtpInputRow";
import PhoneInputRow from "@components/PhoneInputRow";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhoneVerificationScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRef = useRef<TextInput>(null);

  const phoneDigits = phone.replace(/\D/g, "");
  const canProceed = phoneDigits.length >= 10 && otp.length === 6;

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const sendCode = useCallback(() => {
    if (phoneDigits.length < 10) return;
    setCodeSent(true);
    setTimerSeconds(179);
    setTimerActive(true);
    otpRef.current?.focus();
  }, [phoneDigits]);

  const verifyCode = useCallback(() => {
    if (otp.length !== 6) return;
    const isValid = otp === "123456";
    if (isValid) {
      setVerified(true);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  }, [otp]);

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    router.push({
      pathname: "/(onboarding)/account-input",
      params: { phone: phoneDigits },
    });
  }, [canProceed, phoneDigits, router]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            className="px-6"
            style={{ paddingTop: Platform.OS === "ios" ? 10 : 20 }}
          >
            <BackButton onPress={() => router.back()} />
          </View>

          <View className="px-6 pt-8">
            <Text className="text-[11px] tracking-[1.4px] text-ef-primary font-bold mb-[10px] uppercase">
              STEP 1 OF 3
            </Text>
            <Text
              className="text-[24px] text-ef-text font-sans mb-[6px]"
              style={{ lineHeight: 32, letterSpacing: -0.3 }}
            >
              핸드폰 번호 인증
            </Text>
            <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-9">
              간편하고 안전한 본인 확인을 위해{"\n"}번호를 입력해 주세요
            </Text>

            <View className="flex-row gap-[5px] mb-9">
              <View className="h-[3px] w-6 rounded-[2px] bg-ef-primary" />
              <View className="h-[3px] w-2 rounded-[2px] bg-ef-surface2" />
              <View className="h-[3px] w-2 rounded-[2px] bg-ef-surface2" />
            </View>

            <View className="mb-[14px]">
              <Text className="text-[11px] tracking-[0.7px] text-ef-text-muted font-bold mb-2 uppercase">
                휴대폰 번호
              </Text>
              <PhoneInputRow
                value={phone}
                onChangeText={setPhone}
                onSend={sendCode}
              />
            </View>

            <View className="mb-[14px]">
              <Text className="text-[11px] tracking-[0.7px] text-ef-text-muted font-bold mb-2 uppercase">
                인증번호
              </Text>
              <OtpInputRow
                value={otp}
                onChangeText={(v) => {
                  setOtp(v);
                  setOtpError(false);
                }}
                onVerify={verifyCode}
                timerSeconds={timerSeconds}
                codeSent={codeSent}
                verified={verified}
                hasError={otpError}
                inputRef={otpRef}
              />
            </View>

            <InfoCard marginTop={28}>
              위 인증을 통해{" "}
              <Text
                style={{
                  fontFamily: "NanumSquareNeo-cBd",
                  color: COLORS.textPrimary,
                }}
              >
                여성인증, 성인인증, 본인인증
              </Text>
              을 진행합니다.{"\n"}나이, 성별 외의 정보는 수집하지 않습니다.
            </InfoCard>
          </View>
        </ScrollView>

        <View
          className="px-6 bg-ef-bg"
          style={{
            paddingTop: 16,
            paddingBottom: Platform.OS === "ios" ? 34 : 24,
          }}
        >
          <CtaButton
            label="다음으로"
            active={canProceed}
            onPress={handleNext}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
