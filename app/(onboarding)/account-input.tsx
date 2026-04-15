/**
 * @file app/(onboarding)/account-input.tsx
 * @description 회원가입 3단계 – 아이디 / 비밀번호 설정
 */

import { COLORS } from "@/constants/colors";
import { RE_ID, RE_PW } from "@/constants/validation";
import AppHeader from "@components/AppHeader";
import CtaButton from "@components/CtaButton";
import PasswordInputField from "@components/PasswordInputField";
import PasswordStrengthBar from "@components/PasswordStrengthBar";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

const StatusIcon: React.FC<{ isValid: boolean }> = ({ isValid }) => (
  <View
    className={`absolute right-[10px] w-7 h-7 rounded-[14px] items-center justify-center ${
      isValid ? 'bg-ef-success-tint' : 'bg-ef-danger-bg'
    }`}
  >
    <Text
      className="text-[12px] font-extrabold"
      style={{ color: isValid ? COLORS.primary : COLORS.danger }}
    >
      {isValid ? "✓" : "✕"}
    </Text>
  </View>
);

export default function AccountInputScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const idValid = RE_ID.test(userId);

  const idHint = useMemo((): { text: string; type: "ok" | "err" } | null => {
    if (!userId) return null;
    if (idValid) return { text: "사용 가능한 아이디입니다", type: "ok" };
    if (userId.length < 4) return { text: "4자 이상 입력해 주세요", type: "err" };
    if (userId.length > 16) return { text: "16자 이하로 입력해 주세요", type: "err" };
    return { text: "영문과 숫자만 사용할 수 있습니다", type: "err" };
  }, [userId, idValid]);

  const pwValid = RE_PW.test(password);

  const pwHint = useMemo((): { text: string; type: "ok" | "err" } | null => {
    if (!password) return null;
    if (pwValid) return { text: "사용 가능한 비밀번호입니다", type: "ok" };
    return { text: "영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요", type: "err" };
  }, [password, pwValid]);

  const pw2Match = passwordConfirm.length > 0 && passwordConfirm === password;
  const pw2Valid = pw2Match && pwValid;

  const matchHint = useMemo((): { text: string; type: "ok" | "err" } | null => {
    if (!passwordConfirm) return null;
    if (pw2Match) return { text: "비밀번호가 일치합니다", type: "ok" };
    return { text: "비밀번호가 일치하지 않습니다", type: "err" };
  }, [passwordConfirm, pw2Match]);

  const canProceed = idValid && pwValid && pw2Valid;

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    router.push("/(onboarding)/nickname");
  }, [canProceed, userId, password, router]);

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
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <AppHeader />

          <View className="px-7 pt-8 pb-10">
            <Text className="text-[11px] font-bold tracking-[1.4px] text-ef-primary mb-[10px] uppercase">
              회원가입
            </Text>
            <Text
              className="text-[26px] font-sans text-ef-text mb-[6px]"
              style={{ letterSpacing: -0.5, lineHeight: 31 }}
            >
              가입 정보 입력
            </Text>
            <Text className="text-[13.5px] font-sans text-ef-text-sub leading-[22px] mb-8">
              계정 생성을 위해 정보를 입력해 주세요
            </Text>

            {/* 아이디 */}
            <View className="mb-[18px]">
              <Text className="text-[11px] font-bold text-ef-text-muted tracking-[0.6px] mb-2 uppercase">
                아이디
              </Text>
              <View className="relative flex-row items-center">
                <TextInput
                  className={`flex-1 bg-ef-surface rounded-[14px] py-[15px] px-4 font-sans text-[14px] text-ef-text border-[1.5px] ${
                    userId && !idValid ? 'border-ef-border-invalid' : 'border-transparent'
                  }`}
                  style={{ paddingRight: 44 }}
                  placeholder="영문, 숫자 포함 4–16자"
                  placeholderTextColor={COLORS.textMuted}
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={16}
                />
                {userId.length > 0 && <StatusIcon isValid={idValid} />}
              </View>
              {idHint && (
                <Text className={`text-[11.5px] font-sans mt-[6px] pl-[2px] ${idHint.type === 'ok' ? 'text-ef-primary' : 'text-ef-danger'}`}>
                  {idHint.text}
                </Text>
              )}
            </View>

            {/* 비밀번호 */}
            <View className="mb-[18px]">
              <Text className="text-[11px] font-bold text-ef-text-muted tracking-[0.6px] mb-2 uppercase">
                비밀번호
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

            {/* 비밀번호 재입력 */}
            <View className="mb-[18px]">
              <Text className="text-[11px] font-bold text-ef-text-muted tracking-[0.6px] mb-2 uppercase">
                비밀번호 재입력
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
                <Text className={`text-[11.5px] font-sans mt-[6px] pl-[2px] ${matchHint.type === 'ok' ? 'text-ef-primary' : 'text-ef-danger'}`}>
                  {matchHint.text}
                </Text>
              )}
            </View>

            <CtaButton label="다음으로" active={canProceed} onPress={handleNext} style={{ marginTop: 8 }} />

            <Text className="text-center text-[13px] font-sans text-ef-text-muted mt-5 leading-[21px]">
              이미 계정이 있으신가요?{" "}
              <Text
                className="text-ef-primary font-bold"
                onPress={() => router.push("/(auth)/login")}
              >
                로그인
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
