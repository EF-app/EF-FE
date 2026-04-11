// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
// 페이지에 공통적으로 적용해야 하는 설정(테마, 데이터 관리, 로그인 상태 등)
// 1. 클라이언트 생성 (파일 바깥에 선언하는 것이 좋습니다)
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 2. QueryClientProvider로 전체를 감싸줍니다.
    /* Stack은 Expo Router에 내장되어 있어서 추가 설치 없이 바로 쓸 수 있습니다.*/
    <QueryClientProvider client={queryClient}>
      {/* 3. Expo Router의 Stack 네비게이션 */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* (tabs) 그룹이나 index 화면을 관리합니다 */}
        <Stack.Screen
          name="index"
          options={{
            title: "EF 홈",
            headerShown: true,
          }}
        />
        {/* 나머지 화면 설정들... */}
      </Stack>
    </QueryClientProvider>
  );
}
