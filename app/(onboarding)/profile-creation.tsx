/**
 * @file app/(onboarding)/profile-creation.tsx
 * @description 회원가입 6단계 – 프로필 생성 (멀티스텝 ver2)
 *
 * 총 8개 스텝:
 *   welcome   → 안내 카드 (4단계 소개)
 *   interest  → 관심 대상 선택 (지인/모두/애인)
 *   keywords  → 관심사 키워드 + 나만의 태그 (STEP 1/5)
 *   habits    → 음주·흡연·타투 생활습관 (STEP 2/5)
 *   style     → 내 외모 스타일 + MBTI 스크롤 드럼 (STEP 3/5)
 *   idealType → 이상형 스타일 + 중요 포인트 (STEP 4/5)
 *   photos    → 프로필 사진 + 자기소개 (STEP 5/5)
 *   complete  → 완료 화면 (프로필 카드 + 완성도 바)
 */

import { COLORS } from "@/constants/colors";
import CheckItem from "@onboarding/components/CheckItem";
import HChip from "@onboarding/components/HChip";
import MBTIDrum from "@onboarding/components/MBTIDrum";
import Pill, { pillsWrapStyle } from "@onboarding/components/Pill";
import SelectItem from "@onboarding/components/SelectItem";
import SLabel from "@onboarding/components/SLabel";
import ToggleSection from "@onboarding/components/ToggleSection";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Android LayoutAnimation 활성화
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SW } = Dimensions.get("window");

// ─── 스텝 타입 ────────────────────────────────────────────────────────────────
type StepKey =
  | "welcome"
  | "interest"
  | "keywords"
  | "habits"
  | "style"
  | "idealType"
  | "photos"
  | "complete";
const STEP_ORDER: StepKey[] = [
  "welcome",
  "interest",
  "keywords",
  "habits",
  "style",
  "idealType",
  "photos",
  "complete",
];

// ─── 관심사 키워드 데이터 ─────────────────────────────────────────────────────
const INTEREST_DATA = {
  lifestyle: [
    "아침형 인간",
    "저녁형 인간",
    "집순이/집돌이",
    "활동적",
    "반려동물",
    "미니멀라이프",
    "혼밥/혼영",
    "워라밸",
    "친환경",
  ],
  hobby: [
    "유튜브",
    "영화",
    "드라마",
    "연예인",
    "애니메이션",
    "웹툰",
    "웹소설",
    "요리",
    "베이킹",
    "홈카페",
    "드로잉",
    "양재",
    "소잉",
    "필사",
    "캘리그라피",
    "뜨개질",
    "향수",
    "악기연주",
    "밴드",
    "춤",
    "사주/타로",
    "메이크업",
    "네일아트",
    "청소",
    "인테리어",
    "물건수집",
    "주식",
    "비트코인",
    "반려식물",
  ],
  outdoor: [
    "맛집 탐방",
    "카페 투어",
    "전시회",
    "연극",
    "뮤지컬",
    "사진 찍기",
    "필름사진",
    "스포츠 직관",
    "페스티벌",
    "방탈출",
    "코인노래방",
    "볼링",
    "당구/포켓볼",
    "쇼핑",
    "피크닉",
    "놀이공원",
    "산책",
    "국내여행",
    "해외여행",
    "드라이브",
    "캠핑",
    "바비큐",
    "등산",
    "낚시",
    "봉사활동",
    "플로깅",
  ],
  selfImprove: [
    "재테크",
    "자격증 취득",
    "외국어 공부",
    "커리어 개발",
    "독서",
    "신문/뉴스",
    "카공",
    "명상",
    "미라클모닝",
    "식단 관리",
    "건강 관리",
    "작문",
    "SNS 키우기",
  ],
  food: [
    "비건",
    "한식",
    "중식",
    "일식",
    "양식",
    "브런치",
    "베트남/태국",
    "멕시코음식",
    "매운음식",
    "채소파",
    "육식파",
    "해산물",
    "분식",
    "패스트푸드",
    "베이커리",
    "간식류",
  ],
  sports: [
    "풋살",
    "러닝",
    "마라톤",
    "자전거",
    "헬스",
    "요가",
    "필라테스",
    "발레",
    "홈트",
    "클라이밍",
    "크로스핏",
    "배드민턴",
    "탁구",
    "골프",
    "테니스",
    "수영",
    "서핑",
    "스쿠버다이빙",
    "스키",
    "스노우보드",
    "스케이트보드",
    "야구",
    "축구",
    "농구",
    "배구",
    "복싱/주짓수",
  ],
  music: [
    "K-POP",
    "J-POP",
    "팝송",
    "인디음악",
    "시티팝",
    "알앤비",
    "EDM",
    "힙합",
    "락",
    "발라드",
    "재즈",
    "클래식",
    "골고루",
  ],
  game: [
    "닌텐도",
    "보드게임",
    "오버워치",
    "배그",
    "LOL",
    "서든어택",
    "메이플",
    "발로란트",
    "플스",
    "스팀 게임",
  ],
};

// ─── 생활습관 데이터 ──────────────────────────────────────────────────────────
const DRINK_OPTIONS = [
  "🚫 아예 안 마심",
  "🌿 가끔 마심",
  "🍺 꽤 마심",
  "🥂 자주 마심",
  "💪 금주 중",
];
const DRINK_TYPES = [
  "🍶 소주",
  "🍺 맥주",
  "🍷 와인",
  "🥃 위스키/하이볼",
  "🍹 칵테일",
  "🍶 전통주",
  "가리지 않아요",
];
const SMOKE_OPTIONS = [
  "🌿 비흡연자",
  "아주 가끔 피움",
  "때때로 피움",
  "🚬 흡연자",
  "💪 금연 중",
];
const SMOKE_TYPES = ["액상 전자담배", "궐련형 전자담배", "연초", "해당없음"];
const TATTOO_OPTIONS = [
  "타투가 많이 있어요 (아주 많아요)",
  "타투가 여러 개 있어요",
  "포인트 타투 하나/소수 있어요",
  "지금은 없지만 관심있어요",
  "없어요",
];

