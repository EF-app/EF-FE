// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // Stack은 Expo Router에 내장되어 있어서 추가 설치 없이 바로 쓸 수 있습니다.
    <Stack screenOptions={{ headerShown: false }}>
      {/* (tabs) 그룹이나 index 화면을 관리합니다 */}
      <Stack.Screen
        name="index"
        options={{
          title: "EF 홈",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
