// app/index.tsx
import { StyleSheet, Text, View } from "react-native";

// 화면 컴포넌트 안에서
//<Smile color="#9686BF" size={40} strokeWidth={2} />;

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EF 프로젝트 시작!</Text>
      <Text style={styles.subtitle}>라이브러리 설치 전 클린 상태입니다.</Text>
    </View>
  );
}

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
