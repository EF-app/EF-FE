/**
 * @file app/(tabs)/noti/index.tsx
 * @description 공지사항 화면
 */

import { COLORS } from "@/constants/colors";
import NoticeCard from "@/features/noti/components/NoticeCard";
import NoticeDetailSheet from "@/features/noti/components/NoticeDetailSheet";
import { useNotices } from "@/features/noti/hooks/useNoti";
import { Notice } from "@/features/noti/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotiScreen() {
  const { data: notices, isLoading } = useNotices();
  const [selected, setSelected] = useState<Notice | null>(null);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={["top", "bottom"]}>
      {/* ── 헤더 ── */}
      <View className="flex-row items-center justify-between px-5 py-[14px] border-b border-ef-divider">
        <Text
          className="text-[20px] text-ef-text font-extrabold"
          style={{ letterSpacing: -0.6 }}
        >
          공지사항
        </Text>
        {!isLoading && (notices?.length ?? 0) > 0 && (
          <View
            className="flex-row items-center gap-[5px] rounded-[20px] px-[11px] py-[4px]"
            style={{ backgroundColor: COLORS.primarySoft2 }}
          >
            <PulseDot />
            <Text
              className="text-[11px] font-extrabold"
              style={{ color: COLORS.primary }}
            >
              새 공지 2
            </Text>
          </View>
        )}
      </View>

      {/* ── 업데이트 배너 ── */}
      <TouchableOpacity
        className="mx-4 mt-[14px] rounded-[16px] flex-row items-center gap-[12px] px-[18px] py-[14px]"
        style={{
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.38,
          shadowRadius: 20,
          elevation: 8,
        }}
        activeOpacity={0.85}
      >
        <View
          className="w-[38px] h-[38px] rounded-[12px] items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          <Text style={{ fontSize: 18 }}>🚀</Text>
        </View>
        <View className="flex-1">
          <Text
            className="text-[11px] font-bold mb-[3px]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            업데이트 안내
          </Text>
          <Text
            className="text-[14px] font-extrabold text-white"
            style={{ letterSpacing: -0.3 }}
          >
            v2.4 업데이트 준비중이에요
          </Text>
        </View>
        <View
          className="w-[28px] h-[28px] rounded-[9px] items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          <Ionicons
            name="chevron-forward"
            size={14}
            color="rgba(255,255,255,0.9)"
          />
        </View>
      </TouchableOpacity>

      {/* ── 공지 목록 ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          notices?.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onPress={setSelected} />
          ))
        )}

        {/* ── 버그신고 버튼 ── */}
        <TouchableOpacity
          className="w-full rounded-[16px] py-[15px] items-center mt-2"
          style={{
            backgroundColor: COLORS.textPrimary,
            shadowColor: COLORS.textPrimary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.22,
            shadowRadius: 18,
            elevation: 6,
          }}
          activeOpacity={0.85}
        >
          <Text
            className="text-[15px] font-extrabold text-white"
            style={{ letterSpacing: -0.3 }}
          >
            🐞 버그신고 / 기능요청
          </Text>
          <Text
            className="text-[11px] font-sans mt-[2px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            불편한 점을 알려주시면 빠르게 개선할게요
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── 공지 상세 바텀시트 ── */}
      <NoticeDetailSheet notice={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

function PulseDot() {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        opacity,
      }}
    />
  );
}
