/**
 * @file app/(onboarding)/nickname.tsx
 * @description 회원가입 4단계 – 닉네임 설정
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@components/AppHeader';
import CtaButton from '@components/CtaButton';
import { COLORS } from '@/constants/colors';

const MAX_LEN = 10;
const BANNED_WORDS = ['관리자', '어드민', 'admin', 'manager', '운영자', '시발', '씨발', '개새끼', '병신'];
const TAKEN_NICKS = ['이프러버', '녹차러버', 'teamaster', '이프왕', 'greentea', '차한잔'];

type ValidationResult =
  | { status: 'idle' }
  | { status: 'ok'; message: string }
  | { status: 'err'; message: string }
  | { status: 'banned'; message: string };

export default function NicknameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({ status: 'idle' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charLen = [...nickname].length;

  const handleNickChange = useCallback((text: string) => {
    setNickname(text);
    const len = [...text].length;
    if (len === 0) { setValidation({ status: 'idle' }); return; }
    if (len > MAX_LEN) { setValidation({ status: 'err', message: '10자 이내로 입력해 주세요' }); return; }
    if (!/^[가-힣a-zA-Z0-9_]+$/.test(text)) {
      setValidation({ status: 'err', message: '한글, 영문, 숫자, _ 만 사용할 수 있어요' });
      return;
    }
    const lowerRaw = text.toLowerCase();
    const hasBanned = BANNED_WORDS.some((w) => lowerRaw.includes(w.toLowerCase()));
    if (hasBanned) { setValidation({ status: 'banned', message: '사용할 수 없는 단어가 포함되어 있어요' }); return; }

    setValidation({ status: 'idle' });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const taken = TAKEN_NICKS.some((n) => n.toLowerCase() === text.toLowerCase());
      if (taken) setValidation({ status: 'err', message: '이미 사용 중인 닉네임입니다' });
      else setValidation({ status: 'ok', message: '사용 가능한 닉네임이에요' });
    }, 500);
  }, []);

  const isValid = validation.status === 'ok';
  const firstChar = nickname.length > 0 ? [...nickname][0].toUpperCase() : '?';

  const counterColor = useMemo(() => {
    if (charLen === 0) return 'transparent';
    if (charLen > MAX_LEN) return COLORS.danger;
    if (charLen >= MAX_LEN * 0.7) return COLORS.primary;
    return COLORS.textMuted;
  }, [charLen]);

  const handleNext = useCallback(() => {
    if (!isValid) return;
    router.push('/(onboarding)/region');
  }, [isValid, nickname, router]);

  const isErr = validation.status === 'err' || validation.status === 'banned';

  return (
    <SafeAreaView className="flex-1 bg-ef-bg">
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
          <View className="px-6 pt-8 pb-10">
            <Text className="text-[11px] tracking-[1.4px] text-ef-primary font-bold mb-[10px] uppercase">
              프로필 설정
            </Text>
            <Text
              className="text-[26px] text-ef-text font-sans mb-2"
              style={{ letterSpacing: -0.5, lineHeight: 34 }}
            >
              닉네임을{'\n'}만들어보세요!
            </Text>
            <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-9">
              프로필에 표시되는 이름으로,{'\n'}언제든 변경 가능해요.
            </Text>

            <View className="mb-[10px]">
              <Text className="text-[11px] text-ef-text-muted font-bold tracking-[0.6px] mb-2 uppercase">
                닉네임
              </Text>
              <View className="relative flex-row items-center">
                <TextInput
                  className={`flex-1 bg-ef-surface rounded-[14px] py-[15px] pl-4 font-sans text-[14px] text-ef-text border-[1.5px] ${
                    isErr ? 'border-ef-border-invalid' : 'border-transparent'
                  }`}
                  style={{ paddingRight: 82 }}
                  placeholder="닉네임을 입력하세요"
                  placeholderTextColor={COLORS.textMuted}
                  value={nickname}
                  onChangeText={handleNickChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={12}
                />
                {charLen > 0 && (
                  <Text
                    className="absolute right-[44px] text-[11px] font-bold"
                    style={{ color: counterColor }}
                  >
                    {charLen}/{MAX_LEN}
                  </Text>
                )}
                {validation.status === 'ok' && (
                  <View className="absolute right-[10px] w-7 h-7 rounded-[14px] bg-ef-primary-tint items-center justify-center">
                    <Text className="text-[12px] font-extrabold text-ef-primary">✓</Text>
                  </View>
                )}
                {isErr && (
                  <View className="absolute right-[10px] w-7 h-7 rounded-[14px] bg-ef-danger-bg items-center justify-center">
                    <Text className="text-[12px] font-extrabold text-ef-danger">✕</Text>
                  </View>
                )}
              </View>

              {(validation.status === 'ok' || validation.status === 'err') && (
                <Text
                  className={`text-[11.5px] font-sans mt-[7px] pl-[2px] leading-[17px] ${
                    validation.status === 'ok' ? 'text-ef-primary' : 'text-ef-danger'
                  }`}
                >
                  {validation.message}
                </Text>
              )}

              {validation.status === 'banned' && (
                <View className="bg-ef-danger-bg rounded-[12px] py-3 px-4 mt-[10px] flex-row items-start gap-2">
                  <Text className="text-[14px] text-ef-danger" style={{ marginTop: 1 }}>⚠</Text>
                  <Text className="flex-1 text-[12px] text-ef-danger font-bold leading-[18px]">
                    {validation.message}
                  </Text>
                </View>
              )}
            </View>

            {isValid && (
              <View className="bg-ef-surface rounded-[16px] py-[18px] px-5 mt-7 flex-row items-center gap-[14px]">
                <View className="w-11 h-11 rounded-[22px] bg-ef-primary-tint items-center justify-center">
                  <Text
                    className="text-[18px] text-ef-primary font-extrabold"
                    style={{ letterSpacing: -0.5 }}
                  >
                    {firstChar}
                  </Text>
                </View>
                <View>
                  <Text className="text-[10.5px] text-ef-text-muted font-bold tracking-[0.5px] mb-[3px] uppercase">
                    미리보기
                  </Text>
                  <Text className="text-[15px] text-ef-text font-bold" style={{ letterSpacing: -0.2 }}>
                    {nickname}
                  </Text>
                </View>
              </View>
            )}

            <CtaButton label="다음으로" active={isValid} onPress={handleNext} style={{ marginTop: 32 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
