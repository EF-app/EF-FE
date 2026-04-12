import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Android LayoutAnimation 활성화
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── 색상 테마 ───
const COLORS = {
  bg: '#F5F3F1',
  white: '#FFFFFF',
  purple: '#9686BF',
  purpleMid: '#7E6BAD',
  purpleDeep: '#6A579A',
  purpleSoft: 'rgba(150,134,191,0.10)',
  purpleSoft2: 'rgba(150,134,191,0.18)',
  purpleBorder: 'rgba(150,134,191,0.22)',
  purpleGlow: 'rgba(150,134,191,0.22)',
  divider: '#EAE7E3',
  t1: '#1C1A1F',
  t2: '#6B6670',
  t3: '#ADA8B2',
};

const FONT_FAMILY = 'NanumSquareNeo';

// ─── 약관 데이터 ───
interface TermData {
  id: number;
  badge: 'required' | 'optional';
  title: string;
  buttonText: string;
  content: string;
}

const REQUIRED_TERMS: TermData[] = [
  {
    id: 1,
    badge: 'required',
    title: 'EF 서비스 이용약관',
    buttonText: '동의합니다',
    content: `제 1 조 (목적)\n본 약관은 주식회사 EF(이하 '회사')이 운영하는 모바일 애플리케이션 'EF' 및 관련 서비스에서 제공하는 제반 서비스의 이용과 관련하여, 회사와 회원과의 권리, 의무 및 책임사항, 이용조건 및 절차 기타 필요한 기본적인 사항을 규정함을 목적으로 합니다.\n\n제 2 조 (용어의 정의)\n• EF 서비스: 회사가 운영하는 여성 전용 회원 매칭 플랫폼\n• 회원: 본 약관에 동의하고 본인인증 절차를 거쳐 이용 자격을 부여받은 자\n• 우표(Stamp): 서비스 내에서 매칭된 상대방의 프로필 정보를 일컫는 고유 명칭\n• 파랑새: 인연을 탐색하고 전달하는 서비스 내 캐릭터 및 시스템 기능\n\n제 4 조 (회원가입)\n본 서비스는 만 19세 이상의 생물학적 및 법적 여성에 한하여 가입 및 이용이 가능합니다.\n\n제 7 조 (금지행위)\n• 타 회원의 성적 지향, 신상정보 외부 유출 (아웃팅) 금지\n• 성별 및 신분 기망 행위 금지\n• 금전 요구, 로맨스 스캠 등 경제적 이득 취득 행위 금지\n• 욕설, 성희롱, 스토킹 등 반사회적 행위 금지\n\n제 10 조 (환불 정책)\n결제 후 7일 이내 미사용 아이템에 한해 환불이 가능합니다.`,
  },
  {
    id: 2,
    badge: 'required',
    title: '생물학적 여성 확인 동의',
    buttonText: '확인·동의합니다',
    content: `본인은 생물학적 여성임을 확인하며, 남성으로 판명될 경우 민·형사상 책임을 질 것에 동의합니다.\n\n본 서비스는 여성 전용 매칭 플랫폼으로, 생물학적 및 법적 여성에 한하여 가입 및 이용이 가능합니다.\n\n• 성별 도용이 적발될 경우 즉시 계정 영구 정지\n• 서비스 이용 방해 및 플랫폼 신뢰도 훼손에 대한 위약벌 청구 가능\n• 관련 법령에 따른 민·형사상 법적 조치 가능\n• 기기 식별번호 및 본인확인값(CI/DI) 영구 차단\n\n위 내용을 모두 확인하였으며, 본인이 생물학적 여성임을 서약합니다.`,
  },
  {
    id: 3,
    badge: 'required',
    title: '개인정보 수집 및 이용 동의',
    buttonText: '동의합니다',
    content: `수집 항목 (필수)\n• 휴대폰 번호: 본인 인증 및 계정 보안\n• 본인확인값(CI/DI): 남성 가입자 차단, 중복 가입 방지\n• 기기 식별번호(ADID/IDFA): 부정 가입 차단 및 서비스 최적화\n• 주민등록번호 뒷자리 첫 번째 숫자: 성별 식별 부호\n• 서비스 이용 정보: 닉네임, 성별, 생년월일, 거주지역, 프로필 사진\n\n수집 항목 (선택)\nMBTI, 키, 체형, 취미, 음주/흡연 여부, 직업, 학력 등\n\n이용 목적\n• 회원 식별 및 연령 확인 (만 19세 이상)\n• 정교한 매칭 서비스 제공\n• 남성 및 부정 가입자 원천 차단\n• 불량 이용자 제재 및 분쟁 처리\n• 법적 의무 이행 및 수사 협조\n\n보유 기간\n회원 탈퇴 시까지. 단, 부정 이용 기록은 탈퇴 후 1년간 별도 보관.`,
  },
  {
    id: 4,
    badge: 'required',
    title: '민감정보 수집 및 이용 동의',
    buttonText: '동의합니다',
    content: `💜 이프(EF)는 당신의 정체성을 가장 소중한 비밀로 다룹니다.\n\n수집된 성향 정보는 오직 매칭 알고리즘 계산을 위해서만 사용되며, 그 누구에게도 당신의 실제 신상과 연결되어 공개되지 않습니다.\n\n수집 항목\n• 성적 지향(정체성): 레즈비언/바이섹슈얼 등 여성 간 매칭 서비스 제공\n• 연애 스타일 및 성향: 개인화된 매칭 알고리즘 적용\n\n보안 및 보호\n• 일반 데이터와 분리된 별도 보안 영역에 암호화 저장\n• 관리자조차 개별 회원 정보 열람 불가\n• 탈퇴 시 복구 불가능한 방법으로 즉시 삭제\n\n아웃팅 방지 약속\n"우리는 아웃팅을 범죄로 규정합니다."\n\n동의를 거부할 경우 서비스 이용(회원가입)이 불가능합니다.`,
  },
  {
    id: 5,
    badge: 'required',
    title: '개인정보 유출 금지 동의',
    buttonText: '확인·동의합니다',
    content: `본 서비스는 성적 지향과 프라이버시 보호가 무엇보다 중요한 여성 전용 매칭 플랫폼입니다.\n\n금지 행위\n타 회원의 성적 지향, 실명, 사진, 연락처, 학력, 직장, SNS 계정 등 일체의 신상정보를 당사자의 동의 없이 외부로 노출하는 모든 행위\n\n즉각적 제재 (무관용 원칙)\n• 계정 즉시 영구 정지\n• 기기 식별번호 및 CI/DI 영구 차단\n\n법적 책임\n• 손해배상: 피해 회원의 정신적 손해 및 회사 브랜드 이미지 실추에 대한 배상\n• 위약벌 부과\n• 형사 고발\n\n본인은 아웃팅 행위가 범죄임을 인지하고, 어떠한 법적 처벌과 불이익도 감수할 것을 확약합니다.`,
  },
];