// ─── 스타일 데이터 ────────────────────────────────────────────────────────────
const HAIR_OPTIONS = ["선택 안함", "숏컷", "단발~중단발", "긴머리"];
const BODY_OPTIONS = ["선택 안함", "슬림", "보통", "통통", "통통 이상"];
const HEIGHT_OPTIONS = [
  "선택 안함",
  "150 이하",
  "151~155",
  "156~160",
  "161~165",
  "166~170",
  "171 이상",
];
const VIBE_OPTIONS = [
  "선택 안함",
  "온깁",
  "깁선호",
  "깁텍",
  "텍선호",
  "온텍",
  "플라토닉",
];
const WORK_OPTION = ["학생", "직장인", "취업준비", "사업", "유학"];

// ─── MBTI 데이터 ──────────────────────────────────────────────────────────────
const MBTI_AXES = [
  ["", "E", "I"],
  ["", "N", "S"],
  ["", "F", "T"],
  ["", "P", "J"],
];
const MBTI_NAMES: Record<string, string> = {
  INTJ: "전략가",
  INTP: "논리학자",
  ENTJ: "통솔자",
  ENTP: "변론가",
  INFJ: "옹호자",
  INFP: "중재자",
  ENFJ: "선도자",
  ENFP: "활동가",
  ISTJ: "현실주의자",
  ISFJ: "수호자",
  ESTJ: "경영자",
  ESFJ: "집정관",
  ISTP: "장인",
  ISFP: "모험가",
  ESTP: "사업가",
  ESFP: "연예인",
};
const MBTI_EMOJIS: Record<string, string> = {
  INTJ: "🦅",
  INTP: "🔬",
  ENTJ: "🦁",
  ENTP: "💡",
  INFJ: "🌌",
  INFP: "🌙",
  ENFJ: "🌟",
  ENFP: "🎠",
  ISTJ: "📋",
  ISFJ: "🛡️",
  ESTJ: "📊",
  ESFJ: "🤝",
  ISTP: "🔧",
  ISFP: "🎨",
  ESTP: "⚡",
  ESFP: "🎉",
};

// ─── 이상형 데이터 ────────────────────────────────────────────────────────────
const IDEAL_HAIR = ["중요하지 않아요", "숏컷", "단발~중단발", "긴머리"];
const IDEAL_BODY = ["중요하지 않아요", "슬림", "보통", "통통", "통통 이상"];
const IDEAL_HEIGHT = [
  "중요하지 않아요",
  "150 이하",
  "151~155",
  "156~160",
  "161~165",
  "166~170",
  "171 이상",
];
const IDEAL_VIBE = [
  "중요하지 않아요",
  "온깁",
  "깁선호",
  "깁텍",
  "텍선호",
  "온텍",
  "플라토닉",
];
const IMPORTANT_POINTS = [
  "🌿 라이프스타일",
  "🎨 관심사",
  "🍷 생활습관",
  "👤 스타일",
  "🧬 MBTI 궁합",
  "💬 연락 스타일",
];

// ─── 관심 대상 ────────────────────────────────────────────────────────────────
const INTEREST_CHOICES = [
  { emoji: "👫", label: "지인", sub: "새로운 친구를 만나고 싶어요" },
  { emoji: "💑", label: "모두", sub: "친구도 연인도 OK!" },
  { emoji: "💕", label: "애인", sub: "사랑을 찾고 싶어요" },
];

// ════════════════════════════════════════════════════════
// TopBar: 뒤로가기 + 프로그레스 바 + 단계 배지
// ════════════════════════════════════════════════════════
const TopBar: React.FC<{
  stepLabel: string;
  stepBadge: string;
  progress: number;
  onBack: () => void;
}> = ({ stepLabel, stepBadge, progress, onBack }) => (
  <View className="flex-row items-center gap-3 px-4 pt-2 pb-3">
    <TouchableOpacity
      className="w-[34px] h-[34px] rounded-[10px] bg-ef-surface items-center justify-center"
      style={Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      })}
      onPress={onBack}
      activeOpacity={0.7}
    >
      <Text
        className="text-[18px] font-bold text-ef-text-sub"
        style={{ marginTop: -1 }}
      >
        ‹
      </Text>
    </TouchableOpacity>
    <View className="flex-1">
      <Text className="text-[10px] font-bold text-ef-text-muted mb-[5px] tracking-[0.5px]">
        {stepLabel}
      </Text>
      <View className="h-1 rounded-sm bg-ef-divider overflow-hidden">
        <View
          className="h-full rounded-sm bg-ef-primary"
          style={{ width: `${progress}%` as any }}
        />
      </View>
    </View>
    <Text className="text-[11px] text-ef-primary font-extrabold">
      {stepBadge}
    </Text>
  </View>
);

