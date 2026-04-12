import React, {useState, useCallback, useMemo} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, StatusBar, KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const C = {
  bg: '#F5F3F1', surface: '#FFFFFF',
  primary: '#9686BF', divider: '#EAE7E3',
  textPrimary: '#1C1A1F', textSecondary: '#6B6670', textMuted: '#ADA8B2',
  green: '#8BBFA8', greenBg: 'rgba(150,134,191,0.12)',
  danger: '#BF9696', dangerBg: '#F5ECEC', borderInvalid: '#D4A9A9',
};
const FONT = 'NanumSquareNeo';

const RE_PW = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const calcStrength = (pw: string): number => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) s++;
  return s;
};

const STRENGTH_COLORS = ['#BF9696', '#C4885A', '#9686BF', '#8BBFA8'];
const STRENGTH_LABELS = ['약함', '보통', '강함', '매우 강함'];

const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const pwValid = RE_PW.test(password);
  const strength = password ? calcStrength(password) : 0;

  const pwHint = useMemo((): {text: string; type: 'ok' | 'err'} | null => {
    if (!password) return null;
    if (pwValid) return {text: '사용 가능한 비밀번호입니다', type: 'ok'};
    return {text: '영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요', type: 'err'};
  }, [password, pwValid]);

  const pw2Match = passwordConfirm.length > 0 && passwordConfirm === password;
  const pw2Valid = pw2Match && pwValid;
  const matchHint = useMemo((): {text: string; type: 'ok' | 'err'} | null => {
    if (!passwordConfirm) return null;
    if (pw2Match) return {text: '비밀번호가 일치합니다', type: 'ok'};
    return {text: '비밀번호가 일치하지 않습니다', type: 'err'};
  }, [passwordConfirm, pw2Match]);

  const canProceed = pwValid && pw2Valid;

  const handleSubmit = useCallback(async () => {
    if (!canProceed) return;
    // TODO: api.post('/auth/reset-password', { userId, newPassword: password })
    // const { data } = await api.post('/auth/reset-password', { ...routeParams, password });
    setIsComplete(true);
    // 성공 후 로그인 화면으로 이동
    // setTimeout(() => navigation.navigate('Login'), 1500);
  }, [canProceed, password]);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom: 40}}>
          {/* 앱 헤더 */}
          <View style={s.appHeader}>
            <View style={s.logoMark}><Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>◇</Text></View>
            <Text style={s.appName}>이프</Text>
          </View>

          <View style={s.content}>
            <Text style={s.eyebrow}>비밀번호 재설정</Text>
            <Text style={s.pageTitle}>새 비밀번호 설정</Text>
            <Text style={s.pageSub}>안전한 비밀번호로 변경해 주세요</Text>

            {/* ─── 비밀번호 ─── */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>새 비밀번호</Text>
              <View style={s.fieldWrap}>
                <TextInput
                  style={[s.inputField, {paddingRight: 80}, password && !pwValid && s.inputInvalid]}
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                  placeholderTextColor={C.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw(!showPw)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={[{fontSize: 14}, showPw && {opacity: 0.4}]}>👁</Text>
                </TouchableOpacity>
                {password.length > 0 && (
                  <View style={[s.statusCircle, pwValid ? s.statusOk : s.statusErr]}>
                    <Text style={{fontSize: 12, fontWeight: '800', color: pwValid ? C.primary : C.danger}}>
                      {pwValid ? '✓' : '✕'}
                    </Text>
                  </View>
                )}
              </View>
              {pwHint && (
                <Text style={[s.fieldHint, pwHint.type === 'ok' ? s.hintOk : s.hintErr]}>{pwHint.text}</Text>
              )}
            </View>

            {/* ─── 비밀번호 강도 ─── */}
            <View style={s.strengthWrap}>
              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>비밀번호 강도</Text>
                <View style={s.dividerLine} />
              </View>
              <View style={{alignItems: 'flex-end', marginBottom: 6}}>
                <Text style={[s.strengthLabel, password && strength > 0 && {color: STRENGTH_COLORS[strength - 1]}]}>
                  {password ? (STRENGTH_LABELS[strength - 1] || '약함') : '—'}
                </Text>
              </View>
              <View style={s.bars}>
                {[0, 1, 2, 3].map(i => (
                  <View key={i} style={[s.bar, password && i < strength && {backgroundColor: STRENGTH_COLORS[strength - 1]}]} />
                ))}
              </View>
            </View>

            {/* ─── 비밀번호 재입력 ─── */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>새 비밀번호 재입력</Text>
              <View style={s.fieldWrap}>
                <TextInput
                  style={[s.inputField, {paddingRight: 52}]}
                  placeholder="비밀번호를 다시 입력하세요"
                  placeholderTextColor={C.textMuted}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!showPw2}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw2(!showPw2)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={[{fontSize: 14}, showPw2 && {opacity: 0.4}]}>👁</Text>
                </TouchableOpacity>
              </View>
              {matchHint && (
                <Text style={[s.matchHint, matchHint.type === 'ok' ? s.hintOk : s.hintErr]}>{matchHint.text}</Text>
              )}
            </View>

            {/* ─── 제출 버튼 ─── */}
            <TouchableOpacity
              style={[s.btnNext, canProceed && !isComplete && s.btnNextActive, isComplete && s.btnComplete]}
              disabled={!canProceed || isComplete}
              onPress={handleSubmit}
              activeOpacity={0.85}>
              <Text style={[s.btnNextText, (canProceed || isComplete) && {color: '#fff'}]}>
                {isComplete ? '완료! ✓' : '비밀번호 변경'}
              </Text>
              {!isComplete && <Text style={{color: canProceed ? '#fff' : '#B0ABB5', fontSize: 16}}>›</Text>}
            </TouchableOpacity>

            <Text style={s.loginLink}>
              비밀번호가 기억나셨나요?{' '}
              <Text style={s.loginLinkAccent} onPress={() => {
                // navigation.navigate('Login');
              }}>
                로그인
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  appHeader: {paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 14 : 20, flexDirection: 'row', alignItems: 'center', gap: 10},
  logoMark: {width: 34, height: 34, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center'},
  appName: {fontSize: 15, fontWeight: '800', color: C.textPrimary, fontFamily: FONT},
  content: {paddingHorizontal: 28, paddingTop: 32},
  eyebrow: {fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary, fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase'},
  pageTitle: {fontSize: 26, fontWeight: '400', color: C.textPrimary, fontFamily: FONT, letterSpacing: -0.5, lineHeight: 31, marginBottom: 6},
  pageSub: {fontSize: 13.5, fontWeight: '400', color: C.textSecondary, fontFamily: FONT, lineHeight: 22, marginBottom: 32},

  fieldGroup: {marginBottom: 18},
  fieldLabel: {fontSize: 11, fontWeight: '700', color: C.textMuted, fontFamily: FONT, letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase'},
  fieldWrap: {position: 'relative', flexDirection: 'row', alignItems: 'center'},
  inputField: {flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 15, paddingHorizontal: 16, fontFamily: FONT, fontSize: 14, color: C.textPrimary, borderWidth: 1.5, borderColor: 'transparent'},
  inputInvalid: {borderColor: C.borderInvalid},

  eyeBtn: {position: 'absolute', right: 44, padding: 4},
  statusCircle: {position: 'absolute', right: 10, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  statusOk: {backgroundColor: C.greenBg},
  statusErr: {backgroundColor: C.dangerBg},

  fieldHint: {fontSize: 11.5, fontWeight: '400', fontFamily: FONT, marginTop: 6, paddingLeft: 2},
  hintOk: {color: C.primary},
  hintErr: {color: C.danger},
  matchHint: {fontSize: 12, fontWeight: '700', fontFamily: FONT, marginTop: 8, paddingLeft: 2},

  strengthWrap: {marginBottom: 28},
  dividerRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12},
  dividerLine: {flex: 1, height: 1, backgroundColor: C.divider},
  dividerText: {fontSize: 11, color: C.textMuted, fontWeight: '400', fontFamily: FONT},
  strengthLabel: {fontSize: 12, fontWeight: '700', color: C.textMuted, fontFamily: FONT},
  bars: {flexDirection: 'row', gap: 4},
  bar: {flex: 1, height: 3, borderRadius: 2, backgroundColor: C.divider},

  btnNext: {width: '100%', backgroundColor: '#E8E5E1', borderRadius: 14, paddingVertical: 16.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8},
  btnNextActive: {backgroundColor: C.primary, ...Platform.select({ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24}, android: {elevation: 8}})},
  btnComplete: {backgroundColor: C.green, ...Platform.select({ios: {shadowColor: C.green, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.35, shadowRadius: 24}, android: {elevation: 8}})},
  btnNextText: {fontSize: 15, fontWeight: '800', color: '#B0ABB5', fontFamily: FONT, letterSpacing: 0.2},

  loginLink: {textAlign: 'center', fontSize: 13, fontWeight: '400', color: C.textMuted, fontFamily: FONT, marginTop: 20, lineHeight: 21},
  loginLinkAccent: {color: C.primary, fontWeight: '700'},
});

export default PasswordResetScreen;
