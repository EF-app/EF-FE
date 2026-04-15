/**
 * @file app/(tabs)/home/bal-game/write.tsx
 * @description 밸런스 게임 만들기 — 2단계 폼 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const MAX_OPTION = 60;

const CATEGORIES = [
  { icon: '☕', label: '일상' },
  { icon: '🍜', label: '음식' },
  { icon: '💘', label: '연애' },
  { icon: '💼', label: '직장' },
  { icon: '🎮', label: '취미' },
  { icon: '✈️', label: '여행' },
  { icon: '🐱', label: '동물' },
  { icon: '💪', label: '건강' },
  { icon: '✨', label: '기타' },
] as const;

const SCOPE_OPTIONS = [
  { icon: '📍', label: '내 동네', value: '동네' as const },
  { icon: '🏙️', label: '서울 전체', value: '서울' as const },
  { icon: '🗺️', label: '전국', value: '전국' as const },
];

export default function BalGameWriteScreen() {
  const router = useRouter();
  const [step, setStep]         = useState<1 | 2>(1);
  const [optionA, setOptionA]   = useState('');
  const [optionB, setOptionB]   = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [scope, setScope]       = useState<'동네' | '서울' | '전국'>('동네');
  const [submitted, setSubmitted] = useState(false);

  const canNext = optionA.trim().length >= 2 && optionB.trim().length >= 2;
  const canSubmit = category !== null;

  const handleSubmit = () => {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    // TODO: API call
    setTimeout(() => router.back(), 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 헤더 ── */}
      <View className="flex-row items-center justify-between px-[20px] py-[12px] border-b border-ef-divider">
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-full items-center justify-center bg-ef-surface-2"
          onPress={() => (step === 2 ? setStep(1) : router.back())}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="text-[15px] font-extrabold text-ef-text" style={{ letterSpacing: -0.3 }}>
          밸런스 게임 만들기
        </Text>
        <Text className="text-[12px] font-bold text-ef-text-muted">
          Step {step}/2
        </Text>
      </View>

      {/* ── 스텝 프로그레스 ── */}
      <View className="flex-row h-[3px] bg-ef-divider mx-0">
        <View
          className="h-full"
          style={{
            flex: step === 1 ? 0.5 : 1,
            backgroundColor: COLORS.primary,
          }}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        {step === 1 ? (
          /* ════ STEP 1 ════ */
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Eyebrow */}
            <Text
              className="text-[11px] font-bold mb-[4px]"
              style={{ color: COLORS.primary, letterSpacing: 1 }}
            >
              STEP 1
            </Text>
            <Text className="text-[20px] font-extrabold text-ef-text mb-[4px]" style={{ letterSpacing: -0.5 }}>
              선택지를 입력해요
            </Text>
            <Text className="text-[12.5px] font-sans text-ef-text-muted mb-[20px]" style={{ lineHeight: 20 }}>
              A와 B 중 뭐가 더 나을까요? 재미있는 상황을 만들어 보세요!
            </Text>

            {/* Option A */}
            <View
              className="bg-ef-surface rounded-[16px] p-[16px] mb-[4px]"
              style={{
                borderWidth: 1.5,
                borderColor: optionA.length > 0 ? COLORS.primary : COLORS.borderDefault,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between mb-[8px]">
                <View
                  className="rounded-[8px] px-[10px] py-[4px]"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Text className="text-[12px] font-extrabold text-white">A</Text>
                </View>
                <Text className="text-[11px] font-bold text-ef-text-muted">
                  {optionA.length}/{MAX_OPTION}
                </Text>
              </View>
              <TextInput
                className="text-[14px] font-sans text-ef-text"
                style={{ lineHeight: 22, minHeight: 72 }}
                placeholder="예) 평생 라면만 먹기"
                placeholderTextColor={COLORS.textMuted}
                value={optionA}
                onChangeText={setOptionA}
                maxLength={MAX_OPTION}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* VS Divider */}
            <View className="items-center justify-center py-[12px]">
              <View
                className="w-[40px] h-[40px] rounded-full items-center justify-center"
                style={{
                  backgroundColor: COLORS.primaryLight,
                  borderWidth: 2,
                  borderColor: COLORS.primaryBorder,
                }}
              >
                <Text className="text-[13px] font-extrabold" style={{ color: COLORS.primaryMid }}>VS</Text>
              </View>
            </View>

            {/* Option B */}
            <View
              className="bg-ef-surface rounded-[16px] p-[16px] mb-[20px]"
              style={{
                borderWidth: 1.5,
                borderColor: optionB.length > 0 ? COLORS.amber : COLORS.borderDefault,
                shadowColor: COLORS.amber,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between mb-[8px]">
                <View
                  className="rounded-[8px] px-[10px] py-[4px]"
                  style={{ backgroundColor: COLORS.amber }}
                >
                  <Text className="text-[12px] font-extrabold text-white">B</Text>
                </View>
                <Text className="text-[11px] font-bold text-ef-text-muted">
                  {optionB.length}/{MAX_OPTION}
                </Text>
              </View>
              <TextInput
                className="text-[14px] font-sans text-ef-text"
                style={{ lineHeight: 22, minHeight: 72 }}
                placeholder="예) 평생 김밥만 먹기"
                placeholderTextColor={COLORS.textMuted}
                value={optionB}
                onChangeText={setOptionB}
                maxLength={MAX_OPTION}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Live preview */}
            {(optionA.trim().length > 0 || optionB.trim().length > 0) && (
              <View
                className="rounded-[18px] overflow-hidden mb-[20px]"
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.primaryBorder,
                }}
              >
                <View
                  className="px-[14px] py-[10px]"
                  style={{ backgroundColor: COLORS.primaryTint }}
                >
                  <Text className="text-[10px] font-bold text-ef-text-muted" style={{ letterSpacing: 1 }}>
                    미리보기
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View
                    className="flex-1 items-center justify-center py-[18px] px-[12px]"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <Text className="text-[11px] font-extrabold mb-[6px]" style={{ color: COLORS.primary }}>A</Text>
                    <Text
                      className="text-[13px] font-bold text-ef-text text-center"
                      style={{ lineHeight: 20 }}
                      numberOfLines={3}
                    >
                      {optionA.trim() || '선택지 A'}
                    </Text>
                  </View>
                  <View
                    className="w-[36px] h-[36px] rounded-full items-center justify-center z-10"
                    style={{
                      backgroundColor: COLORS.bg,
                      borderWidth: 2,
                      borderColor: COLORS.primaryBorder,
                      marginHorizontal: -18,
                    }}
                  >
                    <Text className="text-[10px] font-extrabold" style={{ color: COLORS.primaryMid }}>VS</Text>
                  </View>
                  <View
                    className="flex-1 items-center justify-center py-[18px] px-[12px]"
                    style={{ backgroundColor: '#FFF5EE' }}
                  >
                    <Text className="text-[11px] font-extrabold mb-[6px]" style={{ color: COLORS.amber }}>B</Text>
                    <Text
                      className="text-[13px] font-bold text-ef-text text-center"
                      style={{ lineHeight: 20 }}
                      numberOfLines={3}
                    >
                      {optionB.trim() || '선택지 B'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Next step button */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center gap-[6px] rounded-[16px] py-[15px]"
              style={{
                backgroundColor: canNext ? COLORS.primary : COLORS.surface2,
                shadowColor: canNext ? COLORS.primary : 'transparent',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: canNext ? 0.35 : 0,
                shadowRadius: 20,
                elevation: canNext ? 6 : 0,
              }}
              onPress={() => canNext && setStep(2)}
              activeOpacity={0.85}
              disabled={!canNext}
            >
              <Text
                className="text-[15px] font-extrabold"
                style={{ color: canNext ? '#fff' : COLORS.textMuted }}
              >
                다음 단계
              </Text>
              <Ionicons name="chevron-forward" size={14} color={canNext ? '#fff' : COLORS.textMuted} />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          /* ════ STEP 2 ════ */
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          >
            <Text
              className="text-[11px] font-bold mb-[4px]"
              style={{ color: COLORS.primary, letterSpacing: 1 }}
            >
              STEP 2
            </Text>
            <Text className="text-[20px] font-extrabold text-ef-text mb-[4px]" style={{ letterSpacing: -0.5 }}>
              카테고리를 선택해요
            </Text>
            <Text className="text-[12.5px] font-sans text-ef-text-muted mb-[20px]" style={{ lineHeight: 20 }}>
              어떤 주제의 게임인가요? 잘 맞는 카테고리를 선택해 주세요.
            </Text>

            {/* Category grid 3x3 */}
            <View className="mb-[20px]">
              {[0, 1, 2].map(row => (
                <View key={row} className="flex-row gap-[8px] mb-[8px]">
                  {CATEGORIES.slice(row * 3, row * 3 + 3).map(cat => (
                    <TouchableOpacity
                      key={cat.label}
                      className="flex-1 items-center gap-[6px] rounded-[16px] py-[14px]"
                      style={{
                        backgroundColor: category === cat.label ? COLORS.primaryTint : COLORS.surface,
                        borderWidth: 1.5,
                        borderColor: category === cat.label ? COLORS.primary : COLORS.borderDefault,
                        shadowColor: COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        elevation: 1,
                      }}
                      onPress={() => setCategory(cat.label)}
                      activeOpacity={0.75}
                    >
                      <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                      <Text
                        className="text-[12px] font-bold"
                        style={{ color: category === cat.label ? COLORS.primary : COLORS.textPrimary }}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* Scope */}
            <Text
              className="text-[11px] font-bold mb-[10px]"
              style={{ color: COLORS.textMuted, letterSpacing: 1 }}
            >
              공개 범위
            </Text>
            <View className="flex-row gap-[8px] mb-[20px]">
              {SCOPE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  className="flex-1 flex-row items-center gap-[6px] justify-center rounded-[14px] py-[12px]"
                  style={{
                    backgroundColor: scope === opt.value ? COLORS.primaryTint : COLORS.surface,
                    borderWidth: 1.5,
                    borderColor: scope === opt.value ? COLORS.primary : COLORS.borderDefault,
                  }}
                  onPress={() => setScope(opt.value)}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 16 }}>{opt.icon}</Text>
                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: scope === opt.value ? COLORS.primary : COLORS.textPrimary }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notice card */}
            <View
              className="flex-row items-start gap-[8px] rounded-[12px] px-[13px] py-[10px] mb-[20px]"
              style={{
                backgroundColor: COLORS.primaryTint,
                borderWidth: 1,
                borderColor: COLORS.primaryBorder,
              }}
            >
              <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} style={{ marginTop: 1 }} />
              <Text className="flex-1 text-[11px] font-sans text-ef-text-sub" style={{ lineHeight: 18 }}>
                작성된 게임은 <Text className="font-extrabold" style={{ color: COLORS.primary }}>선택한 지역</Text>의 사람들에게 공개돼요.{'\n'}
                욕설·혐오 표현이 포함된 게임은 제재될 수 있어요.
              </Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center gap-[8px] rounded-[16px] py-[15px]"
              style={{
                backgroundColor: submitted
                  ? COLORS.green
                  : canSubmit ? COLORS.primary : COLORS.surface2,
                shadowColor: canSubmit ? COLORS.primary : 'transparent',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: canSubmit ? 0.35 : 0,
                shadowRadius: 20,
                elevation: canSubmit ? 6 : 0,
              }}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={!canSubmit || submitted}
            >
              <Ionicons
                name={submitted ? 'checkmark-circle-outline' : 'game-controller-outline'}
                size={16}
                color={canSubmit || submitted ? '#fff' : COLORS.textMuted}
              />
              <Text
                className="text-[15px] font-extrabold"
                style={{ color: canSubmit || submitted ? '#fff' : COLORS.textMuted }}
              >
                {submitted ? '게임 등록 완료!' : '게임 등록하기'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
