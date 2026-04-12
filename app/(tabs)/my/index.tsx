/**
 * @file app/(tabs)/my/index.tsx
 * @description 마이 프로필 화면
 */

import { COLORS } from "@/constants/colors";
import { MENU_SECTIONS } from "@/features/my/api/myApi";
import ActivityStrip from "@/features/my/components/ActivityStrip";
import MenuSection from "@/features/my/components/MenuSection";
import PremiumCard from "@/features/my/components/PremiumCard";
import ProfileHeroCard from "@/features/my/components/ProfileHeroCard";
import { useMyProfile } from "@/features/my/hooks/useMy";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useMyProfile();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    darkMode: false,
    dataSaver: false,
  });

  const handleToggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={["top"]}>
      {/* ── 헤더 ── */}
      <View
        className="flex-row items-end justify-between px-[24px] pb-[10px]"
        style={{ height: 62 }}
      >
        <Text
          className="text-[17px] font-extrabold text-ef-text"
          style={{ letterSpacing: -0.4 }}
        >
          프로필
        </Text>
        <TouchableOpacity
          className="w-[36px] h-[36px] bg-ef-surface rounded-[13px] items-center justify-center"
          style={{
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.09,
            shadowRadius: 20,
            elevation: 3,
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="settings-outline"
            size={17}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* ── Scroll content ── */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isLoading || !profile ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginTop: 60 }}
          />
        ) : (
          <>
            {/* Profile hero */}
            <ProfileHeroCard profile={profile} onEdit={() => {}} />

            {/* Edit profile button */}
            <TouchableOpacity
              className="mx-[20px] mb-[20px] h-[44px] rounded-[14px] flex-row items-center justify-center gap-[7px]"
              style={{ backgroundColor: COLORS.primaryTint }}
              activeOpacity={0.85}
              onPress={() => router.push("/(tabs)/my/profile")}
            >
              <Ionicons
                name="pencil-outline"
                size={14}
                color={COLORS.primary}
              />
              <Text
                className="text-[13px] font-extrabold"
                style={{ color: COLORS.primary, letterSpacing: -0.3 }}
              >
                프로필 수정하기
              </Text>
            </TouchableOpacity>

            {/* Activity strip */}
            <ActivityStrip activity={profile.activity} />

            {/* Premium card */}
            <PremiumCard />

            {/* Menu sections */}
            {MENU_SECTIONS.map((section) => (
              <MenuSection
                key={section.label}
                section={section}
                toggles={toggles}
                onToggle={handleToggle}
              />
            ))}

            {/* Logout */}
            <TouchableOpacity
              className="mx-[20px] mb-[6px] bg-ef-surface rounded-[14px] py-[14px] flex-row items-center justify-center gap-[8px]"
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.09,
                shadowRadius: 20,
                elevation: 3,
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={15} color={COLORS.red} />
              <Text
                className="text-[13px] font-bold"
                style={{ color: COLORS.red }}
              >
                로그아웃
              </Text>
            </TouchableOpacity>

            {/* Version */}
            <Text className="text-center text-[10px] font-sans text-ef-text-muted py-[10px]">
              녹차 v2.4.1 · Made with 🍵 in Seoul
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
