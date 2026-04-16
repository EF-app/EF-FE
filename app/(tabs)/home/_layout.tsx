/**
 * @file app/(tabs)/home/_layout.tsx
 * @description 홈 탭 내부 스택 레이아웃
 */

import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="bal-game/index" />
      <Stack.Screen name="bal-game/apply" />
      <Stack.Screen name="post-it/index" />
      <Stack.Screen name="post-it/write" />
    </Stack>
  );
}
