import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// ─── 색상 테마 ───
const C = {
  bg: '#F5F3F1',
  surface: '#FFFFFF',
  surface2: '#EDEAE7',
  primary: '#9686BF',
  primaryLight: '#EDE9F6',
  textMain: '#1C1A1F',
  textSub: '#7B7683',
  textHint: '#ADA8B6',
  radius: 14,
  radiusSm: 10,
};

const FONT = 'NanumSquareNeo';

// ─── 전화번호 포맷팅 ───
const formatPhone = (raw: string): string => {
  const v = raw.replace(/\D/g, '');
  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
};

const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRef = useRef<TextInput>(null);

  const phoneDigits = phone.replace(/\D/g, '');
  const canProceed = phoneDigits.length >= 10 && otp.length === 6;

  // ─── 타이머 ───
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
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

  const timerText = timerSeconds > 0
    ? `${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(timerSeconds % 60).padStart(2, '0')}`
    : '만료됨';

  // ─── 인증번호 전송 ───
  const sendCode = useCallback(() => {
    if (phoneDigits.length < 10) return;
    // TODO: Axios로 백엔드 API 호출
    // await api.post('/auth/send-code', { phone: phoneDigits });
    setCodeSent(true);
    setTimerSeconds(179);
    setTimerActive(true);
    otpRef.current?.focus();
  }, [phoneDigits]);

  // ─── 인증번호 확인 ───
  const verifyCode = useCallback(() => {
    if (otp.length !== 6) return;
    // TODO: Axios로 백엔드 API 호출
    // await api.post('/auth/verify-code', { phone: phoneDigits, code: otp });
    setVerified(true);
  }, [otp]);

  // ─── 다음 단계 ───
  const handleNext = useCallback(() => {
    if (!canProceed) return;
    // navigation.navigate('AccountInput');
    console.log('다음: 계정입력');
  }, [canProceed]);

  // ─── 전화번호 입력 처리 ───
  const handlePhoneChange = useCallback((text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}>

          {/* ─── Nav ─── */}
          <View style={styles.nav}>
            <TouchableOpacity
              style={styles.navBack}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}>
              <Text style={styles.navBackIcon}>‹</Text>
            </TouchableOpacity>
          </View>

          {/* ─── Content ─── */}
          <View style={styles.content}>
            <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
            <Text style={styles.title}>핸드폰 번호{'\n'}인증</Text>
            <Text style={styles.subtitle}>
              간편하고 안전한 본인 확인을 위해{'\n'}번호를 입력해 주세요
            </Text>

            {/* 프로그레스 dots */}
            <View style={styles.progress}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            {/* ─── 휴대폰 번호 ─── */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>휴대폰 번호</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrap}>
                  <Text style={styles.flag}>🇰🇷</Text>
                  <View style={styles.dividerV} />
                  <TextInput
                    style={styles.input}
                    placeholder="010-0000-0000"
                    placeholderTextColor={C.textHint}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={13}
                  />
                </View>
                <TouchableOpacity
                  style={styles.btnVerify}
                  onPress={sendCode}
                  activeOpacity={0.7}>
                  <Text style={styles.btnVerifyText}>인증</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ─── 인증번호 ─── */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>인증번호</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrap}>
                  <TextInput
                    ref={otpRef}
                    style={styles.input}
                    placeholder="6자리 입력"
                    placeholderTextColor={C.textHint}
                    value={otp}
                    onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={verifyCode}
                  activeOpacity={0.7}>
                  <Text style={styles.btnConfirmText}>확인</Text>
                </TouchableOpacity>
              </View>

              {codeSent && (
                <View style={styles.timerRow}>
                  <Text style={styles.timerIcon}>⏱</Text>
                  <Text style={styles.timerText}>{timerText}</Text>
                </View>
              )}
            </View>

            {/* ─── 안내 카드 ─── */}
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>!</Text>
              </View>
              <Text style={styles.infoText}>
                위 인증을 통해{' '}
                <Text style={styles.infoTextBold}>여성인증, 성인인증, 본인인증</Text>
                을 진행합니다.{'\n'}나이, 성별 외의 정보는 수집하지 않습니다.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ─── CTA ─── */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={[styles.btnCta, canProceed && styles.btnCtaActive]}
            disabled={!canProceed}
            onPress={handleNext}
            activeOpacity={0.85}>
            <Text style={[styles.btnCtaText, canProceed && styles.btnCtaTextActive]}>
              다음으로
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},

  nav: {paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20},
  navBack: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  navBackIcon: {fontSize: 22, color: C.textMain, fontWeight: '700', marginTop: -2},

  content: {paddingHorizontal: 24, paddingTop: 32},

  stepLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.4,
    color: C.primary, fontFamily: FONT, marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24, fontWeight: '400', color: C.textMain,
    fontFamily: FONT, lineHeight: 32, letterSpacing: -0.3, marginBottom: 6,
  },
  subtitle: {
    fontSize: 13, fontWeight: '400', color: C.textSub,
    fontFamily: FONT, lineHeight: 21, marginBottom: 36,
  },

  progress: {flexDirection: 'row', gap: 5, marginBottom: 36},
  dot: {height: 3, width: 8, borderRadius: 2, backgroundColor: C.surface2},
  dotActive: {width: 24, backgroundColor: C.primary},

  formGroup: {marginBottom: 14},
  fieldLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.7,
    color: C.textHint, fontFamily: FONT, marginBottom: 8,
    textTransform: 'uppercase',
  },

  inputRow: {flexDirection: 'row', gap: 8},
  inputWrap: {
    flex: 1, backgroundColor: C.surface, borderRadius: C.radius,
    paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  flag: {fontSize: 18},
  dividerV: {width: 1, height: 16, backgroundColor: C.surface2},
  input: {
    flex: 1, fontSize: 14, fontWeight: '400', color: C.textMain,
    fontFamily: FONT, padding: 0,
  },

  btnVerify: {
    backgroundColor: C.primary, borderRadius: C.radiusSm,
    paddingHorizontal: 18, justifyContent: 'center',
  },
  btnVerifyText: {fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: FONT},

  btnConfirm: {
    backgroundColor: C.primaryLight, borderRadius: C.radiusSm,
    paddingHorizontal: 18, justifyContent: 'center',
  },
  btnConfirmText: {fontSize: 13, fontWeight: '700', color: C.primary, fontFamily: FONT},

  timerRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 7, paddingLeft: 2},
  timerIcon: {fontSize: 12, color: C.primary},
  timerText: {fontSize: 12, fontWeight: '700', color: C.primary, fontFamily: FONT},

  infoCard: {
    backgroundColor: C.surface, borderRadius: C.radius,
    padding: 16, marginTop: 28,
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
  },
  infoIcon: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  infoIconText: {fontSize: 10, fontWeight: '800', color: C.primary},
  infoText: {
    flex: 1, fontSize: 12, fontWeight: '400', color: C.textSub,
    fontFamily: FONT, lineHeight: 20,
  },
  infoTextBold: {fontWeight: '700', color: C.textMain},

  ctaWrap: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 16,
    backgroundColor: C.bg,
  },
  btnCta: {
    width: '100%', backgroundColor: '#E8E5E1', borderRadius: C.radius,
    paddingVertical: 17, alignItems: 'center', justifyContent: 'center',
  },
  btnCtaActive: {
    backgroundColor: C.primary,
    ...Platform.select({
      ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24},
      android: {elevation: 8},
    }),
  },
  btnCtaText: {fontSize: 15, fontWeight: '700', color: '#B0ABB5', fontFamily: FONT},
  btnCtaTextActive: {color: '#fff'},
});

export default PhoneVerificationScreen;
