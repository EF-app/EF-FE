import React, {useState, useCallback, useMemo} from 'react';
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
  primary: '#9686BF',
  divider: '#EAE7E3',
  textPrimary: '#1C1A1F',
  textSecondary: '#6B6670',
  textMuted: '#ADA8B2',
  green: '#8BBFA8',
  greenBg: 'rgba(150,134,191,0.12)',
  danger: '#BF9696',
  dangerBg: '#F5ECEC',
  borderDefault: '#E8E4DF',
  borderFocus: '#9686BF',
  borderInvalid: '#D4A9A9',
};

const FONT = 'NanumSquareNeo';

// ─── 정규식 ───
const RE_ID = /^[a-zA-Z0-9]{4,16}$/;
const RE_PW = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

// ─── 비밀번호 강도 계산 ───
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

// ─── 상태 아이콘 컴포넌트 ───
const StatusIcon: React.FC<{type: 'ok' | 'err'}> = ({type}) => (
  <View style={[styles.statusCircle, type === 'ok' ? styles.statusOk : styles.statusErr]}>
    <Text style={{fontSize: 12, fontWeight: '800', color: type === 'ok' ? C.primary : C.danger}}>
      {type === 'ok' ? '✓' : '✕'}
    </Text>
  </View>
);

const AccountInputScreen: React.FC = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // ─── 아이디 검증 ───
  const idValid = RE_ID.test(userId);
  const idHint = useMemo((): {text: string; type: 'ok' | 'err'} | null => {
    if (!userId) return null;
    if (idValid) return {text: '사용 가능한 아이디입니다', type: 'ok'};
    if (userId.length < 4) return {text: '4자 이상 입력해 주세요', type: 'err'};
    if (userId.length > 16) return {text: '16자 이하로 입력해 주세요', type: 'err'};
    return {text: '영문과 숫자만 사용할 수 있습니다', type: 'err'};
  }, [userId, idValid]);

  // ─── 비밀번호 검증 ───
  const pwValid = RE_PW.test(password);
  const strength = password ? calcStrength(password) : 0;
  const pwHint = useMemo((): {text: string; type: 'ok' | 'err'} | null => {
    if (!password) return null;
    if (pwValid) return {text: '사용 가능한 비밀번호입니다', type: 'ok'};
    return {text: '영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요', type: 'err'};
  }, [password, pwValid]);

  // ─── 비밀번호 확인 ───
  const pw2Match = passwordConfirm.length > 0 && passwordConfirm === password;
  const pw2Valid = pw2Match && pwValid;
  const matchHint = useMemo((): {text: string; type: 'ok' | 'err'} | null => {
    if (!passwordConfirm) return null;
    if (pw2Match) return {text: '비밀번호가 일치합니다', type: 'ok'};
    return {text: '비밀번호가 일치하지 않습니다', type: 'err'};
  }, [passwordConfirm, pw2Match]);

  const canProceed = idValid && pwValid && pw2Valid;

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    // TODO: Zustand store에 userId/password 저장
    // navigation.navigate('Nickname');
    console.log('다음: 닉네임 설정');
  }, [canProceed]);

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
          contentContainerStyle={{paddingBottom: 40}}>

          {/* ─── 앱 헤더 ─── */}
          <View style={styles.appHeader}>
            <View style={styles.logoMark}>
              <Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>◇</Text>
            </View>
            <Text style={styles.appName}>이프</Text>
          </View>

          {/* ─── Content ─── */}
          <View style={styles.content}>
            <Text style={styles.eyebrow}>회원가입</Text>
            <Text style={styles.pageTitle}>가입 정보 입력</Text>
            <Text style={styles.pageSub}>계정 생성을 위해 정보를 입력해 주세요</Text>

            {/* ─── 아이디 ─── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>아이디</Text>
              <View style={styles.fieldWrap}>
                <TextInput
                  style={[
                    styles.inputField,
                    userId && !idValid && styles.inputInvalid,
                  ]}
                  placeholder="영문, 숫자 포함 4–16자"
                  placeholderTextColor={C.textMuted}
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={16}
                />
                {userId.length > 0 && (
                  <StatusIcon type={idValid ? 'ok' : 'err'} />
                )}
              </View>
              {idHint && (
                <Text style={[styles.fieldHint, idHint.type === 'ok' ? styles.hintOk : styles.hintErr]}>
                  {idHint.text}
                </Text>
              )}
            </View>

            {/* ─── 비밀번호 ─── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>비밀번호</Text>
              <View style={styles.fieldWrap}>
                <TextInput
                  style={[
                    styles.inputField,
                    {paddingRight: 80},
                    password && !pwValid && styles.inputInvalid,
                  ]}
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                  placeholderTextColor={C.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPw(!showPw)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={[styles.eyeIcon, showPw && {opacity: 0.5}]}>👁</Text>
                </TouchableOpacity>
                {password.length > 0 && (
                  <StatusIcon type={pwValid ? 'ok' : 'err'} />
                )}
              </View>
              {pwHint && (
                <Text style={[styles.fieldHint, pwHint.type === 'ok' ? styles.hintOk : styles.hintErr]}>
                  {pwHint.text}
                </Text>
              )}
            </View>

            {/* ─── 비밀번호 강도 ─── */}
            <View style={styles.strengthWrap}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>비밀번호 강도</Text>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.strengthLabelRow}>
                <Text
                  style={[
                    styles.strengthLabel,
                    password && strength > 0 && {color: STRENGTH_COLORS[strength - 1]},
                  ]}>
                  {password ? (STRENGTH_LABELS[strength - 1] || '약함') : '—'}
                </Text>
              </View>
              <View style={styles.bars}>
                {[0, 1, 2, 3].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      password && i < strength && {backgroundColor: STRENGTH_COLORS[strength - 1]},
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* ─── 비밀번호 재입력 ─── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>비밀번호 재입력</Text>
              <View style={styles.fieldWrap}>
                <TextInput
                  style={[styles.inputField, {paddingRight: 52}]}
                  placeholder="비밀번호를 다시 입력하세요"
                  placeholderTextColor={C.textMuted}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!showPw2}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPw2(!showPw2)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={[styles.eyeIcon, showPw2 && {opacity: 0.5}]}>👁</Text>
                </TouchableOpacity>
              </View>
              {matchHint && (
                <Text style={[styles.fieldHint, matchHint.type === 'ok' ? styles.hintOk : styles.hintErr]}>
                  {matchHint.text}
                </Text>
              )}
            </View>

            {/* ─── 다음 버튼 ─── */}
            <TouchableOpacity
              style={[styles.btnNext, canProceed && styles.btnNextActive]}
              disabled={!canProceed}
              onPress={handleNext}
              activeOpacity={0.85}>
              <Text style={[styles.btnNextText, canProceed && {color: '#fff'}]}>
                다음으로
              </Text>
              <Text style={{color: canProceed ? '#fff' : '#B0ABB5', fontSize: 16}}>›</Text>
            </TouchableOpacity>

            {/* ─── 로그인 링크 ─── */}
            <Text style={styles.loginLink}>
              이미 계정이 있으신가요?{' '}
              <Text
                style={styles.loginLinkAccent}
                onPress={() => {
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

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},

  appHeader: {
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 14 : 20,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  appName: {fontSize: 15, fontWeight: '800', color: C.textPrimary, fontFamily: FONT},

  content: {paddingHorizontal: 28, paddingTop: 32, paddingBottom: 40},

  eyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary,
    fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 26, fontWeight: '400', color: C.textPrimary, fontFamily: FONT,
    letterSpacing: -0.5, lineHeight: 31, marginBottom: 6,
  },
  pageSub: {
    fontSize: 13.5, fontWeight: '400', color: C.textSecondary, fontFamily: FONT,
    lineHeight: 22, marginBottom: 32,
  },

  fieldGroup: {marginBottom: 18},
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: C.textMuted, fontFamily: FONT,
    letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase',
  },
  fieldWrap: {position: 'relative', flexDirection: 'row', alignItems: 'center'},

  inputField: {
    flex: 1, backgroundColor: C.surface, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 16, paddingRight: 44,
    fontFamily: FONT, fontSize: 14, fontWeight: '400', color: C.textPrimary,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  inputInvalid: {borderColor: C.borderInvalid},

  statusCircle: {
    position: 'absolute', right: 10,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  statusOk: {backgroundColor: C.greenBg},
  statusErr: {backgroundColor: C.dangerBg},

  eyeBtn: {position: 'absolute', right: 44, padding: 4},
  eyeIcon: {fontSize: 14},

  fieldHint: {
    fontSize: 11.5, fontWeight: '400', fontFamily: FONT,
    marginTop: 6, paddingLeft: 2,
  },
  hintOk: {color: C.primary},
  hintErr: {color: C.danger},

  strengthWrap: {marginBottom: 28},
  dividerRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12},
  dividerLine: {flex: 1, height: 1, backgroundColor: C.divider},
  dividerText: {fontSize: 11, color: C.textMuted, fontWeight: '400', fontFamily: FONT},
  strengthLabelRow: {alignItems: 'flex-end', marginBottom: 6},
  strengthLabel: {fontSize: 12, fontWeight: '700', color: C.textMuted, fontFamily: FONT},
  bars: {flexDirection: 'row', gap: 4},
  bar: {flex: 1, height: 3, borderRadius: 2, backgroundColor: C.divider},

  btnNext: {
    width: '100%', backgroundColor: '#E8E5E1', borderRadius: 14,
    paddingVertical: 16.5,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 8,
  },
  btnNextActive: {
    backgroundColor: C.primary,
    ...Platform.select({
      ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24},
      android: {elevation: 8},
    }),
  },
  btnNextText: {
    fontSize: 15, fontWeight: '800', color: '#B0ABB5',
    fontFamily: FONT, letterSpacing: 0.2,
  },

  loginLink: {
    textAlign: 'center', fontSize: 13, fontWeight: '400',
    color: C.textMuted, fontFamily: FONT, marginTop: 20, lineHeight: 21,
  },
  loginLinkAccent: {color: C.primary, fontWeight: '700'},
});

export default AccountInputScreen;
