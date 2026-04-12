// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// 1. 클라이언트 생성 (파일 바깥에 선언하는 것이 좋습니다)
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NanumSquareNeo-aLt": require("../assets/fonts/NanumSquareNeo-aLt.ttf"),
    "NanumSquareNeo-bRg": require("../assets/fonts/NanumSquareNeo-bRg.ttf"),
    "NanumSquareNeo-cBd": require("../assets/fonts/NanumSquareNeo-cBd.ttf"),
    "NanumSquareNeo-dEb": require("../assets/fonts/NanumSquareNeo-dEb.ttf"),
    "NanumSquareNeo-eHv": require("../assets/fonts/NanumSquareNeo-eHv.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    // 2. QueryClientProvider로 전체를 감싸줍니다.
    /* Stack은 Expo Router에 내장되어 있어서 추가 설치 없이 바로 쓸 수 있습니다.*/
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
