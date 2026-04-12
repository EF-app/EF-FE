/**
 * @file app/(onboarding)/_layout.tsx
 * @description 회원가입 온보딩 그룹 레이아웃
 *
 * (onboarding) 그룹에 속하는 화면 순서:
 *   1. terms-agreement     약관 동의
 *   2. phone-verification  본인 인증 (핸드폰 번호)
 *   3. account-input       아이디 / 비밀번호 설정
 *   4. nickname            닉네임 설정
 *   5. region              거주 지역 설정
 *   6. profile-creation    프로필 생성 (관심사·생활습관·스타일·이상형·사진)
 *
 * 모든 화면의 기본 헤더를 숨깁니다.
 * (각 화면이 TopBar 또는 AppHeader + BackButton 조합을 직접 구현)
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="terms-agreement" />
      <Stack.Screen name="phone-verification" />
      <Stack.Screen name="account-input" />
      <Stack.Screen name="nickname" />
      <Stack.Screen name="region" />
      <Stack.Screen name="profile-creation" />
      <Stack.Screen name="security-code" />
    </Stack>
  );
}
