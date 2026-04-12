import React, {useState, useCallback} from 'react';
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
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const C = {
  bg: '#F5F3F1',
  surface: '#FFFFFF',
  surface2: '#EDEAE7',
  primary: '#9686BF',
  primaryTint: 'rgba(150,134,191,0.10)',
  divider: '#EAE7E3',
  textPrimary: '#1C1A1F',
  textSecondary: '#6B6670',
  textMuted: '#ADA8B2',
  danger: '#BF9696',
  dangerBg: '#F5ECEC',
  borderInvalid: '#D4A9A9',
};
const FONT = 'NanumSquareNeo';
const MAX_FAIL = 5;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);

  const hasInput = userId.trim().length > 0 && password.length > 0;
  const canLogin = hasInput && !isLocked && !isLoading;

  // ─── 필드 입력 시 에러 초기화 ───
  const handleIdChange = useCallback((text: string) => {
    setUserId(text);
    if (showError) {
      setShowError(false);
      setInputInvalid(false);
    }
  }, [showError]);

  const handlePwChange = useCallback((text: string) => {
    setPassword(text);
    if (showError) {
      setShowError(false);
      setInputInvalid(false);
    }
  }, [showError]);

  // ─── 로그인 ───
  const doLogin = useCallback(async () => {
    if (!canLogin) return;

    setIsLoading(true);

    try {
      // TODO: Axios + TanStack Query로 교체
      // const { data } = await api.post('/auth/login', { userId, password });
      // if (data.success) { ... }

      // 더미 로직 (삭제 예정)
      const isValid = false; // 실제 API 응답으로 교체

      if (isValid) {
        // 로그인 성공 → Zustand에 토큰 저장 후 메인 화면 이동
        // useAuthStore.getState().setToken(data.token);
        // navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        // 실패 처리
        const newCount = failCount + 1;
        setFailCount(newCount);
        setPassword('');
        setInputInvalid(true);

        if (newCount >= MAX_FAIL) {
          setIsLocked(true);
          setShowError(false);
        } else {
          setShowError(true);
        }
      }
    } catch (error) {
      setShowError(true);
      setInputInvalid(true);
    } finally {
      setIsLoading(false);
    }
  }, [canLogin, userId, password, failCount]);

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

          {/* ─── 앱 헤더 ─── */}
          <View style={styles.appHeader}>
            <View style={styles.logoMark}>
              <Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>◇</Text>
            </View>
            <Text style={styles.appName}>이프</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.eyebrow}>로그인</Text>
            <Text style={styles.pageTitle}>다시 만나서{'\n'}반가워요</Text>
            <Text style={styles.pageSub}>계속하려면 로그인해 주세요</Text>

            {/* ─── 계정 잠김 배너 ─── */}
            {isLocked && (
              <View style={styles.lockedBanner}>
                <Text style={styles.lockedText}>
                  🔒 로그인 {MAX_FAIL}회 실패로 계정이 잠겼습니다.{'\n'}
                  고객센터 또는 비밀번호 재설정을 이용해 주세요.
                </Text>
              </View>
            )}

            {/* ─── 아이디 ─── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>아이디</Text>
              <View style={styles.fieldWrap}>
                <TextInput
                  style={[styles.inputField, inputInvalid && styles.inputInvalid]}
                  placeholder="아이디를 입력하세요"
                  placeholderTextColor={C.textMuted}
                  value={userId}
                  onChangeText={handleIdChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLocked}
                />
              </View>
            </View>

            {/* ─── 비밀번호 ─── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>비밀번호</Text>
              <View style={styles.fieldWrap}>
                <TextInput
                  style={[styles.inputField, {paddingRight: 48}, inputInvalid && styles.inputInvalid]}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor={C.textMuted}
                  value={password}
                  onChangeText={handlePwChange}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  editable={!isLocked}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPw(!showPw)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={[styles.eyeIcon, showPw && {opacity: 0.4}]}>👁</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.pwRule}>영문, 숫자, 특수문자 포함 8자 이상</Text>
            </View>

            {/* ─── 오류 메시지 ─── */}
            {showError && (
              <View style={styles.errorMsg}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorMsgText}>로그인 정보가 일치하지 않습니다.</Text>
                <Text style={styles.errorCount}>{failCount}/{MAX_FAIL}</Text>
              </View>
            )}

            {/* ─── 확인 버튼 ─── */}
            <TouchableOpacity
              style={[styles.btnConfirm, canLogin && styles.btnConfirmActive]}
              disabled={!canLogin}
              onPress={doLogin}
              activeOpacity={0.85}>
              <Text style={[styles.btnConfirmText, canLogin && {color: '#fff'}]}>
                {isLoading ? '로그인 중...' : '확인'}
              </Text>
              {!isLoading && (
                <Text style={{color: canLogin ? '#fff' : '#B0ABB5', fontSize: 16}}>›</Text>
              )}
            </TouchableOpacity>

            {/* ─── 링크 영역 ─── */}
            <View style={styles.linksRow}>
              <TouchableOpacity onPress={() => {
                // navigation.navigate('ForgotPasswordVerify');
              }}>
                <Text style={styles.linkBtn}>비밀번호를 잊으셨나요?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>아직 회원이 아니세요?</Text>
              <View style={styles.linkDivider} />
              <TouchableOpacity onPress={() => {
                // navigation.navigate('TermsAgreement');
              }}>
                <Text style={[styles.linkBtn, styles.linkAccent]}>회원가입</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.supportRow}>
              <TouchableOpacity
                style={styles.supportLink}
                onPress={() => Linking.openURL('mailto:support@ef-app.com')}>
                <Text style={styles.supportLinkText}>✉ 고객센터 메일 문의</Text>
              </TouchableOpacity>
            </View>
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

  content: {paddingHorizontal: 24, paddingTop: 32, paddingBottom: 36},

  eyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary,
    fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 26, fontWeight: '400', color: C.textPrimary, fontFamily: FONT,
    letterSpacing: -0.5, lineHeight: 31, marginBottom: 6,
  },
  pageSub: {
    fontSize: 13, fontWeight: '400', color: C.textSecondary, fontFamily: FONT,
    lineHeight: 21, marginBottom: 32,
  },

  lockedBanner: {
    backgroundColor: C.dangerBg, borderRadius: 14,
    padding: 16, marginBottom: 16,
  },
  lockedText: {fontSize: 12.5, fontWeight: '700', color: C.danger, fontFamily: FONT, lineHeight: 20},

  fieldGroup: {marginBottom: 16},
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: C.textMuted, fontFamily: FONT,
    letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase',
  },
  fieldWrap: {position: 'relative', flexDirection: 'row', alignItems: 'center'},
  inputField: {
    flex: 1, backgroundColor: C.surface, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 16,
    fontFamily: FONT, fontSize: 14, fontWeight: '400', color: C.textPrimary,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  inputInvalid: {borderColor: C.borderInvalid},

  eyeBtn: {position: 'absolute', right: 14, padding: 4},
  eyeIcon: {fontSize: 14, opacity: 0.5},

  pwRule: {
    fontSize: 11, fontWeight: '400', color: C.textMuted, fontFamily: FONT,
    marginTop: 6, paddingLeft: 2,
  },

  errorMsg: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.dangerBg, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 16,
  },
  errorIcon: {fontSize: 14},
  errorMsgText: {flex: 1, fontSize: 12, fontWeight: '700', color: C.danger, fontFamily: FONT},
  errorCount: {fontSize: 11, fontWeight: '700', color: C.danger, opacity: 0.7, fontFamily: FONT},

  btnConfirm: {
    width: '100%', backgroundColor: '#E8E5E1', borderRadius: 14,
    paddingVertical: 16.5,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 8,
  },
  btnConfirmActive: {
    backgroundColor: C.primary,
    ...Platform.select({
      ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24},
      android: {elevation: 8},
    }),
  },
  btnConfirmText: {fontSize: 15, fontWeight: '800', color: '#B0ABB5', fontFamily: FONT},

  linksRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 20, gap: 6,
  },
  linkBtn: {
    fontSize: 12.5, fontWeight: '400', color: C.textSecondary,
    fontFamily: FONT, paddingVertical: 2, paddingHorizontal: 4,
  },
  linkAccent: {color: C.primary, fontWeight: '700'},
  linkDivider: {width: 1, height: 11, backgroundColor: C.divider},

  signupRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 10, gap: 4,
  },
  signupText: {fontSize: 12.5, color: C.textMuted, fontWeight: '400', fontFamily: FONT},

  supportRow: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 28,
  },
  supportLink: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.surface2, borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  supportLinkText: {fontSize: 11.5, fontWeight: '400', color: C.textMuted, fontFamily: FONT},
});

export default LoginScreen;