const OPTIONAL_TERMS: TermData[] = [
  {
    id: 6,
    badge: 'optional',
    title: '위치기반 서비스 이용약관',
    buttonText: '동의합니다',
    content: `서비스 내용\n• 내 주변 인연 추천: 현재 위치 기반으로 인근 회원 추천\n• 거리 정보 제공: 매칭 후보자와의 상대적 거리 표시\n• 위치 기반 맞춤형 콘텐츠 제공\n\n프라이버시 보호\n• 상세 주소나 실시간 이동 경로는 절대 공개하지 않음\n• 약 OOm 오차 범위의 거리 데이터 또는 행정동 단위로만 제공\n• 수집된 위치 데이터는 강력한 보안 알고리즘으로 암호화 저장\n\n동의 철회\n앱 내 [설정 > 위치 설정]에서 언제든지 철회 가능.\n\n동의하지 않아도 기본 매칭 서비스 이용이 가능합니다.`,
  },
  {
    id: 7,
    badge: 'optional',
    title: '마케팅 정보 수신 동의',
    buttonText: '동의합니다',
    content: `동의 시 아래와 같은 혜택 및 맞춤형 정보를 제공받으실 수 있습니다.\n\n제공 혜택\n• 맞춤형 인연 매칭 알림\n• 이벤트 및 프로모션 안내\n• 개인화된 콘텐츠 추천\n\n수신 방법 및 철회\n앱 내 [설정 > 알림 설정]에서 언제든지 수신 방법별로 변경하거나 철회 가능.\n\n야간(오후 9시 ~ 오전 8시)에는 광고성 정보를 발송하지 않습니다.\n\n동의하지 않아도 기본 매칭 서비스 이용이 가능합니다.`,
  },
];

