// app/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TestCenter() {
  const router = useRouter();
  {
    /* 임시: 관리자 권한 확인 변수 (개발 중엔 true로 둡니다)*/
  }
  const isAdmin = true;

  return (
    <View className="flex-1 items-center justify-center bg-[#F5F3F1] p-6">
      <Text className="text-2xl font-bold text-[#9686BF] mb-10">
        EF 프로젝트 테스트 센터 💜
      </Text>

      {/* 1. 정상 경로 이동 버튼 */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="w-full bg-[#9686BF] p-4 rounded-2xl mb-4 shadow-sm"
      >
        <Text className="text-white text-center font-bold text-lg">
          로그인 화면으로 가기 (정상)
        </Text>
      </TouchableOpacity>

      {/* 2. 존재하지 않는 경로 이동 버튼 */}
      <TouchableOpacity
        onPress={() => router.push("/this-is-not-real")}
        className="w-full bg-white border-2 border-[#9686BF] p-4 rounded-2xl mb-4"
      >
        <Text className="text-[#9686BF] text-center font-bold text-lg">
          없는 페이지로 가기 (에러 테스트)
        </Text>
      </TouchableOpacity>

      {/* --- 관리자 이동 버튼 추가 --- */}
      {isAdmin && (
        <TouchableOpacity
          // 클릭 시 (admin) 그룹 폴더의 메인(index.tsx)으로 이동
          onPress={() => router.push("/(admin)")}
          // NativeWind 스타일: 보라색 배경, 라운딩, 그림자 효과
          className="w-full flex-row items-center justify-center bg-[#9686BF] p-4 rounded-2xl shadow-lg active:opacity-80 mb-4"
        >
          {/* 아이콘 추가: 방패 모양으로 관리자 느낌 강조 */}
          <Ionicons
            name="shield-checkmark"
            size={20}
            color="white"
            className="mr-2"
          />
          <Text className="text-white text-lg font-bold text-center">
            관리자 모드 진입
          </Text>
        </TouchableOpacity>
      )}

      <Text className="mt-8 text-gray-400 text-sm">
        현재 경로: /app/index.tsx
      </Text>
    </View>
  );
}

// export default function Index() {
//   /**
//    * 앱이 실행되면 가장 먼저 이 index.tsx를 찾습니다.
//    * 여기서 바로 /(auth)/login 경로로 사용자를 보내줍니다.
//    * (괄호) 폴더는 주소창에 나타나지 않으므로 경로는 "/login"으로 작성합니다.
//    */

//   return <Redirect href="/login" />;
// }

// 화면 컴포넌트 안에서
//<Smile color="#9686BF" size={40} strokeWidth={2} />;

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>EF 프로젝트 시작!</Text>
//       <Text style={styles.subtitle}>라이브러리 설치 전 클린 상태입니다.</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F3F1", // 배경색
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9686BF", // 포인트 보라색
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    color: "#888",
  },
});
