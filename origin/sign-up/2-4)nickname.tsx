import React, {useState, useCallback, useRef, useMemo} from 'react';
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
const MAX_LEN = 10;

// ─── 금칙어 목록 (실제 서비스에서 API 호출로 확장) ───
const BANNED_WORDS = [
  '관리자', '어드민', 'admin', 'manager', '운영자',
  '시발', '씨발', '개새끼', '병신',
];

// ─── 이미 사용 중인 닉네임 (실제 서비스에서 API 호출) ───
const TAKEN_NICKS = ['이프러버', '녹차러버', 'teamaster', '이프왕', 'greentea', '차한잔'];

type ValidationResult =
  | {status: 'idle'}
  | {status: 'ok'; message: string}
  | {status: 'err'; message: string}
  | {status: 'banned'; message: string};

const NicknameScreen: React.FC = () => {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({status: 'idle'});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charLen = [...nickname].length; // 유니코드 정확한 글자 수

  // ─── 닉네임 검증 ───
  const handleNickChange = useCallback((text: string) => {
    setNickname(text);
    const len = [...text].length;

    if (len === 0) {
      setValidation({status: 'idle'});
      return;
    }

    // 길이 초과
    if (len > MAX_LEN) {
      setValidation({status: 'err', message: '10자 이내로 입력해 주세요'});
      return;
    }

    // 특수문자 체크
    if (!/^[가-힣a-zA-Z0-9_]+$/.test(text)) {
      setValidation({status: 'err', message: '한글, 영문, 숫자, _ 만 사용할 수 있어요'});
      return;
    }

    // 금칙어 체크
    const lowerRaw = text.toLowerCase();
    const foundBanned = BANNED_WORDS.find(w => lowerRaw.includes(w.toLowerCase()));
    if (foundBanned) {
      setValidation({status: 'banned', message: '사용할 수 없는 단어가 포함되어 있어요'});
      return;
    }

    // 디바운스: 중복 검사
    setValidation({status: 'idle'}); // 로딩 중
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // TODO: 실제 서비스에서는 Axios API 호출
      // const { data } = await api.get(`/auth/check-nickname?nick=${encodeURIComponent(text)}`);
      const taken = TAKEN_NICKS.some(n => n.toLowerCase() === text.toLowerCase());
      if (taken) {
        setValidation({status: 'err', message: '이미 사용 중인 닉네임입니다'});
      } else {
        setValidation({status: 'ok', message: '사용 가능한 닉네임이에요'});
      }
    }, 500);
  }, []);

  const isValid = validation.status === 'ok';
  const firstChar = nickname.length > 0 ? [...nickname][0].toUpperCase() : '?';

  // ─── 카운터 색상 ───
  const counterColor = useMemo(() => {
    if (charLen === 0) return 'transparent';
    if (charLen > MAX_LEN) return C.danger;
    if (charLen >= MAX_LEN * 0.7) return C.primary;
    return C.textMuted;
  }, [charLen]);

  const handleNext = useCallback(() => {
    if (!isValid) return;
    // TODO: Zustand store에 nickname 저장
    // navigation.navigate('RegionSelect');
    console.log('다음: 지역 설정');
  }, [isValid, nickname]);

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

          {/* ─── Content ─── */}
          <View style={styles.content}>
            <Text style={styles.eyebrow}>프로필 설정</Text>
            <Text style={styles.pageTitle}>닉네임을{'\n'}만들어보세요!</Text>
            <Text style={styles.pageSub}>
              프로필에 표시되는 이름으로,{'\n'}언제든 변경 가능해요.
            </Text>

            {/* ─── 닉네임 입력 ─── */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>닉네임</Text>
              <View style={styles.fieldWrap}>
                <TextInput
                  style={[
                    styles.inputField,
                    (validation.status === 'err' || validation.status === 'banned') && styles.inputInvalid,
                  ]}
                  placeholder="닉네임을 입력하세요"
                  placeholderTextColor={C.textMuted}
                  value={nickname}
                  onChangeText={handleNickChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={12}
                />
                {charLen > 0 && (
                  <Text style={[styles.charCount, {color: counterColor}]}>
                    {charLen}/{MAX_LEN}
                  </Text>
                )}
                {validation.status === 'ok' && (
                  <View style={[styles.statusCircle, styles.statusOk]}>
                    <Text style={{fontSize: 12, fontWeight: '800', color: C.primary}}>✓</Text>
                  </View>
                )}
                {(validation.status === 'err' || validation.status === 'banned') && (
                  <View style={[styles.statusCircle, styles.statusErr]}>
                    <Text style={{fontSize: 12, fontWeight: '800', color: C.danger}}>✕</Text>
                  </View>
                )}
              </View>

              {/* 상태 힌트 */}
              {(validation.status === 'ok' || validation.status === 'err') && (
                <Text
                  style={[
                    styles.fieldHint,
                    validation.status === 'ok' ? styles.hintOk : styles.hintErr,
                  ]}>
                  {validation.message}
                </Text>
              )}

              {/* 금칙어 배너 */}
              {validation.status === 'banned' && (
                <View style={styles.bannedWrap}>
                  <Text style={styles.bannedIcon}>⚠</Text>
                  <Text style={styles.bannedText}>{validation.message}</Text>
                </View>
              )}
            </View>

            {/* ─── 프로필 미리보기 ─── */}
            {isValid && (
              <View style={styles.previewCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{firstChar}</Text>
                </View>
                <View>
                  <Text style={styles.previewLabel}>미리보기</Text>
                  <Text style={styles.previewName}>{nickname}</Text>
                </View>
              </View>
            )}

            {/* ─── 다음 버튼 ─── */}
            <TouchableOpacity
              style={[styles.btnNext, isValid && styles.btnNextActive]}
              disabled={!isValid}
              onPress={handleNext}
              activeOpacity={0.85}>
              <Text style={[styles.btnNextText, isValid && {color: '#fff'}]}>
                다음으로
              </Text>
              <Text style={{color: isValid ? '#fff' : '#B0ABB5', fontSize: 16}}>›</Text>
            </TouchableOpacity>
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

  content: {paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40},

  eyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary,
    fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 26, fontWeight: '400', color: C.textPrimary, fontFamily: FONT,
    letterSpacing: -0.5, lineHeight: 34, marginBottom: 8,
  },
  pageSub: {
    fontSize: 13, fontWeight: '400', color: C.textSecondary, fontFamily: FONT,
    lineHeight: 21, marginBottom: 36,
  },

  fieldGroup: {marginBottom: 10},
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: C.textMuted, fontFamily: FONT,
    letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase',
  },
  fieldWrap: {position: 'relative', flexDirection: 'row', alignItems: 'center'},

  inputField: {
    flex: 1, backgroundColor: C.surface, borderRadius: 14,
    paddingVertical: 15, paddingLeft: 16, paddingRight: 82,
    fontFamily: FONT, fontSize: 14, fontWeight: '400', color: C.textPrimary,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  inputInvalid: {borderColor: C.borderInvalid},

  charCount: {
    position: 'absolute', right: 44,
    fontSize: 11, fontWeight: '700', fontFamily: FONT,
  },

  statusCircle: {
    position: 'absolute', right: 10,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  statusOk: {backgroundColor: C.primaryTint},
  statusErr: {backgroundColor: C.dangerBg},

  fieldHint: {
    fontSize: 11.5, fontWeight: '400', fontFamily: FONT,
    marginTop: 7, paddingLeft: 2, lineHeight: 17,
  },
  hintOk: {color: C.primary},
  hintErr: {color: C.danger},

  bannedWrap: {
    backgroundColor: C.dangerBg, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
  },
  bannedIcon: {fontSize: 14, color: C.danger, marginTop: 1},
  bannedText: {fontSize: 12, fontWeight: '700', color: C.danger, fontFamily: FONT, lineHeight: 18, flex: 1},

  previewCard: {
    backgroundColor: C.surface, borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 20,
    marginTop: 28,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: {fontSize: 18, fontWeight: '800', color: C.primary, fontFamily: FONT, letterSpacing: -0.5},
  previewLabel: {
    fontSize: 10.5, fontWeight: '700', color: C.textMuted, fontFamily: FONT,
    letterSpacing: 0.5, marginBottom: 3, textTransform: 'uppercase',
  },
  previewName: {fontSize: 15, fontWeight: '700', color: C.textPrimary, fontFamily: FONT, letterSpacing: -0.2},

  btnNext: {
    width: '100%', backgroundColor: '#E8E5E1', borderRadius: 14,
    paddingVertical: 16.5,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 32,
  },
  btnNextActive: {
    backgroundColor: C.primary,
    ...Platform.select({
      ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24},
      android: {elevation: 8},
    }),
  },
  btnNextText: {fontSize: 15, fontWeight: '800', color: '#B0ABB5', fontFamily: FONT},
});

export default NicknameScreen;
