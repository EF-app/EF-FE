/**
 * @file app/report/_layout.tsx
 */

import { Stack } from 'expo-router';

export default function ReportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="balance-game-comment" />
      <Stack.Screen name="postit" />
    </Stack>
  );
}
