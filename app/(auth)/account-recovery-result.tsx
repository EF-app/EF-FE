/**
 * @file app/(auth)/account-recovery-result.tsx
 * @description 계정 찾기 결과 화면
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@components/AppHeader';
import BackButton from '@components/BackButton';
import { COLORS } from '@/constants/colors';

const FoundBranch: React.FC<{ maskedId: string; createdAt: string }> = ({ maskedId, createdAt }) => {
  const router = useRouter();
  return (
    <View>
      <Text className="text-[26px] text-ef-text font-sans mb-[6px]" style={{ letterSpacing: -0.5, lineHeight: 34 }}>
        계정을 찾았어요
      </Text>
      <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-8">
        인증된 번호로 등록된{'\n'}계정 정보입니다.
      </Text>

      <View className="bg-ef-surface rounded-[16px] py-5 px-5 mb-3 flex-row items-center gap-[14px]">
        <View className="w-10 h-10 rounded-[12px] bg-ef-primary-tint items-center justify-center">
          <Text style={{ fontSize: 18, color: COLORS.primary }}>👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[10.5px] text-ef-text-muted font-bold tracking-[0.5px] mb-1 uppercase">
            아이디
          </Text>
          <Text className="text-[18px] text-ef-text font-extrabold" style={{ letterSpacing: -0.3 }}>
            {maskedId.replace(/\*/g, '')}
            <Text className="text-ef-text-muted" style={{ letterSpacing: 1 }}>{'*'.repeat(5)}</Text>
          </Text>
        </View>
        <View className="bg-ef-green-bg rounded-[20px] py-[3px] px-[9px]">
          <Text className="text-[10.5px] text-ef-green font-bold">확인됨</Text>
        </View>
      </View>

      <View className="bg-ef-surface rounded-[14px] py-[14px] px-[18px] mb-6 flex-row justify-between items-center">
        <Text className="text-[12px] text-ef-text-muted font-sans">가입일</Text>
        <Text className="text-[12px] text-ef-text-sub font-bold">{createdAt}</Text>
      </View>

      <TouchableOpacity
        className="w-full bg-ef-primary rounded-[14px] py-[16.5px] flex-row items-center justify-center gap-2 mb-4"
        style={Platform.select({
          ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 24 },
          android: { elevation: 8 },
        })}
        onPress={() => router.push('/(auth)/password-recovery-verify')}
        activeOpacity={0.85}
      >
        <Text className="text-[15px] text-white font-extrabold">🔒 비밀번호 재설정</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center items-center gap-[6px] mt-1">
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@ef-app.com')}>
          <Text className="text-[12.5px] text-ef-text-sub font-sans py-[2px] px-1">아이디가 생각나지 않나요?</Text>
        </TouchableOpacity>
        <View className="w-px h-[11px] bg-ef-divider" />
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@ef-app.com')}>
          <Text className="text-[12.5px] text-ef-text-sub font-sans py-[2px] px-1">고객센터</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NotFoundBranch: React.FC = () => {
  const router = useRouter();
  return (
    <View>
      <Text className="text-[26px] text-ef-text font-sans mb-[6px]" style={{ letterSpacing: -0.5, lineHeight: 34 }}>
        가입 정보가{'\n'}없습니다
      </Text>
      <Text className="text-[13px] text-ef-text-sub font-sans leading-[21px] mb-8">
        입력하신 번호로 등록된{'\n'}계정을 찾을 수 없어요.
      </Text>

      <View className="items-center pt-3 pb-7">
        <View className="w-[72px] h-[72px] rounded-[24px] bg-ef-danger-bg items-center justify-center mb-5">
          <Text style={{ fontSize: 28 }}>🔍</Text>
        </View>

        <View className="bg-ef-surface rounded-[14px] p-4 flex-row items-start gap-[10px] w-full mb-6">
          <View className="w-[18px] h-[18px] rounded-[9px] bg-ef-primary-light items-center justify-center">
            <Text className="text-[10px] text-ef-primary font-extrabold">!</Text>
          </View>
          <Text className="flex-1 text-[12px] text-ef-text-sub font-sans leading-5">
            다른 번호로 가입하셨거나 아직 가입하지 않으셨을 수 있어요.{'\n'}
            <Text style={{ fontFamily: 'NanumSquareNeo-cBd', color: COLORS.textPrimary }}>고객센터</Text>로
            문의하시거나 새로 회원가입을 진행해 주세요.
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-[6px] bg-ef-surface border-[1.5px] border-ef-divider rounded-[14px] py-[14px] px-5 mb-5"
          onPress={() => Linking.openURL('mailto:support@ef-app.com')}
          activeOpacity={0.7}
        >
          <Text className="text-[13px] text-ef-text-sub font-bold">✉ 고객센터 메일 문의</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-[6px]">
          <Text className="text-[12.5px] text-ef-text-muted font-sans">처음 방문하셨나요?</Text>
          <TouchableOpacity onPress={() => router.push('/(onboarding)/terms-agreement')}>
            <Text className="text-[12.5px] text-ef-primary font-bold">회원가입 하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function AccountRecoveryResultScreen() {
  const router = useRouter();
  const found = true;
  const maskedId = 'yyy*****';
  const createdAt = '2024년 11월 03일';

  return (
    <View className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AppHeader />
        <View className="px-6 pt-4">
          <BackButton onPress={() => router.back()} />
        </View>
        <View className="px-6 pt-7 pb-10">
          <Text className="text-[11px] tracking-[1.4px] text-ef-primary font-bold mb-[10px] uppercase">
            계정 정보 확인
          </Text>
          {found ? <FoundBranch maskedId={maskedId} createdAt={createdAt} /> : <NotFoundBranch />}
        </View>
      </ScrollView>
    </View>
  );
}
