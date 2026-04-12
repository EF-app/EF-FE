/**
 * @file app/(auth)/login.tsx
 * @description 로그인 화면
 */

import { COLORS } from "@/constants/colors";
import AppHeader from "@components/AppHeader";
import CtaButton from "@components/CtaButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MAX_FAIL = 5;

export default function LoginScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasInput = userId.trim().length > 0 && password.length > 0;
  const canLogin = hasInput && !isLocked && !isLoading;

  const handleIdChange = useCallback(
    (text: string) => {
      setUserId(text);
      if (showError) {
        setShowError(false);
        setInputInvalid(false);
      }
    },
    [showError],
  );

  const handlePwChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (showError) {
        setShowError(false);
        setInputInvalid(false);
      }
    },
    [showError],
  );

  const doLogin = useCallback(async () => {
    if (!canLogin) return;
    setIsLoading(true);
    try {
      const isValid = false;
      if (isValid) {
        // router.replace('/(tabs)/home');
      } else {
        const newCount = failCount + 1;
        setFailCount(newCount);
        setPassword("");
        setInputInvalid(true);
        if (newCount >= MAX_FAIL) {
          setIsLocked(true);
          setShowError(false);
        } else {
          setShowError(true);
        }
      }
    } catch {
      setShowError(true);
      setInputInvalid(true);
    } finally {
      setIsLoading(false);
    }
  }, [canLogin, userId, password, failCount]);

  return (
    <View className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <AppHeader />

          <View className="px-6 pt-16 pb-12">
            <Text className="text-[11px] tracking-[1.4px] text-ef-primary font-bold mb-[12px] uppercase">
              로그인
            </Text>
            <Text
              className="text-[26px] text-ef-text font-sans mb-[8px]"
              style={{ letterSpacing: -0.5, lineHeight: 31 }}
            >
              만나서 반가워요
            </Text>
            <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-10">
              계속하려면 로그인해 주세요
            </Text>

            {isLocked && (
              <View className="bg-ef-danger-bg rounded-[14px] p-4 mb-5">
                <Text className="text-[12.5px] text-ef-danger font-bold leading-5">
                  🔒 로그인 {MAX_FAIL}회 실패로 계정이 잠겼습니다.{"\n"}
                  고객센터 또는 비밀번호 재설정을 이용해 주세요.
                </Text>
              </View>
            )}

            {/* 아이디 */}
            <View className="mb-5">
              <Text className="text-[11px] text-ef-text-muted font-bold tracking-[0.6px] mb-2 uppercase">
                아이디
              </Text>
              <TextInput
                className={`bg-ef-surface rounded-[14px] py-[15px] px-4 font-sans text-[14px] text-ef-text border-[1.5px] ${
                  inputInvalid
                    ? "border-ef-border-invalid"
                    : "border-transparent"
                }`}
                placeholder="아이디를 입력하세요"
                placeholderTextColor={COLORS.textMuted}
                value={userId}
                onChangeText={handleIdChange}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLocked}
              />
            </View>

            {/* 비밀번호 */}
            <View className="mb-5">
              <Text className="text-[11px] text-ef-text-muted font-bold tracking-[0.6px] mb-2 uppercase">
                비밀번호
              </Text>
              <View className="relative flex-row items-center">
                <TextInput
                  className={`flex-1 bg-ef-surface rounded-[14px] py-[15px] px-4 font-sans text-[14px] text-ef-text border-[1.5px] ${
                    inputInvalid
                      ? "border-ef-border-invalid"
                      : "border-transparent"
                  }`}
                  style={{ paddingRight: 48 }}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={handlePwChange}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  editable={!isLocked}
                />
                <TouchableOpacity
                  className="absolute right-[14px] p-1"
                  onPress={() => setShowPw(!showPw)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPw ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-[11px] text-ef-text-muted font-sans mt-[6px] pl-[2px]">
                영문, 숫자, 특수문자 포함 8자 이상
              </Text>
            </View>

            {showError && (
              <View className="flex-row items-center gap-[6px] bg-ef-danger-bg rounded-[10px] py-[10px] px-[14px] mb-5">
                <Text className="text-[14px]">⚠</Text>
                <Text className="flex-1 text-[12px] text-ef-danger font-bold">
                  로그인 정보가 일치하지 않습니다.
                </Text>
                <Text className="text-[11px] text-ef-danger font-bold opacity-70">
                  {failCount}/{MAX_FAIL}
                </Text>
              </View>
            )}

            <CtaButton
              label="확인"
              active={canLogin}
              loading={isLoading}
              loadingLabel="로그인 중..."
              onPress={doLogin}
              style={{ marginTop: 10 }}
            />

            <View className="flex-row justify-center items-center mt-6 gap-[6px]">
              <TouchableOpacity
                onPress={() => router.push("/(auth)/password-recovery-verify")}
              >
                <Text className="text-[12.5px] text-ef-text-sub font-sans py-[2px] px-1">
                  비밀번호를 잊으셨나요?
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center items-center mt-3 gap-1">
              <Text className="text-[12.5px] text-ef-text-muted font-sans">
                아직 회원이 아니세요?
              </Text>
              <View className="w-px h-[11px] bg-ef-divider" />
              <TouchableOpacity
                onPress={() => router.push("/(onboarding)/terms-agreement")}
              >
                <Text className="text-[12.5px] text-ef-primary font-bold py-[2px] px-1">
                  회원가입
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-10">
              <TouchableOpacity
                className="flex-row items-center gap-[5px] rounded-[14px] py-[10px] px-5 border-[1.5px] border-[#E8E5E1]"
                onPress={() => Linking.openURL("mailto:support@ef-app.com")}
              >
                <Text className="text-[10.5px] text-[#B0ABB5] font-sans">
                  ✉ 고객센터 메일 문의
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
