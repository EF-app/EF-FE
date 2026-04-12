/**
 * @file app/(auth)/_layout.tsx
 * @description 인증(로그인·계정 찾기·비밀번호 재설정) 그룹 레이아웃
 *
 * (auth) 그룹에 속하는 화면 목록:
 *   - login                    로그인
 *   - account-recovery-verify  계정 찾기 – 번호 인증
 *   - account-recovery-result  계정 찾기 – 결과
 *   - password-recovery-verify 비밀번호 찾기 – 번호 인증
 *   - password-reset           비밀번호 재설정
 *
 * 모든 화면의 기본 헤더를 숨김 처리합니다.
 * (각 화면이 AppHeader, BackButton 등 커스텀 헤더를 직접 구현)
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="account-recovery-verify" />
      <Stack.Screen name="account-recovery-result" />
      <Stack.Screen name="password-recovery-verify" />
      <Stack.Screen name="password-reset" />
    </Stack>
  );
}
