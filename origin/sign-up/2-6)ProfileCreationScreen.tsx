import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── 색상 테마 ───
const C = {
  bg: '#F5F3F1',
  purple: '#9686BF',
  pl: 'rgba(150,134,191,0.10)',
  pm: 'rgba(150,134,191,0.22)',
  card: '#FFFFFF',
  div: '#EAE7E3',
  t1: '#1C1A1F',
  t2: '#6B6670',
  t3: '#ADA8B2',
  green: '#5BB98C',
  amber: '#C4885A',
  red: '#D4655A',
};

const FONT = 'NanumSquareNeo';
const {width: SW} = Dimensions.get('window');

// ─── 스텝 타입 ───
type StepKey = 'welcome' | 'interest' | 'keywords' | 'habits' | 'style' | 'idealType' | 'photos' | 'complete';

const STEP_ORDER: StepKey[] = [
  'welcome', 'interest', 'keywords', 'habits', 'style', 'idealType', 'photos', 'complete',
];

// ─── 데이터 ───
const INTEREST_DATA = {
  lifestyle: [
    '아침형 인간', '저녁형 인간', '집순이/집돌이', '활동적', '반려동물',
    '미니멀라이프', '혼밥/혼영', '워라밸', '친환경',
  ],
  hobby: [
    '유튜브', '영화', '드라마', '연예인', '애니메이션', '웹툰', '웹소설',
    '요리', '베이킹', '홈카페', '드로잉', '양재', '소잉', '필사',
    '캘리그라피', '뜨개질', '향수', '악기연주', '밴드', '춤',
    '사주/타로', '메이크업', '네일아트', '청소', '인테리어',
    '물건수집', '주식', '비트코인', '반려식물',
  ],
  outdoor: [
    '맛집 탐방', '카페 투어', '전시회', '연극', '뮤지컬', '사진 찍기',
    '필름사진', '스포츠 직관', '페스티벌', '방탈출', '코인노래방',
    '볼링', '당구/포켓볼', '쇼핑', '피크닉', '놀이공원', '산책',
    '국내여행', '해외여행', '드라이브', '캠핑', '바비큐', '등산',
    '낚시', '봉사활동', '플로깅',
  ],
  selfImprove: [
    '재테크', '자격증 취득', '외국어 공부', '커리어 개발', '독서',
    '신문/뉴스', '카공', '명상', '미라클모닝', '식단 관리',
    '건강 관리', '작문', 'SNS 키우기',
  ],
  food: [
    '비건', '한식', '중식', '일식', '양식', '브런치', '베트남/태국',
    '멕시코음식', '매운음식', '채소파', '육식파', '해산물', '분식',
    '패스트푸드', '베이커리', '간식류',
  ],
  sports: [
    '풋살', '러닝', '마라톤', '자전거', '헬스', '요가', '필라테스',
    '발레', '홈트', '클라이밍', '크로스핏', '배드민턴', '탁구',
    '골프', '테니스', '수영', '서핑', '스쿠버다이빙', '스키',
    '스노우보드', '스케이트보드', '야구', '축구', '농구', '배구',
    '복싱/주짓수',
  ],
  music: [
    'K-POP', 'J-POP', '팝송', '인디음악', '시티팝', '알앤비',
    'EDM', '힙합', '락', '발라드', '재즈', '클래식', '골고루',
  ],
  game: [
    '닌텐도', '보드게임', '오버워치', '배그', 'LOL', '서든어택',
    '메이플', '발로란트', '플스', '스팀 게임',
  ],
};

const DRINK_OPTIONS = [
  {emoji: '🚫', label: '아예 안 마심'},
  {emoji: '🌿', label: '가끔 마심'},
  {emoji: '🍺', label: '꽤 마심'},
  {emoji: '🥂', label: '자주 마심'},
  {emoji: '💪', label: '금주 중'},
];

const DRINK_TYPES = ['🍶 소주', '🍺 맥주', '🍷 와인', '🥃 위스키/하이볼', '🍹 칵테일', '🍶 전통주', '가리지 않아요'];

const SMOKE_OPTIONS = [
  {emoji: '🌿', label: '비흡연자'},
  {emoji: '', label: '아주 가끔 피움'},
  {emoji: '', label: '때때로 피움'},
  {emoji: '🚬', label: '흡연자'},
  {emoji: '💪', label: '금연 중'},
];

const SMOKE_TYPES = ['액상 전자담배', '궐련형 전자담배', '연초', '해당없음'];

const TATTOO_OPTIONS = [
  '타투가 많이 있어요 (아주 많아요)',
  '타투가 여러 개 있어요',
  '포인트 타투 하나/소수 있어요',
  '지금은 없지만 관심있어요',
  '없어요',
];

const HAIR_OPTIONS = ['선택 안함', '숏컷', '단발~중단발', '긴머리'];
const BODY_OPTIONS = ['선택 안함', '슬림', '보통', '통통', '통통 이상'];
const HEIGHT_OPTIONS = ['선택 안함', '150 이하', '151~155', '156~160', '161~165', '166~170', '171 이상'];
const VIBE_OPTIONS = ['선택 안함', '온깁', '깁선호', '텍선호', '온텍', '플라토닉'];

const MBTI_AXES = [
  ['', 'E', 'I'],
  ['', 'N', 'S'],
  ['', 'F', 'T'],
  ['', 'P', 'J'],
];

const MBTI_NAMES: Record<string, string> = {
  INTJ: '전략가', INTP: '논리학자', ENTJ: '통솔자', ENTP: '변론가',
  INFJ: '옹호자', INFP: '중재자', ENFJ: '선도자', ENFP: '활동가',
  ISTJ: '현실주의자', ISFJ: '수호자', ESTJ: '경영자', ESFJ: '집정관',
  ISTP: '장인', ISFP: '모험가', ESTP: '사업가', ESFP: '연예인',
};

const MBTI_EMOJIS: Record<string, string> = {
  INTJ: '🦅', INTP: '🔬', ENTJ: '🦁', ENTP: '💡',
  INFJ: '🌌', INFP: '🌙', ENFJ: '🌟', ENFP: '🎠',
  ISTJ: '📋', ISFJ: '🛡️', ESTJ: '📊', ESFJ: '🤝',
  ISTP: '🔧', ISFP: '🎨', ESTP: '⚡', ESFP: '🎉',
};

