/**
 * @file app/(tabs)/my/_layout.tsx
 * @description 마이 탭 내부 스택 레이아웃
 * index 이외의 파일(premium, account, notifications 등)은
 * 이 Stack이 자동으로 처리하므로 _layout에 href:null 불필요
 */

import { Stack } from 'expo-router';

export default function MyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="premium" />
      <Stack.Screen name="profile/index" />
    </Stack>
  );
}
