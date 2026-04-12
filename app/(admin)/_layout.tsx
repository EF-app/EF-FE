// app/(admin)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  // // 테스트를 위해 임시로 작성한 데이터입니다.
  // // 실제로는 전역 상태나 서버에서 가져온 데이터를 넣으세요.
  // const user = { role: 'USER' }; // 'ADMIN'으로 바꾸면 관리자 탭이 보입니다.

  // // 1. 유저 정보가 아직 로딩 중이거나 없는 경우 처리
  // if (!user) {
  //     return <Redirect href="/login" />;
  // }

  // // 2. 권한 체크 (가장 중요한 부분)
  // if (user.role !== 'ADMIN') {
  //     // 관리자가 아니면 메인 화면이나 로그인 화면으로 튕겨냅니다.
  //     // 주의: "/" 경로가 index.tsx를 가리키는지 확인하세요!
  //     return <Redirect href="/" />;
  // }

  // 3. 관리자일 때만 탭 화면을 보여줍니다.
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF5A5F", // 관리자는 포인트 컬러를 다르게! (예: 빨간색 계열)
        headerShown: true, // 관리자 화면은 상단 타이틀을 보여주는 게 관리하기 편해요
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "대시보드",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "유저 관리",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