const ALL_TERMS = [...REQUIRED_TERMS, ...OPTIONAL_TERMS];
const REQUIRED_IDS = REQUIRED_TERMS.map(t => t.id);

// ─── 체크 아이콘 컴포넌트 ───
const CheckIcon: React.FC<{size?: number; color?: string}> = ({
  size = 11,
  color = '#fff',
}) => (
  <Text style={{fontSize: size, color, fontWeight: '800'}}>✓</Text>
);

// ─── 약관 아이템 컴포넌트 ───
interface TermItemProps {
  term: TermData;
  isChecked: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onCheck: (val?: boolean) => void;
}

const TermItem: React.FC<TermItemProps> = ({
  term,
  isChecked,
  isOpen,
  onToggleOpen,
  onCheck,
}) => {
  return (
    <View style={styles.termItem}>
      {/* Header */}
      <TouchableOpacity
        style={styles.termHeader}
        activeOpacity={0.7}
        onPress={onToggleOpen}>
        <TouchableOpacity
          style={[styles.termCheck, isChecked && styles.termCheckChecked]}
          onPress={() => onCheck()}
          activeOpacity={0.7}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          {isChecked && <CheckIcon size={11} />}
        </TouchableOpacity>
        <View style={styles.termInfo}>
          <View style={styles.termBadgeRow}>
            <View
              style={[
                styles.termBadge,
                term.badge === 'required'
                  ? styles.badgeRequired
                  : styles.badgeOptional,
              ]}>
              <Text
                style={[
                  styles.termBadgeText,
                  term.badge === 'required'
                    ? styles.badgeRequiredText
                    : styles.badgeOptionalText,
                ]}>
                {term.badge === 'required' ? '필수' : '선택'}
              </Text>
            </View>
            <Text style={styles.termTitle}>{term.title}</Text>
          </View>
        </View>
        <Text style={[styles.termArrow, isOpen && styles.termArrowOpen]}>
          ▾
        </Text>
      </TouchableOpacity>

      {/* Body */}
      {isOpen && (
        <View style={styles.termBody}>
          <ScrollView
            style={styles.termScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator>
            <Text style={styles.termText}>{term.content}</Text>
          </ScrollView>
          <View style={styles.termAgreeRow}>
            <TouchableOpacity
              style={styles.btnDisagree}
              onPress={() => onCheck(false)}
              activeOpacity={0.7}>
              <Text style={styles.btnDisagreeText}>동의 안 함</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAgreeSm}
              onPress={() => onCheck(true)}
              activeOpacity={0.7}>
              <Text style={styles.btnAgreeSmText}>{term.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── 메인 스크린 컴포넌트 ───
const TermsAgreementScreen: React.FC = () => {
  const navigation = useNavigation();

  // 약관 동의 상태
  const [checkedTerms, setCheckedTerms] = useState<Record<number, boolean>>(
    () => {
      const init: Record<number, boolean> = {};
      ALL_TERMS.forEach(t => {
        init[t.id] = false;
      });
      return init;
    },
  );

  // 열린 약관 ID
  const [openTermId, setOpenTermId] = useState<number | null>(null);

  // 프로그레스 애니메이션
  const progressAnim = useRef(new Animated.Value(0)).current;

  // 필수 약관 완료 수
  const requiredDone = REQUIRED_IDS.filter(id => checkedTerms[id]).length;
  const allChecked = ALL_TERMS.every(t => checkedTerms[t.id]);
  const canProceed = REQUIRED_IDS.every(id => checkedTerms[id]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (requiredDone / REQUIRED_IDS.length) * 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [requiredDone, progressAnim]);

  const toggleTerm = useCallback((id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenTermId(prev => (prev === id ? null : id));
  }, []);

  const checkTerm = useCallback(
    (id: number, val?: boolean) => {
      setCheckedTerms(prev => {
        const newState = {...prev};
        newState[id] = val !== undefined ? val : !prev[id];
        return newState;
      });
      if (val === true) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenTermId(null);
      }
    },
    [],
  );

  const toggleAll = useCallback(() => {
    const newVal = !allChecked;
    setCheckedTerms(prev => {
      const newState = {...prev};
      ALL_TERMS.forEach(t => {
        newState[t.id] = newVal;
      });
      return newState;
    });
  }, [allChecked]);

  const handleNext = useCallback(() => {
    // navigation.navigate('ProfileSetup') 등으로 변경
    console.log('다음 단계로 이동');
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* ─── Header ─── */}
        <View style={styles.pageHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={styles.backBtnIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.pageLogo}>
            이<Text style={styles.pageLogoAccent}>프</Text>
          </Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1 / 3 단계</Text>
          </View>
        </View>

        {/* ─── Title ─── */}
        <View style={styles.titleBlock}>
          <View style={styles.titlePill}>
            <Text style={styles.titlePillText}>💜  약관 동의</Text>
          </View>
          <Text style={styles.pageTitle}>
            안전한 공간을 위한{'\n'}
            <Text style={styles.pageTitleAccent}>소중한 약속</Text>이에요
          </Text>
          <Text style={styles.pageSub}>
            아래 약관을 확인하고 동의해 주세요.{'\n'}필수 항목에 동의하셔야
            서비스를 이용할 수 있어요.
          </Text>
        </View>

        {/* ─── 모두 동의 ─── */}
        <View style={styles.allAgreeWrap}>
          <TouchableOpacity
            style={[
              styles.allAgreeBox,
              allChecked && styles.allAgreeBoxChecked,
            ]}
            onPress={toggleAll}
            activeOpacity={0.85}>
            <View
              style={[
                styles.allCheckIcon,
                allChecked && styles.allCheckIconChecked,
              ]}>
              {allChecked && (
                <CheckIcon size={13} color={COLORS.purple} />
              )}
            </View>
            <View style={styles.allAgreeTextWrap}>
              <Text style={styles.allAgreeTitle}>모두 동의하기 ✨</Text>
              <Text style={styles.allAgreeSub}>
                필수 및 선택 약관을 모두 동의해요
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── 필수 약관 ─── */}
        <View style={styles.termsSection}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>필수 동의</Text>
            <View style={styles.sectionLine} />
          </View>
          {REQUIRED_TERMS.map(term => (
            <TermItem
              key={term.id}
              term={term}
              isChecked={checkedTerms[term.id]}
              isOpen={openTermId === term.id}
              onToggleOpen={() => toggleTerm(term.id)}
              onCheck={(val) => checkTerm(term.id, val)}
            />
          ))}
        </View>

        {/* ─── 선택 약관 ─── */}
        <View style={[styles.termsSection, {paddingTop: 0}]}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>선택 동의</Text>
            <View style={styles.sectionLine} />
          </View>
          {OPTIONAL_TERMS.map(term => (
            <TermItem
              key={term.id}
              term={term}
              isChecked={checkedTerms[term.id]}
              isOpen={openTermId === term.id}
              onToggleOpen={() => toggleTerm(term.id)}
              onCheck={(val) => checkTerm(term.id, val)}
            />
          ))}
        </View>

        {/* 스크롤 하단 여백 */}
        <View style={{height: 120}} />
      </ScrollView>

      {/* ─── 하단 CTA (고정) ─── */}
      <View style={styles.ctaArea}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            필수 항목{' '}
            <Text style={styles.progressLabelAccent}>{requiredDone}</Text> / 5
            완료
          </Text>
          <Text style={styles.progressLabelRight}>다음: 프로필 설정</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, {width: progressWidth}]}
          />
        </View>
        <TouchableOpacity
          style={[styles.btnNext, !canProceed && styles.btnNextDisabled]}
          disabled={!canProceed}
          onPress={handleNext}
          activeOpacity={0.85}>
          <Text style={styles.btnNextArrow}>›</Text>
          <Text style={styles.btnNextText}>다음 단계로</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── 스타일시트 ───
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollBody: {
    flex: 1,
  },

  // Header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 0,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.purpleSoft,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnIcon: {
    fontSize: 22,
    color: COLORS.purple,
    fontWeight: '700',
    marginTop: -2,
  },
  pageLogo: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.t1,
    fontFamily: FONT_FAMILY,
    letterSpacing: -0.3,
  },
  pageLogoAccent: {
    color: COLORS.purple,
  },
  stepBadge: {
    backgroundColor: COLORS.purpleSoft,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.purple,
    fontFamily: FONT_FAMILY,
  },

  // Title
  titleBlock: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titlePill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.purpleSoft,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  titlePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.purpleMid,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.6,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.t1,
    fontFamily: FONT_FAMILY,
    letterSpacing: -0.9,
    lineHeight: 29,
    marginBottom: 6,
  },
  pageTitleAccent: {
    color: COLORS.purple,
  },
  pageSub: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.t2,
    fontFamily: FONT_FAMILY,
    lineHeight: 20,
  },

  // All agree
  allAgreeWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  allAgreeBox: {
    backgroundColor: COLORS.purple,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.purple,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  allAgreeBoxChecked: {
    backgroundColor: COLORS.purpleDeep,
  },
  allCheckIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCheckIconChecked: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'transparent',
  },
  allAgreeTextWrap: {
    flex: 1,
  },
  allAgreeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    fontFamily: FONT_FAMILY,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  allAgreeSub: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT_FAMILY,
  },

  // Section
  termsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.purple,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.6,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.purpleBorder,
  },

  // Term item
  termItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    marginBottom: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.purple,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  termCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.purpleBorder,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termCheckChecked: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.purple,
  },
  termInfo: {
    flex: 1,
  },
  termBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  termBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeRequired: {
    backgroundColor: COLORS.purpleSoft2,
  },
  badgeOptional: {
    backgroundColor: 'rgba(173,168,178,0.15)',
  },
  termBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: FONT_FAMILY,
  },
  badgeRequiredText: {
    color: COLORS.purpleMid,
  },
  badgeOptionalText: {
    color: COLORS.t3,
  },
  termTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.t1,
    fontFamily: FONT_FAMILY,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  termArrow: {
    fontSize: 14,
    color: COLORS.t3,
  },
  termArrowOpen: {
    transform: [{rotate: '180deg'}],
  },

  // Term body
  termBody: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  termScroll: {
    maxHeight: 160,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  termText: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.t2,
    fontFamily: FONT_FAMILY,
    lineHeight: 20,
  },
  termAgreeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 8,
  },
  btnDisagree: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnDisagreeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.t3,
    fontFamily: FONT_FAMILY,
  },
  btnAgreeSm: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.purple,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnAgreeSmText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    fontFamily: FONT_FAMILY,
  },

  // CTA
  ctaArea: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 12,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.t3,
    fontFamily: FONT_FAMILY,
  },
  progressLabelAccent: {
    color: COLORS.purple,
    fontWeight: '800',
  },
  progressLabelRight: {
    fontSize: 10,
    fontWeight: '400',
    color: COLORS.t3,
    fontFamily: FONT_FAMILY,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.purple,
    borderRadius: 4,
  },
  btnNext: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: COLORS.purple,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.purple,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  btnNextDisabled: {
    backgroundColor: COLORS.t3,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  btnNextArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  btnNextText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    fontFamily: FONT_FAMILY,
    letterSpacing: -0.3,
  },
});

export default TermsAgreementScreen;
