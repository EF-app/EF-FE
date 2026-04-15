/**
 * @file app/(tabs)/_layout.tsx
 * @description 메인 탭 네비게이터 레이아웃
 * 탭 순서: 알림 | 설레임 | 이프(중앙) | 채팅 | 마이
 */

import { COLORS } from "@/constants/colors";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#9686BF";
const INACTIVE_COLOR = "rgba(150,134,191,0.4)";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "NanumSquareNeo-cBd",
          marginTop: 0,
          marginBottom: Platform.OS === "ios" ? 0 : 2,
        },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.divider,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 90 : 70 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? 30 : 12 + insets.bottom,
          paddingTop: 8,
        },
      }}
    >
      {/* 1 — 공지사항 */}
      <Tabs.Screen
        name="noti/index"
        options={{
          tabBarLabel: "NOTI",
          tabBarIcon: ({ color }) => (
            <AntDesign name="notification" size={22} color={color} />
          ),
        }}
      />

      {/* 2 — hi */}
      <Tabs.Screen
        name="hi/index"
        options={{
          tabBarLabel: "HI",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart-o" size={22} color={color} />
          ),
        }}
      />

      {/* 3 — 이프 (중앙) */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "EF",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />

      {/* 4 — 채팅 */}
      <Tabs.Screen
        name="chat-list/index"
        options={{
          tabBarLabel: "CHAT",
          tabBarIcon: ({ color }) => (
            <Entypo name="chat" size={22} color={color} />
          ),
        }}
      />

      {/* 5 — 마이 */}
      <Tabs.Screen
        name="my"
        options={{
          tabBarLabel: "MY",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