const IDEAL_HAIR = ['중요하지 않아요', '숏컷', '단발~중단발', '긴머리'];
const IDEAL_BODY = ['중요하지 않아요', '슬림', '보통', '통통', '통통 이상'];
const IDEAL_HEIGHT = ['중요하지 않아요', '150 이하', '151~155', '156~160', '161~165', '166~170', '171 이상'];
const IDEAL_VIBE = ['중요하지 않아요', '온깁', '깁선호', '텍선호', '온텍', '플라토닉'];

const IMPORTANT_POINTS = [
  {emoji: '🌿', label: '라이프스타일'},
  {emoji: '🎨', label: '관심사'},
  {emoji: '🍷', label: '생활습관'},
  {emoji: '👤', label: '스타일'},
  {emoji: '🧬', label: 'MBTI 궁합'},
  {emoji: '💬', label: '연락 스타일'},
];

const INTEREST_CHOICES = [
  {emoji: '👫', label: '지인', sub: '새로운 친구를 만나고 싶어요'},
  {emoji: '💑', label: '모두', sub: '친구도 연인도 OK!'},
  {emoji: '💕', label: '애인', sub: '사랑을 찾고 싶어요'},
];

// ─── 공통 컴포넌트: Pill ───
const Pill: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({label, selected, onPress}) => (
  <TouchableOpacity
    style={[styles.pill, selected && styles.pillOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.pillText, selected && styles.pillTextOn]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── 공통 컴포넌트: SelectItem (단일 선택 row) ───
const SelectItem: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({label, selected, onPress}) => (
  <TouchableOpacity
    style={[styles.selItem, selected && styles.selItemOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.selItemTxt, selected && styles.selItemTxtOn]}>
      {label}
    </Text>
    <View style={[styles.selCheck, selected && styles.selCheckOn]}>
      {selected && <Text style={styles.selCheckMark}>✓</Text>}
    </View>
  </TouchableOpacity>
);

// ─── 공통 컴포넌트: HChip (가로 스크롤 칩) ───
const HChip: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({label, selected, onPress}) => (
  <TouchableOpacity
    style={[styles.hChip, selected && styles.hChipOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.hChipText, selected && styles.hChipTextOn]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── 공통 컴포넌트: CheckItem (체크박스) ───
const CheckItem: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({label, selected, onPress}) => (
  <TouchableOpacity
    style={[styles.checkItem, selected && styles.checkItemOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <View style={[styles.checkBox, selected && styles.checkBoxOn]}>
      {selected && <Text style={styles.checkBoxMark}>✓</Text>}
    </View>
    <Text style={[styles.checkTxt, selected && styles.checkTxtOn]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── 공통 컴포넌트: SectionLabel ───
const SLabel: React.FC<{label: string}> = ({label}) => (
  <View style={styles.slbl}>
    <View style={styles.sdot} />
    <Text style={styles.slblText}>{label}</Text>
  </View>
);

// ─── 공통 컴포넌트: ToggleSection ───
const ToggleSection: React.FC<{
  emoji: string;
  label: string;
  children: React.ReactNode;
}> = ({emoji, label, children}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{marginBottom: 6}}>
      <TouchableOpacity
        style={[styles.togHead, open && styles.togHeadOpen]}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen(!open);
        }}
        activeOpacity={0.7}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
          <Text style={{fontSize: 14}}>{emoji}</Text>
          <Text
            style={[
              {fontSize: 13, fontWeight: '700', color: C.t2, fontFamily: FONT},
              open && {color: C.purple},
            ]}>
            {label}
          </Text>
        </View>
        <Text
          style={[
            {fontSize: 14, color: C.t3},
            open && {color: C.purple, transform: [{rotate: '180deg'}]},
          ]}>
          ▾
        </Text>
      </TouchableOpacity>
      {open && <View style={{paddingTop: 12, paddingBottom: 4}}>{children}</View>}
    </View>
  );
};

// ─── 공통 컴포넌트: TopBar ───
const TopBar: React.FC<{
  stepLabel: string;
  stepBadge: string;
  progress: number;
  onBack: () => void;
}> = ({stepLabel, stepBadge, progress, onBack}) => (
  <View style={styles.topBar}>
    <TouchableOpacity style={styles.backBtnSmall} onPress={onBack} activeOpacity={0.7}>
      <Text style={{fontSize: 18, color: C.t2, fontWeight: '700'}}>‹</Text>
    </TouchableOpacity>
    <View style={styles.progWrap}>
      <Text style={styles.progLabel}>{stepLabel}</Text>
      <View style={styles.progTrack}>
        <View style={[styles.progFill, {width: `${progress}%`}]} />
      </View>
    </View>
    <Text style={styles.stepBadgeText}>{stepBadge}</Text>
  </View>
);

// ─── 공통 컴포넌트: BottomCTA ───
const BottomCTA: React.FC<{
  label: string;
  disabled?: boolean;
  onPress: () => void;
  skipLabel?: string;
  onSkip?: () => void;
}> = ({label, disabled, onPress, skipLabel, onSkip}) => (
  <View style={styles.bottom}>
    <TouchableOpacity
      style={[styles.cta, disabled && styles.ctaDisabled]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}>
      <Text style={styles.ctaText}>{label}</Text>
      <Text style={{fontSize: 18, color: '#fff', fontWeight: '700'}}>›</Text>
    </TouchableOpacity>
    {skipLabel && onSkip && (
      <TouchableOpacity onPress={onSkip} style={{marginTop: 10}}>
        <Text style={styles.skipText}>{skipLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── MBTI 드럼 컴포넌트 ───
const MBTIDrum: React.FC<{
  items: string[];
  selectedIndex: number;
  onSelect: (idx: number) => void;
}> = ({items, selectedIndex, onSelect}) => {
  const isSet = selectedIndex > 0;
  return (
    <View style={[styles.mbtiDrum, isSet && styles.mbtiDrumSel]}>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.mbtiDrumItem}
          onPress={() => onSelect(idx)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.mbtiDrumText,
              idx === selectedIndex && styles.mbtiDrumTextActive,
              idx === selectedIndex && isSet && {color: C.purple},
            ]}>
            {item || '﹣'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ══════════════════════════════════════════════
// ─── 메인 컴포넌트 ───
// ══════════════════════════════════════════════
const ProfileCreationScreen: React.FC = () => {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  // ─── 스텝 관리 ───
  const [currentStep, setCurrentStep] = useState<StepKey>('welcome');

  const goStep = useCallback((step: StepKey) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity},
      update: {type: LayoutAnimation.Types.easeInEaseOut},
    });
    setCurrentStep(step);
    scrollRef.current?.scrollTo({y: 0, animated: false});
  }, []);

  // ─── 관심 대상 ───
  const [interestChoice, setInterestChoice] = useState<number | null>(null);

  // ─── 키워드 ───
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const toggleKeyword = useCallback((kw: string) => {
    setSelectedKeywords(prev => {
      const n = new Set(prev);
      n.has(kw) ? n.delete(kw) : n.add(kw);
      return n;
    });
  }, []);

  const addTag = useCallback(() => {
    const val = tagInput.trim();
    if (!val) return;
    setCustomTags(prev => [...prev, val]);
    setTagInput('');
  }, [tagInput]);

  const removeTag = useCallback((idx: number) => {
    setCustomTags(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const kwHasSelection = selectedKeywords.size > 0 || customTags.length > 0;

  // ─── 생활습관 ───
  const [drinkFreq, setDrinkFreq] = useState<number | null>(null);
  const [drinkTypes, setDrinkTypes] = useState<Set<string>>(new Set());
  const [smokeFreq, setSmokeFreq] = useState<number | null>(null);
  const [smokeTypes, setSmokeTypes] = useState<Set<string>>(new Set());
  const [tattoo, setTattoo] = useState<number | null>(null);
  const [showTattoo, setShowTattoo] = useState(false);

  const showDrinkTypes = drinkFreq !== null && drinkFreq !== 0 && drinkFreq !== 4;
  const showSmokeTypes = smokeFreq !== null && smokeFreq !== 0;
  const habitCanProceed = drinkFreq !== null && smokeFreq !== null;

  // ─── 스타일 ───
  const [hair, setHair] = useState<number | null>(null);
  const [bodyType, setBodyType] = useState<number | null>(null);
  const [heightRange, setHeightRange] = useState<number | null>(null);
  const [vibe, setVibe] = useState<number | null>(null);
  const [mbtiSel, setMbtiSel] = useState<number[]>([0, 0, 0, 0]);

  const mbtiType = mbtiSel.map((idx, axis) => MBTI_AXES[axis][idx] || '').join('');
  const mbtiDisplay = mbtiSel.map((idx, axis) => MBTI_AXES[axis][idx] || '_').join(' ');
  const mbtiAllSet = mbtiSel.every(s => s > 0);
  const mbtiPartial = mbtiSel.some(s => s > 0) && !mbtiAllSet;
  const styleNextDisabled = mbtiPartial;

  const setMbtiAxis = useCallback((axisIdx: number, val: number) => {
    setMbtiSel(prev => {
      const n = [...prev];
      n[axisIdx] = val;
      return n;
    });
  }, []);

  // ─── 이상형 ───
  const [idealHair, setIdealHair] = useState<Set<string>>(new Set());
  const [idealBody, setIdealBody] = useState<Set<string>>(new Set());
  const [idealHeight, setIdealHeight] = useState<Set<string>>(new Set());
  const [idealVibe, setIdealVibe] = useState<Set<string>>(new Set());
  const [importantPoints, setImportantPoints] = useState<Set<string>>(new Set());

  // ─── 사진 & 자기소개 ───
  const [mainPhotoFilled, setMainPhotoFilled] = useState(false);
  const [extraPhotos, setExtraPhotos] = useState<boolean[]>([false, false]);
  const [bio, setBio] = useState('');

  // ═══════════════════════════════════════
  // ─── 렌더링 ───
  // ═══════════════════════════════════════

  const renderContent = () => {
    switch (currentStep) {
      // ══════ WELCOME ══════
      case 'welcome':
        return (
          <View style={{flex: 1}}>
            <ScrollView
              ref={scrollRef}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 24}}>
              {/* 로고 */}
              <View style={styles.welcomeLogo}>
                <View style={styles.welcomeLogoIcon}>
                  <Text style={{color: '#fff', fontSize: 18, fontWeight: '800'}}>✓</Text>
                </View>
                <Text style={styles.welcomeLogoText}>
                  이<Text style={{color: C.purple}}>프</Text>
                </Text>
              </View>

              {/* 타이틀 */}
              <Text style={styles.welcomeTitle}>
                나만의 프로필을{'\n'}
                <Text style={{color: C.purple}}>만들어볼까요?</Text> 🌿
              </Text>
              <Text style={styles.welcomeSub}>
                몇 가지 질문에 답하면{'\n'}꼭 맞는 사람을 매칭해드려요.{'\n'}솔직할수록 좋은 만남이 생겨요!
              </Text>

              {/* 스텝 카드 */}
              {[
                {num: '1', title: '관심 키워드 선택', sub: '나를 표현할 키워드 입력'},
                {num: '2', title: '음주 · 흡연 · 타투', sub: '나의 생활습관 정보 입력'},
                {num: '3', title: '스타일 & 이상형', sub: '나의 모습과 원하는 상대 설정'},
                {num: '4', title: '사진 & 자기소개', sub: '첫인상을 결정하는 마지막 단계'},
              ].map((card, i) => (
                <View key={i} style={styles.stepCard}>
                  <View style={styles.stepCardNum}>
                    <Text style={styles.stepCardNumText}>{card.num}</Text>
                  </View>
                  <View>
                    <Text style={styles.stepCardTitle}>{card.title}</Text>
                    <Text style={styles.stepCardSub}>{card.sub}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <BottomCTA label="프로필 만들기 시작" onPress={() => goStep('interest')} />
          </View>
        );

      // ══════ INTEREST ══════
      case 'interest':
        return (
          <View style={{flex: 1}}>
            <TopBar stepLabel="시작하기" stepBadge="선택 후 다음" progress={8} onBack={() => goStep('welcome')} />
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.sc}>
                <Text style={styles.sEmoji}>💫</Text>
                <Text style={styles.sTitle}>어디에 더{'\n'}관심 있나요?</Text>
                <Text style={styles.sSub}>원하는 만남의 방향을 선택해 주세요.{'\n'}나중에 언제든 바꿀 수 있어요.</Text>

                <View style={styles.interestGrid}>
                  {INTEREST_CHOICES.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.interestCard, interestChoice === idx && styles.selItemOn]}
                      onPress={() => setInterestChoice(idx)}
                      activeOpacity={0.7}>
                      <Text style={{fontSize: 28, marginBottom: 10}}>{item.emoji}</Text>
                      <Text style={[styles.interestCardLabel, interestChoice === idx && {color: C.purple}]}>
                        {item.label}
                      </Text>
                      <Text style={styles.interestCardSub}>{item.sub}</Text>
                      <View style={[styles.selCheck, {marginTop: 12}, interestChoice === idx && styles.selCheckOn]}>
                        {interestChoice === idx && <Text style={styles.selCheckMark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            <BottomCTA label="다음" disabled={interestChoice === null} onPress={() => goStep('keywords')} />
          </View>
        );

      // ══════ KEYWORDS ══════
      case 'keywords':
        return (
          <View style={{flex: 1}}>
            <TopBar stepLabel="STEP 1 / 5" stepBadge="1/5" progress={20} onBack={() => goStep('interest')} />
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.sc}>
                <Text style={styles.sEmoji}>🎨</Text>
                <Text style={styles.sTitle}>관심사 키워드를{'\n'}골라주세요</Text>
                <Text style={styles.sSub}>여러 개 선택 가능해요. 많이 고를수록{'\n'}더 잘 맞는 사람을 만날 수 있어요!</Text>

                <SLabel label="라이프스타일" />
                <View style={[styles.pillsWrap, {marginBottom: 18}]}>
                  {INTEREST_DATA.lifestyle.map(kw => (
                    <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                  ))}
                </View>

                <SLabel label="취미" />
                <View style={[styles.pillsWrap, {marginBottom: 18}]}>
                  {INTEREST_DATA.hobby.map(kw => (
                    <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                  ))}
                </View>

                <SLabel label="외부 여가활동" />
                <View style={[styles.pillsWrap, {marginBottom: 18}]}>
                  {INTEREST_DATA.outdoor.map(kw => (
                    <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                  ))}
                </View>

                <SLabel label="자기계발" />
                <View style={[styles.pillsWrap, {marginBottom: 18}]}>
                  {INTEREST_DATA.selfImprove.map(kw => (
                    <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                  ))}
                </View>

                <ToggleSection emoji="🍜" label="음식">
                  <View style={styles.pillsWrap}>
                    {INTEREST_DATA.food.map(kw => (
                      <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                    ))}
                  </View>
                </ToggleSection>

                <ToggleSection emoji="⚽" label="운동">
                  <View style={styles.pillsWrap}>
                    {INTEREST_DATA.sports.map(kw => (
                      <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                    ))}
                  </View>
                </ToggleSection>

                <ToggleSection emoji="🎵" label="음악">
                  <View style={styles.pillsWrap}>
                    {INTEREST_DATA.music.map(kw => (
                      <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                    ))}
                  </View>
                </ToggleSection>

                <ToggleSection emoji="🎮" label="게임">
                  <View style={styles.pillsWrap}>
                    {INTEREST_DATA.game.map(kw => (
                      <Pill key={kw} label={kw} selected={selectedKeywords.has(kw)} onPress={() => toggleKeyword(kw)} />
                    ))}
                  </View>
                </ToggleSection>

                {/* 커스텀 태그 */}
                <View style={{marginTop: 14}} />
                <SLabel label="나만의 키워드 추가" />
                <View style={styles.tagInputRow}>
                  <TextInput
                    style={styles.tagInputField}
                    placeholder="직접 입력해보세요"
                    placeholderTextColor={C.t3}
                    value={tagInput}
                    onChangeText={setTagInput}
                    maxLength={12}
                    onSubmitEditing={addTag}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.tagAddBtn} onPress={addTag} activeOpacity={0.7}>
                    <Text style={styles.tagAddBtnText}>추가</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pillsWrap}>
                  {customTags.map((tag, idx) => (
                    <View key={idx} style={styles.customTag}>
                      <Text style={styles.customTagText}>#{tag}</Text>
                      <TouchableOpacity
                        style={styles.customTagX}
                        onPress={() => removeTag(idx)}
                        hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                        <Text style={{color: '#fff', fontSize: 10}}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={{height: 4}} />
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              disabled={!kwHasSelection}
              onPress={() => goStep('habits')}
              skipLabel="건너뛰기 · 필요할 때 언제든 추가할 수 있어요"
              onSkip={() => goStep('habits')}
            />
          </View>
        );

      // ══════ HABITS ══════
      case 'habits':
        return (
          <View style={{flex: 1}}>
            <TopBar stepLabel="STEP 2 / 5" stepBadge="2/5" progress={40} onBack={() => goStep('keywords')} />
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.sc}>
                <Text style={styles.sEmoji}>🍷</Text>
                <Text style={styles.sTitle}>생활 습관을{'\n'}알려주세요</Text>
                <Text style={styles.sSub}>솔직하게 답해줄수록 잘 맞는{'\n'}상대를 찾기 쉬워져요!</Text>

                <SLabel label="음주 빈도" />
                <View style={{gap: 4, marginBottom: 14}}>
                  {DRINK_OPTIONS.map((opt, idx) => (
                    <SelectItem
                      key={idx}
                      label={`${opt.emoji} ${opt.label}`}
                      selected={drinkFreq === idx}
                      onPress={() => setDrinkFreq(idx)}
                    />
                  ))}
                </View>

                {showDrinkTypes && (
                  <>
                    <SLabel label="선호 주종" />
                    <View style={[styles.pillsWrap, {marginBottom: 18}]}>
                      {DRINK_TYPES.map(dt => (
                        <Pill
                          key={dt}
                          label={dt}
                          selected={drinkTypes.has(dt)}
                          onPress={() => {
                            setDrinkTypes(prev => {
                              const n = new Set(prev);
                              n.has(dt) ? n.delete(dt) : n.add(dt);
                              return n;
                            });
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}

                <View style={styles.sep} />

                <SLabel label="흡연 여부" />
                <Text style={styles.subDesc}>흡연 여부는 매칭에서 중요한 정보예요. 솔직하게 알려주세요.</Text>
                <View style={{gap: 4, marginBottom: 14}}>
                  {SMOKE_OPTIONS.map((opt, idx) => (
                    <SelectItem
                      key={idx}
                      label={`${opt.emoji ? opt.emoji + ' ' : ''}${opt.label}`}
                      selected={smokeFreq === idx}
                      onPress={() => setSmokeFreq(idx)}
                    />
                  ))}
                </View>

                {showSmokeTypes && (
                  <>
                    <SLabel label="종류" />
                    <View style={[styles.pillsWrap, {marginBottom: 18}]}>
                      {SMOKE_TYPES.map(st => (
                        <Pill
                          key={st}
                          label={st}
                          selected={smokeTypes.has(st)}
                          onPress={() => {
                            setSmokeTypes(prev => {
                              const n = new Set(prev);
                              n.has(st) ? n.delete(st) : n.add(st);
                              return n;
                            });
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}

                <View style={styles.sep} />

                {/* 타투 */}
                <TouchableOpacity
                  style={[styles.togHead, showTattoo && styles.togHeadOpen]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowTattoo(!showTattoo);
                  }}
                  activeOpacity={0.7}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                    <Text style={{fontSize: 14}}>🖊️</Text>
                    <Text
                      style={[
                        {fontSize: 13, fontWeight: '700', color: C.t2, fontFamily: FONT},
                        showTattoo && {color: C.purple},
                      ]}>
                      타투 유무
                    </Text>
                  </View>
                  <Text
                    style={[
                      {fontSize: 14, color: C.t3},
                      showTattoo && {color: C.purple, transform: [{rotate: '180deg'}]},
                    ]}>
                    ▾
                  </Text>
                </TouchableOpacity>
                {showTattoo && (
                  <View style={{paddingTop: 10, paddingBottom: 8}}>
                    <Text style={styles.subDesc}>취향을 더 잘 맞추기 위한 정보예요 💛</Text>
                    <View style={{gap: 4}}>
                      {TATTOO_OPTIONS.map((opt, idx) => (
                        <SelectItem
                          key={idx}
                          label={opt}
                          selected={tattoo === idx}
                          onPress={() => setTattoo(idx)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
            <BottomCTA label="다음" disabled={!habitCanProceed} onPress={() => goStep('style')} />
          </View>
        );

      // ══════ STYLE + MBTI ══════
      case 'style':
        return (
          <View style={{flex: 1}}>
            <TopBar stepLabel="STEP 3 / 5" stepBadge="3/5" progress={60} onBack={() => goStep('habits')} />
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.sc}>
                <Text style={styles.sEmoji}>👤</Text>
                <Text style={styles.sTitle}>내 스타일 정보를{'\n'}추가해볼까요?</Text>
                <Text style={styles.sSub}>선택 안 해도 되는 항목이에요.{'\n'}자유롭게 업데이트할 수 있어요.</Text>

                <SLabel label="머리 길이" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    {HAIR_OPTIONS.map((opt, idx) => (
                      <HChip key={opt} label={opt} selected={hair === idx} onPress={() => setHair(idx)} />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="체형" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    {BODY_OPTIONS.map((opt, idx) => (
                      <HChip key={opt} label={opt} selected={bodyType === idx} onPress={() => setBodyType(idx)} />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="키" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    {HEIGHT_OPTIONS.map((opt, idx) => (
                      <HChip key={opt} label={opt} selected={heightRange === idx} onPress={() => setHeightRange(idx)} />
                    ))}
                  </View>
                </ScrollView>

                <SLabel label="성향" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 22}}>
                  <View style={{flexDirection: 'row', gap: 7}}>
                    {VIBE_OPTIONS.map((opt, idx) => (
                      <HChip key={opt} label={opt} selected={vibe === idx} onPress={() => setVibe(idx)} />
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.sep} />

                {/* MBTI */}
                <SLabel label="MBTI" />
                <Text style={[styles.subDesc, {marginBottom: 14}]}>
                  탭하여 선택해주세요
                </Text>
                <View style={styles.mbtiWrap}>
                  {MBTI_AXES.map((axis, axisIdx) => (
                    <MBTIDrum
                      key={axisIdx}
                      items={axis}
                      selectedIndex={mbtiSel[axisIdx]}
                      onSelect={(val) => setMbtiAxis(axisIdx, val)}
                    />
                  ))}
                </View>
                <View style={[styles.mbtiResult, mbtiPartial && {borderColor: C.amber}]}>
                  <View>
                    <Text style={[styles.mbtiType, mbtiAllSet && {color: C.purple}]}>
                      {mbtiDisplay}
                    </Text>
                    <Text style={styles.mbtiName}>
                      {mbtiAllSet ? (MBTI_NAMES[mbtiType] || '알 수 없는 유형') : '선택해주세요'}
                    </Text>
                  </View>
                  <Text style={{fontSize: 28}}>
                    {mbtiAllSet ? (MBTI_EMOJIS[mbtiType] || '✨') : '🤔'}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              disabled={styleNextDisabled}
              onPress={() => goStep('idealType')}
              skipLabel="건너뛰기 · 자유롭게 업데이트할 수 있습니다"
              onSkip={() => goStep('idealType')}
            />
          </View>
        );

      // ══════ IDEAL TYPE ══════
      case 'idealType':
        return (
          <View style={{flex: 1}}>
            <TopBar stepLabel="STEP 4 / 5" stepBadge="4/5" progress={80} onBack={() => goStep('style')} />
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.sc}>
                <Text style={styles.sEmoji}>💜</Text>
                <Text style={styles.sTitle}>끌리는 스타일이{'\n'}있다면 선택해볼까요?</Text>
                <Text style={styles.sSub}>당신의 마음을 움직이는 키워드를 찾아보세요.{'\n'}복수 선택 가능해요!</Text>

                {/* 이상형 선택지들 */}
                {[
                  {label: '머리 길이', data: IDEAL_HAIR, state: idealHair, setter: setIdealHair},
                  {label: '체형', data: IDEAL_BODY, state: idealBody, setter: setIdealBody},
                  {label: '키', data: IDEAL_HEIGHT, state: idealHeight, setter: setIdealHeight},
                  {label: '성향', data: IDEAL_VIBE, state: idealVibe, setter: setIdealVibe},
                ].map(({label, data, state, setter}) => (
                  <View key={label}>
                    <SLabel label={label} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 16}}>
                      <View style={{flexDirection: 'row', gap: 7}}>
                        {data.map(opt => (
                          <HChip
                            key={opt}
                            label={opt}
                            selected={state.has(opt)}
                            onPress={() => {
                              setter((prev: Set<string>) => {
                                const n = new Set(prev);
                                n.has(opt) ? n.delete(opt) : n.add(opt);
                                return n;
                              });
                            }}
                          />
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                ))}

                <View style={styles.sep} />

                <SLabel label="상대를 볼 때 가장 중요한 포인트" />
                <Text style={[styles.subDesc, {marginBottom: 12}]}>복수 선택 가능해요!</Text>
                <View style={styles.checkGrid}>
                  {IMPORTANT_POINTS.map(pt => (
                    <CheckItem
                      key={pt.label}
                      label={`${pt.emoji} ${pt.label}`}
                      selected={importantPoints.has(pt.label)}
                      onPress={() => {
                        setImportantPoints(prev => {
                          const n = new Set(prev);
                          n.has(pt.label) ? n.delete(pt.label) : n.add(pt.label);
                          return n;
                        });
                      }}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
            <BottomCTA
              label="다음"
              onPress={() => goStep('photos')}
              skipLabel="건너뛰기 · 마음이 아리송하면 나중에 선택해도 돼요"
              onSkip={() => goStep('photos')}
            />
          </View>
        );

      // ══════ PHOTOS + BIO ══════
      case 'photos':
        return (
          <View style={{flex: 1}}>
            <TopBar stepLabel="STEP 5 / 5" stepBadge="5/5" progress={100} onBack={() => goStep('idealType')} />
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.sc}>
                <Text style={styles.sEmoji}>📷</Text>
                <Text style={styles.sTitle}>프로필 사진을{'\n'}등록해 주세요</Text>
                <Text style={styles.sSub}>첫인상이 결정돼요! 밝고 잘 나온 사진일수록{'\n'}매칭 확률이 올라가요.</Text>

                {/* 사진 그리드 */}
                <View style={styles.photoGrid}>
                  <TouchableOpacity
                    style={[styles.photoSlot, styles.photoSlotMain, mainPhotoFilled && styles.photoSlotFilled]}
                    onPress={() => setMainPhotoFilled(!mainPhotoFilled)}
                    activeOpacity={0.7}>
                    {mainPhotoFilled ? (
                      <View style={styles.photoMock}>
                        <Text style={{fontSize: 32}}>🌸</Text>
                        <View style={styles.photoBadge}>
                          <Text style={styles.photoBadgeText}>대표</Text>
                        </View>
                      </View>
                    ) : (
                      <>
                        <Text style={{fontSize: 20, color: C.purple, fontWeight: '300'}}>+</Text>
                        <Text style={[styles.photoLbl, {color: C.purple}]}>대표 사진</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {extraPhotos.map((filled, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.photoSlot, filled && styles.photoSlotFilled]}
                      onPress={() => {
                        setExtraPhotos(prev => {
                          const n = [...prev];
                          n[idx] = !n[idx];
                          return n;
                        });
                      }}
                      activeOpacity={0.7}>
                      {filled ? (
                        <View style={styles.photoMock}>
                          <Text style={{fontSize: 26}}>🌿</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={{fontSize: 20, color: C.t3, fontWeight: '300'}}>+</Text>
                          <Text style={styles.photoLbl}>+ 추가</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 사진 가이드 */}
                <View style={styles.infoCard}>
                  <Text style={{fontSize: 15, marginRight: 8}}>💡</Text>
                  <View style={{flex: 1}}>
                    <Text style={[styles.infoCardTxt, {fontWeight: '700', color: C.t1, marginBottom: 4}]}>
                      사진 가이드
                    </Text>
                    <Text style={styles.infoCardTxt}>✅ 얼굴이 잘 보이는 정면 사진</Text>
                    <Text style={styles.infoCardTxt}>✅ 밝은 환경에서 찍은 사진</Text>
                    <Text style={styles.infoCardTxt}>❌ 너무 오래된 사진, 단체 사진</Text>
                  </View>
                </View>

                <View style={styles.sep} />

                {/* 자기소개 */}
                <Text style={styles.sEmoji}>✏️</Text>
                <Text style={[styles.sTitle, {fontSize: 19}]}>나에 대해{'\n'}더 알려주세요!</Text>
                <Text style={[styles.sSub, {marginBottom: 14}]}>
                  자유롭게 작성해보세요. 어떤 형식이든 좋아요!{'\n'}짧게 적고 나중에 더 추가할 수도 있어요 😊
                </Text>

                <TextInput
                  style={styles.bioTa}
                  multiline
                  maxLength={300}
                  value={bio}
                  onChangeText={setBio}
                  placeholder={`예) 서울에서 디자이너로 일하고 있어요 🌿\n주말엔 홈카페 만들거나 사진 찍으러 다녀요.\n대화가 잘 통하는 분이면 더 좋겠어요 :)`}
                  placeholderTextColor={C.t3}
                  textAlignVertical="top"
                />
                <Text style={styles.bioCnt}>{bio.length}/300</Text>
              </View>
            </ScrollView>
            <BottomCTA
              label="프로필 완성하기 ✨"
              disabled={!mainPhotoFilled}
              onPress={() => goStep('complete')}
            />
          </View>
        );

      // ══════ COMPLETE ══════
      case 'complete':
        return (
          <View style={{flex: 1}}>
            <ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.completeWrap}>
                {/* 체크 링 */}
                <View style={styles.compRing}>
                  <Text style={{color: '#fff', fontSize: 30, fontWeight: '800'}}>✓</Text>
                </View>
                <Text style={styles.compBadge}>PROFILE COMPLETE</Text>
                <Text style={styles.compTitle}>
                  프로필 생성이{'\n'}
                  <Text style={{color: C.purple}}>완료됐어요!</Text> 🎉
                </Text>
                <View style={{height: 12}} />
                <Text style={styles.compDesc}>
                  이제 이프에서 새로운 만남을{'\n'}시작해볼까요?{'\n'}딱 맞는 사람을 찾아드릴게요 💜
                </Text>

                {/* 프로필 카드 */}
                <View style={styles.compCard}>
                  <View style={styles.compAv}>
                    <Text style={styles.compAvText}>지수</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.compName}>김지수 · 26세</Text>
                    <Text style={styles.compMeta}>INFP · 서울 마포구</Text>
                    <View style={styles.compChips}>
                      {['홈카페', '테니스', '인디음악', '클라이밍'].map(chip => (
                        <View key={chip} style={styles.compChip}>
                          <Text style={styles.compChipText}>{chip}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* 완성도 바 */}
                <View style={styles.compBarCard}>
                  <View style={styles.compBarHeader}>
                    <Text style={styles.compBarLabel}>프로필 완성도</Text>
                    <Text style={styles.compBarPct}>92%</Text>
                  </View>
                  <View style={styles.compBarTrack}>
                    <View style={[styles.compBarFill, {width: '92%'}]} />
                  </View>
                  <Text style={styles.compBarHint}>사진 1장 더 추가하면 100%예요! 🌟</Text>
                </View>
              </View>
            </ScrollView>
            <BottomCTA
              label="이프 시작하기"
              onPress={() => {
                // navigation.reset 등으로 메인 화면 이동
                console.log('메인 화면으로');
              }}
              skipLabel="프로필 미리보기"
              onSkip={() => console.log('미리보기')}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      {renderContent()}
    </View>
  );
};

// ═══════════════════════════════════════════
// ─── 스타일시트 ───
// ═══════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ─── TopBar ───
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 8,
  },
  backBtnSmall: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
      android: {elevation: 2},
    }),
  },
  progWrap: {flex: 1},
  progLabel: {fontSize: 10, fontWeight: '700', color: C.t3, fontFamily: FONT, marginBottom: 4, letterSpacing: 0.4},
  progTrack: {height: 4, borderRadius: 2, backgroundColor: C.div, overflow: 'hidden'},
  progFill: {height: '100%', borderRadius: 2, backgroundColor: C.purple},
  stepBadgeText: {fontSize: 11, fontWeight: '800', color: C.purple, fontFamily: FONT},

  // ─── Bottom ───
  bottom: {
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 12,
    backgroundColor: C.bg,
  },
  cta: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: C.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    ...Platform.select({
      ios: {shadowColor: C.purple, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.32, shadowRadius: 22},
      android: {elevation: 8},
    }),
  },
  ctaDisabled: {
    backgroundColor: C.t3,
    opacity: 0.7,
    ...Platform.select({
      ios: {shadowOpacity: 0},
      android: {elevation: 0},
    }),
  },
  ctaText: {fontSize: 15, fontWeight: '800', color: '#fff', fontFamily: FONT, letterSpacing: -0.3},
  skipText: {
    textAlign: 'center',
    fontSize: 12.5,
    fontWeight: '700',
    color: C.t3,
    fontFamily: FONT,
    lineHeight: 18,
  },

  // ─── Scroll content ───
  sc: {paddingHorizontal: 18, paddingBottom: 16},

  // ─── Step header ───
  sEmoji: {fontSize: 28, marginBottom: 8},
  sTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: C.t1,
    fontFamily: FONT,
    letterSpacing: -0.8,
    lineHeight: 27,
    marginBottom: 5,
  },
  sSub: {
    fontSize: 12.5,
    fontWeight: '400',
    color: C.t3,
    fontFamily: FONT,
    lineHeight: 20,
    marginBottom: 20,
  },

  // ─── Section label ───
  slbl: {flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 9, marginTop: 2},
  sdot: {width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.purple},
  slblText: {fontSize: 11, fontWeight: '700', color: C.t3, fontFamily: FONT, letterSpacing: 0.5, textTransform: 'uppercase'},

  // ─── Pills ───
  pillsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 4},
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
  },
  pillOn: {
    borderColor: C.purple,
    backgroundColor: C.pl,
  },
  pillText: {fontSize: 12.5, fontWeight: '700', color: C.t2, fontFamily: FONT},
  pillTextOn: {color: C.purple},

  // ─── SelectItem ───
  selItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
  },
  selItemOn: {borderColor: C.purple, backgroundColor: C.pl},
  selItemTxt: {fontSize: 13.5, fontWeight: '700', color: C.t1, fontFamily: FONT},
  selItemTxtOn: {color: C.purple},
  selCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.div,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selCheckOn: {backgroundColor: C.purple, borderColor: C.purple},
  selCheckMark: {fontSize: 10, color: '#fff', fontWeight: '800'},

  // ─── HChip ───
  hChip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
  },
  hChipOn: {borderColor: C.purple, backgroundColor: C.pl},
  hChipText: {fontSize: 13, fontWeight: '700', color: C.t2, fontFamily: FONT},
  hChipTextOn: {color: C.purple},

  // ─── CheckItem ───
  checkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
    width: (SW - 36 - 6) / 2,
  },
  checkItemOn: {borderColor: C.purple, backgroundColor: C.pl},
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: C.div,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxOn: {backgroundColor: C.purple, borderColor: C.purple},
  checkBoxMark: {fontSize: 10, color: '#fff', fontWeight: '800'},
  checkTxt: {fontSize: 12.5, fontWeight: '700', color: C.t1, fontFamily: FONT},
  checkTxtOn: {color: C.purple},

  // ─── Toggle head ───
  togHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.div,
  },
  togHeadOpen: {borderColor: C.purple, backgroundColor: C.pl},

  // ─── Tag input ───
  tagInputRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  tagInputField: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
    fontFamily: FONT,
    fontSize: 13,
    color: C.t1,
  },
  tagAddBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: C.purple,
    justifyContent: 'center',
    ...Platform.select({
      ios: {shadowColor: C.purple, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 12},
      android: {elevation: 4},
    }),
  },
  tagAddBtnText: {fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: FONT},
  customTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingLeft: 13,
    paddingRight: 10,
    borderRadius: 20,
    backgroundColor: C.purple,
  },
  customTagText: {fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: FONT},
  customTagX: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Misc ───
  sep: {height: 1, backgroundColor: C.div, marginVertical: 16},
  subDesc: {fontSize: 12, fontWeight: '400', color: C.t3, fontFamily: FONT, marginBottom: 10, lineHeight: 18},

  // ─── MBTI ───
  mbtiWrap: {flexDirection: 'row', gap: 8, marginBottom: 4},
  mbtiDrum: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.div,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  mbtiDrumSel: {borderColor: C.purple, backgroundColor: C.pl},
  mbtiDrumItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mbtiDrumText: {
    fontSize: 18,
    fontWeight: '800',
    color: C.t3,
    fontFamily: FONT,
    letterSpacing: -0.3,
  },
  mbtiDrumTextActive: {
    fontSize: 22,
    color: C.purple,
  },
  mbtiResult: {
    marginTop: 10,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: C.div,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mbtiType: {fontSize: 24, fontWeight: '800', color: C.t3, fontFamily: FONT, letterSpacing: -0.3},
  mbtiName: {fontSize: 12, fontWeight: '400', color: C.t3, fontFamily: FONT},

  // ─── Photo ───
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  photoSlot: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: C.div,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoSlotMain: {borderColor: C.purple, backgroundColor: C.pl},
  photoSlotFilled: {borderStyle: 'solid', borderColor: 'transparent'},
  photoMock: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.purple,
  },
  photoBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: C.purple,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  photoBadgeText: {fontSize: 10, fontWeight: '700', color: '#fff', fontFamily: FONT},
  photoLbl: {fontSize: 11, fontWeight: '700', color: C.t3, fontFamily: FONT, marginTop: 4},

  // ─── Bio ───
  bioTa: {
    width: '100%',
    minHeight: 130,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
    fontFamily: FONT,
    fontSize: 13.5,
    color: C.t1,
    lineHeight: 23,
    textAlignVertical: 'top',
  },
  bioCnt: {textAlign: 'right', fontSize: 11, color: C.t3, fontWeight: '700', fontFamily: FONT, marginTop: 5},

  // ─── Info card ───
  infoCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
      android: {elevation: 2},
    }),
  },
  infoCardTxt: {fontSize: 12, fontWeight: '400', color: C.t2, fontFamily: FONT, lineHeight: 20},

  // ─── Welcome ───
  welcomeLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: Platform.OS === 'ios' ? 18 : 24,
    paddingBottom: 32,
  },
  welcomeLogoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {shadowColor: C.purple, shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.35, shadowRadius: 18},
      android: {elevation: 6},
    }),
  },
  welcomeLogoText: {fontSize: 22, fontWeight: '800', color: C.t1, fontFamily: FONT, letterSpacing: -0.8},
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: C.t1,
    fontFamily: FONT,
    letterSpacing: -1,
    lineHeight: 32,
    marginBottom: 14,
  },
  welcomeSub: {
    fontSize: 13.5,
    fontWeight: '400',
    color: C.t2,
    fontFamily: FONT,
    lineHeight: 24,
    marginBottom: 32,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
      android: {elevation: 2},
    }),
  },
  stepCardNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.pl,
    borderWidth: 1.5,
    borderColor: C.pm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCardNumText: {fontSize: 16, fontWeight: '800', color: C.purple, fontFamily: FONT},
  stepCardTitle: {fontSize: 13.5, fontWeight: '800', color: C.t1, fontFamily: FONT, letterSpacing: -0.3},
  stepCardSub: {fontSize: 11.5, fontWeight: '400', color: C.t3, fontFamily: FONT, marginTop: 2},

  // ─── Interest ───
  interestGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  interestCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.div,
    backgroundColor: C.card,
  },
  interestCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: C.t1,
    fontFamily: FONT,
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  interestCardSub: {
    fontSize: 11,
    fontWeight: '400',
    color: C.t3,
    fontFamily: FONT,
    lineHeight: 15,
    textAlign: 'center',
  },

  // ─── Complete ───
  completeWrap: {
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  compRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {shadowColor: C.purple, shadowOffset: {width: 0, height: 12}, shadowOpacity: 0.38, shadowRadius: 32},
      android: {elevation: 10},
    }),
  },
  compBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: C.t3,
    fontFamily: FONT,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  compTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.t1,
    fontFamily: FONT,
    letterSpacing: -0.8,
    textAlign: 'center',
    lineHeight: 30,
  },
  compDesc: {
    fontSize: 13.5,
    fontWeight: '400',
    color: C.t2,
    fontFamily: FONT,
    lineHeight: 24,
    textAlign: 'center',
  },
  compCard: {
    width: '100%',
    marginTop: 24,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
      android: {elevation: 2},
    }),
  },
  compAv: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compAvText: {fontSize: 18, fontWeight: '800', color: '#fff', fontFamily: FONT},
  compName: {fontSize: 15, fontWeight: '800', color: C.t1, fontFamily: FONT, letterSpacing: -0.5},
  compMeta: {fontSize: 11.5, fontWeight: '400', color: C.t3, fontFamily: FONT, marginTop: 2},
  compChips: {flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 7},
  compChip: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 20,
    backgroundColor: C.pl,
    borderWidth: 1,
    borderColor: C.pm,
  },
  compChipText: {fontSize: 11, fontWeight: '700', color: C.purple, fontFamily: FONT},
  compBarCard: {
    width: '100%',
    marginTop: 12,
    backgroundColor: C.card,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
      android: {elevation: 2},
    }),
  },
  compBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compBarLabel: {fontSize: 12, fontWeight: '700', color: C.t3, fontFamily: FONT},
  compBarPct: {fontSize: 19, fontWeight: '800', color: C.purple, fontFamily: FONT},
  compBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: C.div,
    overflow: 'hidden',
    marginBottom: 7,
  },
  compBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: C.purple,
  },
  compBarHint: {fontSize: 11, fontWeight: '400', color: C.t3, fontFamily: FONT},
});

export default ProfileCreationScreen;
