/**
 * @file app/(onboarding)/terms-agreement.tsx
 * @description 회원가입 1단계 – 약관 동의 화면
 */

import { COLORS } from "@/constants/colors";
import {
  EF_SERVICE_TERMS,
  LOCATION_TERMS,
  MARKETING_TERMS,
  PRIVACY_PROTECTION_TERMS,
  PRIVACY_TERMS,
  SENSITIVE_INFO_TERMS,
} from "@/features/onboarding/components/termsContent";
import TermItem, { TermData } from "@/features/onboarding/components/TermItem";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const REQUIRED_TERMS: TermData[] = [
  {
    id: 1,
    badge: "required",
    title: "EF 서비스 이용약관",
    buttonText: "동의합니다",
    content: EF_SERVICE_TERMS,
  },
  {
    id: 2,
    badge: "required",
    title: "생물학적 여성 확인 동의",
    buttonText: "확인·동의합니다",
    content: `본인은 생물학적 여성임을 확인하며, 남성으로 판명될 경우 민·형사상 책임을 질 것에 동의합니다.\n\n본 서비스는 여성 전용 매칭 플랫폼으로, 생물학적 및 법적 여성에 한하여 가입 및 이용이 가능합니다.\n\n• 성별 도용이 적발될 경우 즉시 계정 영구 정지\n• 서비스 이용 방해 및 플랫폼 신뢰도 훼손에 대한 위약벌 청구 가능\n• 관련 법령에 따른 민·형사상 법적 조치 가능`,
  },
  {
    id: 3,
    badge: "required",
    title: "개인정보 수집 및 이용 동의",
    buttonText: "동의합니다",
    content: PRIVACY_TERMS,
  },
  {
    id: 4,
    badge: "required",
    title: "민감정보 수집 및 이용 동의",
    buttonText: "동의합니다",
    content: SENSITIVE_INFO_TERMS,
  },
  {
    id: 5,
    badge: "required",
    title: "개인정보 유출 금지 동의",
    buttonText: "확인·동의합니다",
    content: PRIVACY_PROTECTION_TERMS,
  },
];

const OPTIONAL_TERMS: TermData[] = [
  {
    id: 6,
    badge: "optional",
    title: "위치기반 서비스 이용약관",
    buttonText: "동의합니다",
    content: LOCATION_TERMS,
  },
  {
    id: 7,
    badge: "optional",
    title: "마케팅 정보 수신 동의",
    buttonText: "동의합니다",
    content: MARKETING_TERMS,
  },
];

const ALL_TERMS = [...REQUIRED_TERMS, ...OPTIONAL_TERMS];
const REQUIRED_IDS = REQUIRED_TERMS.map((t) => t.id);