// ════════════════════════════════════════════════════════
// BottomCTA: 다음/완료 버튼 + 선택적 건너뛰기
// ════════════════════════════════════════════════════════
const BottomCTA: React.FC<{
  label: string;
  disabled?: boolean;
  onPress: () => void;
  skipLabel?: string;
  onSkip?: () => void;
}> = ({ label, disabled, onPress, skipLabel, onSkip }) => (
  <View
    className="px-5 bg-ef-bg border-t border-ef-divider items-center"
    style={{ paddingTop: 12, paddingBottom: Platform.OS === "ios" ? 34 : 24 }}
  >
    <TouchableOpacity
      className={`w-full rounded-[14px] py-4 flex-row items-center justify-center gap-2 ${
        disabled ? "bg-ef-text-muted" : "bg-ef-primary"
      }`}
      style={
        !disabled
          ? Platform.select({
              ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 22,
              },
              android: { elevation: 8 },
            })
          : undefined
      }
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text className="text-[15px] text-white font-bold">{label}</Text>
      <Text className="text-[18px] text-white font-bold">›</Text>
    </TouchableOpacity>
    {skipLabel && onSkip && (
      <TouchableOpacity onPress={onSkip} className="mt-[10px]">
        <Text className="text-[12.5px] font-bold text-ef-text-muted py-1 text-center">
          {skipLabel}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

// ════════════════════════════════════════════════════════
// 메인 컴포넌트
// ════════════════════════════════════════════════════════
export default function ProfileCreationScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState<StepKey>("welcome");

  const goStep = useCallback((step: StepKey) => {
    LayoutAnimation.configureNext({
      duration: 280,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });
    setCurrentStep(step);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  // ─── 관심 대상 ────────────────────────────────────────────────────────────
  const [interestChoice, setInterestChoice] = useState<number | null>(null);

  // ─── 키워드 & 커스텀 태그 ────────────────────────────────────────────────
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set(),
  );
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const toggleKeyword = useCallback((kw: string) => {
    setSelectedKeywords((prev) => {
      const n = new Set(prev);
      n.has(kw) ? n.delete(kw) : n.add(kw);
      return n;
    });
  }, []);

  const addTag = useCallback(() => {
    const val = tagInput.trim();
    if (!val) return;
    setCustomTags((prev) => [...prev, val]);
    setTagInput("");
  }, [tagInput]);

  const removeTag = useCallback((idx: number) => {
    setCustomTags((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const kwCanProceed = selectedKeywords.size > 0 || customTags.length > 0;

  // ─── 생활습관 ─────────────────────────────────────────────────────────────
  const [drinkFreq, setDrinkFreq] = useState<number | null>(null);
  const [drinkTypes, setDrinkTypes] = useState<Set<string>>(new Set());
  const [smokeFreq, setSmokeFreq] = useState<number | null>(null);
  const [smokeTypes, setSmokeTypes] = useState<Set<string>>(new Set());
  const [tattoo, setTattoo] = useState<number | null>(null);

  const showDrinkTypes =
    drinkFreq !== null && drinkFreq !== 0 && drinkFreq !== 4;
  const showSmokeTypes = smokeFreq !== null && smokeFreq !== 0;
  const habitCanProceed = drinkFreq !== null && smokeFreq !== null;

  const toggleDrinkType = useCallback((t: string) => {
    setDrinkTypes((prev) => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });
  }, []);
  const toggleSmokeType = useCallback((t: string) => {
    setSmokeTypes((prev) => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });
  }, []);

  // ─── 스타일 ───────────────────────────────────────────────────────────────
  const [hair, setHair] = useState<number | null>(null);
  const [bodyType, setBodyType] = useState<number | null>(null);
  const [heightRange, setHeight] = useState<number | null>(null);
  const [vibe, setVibe] = useState<number | null>(null);
  const [mbtiSel, setMbtiSel] = useState<number[]>([0, 0, 0, 0]);

  const mbtiType = mbtiSel
    .map((idx, axis) => MBTI_AXES[axis][idx] || "")
    .join("");
  const mbtiAllSet = mbtiSel.every((s) => s > 0);

  const setMbtiAxis = useCallback((axisIdx: number, val: number) => {
    setMbtiSel((prev) => {
      const n = [...prev];
      n[axisIdx] = val;
      return n;
    });
  }, []);

  // ─── 이상형 ───────────────────────────────────────────────────────────────
  const [idealHair, setIdealHair] = useState<Set<string>>(new Set());
  const [idealBody, setIdealBody] = useState<Set<string>>(new Set());
  const [idealHeight, setIdealHeight] = useState<Set<string>>(new Set());
  const [idealVibe, setIdealVibe] = useState<Set<string>>(new Set());
  const [importantPoints, setImportantPt] = useState<Set<string>>(new Set());

  const toggleIdeal = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Set<string>>>,
      val: string,
    ) => {
      setter((prev) => {
        const n = new Set(prev);
        n.has(val) ? n.delete(val) : n.add(val);
        return n;
      });
    },
    [],
  );

  // ─── 사진 & 자기소개 ──────────────────────────────────────────────────────
  const [mainPhotoFilled, setMainPhotoFilled] = useState(false);
  const [extraPhotos, setExtraPhotos] = useState<boolean[]>([false, false]);
  const [bio, setBio] = useState("");

  const photosCanProceed = mainPhotoFilled;

  // ─── 완료 처리 ────────────────────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    router.replace("/(tabs)/home" as any);
  }, [router]);

  const completionPct = Math.min(
    100,
    (interestChoice !== null ? 10 : 0) +
      (selectedKeywords.size > 0 || customTags.length > 0 ? 15 : 0) +
      (drinkFreq !== null ? 10 : 0) +
      (smokeFreq !== null ? 10 : 0) +
      (hair !== null ? 5 : 0) +
      (mbtiAllSet ? 10 : 0) +
      (mainPhotoFilled ? 20 : 0) +
      (bio.length > 0 ? 20 : 0),
  );

  // ════════════════════════════════════════════════════════
  // 스텝별 렌더링
  // ════════════════════════════════════════════════════════
  const renderContent = () => {
    switch (currentStep) {
      // ══════ WELCOME ══════
      case "welcome":
        return (
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 24,
              }}
            >
              {/* 앱 로고 */}
              <View className="flex-row items-center gap-[10px] pt-[18px] pb-7">
                <View
                  className="w-[42px] h-[42px] rounded-[14px] bg-ef-primary items-center justify-center"
                  style={Platform.select({
                    ios: {
                      shadowColor: COLORS.primary,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.35,
                      shadowRadius: 18,
                    },
                    android: { elevation: 8 },
                  })}
                >
                  <Text className="text-white text-[18px] font-extrabold">
                    ✓
                  </Text>
                </View>
                <Text
                  className="text-[22px] font-extrabold text-ef-text"
                  style={{ letterSpacing: -0.04 * 22 }}
                >
                  이<Text className="text-ef-primary">프</Text>
                </Text>
              </View>

              <Text
                className="text-[26px] font-extrabold text-ef-text mb-[14px]"
                style={{ letterSpacing: -0.05 * 26, lineHeight: 32 }}
              >
                나만의 프로필을{"\n"}
                <Text className="text-ef-primary">만들어볼까요?</Text> 🌿
              </Text>
              <Text className="text-[13.5px] font-sans text-ef-text-sub leading-[23px] mb-7">
                몇 가지 질문에 답하면{"\n"}꼭 맞는 사람을 매칭해드려요.{"\n"}
                솔직할수록 좋은 만남이 생겨요!
              </Text>

              {/* 단계 안내 카드 */}
              {[
                {
                  num: "1",
                  title: "관심 키워드 선택",
                  sub: "나를 표현할 키워드 입력",
                },
                {
                  num: "2",
                  title: "음주 · 흡연 · 타투",
                  sub: "나의 생활습관 정보 입력",
                },
                {
                  num: "3",
                  title: "스타일 & 이상형",
                  sub: "나의 모습과 원하는 상대 설정",
                },
                {
                  num: "4",
                  title: "사진 & 자기소개",
                  sub: "첫인상을 결정하는 마지막 단계",
                },
              ].map((card, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-[14px] p-[15px] bg-ef-surface rounded-[16px] mb-[10px]"
                  style={Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                    },
                    android: { elevation: 2 },
                  })}
                >
                  <View className="w-[34px] h-[34px] rounded-[17px] bg-ef-primary-tint border-[1.5px] border-ef-primary-border items-center justify-center shrink-0">
                    <Text className="text-[16px] text-ef-primary font-extrabold">
                      {card.num}
                    </Text>
                  </View>
                  <View>
                    <Text
                      className="text-[13.5px] font-extrabold text-ef-text"
                      style={{ letterSpacing: -0.3 }}
                    >
                      {card.title}
                    </Text>
                    <Text className="text-[11.5px] font-sans text-ef-text-muted mt-[2px]">
                      {card.sub}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <BottomCTA
              label="프로필 만들기 시작"
              onPress={() => goStep("interest")}
            />
          </View>
        );

      // ══════ INTEREST: 관심 대상 ══════
      case "interest":
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              stepLabel="시작하기"
              stepBadge="선택 후 다음"
              progress={8}
              onBack={() => goStep("welcome")}
            />
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="px-[18px] pb-4">
                <Text className="text-[28px] mb-2">💫</Text>
                <Text
                  className="text-[21px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 21, lineHeight: 27 }}
                >
                  어디에 더{"\n"}관심 있나요?
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-5">
                  원하는 만남의 방향을 선택해 주세요.{"\n"}나중에 언제든 바꿀 수
                  있어요.
                </Text>
                <View className="flex-row gap-[10px]">
                  {INTEREST_CHOICES.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      className={`flex-1 p-4 items-center rounded-[18px] border-[1.5px] ${
                        interestChoice === idx
                          ? "bg-ef-primary-tint border-ef-primary"
                          : "bg-ef-surface border-transparent"
                      }`}
                      onPress={() => setInterestChoice(idx)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-[28px] mb-[10px]">
                        {item.emoji}
                      </Text>
                      <Text
                        className={`text-[14px] font-extrabold mb-[5px] ${
                          interestChoice === idx
                            ? "text-ef-primary"
                            : "text-ef-text"
                        }`}
                        style={{ letterSpacing: -0.3 }}
                      >
                        {item.label}
                      </Text>
                      <Text className="text-[11px] font-sans text-ef-text-muted leading-4 text-center">
                        {item.sub}
                      </Text>
                      <View
                        className={`w-5 h-5 rounded-[10px] border-[1.5px] items-center justify-center mt-3 ${
                          interestChoice === idx
                            ? "bg-ef-primary border-ef-primary"
                            : "border-ef-primary-border"
                        }`}
                      >
                        {interestChoice === idx && (
                          <Text className="text-[11px] text-white font-extrabold">
                            ✓
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              disabled={interestChoice === null}
              onPress={() => goStep("keywords")}
            />
          </View>
        );

      // ══════ KEYWORDS: 관심사 (STEP 1/5) ══════
      case "keywords":
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              stepLabel="STEP 1 / 5"
              stepBadge="1/5"
              progress={20}
              onBack={() => goStep("interest")}
            />
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="px-[18px] pb-4">
                <Text className="text-[28px] mb-2">🎨</Text>
                <Text
                  className="text-[21px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 21, lineHeight: 27 }}
                >
                  관심사 키워드를{"\n"}골라주세요
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-5">
                  여러 개 선택 가능해요. 많이 고를수록{"\n"}더 잘 맞는 사람을
                  만날 수 있어요!
                </Text>

                <SLabel label="라이프스타일" />
                <View style={[pillsWrapStyle, { marginBottom: 18 }]}>
                  {INTEREST_DATA.lifestyle.map((kw) => (
                    <Pill
                      key={kw}
                      label={kw}
                      selected={selectedKeywords.has(kw)}
                      onPress={() => toggleKeyword(kw)}
                    />
                  ))}
                </View>

                <SLabel label="취미" />
                <View style={[pillsWrapStyle, { marginBottom: 18 }]}>
                  {INTEREST_DATA.hobby.map((kw) => (
                    <Pill
                      key={kw}
                      label={kw}
                      selected={selectedKeywords.has(kw)}
                      onPress={() => toggleKeyword(kw)}
                    />
                  ))}
                </View>

                <SLabel label="외부 여가활동" />
                <View style={[pillsWrapStyle, { marginBottom: 18 }]}>
                  {INTEREST_DATA.outdoor.map((kw) => (
                    <Pill
                      key={kw}
                      label={kw}
                      selected={selectedKeywords.has(kw)}
                      onPress={() => toggleKeyword(kw)}
                    />
                  ))}
                </View>

                <SLabel label="자기계발" />
                <View style={[pillsWrapStyle, { marginBottom: 18 }]}>
                  {INTEREST_DATA.selfImprove.map((kw) => (
                    <Pill
                      key={kw}
                      label={kw}
                      selected={selectedKeywords.has(kw)}
                      onPress={() => toggleKeyword(kw)}
                    />
                  ))}
                </View>

                <ToggleSection emoji="🍜" label="음식">
                  <View style={pillsWrapStyle}>
                    {INTEREST_DATA.food.map((kw) => (
                      <Pill
                        key={kw}
                        label={kw}
                        selected={selectedKeywords.has(kw)}
                        onPress={() => toggleKeyword(kw)}
                      />
                    ))}
                  </View>
                </ToggleSection>
                <ToggleSection emoji="⚽" label="운동">
                  <View style={pillsWrapStyle}>
                    {INTEREST_DATA.sports.map((kw) => (
                      <Pill
                        key={kw}
                        label={kw}
                        selected={selectedKeywords.has(kw)}
                        onPress={() => toggleKeyword(kw)}
                      />
                    ))}
                  </View>
                </ToggleSection>
                <ToggleSection emoji="🎵" label="음악">
                  <View style={pillsWrapStyle}>
                    {INTEREST_DATA.music.map((kw) => (
                      <Pill
                        key={kw}
                        label={kw}
                        selected={selectedKeywords.has(kw)}
                        onPress={() => toggleKeyword(kw)}
                      />
                    ))}
                  </View>
                </ToggleSection>
                <ToggleSection emoji="🎮" label="게임">
                  <View style={[pillsWrapStyle, { marginBottom: 6 }]}>
                    {INTEREST_DATA.game.map((kw) => (
                      <Pill
                        key={kw}
                        label={kw}
                        selected={selectedKeywords.has(kw)}
                        onPress={() => toggleKeyword(kw)}
                      />
                    ))}
                  </View>
                </ToggleSection>

                {/* 나만의 키워드 추가 */}
                <SLabel label="나만의 키워드 추가" />
                <View className="flex-row gap-2 mb-[10px]">
                  <TextInput
                    className="flex-1 py-[10px] px-[14px] rounded-[12px] border-[1.5px] border-ef-divider bg-ef-surface font-sans text-[13px] text-ef-text"
                    placeholder="직접 입력해보세요"
                    placeholderTextColor={COLORS.textMuted}
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={addTag}
                    returnKeyType="done"
                    maxLength={12}
                  />
                  <TouchableOpacity
                    className="py-[10px] px-4 rounded-[12px] bg-ef-primary"
                    style={Platform.select({
                      ios: {
                        shadowColor: COLORS.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                      },
                      android: { elevation: 4 },
                    })}
                    onPress={addTag}
                    activeOpacity={0.7}
                  >
                    <Text className="text-[13px] text-white font-bold">
                      추가
                    </Text>
                  </TouchableOpacity>
                </View>
                {customTags.length > 0 && (
                  <View style={[pillsWrapStyle, { marginTop: 8 }]}>
                    {customTags.map((tag, i) => (
                      <TouchableOpacity
                        key={i}
                        className="flex-row items-center gap-[5px] py-[6px] pl-[13px] pr-[10px] rounded-[20px] bg-ef-primary"
                        onPress={() => removeTag(i)}
                        activeOpacity={0.7}
                      >
                        <Text className="text-[12px] text-white font-bold">
                          #{tag}
                        </Text>
                        <Text
                          className="w-4 h-4 rounded-[8px] text-center text-[10px] text-white font-bold"
                          style={{
                            lineHeight: 16,
                            backgroundColor: "rgba(255,255,255,0.25)",
                          }}
                        >
                          ✕
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              disabled={!kwCanProceed}
              onPress={() => goStep("habits")}
              skipLabel="건너뛰기 · 필요할 때 언제든 추가할 수 있어요"
              onSkip={() => goStep("habits")}
            />
          </View>
        );

      // ══════ HABITS: 생활습관 (STEP 2/5) ══════
      case "habits":
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              stepLabel="STEP 2 / 5"
              stepBadge="2/5"
              progress={40}
              onBack={() => goStep("keywords")}
            />
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="px-[18px] pb-4">
                <Text className="text-[28px] mb-2">🍷</Text>
                <Text
                  className="text-[21px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 21, lineHeight: 27 }}
                >
                  생활 습관을{"\n"}알려주세요
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-5">
                  솔직하게 답해줄수록 잘 맞는{"\n"}상대를 찾기 쉬워져요!
                </Text>

                <SLabel label="음주 빈도" />
                <View className="mb-[14px]">
                  {DRINK_OPTIONS.map((opt, i) => (
                    <SelectItem
                      key={i}
                      label={opt}
                      selected={drinkFreq === i}
                      onPress={() => setDrinkFreq(i)}
                    />
                  ))}
                </View>

                {showDrinkTypes && (
                  <View className="mb-[18px]">
                    <SLabel label="선호 주종" />
                    <View style={pillsWrapStyle}>
                      {DRINK_TYPES.map((t) => (
                        <Pill
                          key={t}
                          label={t}
                          selected={drinkTypes.has(t)}
                          onPress={() => toggleDrinkType(t)}
                        />
                      ))}
                    </View>
                  </View>
                )}

                <View className="h-px bg-ef-divider my-4" />

                <SLabel label="흡연 여부" />
                <Text className="text-[12px] font-sans text-ef-text-muted leading-[18px] mb-[10px]">
                  흡연 여부는 매칭에서 중요한 정보예요. 솔직하게 알려주세요.
                </Text>
                <View className="mb-[14px]">
                  {SMOKE_OPTIONS.map((opt, i) => (
                    <SelectItem
                      key={i}
                      label={opt}
                      selected={smokeFreq === i}
                      onPress={() => setSmokeFreq(i)}
                    />
                  ))}
                </View>

                {showSmokeTypes && (
                  <View className="mb-[18px]">
                    <SLabel label="종류" />
                    <View style={pillsWrapStyle}>
                      {SMOKE_TYPES.map((t) => (
                        <Pill
                          key={t}
                          label={t}
                          selected={smokeTypes.has(t)}
                          onPress={() => toggleSmokeType(t)}
                        />
                      ))}
                    </View>
                  </View>
                )}

                <View className="h-px bg-ef-divider my-4" />

                <ToggleSection emoji="🖊️" label="타투 유무">
                  <Text className="text-[12px] font-sans text-ef-text-muted leading-[18px] mb-[10px]">
                    취향을 더 잘 맞추기 위한 정보예요 💛
                  </Text>
                  {TATTOO_OPTIONS.map((opt, i) => (
                    <SelectItem
                      key={i}
                      label={opt}
                      selected={tattoo === i}
                      onPress={() => setTattoo(i)}
                    />
                  ))}
                </ToggleSection>
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              disabled={!habitCanProceed}
              onPress={() => goStep("style")}
            />
          </View>
        );

      // ══════ STYLE: 내 스타일 + MBTI (STEP 3/5) ══════
      case "style":
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              stepLabel="STEP 3 / 5"
              stepBadge="3/5"
              progress={60}
              onBack={() => goStep("habits")}
            />
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {/* 스타일 정보 영역: 머리·체형·키·성향 */}
              <View className="px-[18px] pb-4">
                <Text className="text-[28px] mb-2">👤</Text>
                <Text
                  className="text-[21px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 21, lineHeight: 27 }}
                >
                  내 스타일 정보를{"\n"}추가해볼까요?
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-5">
                  선택 안 해도 되는 항목이에요.{"\n"}자유롭게 업데이트할 수
                  있어요.
                </Text>

                <SLabel label="머리 길이" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 18 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {HAIR_OPTIONS.map((opt, i) => (
                      <HChip
                        key={i}
                        label={opt}
                        selected={hair === i}
                        onPress={() => setHair(i)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="체형" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 18 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {BODY_OPTIONS.map((opt, i) => (
                      <HChip
                        key={i}
                        label={opt}
                        selected={bodyType === i}
                        onPress={() => setBodyType(i)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="키" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 18 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {HEIGHT_OPTIONS.map((opt, i) => (
                      <HChip
                        key={i}
                        label={opt}
                        selected={heightRange === i}
                        onPress={() => setHeight(i)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="성향" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 8 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {VIBE_OPTIONS.map((opt, i) => (
                      <HChip
                        key={i}
                        label={opt}
                        selected={vibe === i}
                        onPress={() => setVibe(i)}
                      />
                    ))}
                  </View>
                </ScrollView>
                <SLabel label="직업" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 8 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {WORK_OPTION.map((opt, i) => (
                      <HChip
                        key={i}
                        label={opt}
                        selected={vibe === i}
                        onPress={() => setVibe(i)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* MBTI 드럼 */}
              <View className="px-5 pt-1 pb-2">
                <View className="h-px bg-ef-divider my-4" />
                <SLabel label="MBTI" />
                <Text className="text-[12px] font-sans text-ef-text-muted leading-[18px] mb-[10px]">
                  위아래로 스크롤해서 선택해주세요
                </Text>
                <View className="flex-row gap-2 mb-1">
                  {MBTI_AXES.map((items, axisIdx) => (
                    <MBTIDrum
                      key={axisIdx}
                      items={items}
                      selectedIndex={mbtiSel[axisIdx]}
                      onSelect={(idx) => setMbtiAxis(axisIdx, idx)}
                    />
                  ))}
                </View>
                <View className="mt-[10px] bg-ef-surface rounded-[14px] p-[13px] border-[1.5px] border-ef-divider flex-row items-center justify-between">
                  <View>
                    <Text
                      className={`text-[24px] font-extrabold ${mbtiAllSet ? "text-ef-primary" : "text-ef-text-muted"}`}
                      style={{ letterSpacing: -0.4 }}
                    >
                      {mbtiType || "_ _ _ _"}
                    </Text>
                    <Text className="text-[12px] font-sans text-ef-text-muted mt-[2px]">
                      {mbtiAllSet
                        ? (MBTI_NAMES[mbtiType] ?? "")
                        : "선택해주세요"}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 28 }}>
                    {mbtiAllSet ? (MBTI_EMOJIS[mbtiType] ?? "🤔") : "🤔"}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <BottomCTA
              label="다음"
              disabled={!mbtiAllSet && !mbtiSel.every((s) => s === 0)}
              onPress={() => goStep("idealType")}
              skipLabel="건너뛰기 · 자유롭게 업데이트할 수 있습니다"
              onSkip={() => goStep("idealType")}
            />
          </View>
        );

      // ══════ IDEAL TYPE: 이상형 (STEP 4/5) ══════
      case "idealType":
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              stepLabel="STEP 4 / 5"
              stepBadge="4/5"
              progress={80}
              onBack={() => goStep("style")}
            />
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="px-[18px] pb-4">
                <Text className="text-[28px] mb-2">💜</Text>
                <Text
                  className="text-[21px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 21, lineHeight: 27 }}
                >
                  끌리는 스타일이{"\n"}있다면 선택해볼까요?
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-5">
                  당신의 마음을 움직이는 키워드를 찾아보세요.{"\n"}복수 선택
                  가능해요!
                </Text>

                <SLabel label="머리 길이" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 16 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {IDEAL_HAIR.map((opt) => (
                      <HChip
                        key={opt}
                        label={opt}
                        selected={idealHair.has(opt)}
                        onPress={() => toggleIdeal(setIdealHair, opt)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="체형" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 16 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {IDEAL_BODY.map((opt) => (
                      <HChip
                        key={opt}
                        label={opt}
                        selected={idealBody.has(opt)}
                        onPress={() => toggleIdeal(setIdealBody, opt)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="키" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 16 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {IDEAL_HEIGHT.map((opt) => (
                      <HChip
                        key={opt}
                        label={opt}
                        selected={idealHeight.has(opt)}
                        onPress={() => toggleIdeal(setIdealHeight, opt)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="성향" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                >
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    {IDEAL_VIBE.map((opt) => (
                      <HChip
                        key={opt}
                        label={opt}
                        selected={idealVibe.has(opt)}
                        onPress={() => toggleIdeal(setIdealVibe, opt)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <View className="h-px bg-ef-divider my-4" />

                <SLabel label="상대를 볼 때 가장 중요한 포인트" />
                <Text className="text-[12px] font-sans text-ef-text-muted leading-[18px] mb-3">
                  복수 선택 가능해요!
                </Text>
                <View className="flex-row flex-wrap gap-[6px] mb-1">
                  {IMPORTANT_POINTS.map((pt) => (
                    <View key={pt} style={{ width: (SW - 36 - 6) / 2 }}>
                      <CheckItem
                        label={pt}
                        selected={importantPoints.has(pt)}
                        onPress={() => toggleIdeal(setImportantPt, pt)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              onPress={() => goStep("photos")}
              skipLabel="건너뛰기 · 마음이 아리송하면 나중에 선택해도 돼요"
              onSkip={() => goStep("photos")}
            />
          </View>
        );

      // ══════ PHOTOS: 사진 + 자기소개 (STEP 5/5) ══════
      case "photos":
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              stepLabel="STEP 5 / 5"
              stepBadge="5/5"
              progress={100}
              onBack={() => goStep("idealType")}
            />
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="px-[18px] pb-4">
                <Text className="text-[28px] mb-2">📷</Text>
                <Text
                  className="text-[21px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 21, lineHeight: 27 }}
                >
                  프로필 사진을{"\n"}등록해 주세요
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-5">
                  첫인상이 결정돼요! 밝고 잘 나온 사진일수록{"\n"}매칭 확률이
                  올라가요.
                </Text>

                {/* 사진 그리드 */}
                <View className="flex-row gap-[10px] mb-[14px]">
                  {/* 대표 사진 */}
                  <TouchableOpacity
                    className={`flex-1 rounded-[12px] border-2 items-center justify-center overflow-hidden ${
                      mainPhotoFilled
                        ? "bg-ef-primary-tint border-transparent"
                        : "bg-ef-primary-tint border-ef-primary"
                    }`}
                    style={{
                      aspectRatio: 3 / 4,
                      borderStyle: mainPhotoFilled ? "solid" : "dashed",
                    }}
                    onPress={() => setMainPhotoFilled(!mainPhotoFilled)}
                    activeOpacity={0.8}
                  >
                    {mainPhotoFilled ? (
                      <>
                        <Text style={{ fontSize: 32 }}>🌸</Text>
                        <View className="absolute top-[7px] left-[7px] bg-ef-primary rounded-[6px] px-2 py-[3px]">
                          <Text className="text-[10px] text-white font-bold">
                            대표
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text className="text-[20px] text-ef-primary mb-1">
                          ＋
                        </Text>
                        <Text className="text-[11px] text-ef-primary font-bold">
                          대표 사진
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* 추가 사진 2장 */}
                  {extraPhotos.map((filled, i) => (
                    <TouchableOpacity
                      key={i}
                      className={`flex-1 rounded-[12px] border-2 items-center justify-center overflow-hidden ${
                        filled
                          ? "bg-ef-surface border-transparent"
                          : "bg-ef-surface border-ef-divider"
                      }`}
                      style={{
                        aspectRatio: 3 / 4,
                        borderStyle: filled ? "solid" : "dashed",
                      }}
                      onPress={() =>
                        setExtraPhotos((prev) => {
                          const n = [...prev];
                          n[i] = !n[i];
                          return n;
                        })
                      }
                      activeOpacity={0.8}
                    >
                      {filled ? (
                        <Text style={{ fontSize: 26 }}>🌿</Text>
                      ) : (
                        <>
                          <Text className="text-[20px] text-ef-text-muted mb-1">
                            ＋
                          </Text>
                          <Text className="text-[11px] text-ef-text-muted font-bold">
                            + 추가
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 사진 가이드 카드 */}
                <View className="bg-ef-surface rounded-[12px] p-[14px] mb-[14px] flex-row gap-2 items-start">
                  <Text style={{ fontSize: 15 }}>💡</Text>
                  <View style={{ flex: 1 }}>
                    <Text className="text-[12px] font-bold text-ef-text mb-1">
                      사진 가이드
                    </Text>
                    <Text className="text-[12px] font-sans text-ef-text-sub leading-5">
                      ✅ 얼굴이 잘 보이는 정면 사진{"\n"}✅ 밝은 환경에서 찍은
                      사진{"\n"}❌ 너무 오래된 사진, 단체 사진
                    </Text>
                  </View>
                </View>

                <View className="h-px bg-ef-divider my-4" />

                <Text style={{ fontSize: 22 }} className="mb-2">
                  ✏️
                </Text>
                <Text
                  className="text-[19px] font-extrabold text-ef-text mb-[5px]"
                  style={{ letterSpacing: -0.04 * 19, lineHeight: 25 }}
                >
                  나에 대해{"\n"}더 알려주세요!
                </Text>
                <Text className="text-[12.5px] font-sans text-ef-text-muted leading-5 mb-[14px]">
                  자유롭게 작성해보세요. 어떤 형식이든 좋아요!{"\n"}짧게 적고
                  나중에 더 추가할 수도 있어요 😊
                </Text>

                <TextInput
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 18,
                    borderWidth: 1.5,
                    borderColor: COLORS.divider,
                    padding: 14,
                    minHeight: 130,
                    fontFamily: "NanumSquareNeo-bRg",
                    fontSize: 13.5,
                    color: COLORS.textPrimary,
                    lineHeight: 22,
                  }}
                  multiline
                  numberOfLines={6}
                  maxLength={300}
                  placeholder={
                    "예) 서울에서 디자이너로 일하고 있어요 🌿\n주말엔 홈카페 만들거나 사진 찍으러 다녀요.\n대화가 잘 통하는 분이면 더 좋겠어요 :)"
                  }
                  placeholderTextColor={COLORS.textMuted}
                  value={bio}
                  onChangeText={setBio}
                  textAlignVertical="top"
                />
                <Text className="text-right text-[11px] font-bold text-ef-text-muted mt-[5px]">
                  {bio.length}/300
                </Text>
              </View>
            </ScrollView>
            <BottomCTA
              label="프로필 완성하기 ✨"
              disabled={!photosCanProceed}
              onPress={() => goStep("complete")}
            />
          </View>
        );

      // ══════ COMPLETE: 완료 ══════
      case "complete":
        return (
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="items-center px-5 pt-11 pb-6">
                {/* 체크 링 아이콘 */}
                <View
                  className="w-[88px] h-[88px] rounded-full bg-ef-primary items-center justify-center mb-5"
                  style={Platform.select({
                    ios: {
                      shadowColor: COLORS.primary,
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 0.38,
                      shadowRadius: 32,
                    },
                    android: { elevation: 12 },
                  })}
                >
                  <Text className="text-white text-[28px] font-extrabold">
                    ✓
                  </Text>
                </View>

                <Text className="text-[11px] font-bold text-ef-text-muted tracking-[1.2px] mb-2">
                  PROFILE COMPLETE
                </Text>
                <Text
                  className="text-[24px] font-extrabold text-ef-text mb-[10px] text-center"
                  style={{ letterSpacing: -0.04 * 24, lineHeight: 32 }}
                >
                  프로필 생성이{"\n"}
                  <Text className="text-ef-primary">완료됐어요!</Text> 🎉
                </Text>
                <Text className="text-[13.5px] font-sans text-ef-text-sub leading-[23px] text-center mb-2 max-w-[270px]">
                  이제 이프에서 새로운 만남을{"\n"}시작해볼까요?{"\n"}딱 맞는
                  사람을 찾아드릴게요 💜
                </Text>

                {/* 프로필 미리보기 카드 */}
                <View
                  className="w-full mt-6 bg-ef-surface rounded-[18px] p-4 flex-row gap-[14px] items-center"
                  style={Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 10,
                    },
                    android: { elevation: 3 },
                  })}
                >
                  <View className="w-[52px] h-[52px] rounded-full bg-ef-primary items-center justify-center shrink-0">
                    <Text className="text-white text-[16px] font-extrabold">
                      지수
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      className="text-[15px] font-extrabold text-ef-text"
                      style={{ letterSpacing: -0.4 }}
                    >
                      김지수 · 26세
                    </Text>
                    <Text className="text-[11.5px] font-sans text-ef-text-muted mt-[2px]">
                      {mbtiAllSet ? mbtiType : "MBTI 미입력"} · 지역 미입력
                    </Text>
                    <View style={[pillsWrapStyle, { marginTop: 7 }]}>
                      {[...selectedKeywords].slice(0, 4).map((kw) => (
                        <View
                          key={kw}
                          className="px-[9px] py-[3px] rounded-[20px] bg-ef-primary-tint border border-ef-primary-border"
                        >
                          <Text className="text-[11px] text-ef-primary font-bold">
                            {kw}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* 프로필 완성도 바 */}
                <View
                  className="w-full mt-3 bg-ef-surface rounded-[18px] p-[15px]"
                  style={Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 10,
                    },
                    android: { elevation: 3 },
                  })}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-[12px] text-ef-text-muted font-bold">
                      프로필 완성도
                    </Text>
                    <Text className="text-[19px] text-ef-primary font-extrabold">
                      {completionPct}%
                    </Text>
                  </View>
                  <View className="h-[5px] rounded-[3px] bg-ef-divider overflow-hidden mb-[7px]">
                    <View
                      className="h-full rounded-[3px] bg-ef-primary"
                      style={{ width: `${completionPct}%` as any }}
                    />
                  </View>
                  <Text className="text-[11px] text-ef-text-muted font-sans">
                    {completionPct < 100
                      ? "사진 1장 더 추가하면 100%예요! 🌟"
                      : "완성도 100%! 완벽해요 🎉"}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <BottomCTA label="이프 시작하기" onPress={handleComplete} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      {renderContent()}
    </SafeAreaView>
  );
}
