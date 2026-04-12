import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, StatusBar, KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const C = {
  bg: '#F5F3F1', surface: '#FFFFFF', surface2: '#EDEAE7',
  primary: '#9686BF', primaryLight: '#EDE9F6', primaryTint: 'rgba(150,134,191,0.10)',
  divider: '#EAE7E3',
  textMain: '#1C1A1F', textSub: '#7B7683', textHint: '#ADA8B6',
  danger: '#BF9696', dangerBg: '#F5ECEC', green: '#8BBFA8',
};
const FONT = 'NanumSquareNeo';

const formatPhone = (raw: string): string => {
  const v = raw.replace(/\D/g, '');
  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
};

const ForgotPasswordVerifyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRef = useRef<TextInput>(null);

  const phoneDigits = phone.replace(/\D/g, '');
  const canSendCode = userId.trim().length > 0 && phoneDigits.length >= 10;

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) { clearInterval(timerRef.current!); setTimerActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const timerText = timerSeconds > 0
    ? `${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(timerSeconds % 60).padStart(2, '0')}`
    : '만료됨';

  const sendCode = useCallback(() => {
    if (!canSendCode) return;
    // TODO: api.post('/auth/forgot-pw/send', { userId, phone: phoneDigits })
    // 서버에서 아이디+번호 매칭 확인 후 코드 발송
    setCodeSent(true);
    setOtpVerified(false);
    setOtpError(false);
    setOtp('');
    setTimerSeconds(179);
    setTimerActive(true);
    otpRef.current?.focus();
  }, [canSendCode, userId, phoneDigits]);

  const verifyOtp = useCallback(() => {
    if (otp.length !== 6) return;
    // TODO: api.post('/auth/forgot-pw/verify', { userId, phone: phoneDigits, code: otp })
    const isValid = otp === '123456'; // 더미
    if (isValid) {
      setOtpVerified(true);
      setOtpError(false);
      clearInterval(timerRef.current!);
      setTimerActive(false);
    } else {
      setOtpError(true);
      setOtp('');
    }
  }, [otp, userId, phoneDigits]);

  const handleNext = useCallback(() => {
    if (!otpVerified) return;
    // navigation.navigate('PasswordReset', { userId, phone: phoneDigits });
    console.log('비밀번호 재설정 화면으로');
  }, [otpVerified, userId, phoneDigits]);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow: 1}}>
          {/* 앱 헤더 */}
          <View style={s.appHeader}>
            <View style={s.logoMark}><Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>◇</Text></View>
            <Text style={s.appName}>이프</Text>
          </View>
          <View style={s.nav}>
            <TouchableOpacity style={s.navBack} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={{fontSize: 22, color: C.textMain, fontWeight: '700', marginTop: -2}}>‹</Text>
            </TouchableOpacity>
          </View>

          <View style={s.content}>
            <Text style={s.stepLabel}>비밀번호 재설정</Text>
            <Text style={s.title}>번호 인증으로{'\n'}본인을 확인해요</Text>
            <Text style={s.subtitle}>가입 시 등록한 아이디와 휴대폰 번호로{'\n'}본인 인증을 진행합니다.</Text>

            {/* ① 아이디 */}
            <View style={s.formGroup}>
              <Text style={s.fieldLabel}>아이디</Text>
              <TextInput
                style={s.inputSolo}
                placeholder="가입한 아이디를 입력하세요"
                placeholderTextColor={C.textHint}
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* ② 핸드폰 번호 */}
            <View style={s.formGroup}>
              <Text style={s.fieldLabel}>휴대폰 번호</Text>
              <View style={s.inputRow}>
                <View style={s.inputWrap}>
                  <Text style={{fontSize: 18}}>🇰🇷</Text>
                  <View style={s.dividerV} />
                  <TextInput style={s.input} placeholder="010-0000-0000" placeholderTextColor={C.textHint}
                    value={phone} onChangeText={t => setPhone(formatPhone(t))}
                    keyboardType="phone-pad" maxLength={13} />
                </View>
                <TouchableOpacity
                  style={[s.btnAction, !canSendCode && {opacity: 0.5}]}
                  onPress={sendCode}
                  disabled={!canSendCode}
                  activeOpacity={0.7}>
                  <Text style={s.btnActionText}>인증</Text>
                </TouchableOpacity>
              </View>
              {otpVerified && (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7, paddingLeft: 2}}>
                  <Text style={{fontSize: 12, color: C.green}}>✓</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: C.green, fontFamily: FONT}}>핸드폰 번호 인증 완료</Text>
                </View>
              )}
            </View>

            {/* ③ 인증번호 */}
            <View style={[s.formGroup, !codeSent && {opacity: 0.4}]} pointerEvents={codeSent ? 'auto' : 'none'}>
              <Text style={s.fieldLabel}>인증번호</Text>
              <View style={s.inputRow}>
                <View style={[s.inputWrap, otpError && {borderColor: C.danger}]}>
                  <TextInput ref={otpRef} style={s.input} placeholder="6자리 입력" placeholderTextColor={C.textHint}
                    value={otp} onChangeText={t => { setOtp(t.replace(/\D/g, '').slice(0, 6)); setOtpError(false); }}
                    keyboardType="number-pad" maxLength={6} />
                </View>
                <TouchableOpacity style={s.btnConfirmSm} onPress={verifyOtp} activeOpacity={0.7}>
                  <Text style={{fontSize: 13, fontWeight: '700', color: C.primary, fontFamily: FONT}}>확인</Text>
                </TouchableOpacity>
              </View>
              {codeSent && timerSeconds > 0 && !otpVerified && (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 7, paddingLeft: 2}}>
                  <Text style={{fontSize: 12}}>⏱</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: C.primary, fontFamily: FONT}}>{timerText}</Text>
                </View>
              )}
              {otpError && (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingLeft: 2}}>
                  <Text style={{fontSize: 13}}>⚠</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: C.danger, fontFamily: FONT}}>인증번호가 틀렸습니다</Text>
                </View>
              )}
            </View>

            {/* ④ 안내 카드 */}
            <View style={s.infoCard}>
              <View style={s.infoIcon}><Text style={{fontSize: 10, fontWeight: '800', color: C.primary}}>!</Text></View>
              <Text style={s.infoText}>
                <Text style={{fontWeight: '700', color: C.textMain}}>비밀번호 재설정</Text>을 위한 휴대폰 번호 인증을 진행합니다.{'\n'}
                가입 시 사용한 아이디와 번호가 일치해야 합니다.
              </Text>
            </View>

            {/* ⑤ 아이디 잊으셨나요? */}
            <View style={{alignItems: 'center', marginTop: 16}}>
              <TouchableOpacity onPress={() => {
                // navigation.navigate('AccountVerify');
              }}>
                <Text style={{fontSize: 12.5, fontWeight: '400', color: C.textSub, fontFamily: FONT}}>아이디를 잊으셨나요?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={s.ctaWrap}>
          <TouchableOpacity style={[s.btnCta, otpVerified && s.btnCtaActive]} disabled={!otpVerified} onPress={handleNext} activeOpacity={0.85}>
            <Text style={[s.btnCtaText, otpVerified && {color: '#fff'}]}>다음으로</Text>
            <Text style={{color: otpVerified ? '#fff' : '#B0ABB5', fontSize: 16}}>›</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  appHeader: {paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 14 : 20, flexDirection: 'row', alignItems: 'center', gap: 10},
  logoMark: {width: 34, height: 34, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center'},
  appName: {fontSize: 15, fontWeight: '800', color: C.textMain, fontFamily: FONT},
  nav: {paddingHorizontal: 24, paddingTop: 16},
  navBack: {width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center'},
  content: {paddingHorizontal: 24, paddingTop: 28},
  stepLabel: {fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary, fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase'},
  title: {fontSize: 24, fontWeight: '400', color: C.textMain, fontFamily: FONT, lineHeight: 32, letterSpacing: -0.3, marginBottom: 6},
  subtitle: {fontSize: 13, fontWeight: '400', color: C.textSub, fontFamily: FONT, lineHeight: 21, marginBottom: 32},
  formGroup: {marginBottom: 14},
  fieldLabel: {fontSize: 11, fontWeight: '700', letterSpacing: 0.7, color: C.textHint, fontFamily: FONT, marginBottom: 8, textTransform: 'uppercase'},
  inputSolo: {backgroundColor: C.surface, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 16, fontFamily: FONT, fontSize: 14, color: C.textMain, borderWidth: 1.5, borderColor: 'transparent'},
  inputRow: {flexDirection: 'row', gap: 8},
  inputWrap: {flex: 1, backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: 'transparent'},
  dividerV: {width: 1, height: 16, backgroundColor: C.surface2},
  input: {flex: 1, fontSize: 14, fontWeight: '400', color: C.textMain, fontFamily: FONT, padding: 0},
  btnAction: {backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 18, justifyContent: 'center'},
  btnActionText: {fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: FONT},
  btnConfirmSm: {backgroundColor: C.primaryLight, borderRadius: 10, paddingHorizontal: 18, justifyContent: 'center'},
  infoCard: {backgroundColor: C.surface, borderRadius: 14, padding: 16, marginTop: 24, flexDirection: 'row', alignItems: 'flex-start', gap: 10},
  infoIcon: {width: 18, height: 18, borderRadius: 9, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center'},
  infoText: {flex: 1, fontSize: 12, fontWeight: '400', color: C.textSub, fontFamily: FONT, lineHeight: 20},
  ctaWrap: {paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 24, paddingTop: 16, backgroundColor: C.bg},
  btnCta: {width: '100%', backgroundColor: '#E8E5E1', borderRadius: 14, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8},
  btnCtaActive: {backgroundColor: C.primary, ...Platform.select({ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24}, android: {elevation: 8}})},
  btnCtaText: {fontSize: 15, fontWeight: '800', color: '#B0ABB5', fontFamily: FONT},
});

export default ForgotPasswordVerifyScreen;