export default function TermsAgreementScreen() {
  const router = useRouter();

  const [checkedTerms, setCheckedTerms] = useState<Record<number, boolean>>(
    () => {
      const init: Record<number, boolean> = {};
      ALL_TERMS.forEach((t) => {
        init[t.id] = false;
      });
      return init;
    },
  );
  const [openTermId, setOpenTermId] = useState<number | null>(null);
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const requiredDone = REQUIRED_IDS.filter((id) => checkedTerms[id]).length;
  const allChecked = ALL_TERMS.every((t) => checkedTerms[t.id]);
  const canProceed = REQUIRED_IDS.every((id) => checkedTerms[id]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (requiredDone / REQUIRED_IDS.length) * 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [requiredDone, progressAnim]);

  const toggleTerm = useCallback((id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenTermId((prev) => (prev === id ? null : id));
  }, []);

  const checkTerm = useCallback((id: number, val?: boolean) => {
    setCheckedTerms((prev) => ({
      ...prev,
      [id]: val !== undefined ? val : !prev[id],
    }));
    if (val === true) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpenTermId(null);
    }
  }, []);

  const toggleAll = useCallback(() => {
    const newVal = !allChecked;
    setCheckedTerms(() => {
      const newState: Record<number, boolean> = {};
      ALL_TERMS.forEach((t) => {
        newState[t.id] = newVal;
      });
      return newState;
    });
  }, [allChecked]);

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    router.push("/(onboarding)/phone-verification");
  }, [canProceed, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={outerScrollEnabled}
      >
        {/* 페이지 헤더 */}
        <View className="flex-row justify-between items-center px-[22px] pt-2">
          <TouchableOpacity
            className="w-9 h-9 rounded-[18px] bg-ef-primary-tint border border-ef-primary-border items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text
              className="text-[22px] text-ef-primary font-bold"
              style={{ marginTop: -2 }}
            >
              ‹
            </Text>
          </TouchableOpacity>
          <Text
            className="text-[16px] text-ef-text font-extrabold"
            style={{ letterSpacing: -0.3 }}
          >
            이<Text className="text-ef-primary">프</Text>
          </Text>
          <View className="bg-ef-primary-tint border border-ef-primary-border px-[10px] py-1 rounded-[20px]">
            <Text className="text-[10px] text-ef-primary font-extrabold">
              1 / 3 단계
            </Text>
          </View>
        </View>

        {/* 타이틀 */}
        <View className="px-[22px] pt-5 pb-4">
          <View className="self-start bg-ef-primary-tint border border-ef-primary-border px-3 py-1 rounded-[20px] mb-3">
            <Text
              className="text-[10px] text-ef-primary-mid font-extrabold"
              style={{ letterSpacing: 0.6 }}
            >
              💜 약관 동의
            </Text>
          </View>
          <Text
            className="text-[22px] text-ef-text font-extrabold mb-[6px]"
            style={{ letterSpacing: -0.9, lineHeight: 29 }}
          >
            안전한 공간을 위한{"\n"}
            <Text className="text-ef-primary">소중한 약속</Text>이에요
          </Text>
          <Text className="text-[12px] text-ef-text-sub font-sans leading-5">
            아래 약관을 확인하고 동의해 주세요.{"\n"}
            필수 항목에 동의하셔야 서비스를 이용할 수 있어요.
          </Text>
        </View>

        {/* 모두 동의 */}
        <View className="px-5 pb-3">
          <TouchableOpacity
            className={`rounded-[16px] py-4 px-[18px] flex-row items-center gap-[14px] ${
              allChecked ? "bg-ef-primary-deep" : "bg-ef-primary"
            }`}
            style={Platform.select({
              ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              },
              android: { elevation: 8 },
            })}
            onPress={toggleAll}
            activeOpacity={0.85}
          >
            <View
              className="w-[26px] h-[26px] rounded-[13px] border-2 items-center justify-center"
              style={{
                backgroundColor: allChecked
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.22)",
                borderColor: allChecked
                  ? "transparent"
                  : "rgba(255,255,255,0.4)",
              }}
            >
              {allChecked && (
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.primary,
                    fontFamily: "NanumSquareNeo-dEb",
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
            <View className="flex-1">
              <Text
                className="text-[14px] text-white font-extrabold mb-[2px]"
                style={{ letterSpacing: -0.3 }}
              >
                모두 동의하기 ✨
              </Text>
              <Text
                className="text-[11px] font-sans"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                필수 및 선택 약관을 모두 동의해요
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 필수 약관 */}
        <View className="px-5 pb-4">
          <View className="flex-row items-center gap-[6px] mb-[10px]">
            <Text
              className="text-[11px] text-ef-primary font-extrabold"
              style={{ letterSpacing: 0.6 }}
            >
              필수 동의
            </Text>
            <View className="flex-1 h-px bg-ef-primary-border" />
          </View>
          {REQUIRED_TERMS.map((term) => (
            <TermItem
              key={term.id}
              term={term}
              isChecked={checkedTerms[term.id]}
              isOpen={openTermId === term.id}
              onToggleOpen={() => toggleTerm(term.id)}
              onCheck={(val) => checkTerm(term.id, val)}
              onInnerScrollStart={() => setOuterScrollEnabled(false)}
              onInnerScrollEnd={() => setOuterScrollEnabled(true)}
            />
          ))}
        </View>

        {/* 선택 약관 */}
        <View className="px-5 pb-4">
          <View className="flex-row items-center gap-[6px] mb-[10px]">
            <Text
              className="text-[11px] text-ef-primary font-extrabold"
              style={{ letterSpacing: 0.6 }}
            >
              선택 동의
            </Text>
            <View className="flex-1 h-px bg-ef-primary-border" />
          </View>
          {OPTIONAL_TERMS.map((term) => (
            <TermItem
              key={term.id}
              term={term}
              isChecked={checkedTerms[term.id]}
              isOpen={openTermId === term.id}
              onToggleOpen={() => toggleTerm(term.id)}
              onCheck={(val) => checkTerm(term.id, val)}
              onInnerScrollStart={() => setOuterScrollEnabled(false)}
              onInnerScrollEnd={() => setOuterScrollEnabled(true)}
            />
          ))}
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>

      {/* 하단 CTA */}
      <View
        className="px-5 bg-ef-bg border-t border-ef-divider"
        style={{
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 34 : 24,
        }}
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[11px] text-ef-text-muted font-sans">
            필수 항목{" "}
            <Text className="text-ef-primary font-extrabold">
              {requiredDone}
            </Text>{" "}
            / 5 완료
          </Text>
          <Text className="text-[10px] text-ef-text-muted font-sans">
            다음: 프로필 설정
          </Text>
        </View>

        <View className="h-1 bg-ef-divider rounded-[4px] mb-4 overflow-hidden">
          <Animated.View
            className="h-full bg-ef-primary rounded-[4px]"
            style={{ width: progressWidth }}
          />
        </View>

        <TouchableOpacity
          className={`w-full py-[15px] rounded-[16px] flex-row items-center justify-center gap-2 ${
            canProceed ? "bg-ef-primary" : "bg-ef-text-muted"
          }`}
          style={
            canProceed
              ? Platform.select({
                  ios: {
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 24,
                  },
                  android: { elevation: 8 },
                })
              : Platform.select({
                  ios: { shadowOpacity: 0 },
                  android: { elevation: 0 },
                })
          }
          disabled={!canProceed}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text className="text-[20px] text-white font-bold">›</Text>
          <Text
            className="text-[15px] text-white font-extrabold"
            style={{ letterSpacing: -0.3 }}
          >
            다음 단계로
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
