import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, Linking,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';

const C = {
  bg: '#F5F3F1', surface: '#FFFFFF', surface2: '#EDEAE7',
  primary: '#9686BF', primaryTint: 'rgba(150,134,191,0.10)',
  divider: '#EAE7E3',
  textPrimary: '#1C1A1F', textSecondary: '#6B6670', textMuted: '#ADA8B2',
  green: '#8BBFA8', greenBg: '#EAF4EF',
  danger: '#BF9696', dangerBg: '#F5ECEC',
};
const FONT = 'NanumSquareNeo';

// 실제 서비스에서는 route params로 결과 데이터를 받음
// type AccountResultParams = { found: boolean; maskedId?: string; createdAt?: string; };

interface AccountResultProps {
  found?: boolean;
  maskedId?: string;
  createdAt?: string;
}

// ─── 계정 있음 분기 ───
const FoundBranch: React.FC<{maskedId: string; createdAt: string}> = ({maskedId, createdAt}) => {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={s.pageTitle}>계정을 찾았어요</Text>
      <Text style={s.pageSub}>인증된 번호로 등록된{'\n'}계정 정보입니다.</Text>

      {/* 아이디 결과 카드 */}
      <View style={s.resultCard}>
        <View style={s.resultIcon}>
          <Text style={{fontSize: 18, color: C.primary}}>👤</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={s.resultLabel}>아이디</Text>
          <Text style={s.resultValue}>
            {maskedId.replace(/\*/g, '')}
            <Text style={s.masked}>{'*'.repeat(5)}</Text>
          </Text>
        </View>
        <View style={s.resultBadge}>
          <Text style={s.resultBadgeText}>확인됨</Text>
        </View>
      </View>

      {/* 가입일 */}
      <View style={s.subCard}>
        <Text style={s.subCardLabel}>가입일</Text>
        <Text style={s.subCardValue}>{createdAt}</Text>
      </View>

      {/* 비밀번호 재설정 버튼 */}
      <TouchableOpacity
        style={s.btnPrimary}
        onPress={() => {
          // navigation.navigate('PasswordReset');
        }}
        activeOpacity={0.85}>
        <Text style={s.btnPrimaryText}>🔒 비밀번호 재설정</Text>
      </TouchableOpacity>

      {/* 링크들 */}
      <View style={s.linksRow}>
        <TouchableOpacity onPress={() => {
          // 고객센터 연결
        }}>
          <Text style={s.linkBtn}>아이디가 생각나지 않나요?</Text>
        </TouchableOpacity>
        <View style={s.linkDivider} />
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@ef-app.com')}>
          <Text style={s.linkBtn}>고객센터</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── 계정 없음 분기 ───
const NotFoundBranch: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={s.pageTitle}>가입 정보가{'\n'}없습니다</Text>
      <Text style={s.pageSub}>입력하신 번호로 등록된{'\n'}계정을 찾을 수 없어요.</Text>

      <View style={s.emptyWrap}>
        {/* 아이콘 */}
        <View style={s.emptyIconWrap}>
          <Text style={{fontSize: 28}}>🔍</Text>
        </View>

        {/* 안내 카드 */}
        <View style={s.infoCard}>
          <View style={s.infoIcon}>
            <Text style={{fontSize: 10, fontWeight: '800', color: C.primary}}>!</Text>
          </View>
          <Text style={s.infoText}>
            다른 번호로 가입하셨거나 아직 가입하지 않으셨을 수 있어요.{'\n'}
            <Text style={{fontWeight: '700', color: C.textPrimary}}>고객센터</Text>로 문의하시거나 새로 회원가입을 진행해 주세요.
          </Text>
        </View>

        {/* 고객센터 메일 */}
        <TouchableOpacity
          style={s.btnSupport}
          onPress={() => Linking.openURL('mailto:support@ef-app.com')}
          activeOpacity={0.7}>
          <Text style={s.btnSupportText}>✉ 고객센터 메일 문의</Text>
        </TouchableOpacity>

        {/* 회원가입 유도 */}
        <View style={s.signupNudge}>
          <Text style={s.signupNudgeText}>처음 방문하셨나요?</Text>
          <TouchableOpacity onPress={() => {
            // navigation.navigate('TermsAgreement');
          }}>
            <Text style={s.signupNudgeLink}>회원가입 하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── 메인 화면 ───
const AccountResultScreen: React.FC = () => {
  const navigation = useNavigation();

  // TODO: route.params에서 결과 데이터 받기
  // const route = useRoute<RouteProp<ParamList, 'AccountResult'>>();
  // const { found, maskedId, createdAt } = route.params;

  // 더미 데이터 (실제 서비스에서 제거)
  const found = true;
  const maskedId = 'yyy*****';
  const createdAt = '2024년 11월 03일';

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* 앱 헤더 */}
        <View style={s.appHeader}>
          <View style={s.logoMark}><Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>◇</Text></View>
          <Text style={s.appName}>이프</Text>
        </View>

        {/* 뒤로가기 */}
        <View style={s.nav}>
          <TouchableOpacity style={s.navBack} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={{fontSize: 22, color: C.textPrimary, fontWeight: '700', marginTop: -2}}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={s.content}>
          <Text style={s.eyebrow}>계정 정보 확인</Text>

          {found ? (
            <FoundBranch maskedId={maskedId} createdAt={createdAt} />
          ) : (
            <NotFoundBranch />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  appHeader: {paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 14 : 20, flexDirection: 'row', alignItems: 'center', gap: 10},
  logoMark: {width: 34, height: 34, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center'},
  appName: {fontSize: 15, fontWeight: '800', color: C.textPrimary, fontFamily: FONT},
  nav: {paddingHorizontal: 24, paddingTop: 16},
  navBack: {width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center'},
  content: {paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40},
  eyebrow: {fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary, fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase'},
  pageTitle: {fontSize: 26, fontWeight: '400', color: C.textPrimary, fontFamily: FONT, letterSpacing: -0.5, lineHeight: 34, marginBottom: 6},
  pageSub: {fontSize: 13, fontWeight: '400', color: C.textSecondary, fontFamily: FONT, lineHeight: 21, marginBottom: 32},

  // Found
  resultCard: {backgroundColor: C.surface, borderRadius: 16, paddingVertical: 20, paddingHorizontal: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14},
  resultIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: C.primaryTint, alignItems: 'center', justifyContent: 'center'},
  resultLabel: {fontSize: 10.5, fontWeight: '700', color: C.textMuted, fontFamily: FONT, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase'},
  resultValue: {fontSize: 18, fontWeight: '800', color: C.textPrimary, fontFamily: FONT, letterSpacing: -0.3},
  masked: {color: C.textMuted, letterSpacing: 1},
  resultBadge: {backgroundColor: C.greenBg, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9},
  resultBadgeText: {fontSize: 10.5, fontWeight: '700', color: C.green, fontFamily: FONT},

  subCard: {backgroundColor: C.surface, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  subCardLabel: {fontSize: 12, fontWeight: '400', color: C.textMuted, fontFamily: FONT},
  subCardValue: {fontSize: 12, fontWeight: '700', color: C.textSecondary, fontFamily: FONT},

  btnPrimary: {
    width: '100%', backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16.5,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16,
    ...Platform.select({ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24}, android: {elevation: 8}}),
  },
  btnPrimaryText: {fontSize: 15, fontWeight: '800', color: '#fff', fontFamily: FONT},

  linksRow: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4},
  linkDivider: {width: 1, height: 11, backgroundColor: C.divider},
  linkBtn: {fontSize: 12.5, fontWeight: '400', color: C.textSecondary, fontFamily: FONT, paddingVertical: 2, paddingHorizontal: 4},

  // Not Found
  emptyWrap: {alignItems: 'center', paddingTop: 12, paddingBottom: 28},
  emptyIconWrap: {width: 72, height: 72, borderRadius: 24, backgroundColor: C.dangerBg, alignItems: 'center', justifyContent: 'center', marginBottom: 20},

  infoCard: {backgroundColor: C.surface, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: '100%', marginBottom: 24},
  infoIcon: {width: 18, height: 18, borderRadius: 9, backgroundColor: '#EDE9F6', alignItems: 'center', justifyContent: 'center'},
  infoText: {flex: 1, fontSize: 12, fontWeight: '400', color: C.textSecondary, fontFamily: FONT, lineHeight: 20},

  btnSupport: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.divider, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 20, marginBottom: 20,
  },
  btnSupportText: {fontSize: 13, fontWeight: '700', color: C.textSecondary, fontFamily: FONT},

  signupNudge: {flexDirection: 'row', alignItems: 'center', gap: 6},
  signupNudgeText: {fontSize: 12.5, fontWeight: '400', color: C.textMuted, fontFamily: FONT},
  signupNudgeLink: {fontSize: 12.5, fontWeight: '700', color: C.primary, fontFamily: FONT},
});

export default AccountResultScreen;
