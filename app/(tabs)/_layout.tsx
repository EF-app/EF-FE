/**
 * @file app/(tabs)/_layout.tsx
 * @description 메인 탭 네비게이터 레이아웃
 * 탭 순서: 알림 | 설레임 | 홈(중앙) | 채팅 | 마이
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
import { Platform, Text, View } from "react-native";

const ACTIVE_COLOR = "#9686BF";
const INACTIVE_COLOR = COLORS.textMuted;

const label = (text: string, focused: boolean) => (
  <Text
    style={{
      fontSize: 10,
      marginTop: 2,
      color: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
      fontFamily: focused ? "NanumSquareNeo-dEb" : "NanumSquareNeo-bRg",
    }}
  >
    {text}
  </Text>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.divider,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
      }}
    >
      {/* 1 — 알림 */}
      <Tabs.Screen
        name="noti"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <AntDesign
                name="notification"
                size={22}
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
              {label("알림", focused)}
            </>
          ),
        }}
      />

      {/* 2 — 설레임 */}
      <Tabs.Screen
        name="hi"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <FontAwesome
                name="heart-o"
                size={22}
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
              {label("설레임", focused)}
            </>
          ),
        }}
      />

      {/* 3 — 홈 (중앙, 메인 진입점) */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: focused ? ACTIVE_COLOR : COLORS.surface2,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: Platform.OS === "ios" ? 10 : 4,
                ...(Platform.OS === "ios"
                  ? {
                      shadowColor: ACTIVE_COLOR,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: focused ? 0.4 : 0,
                      shadowRadius: 12,
                    }
                  : { elevation: focused ? 6 : 0 }),
              }}
            >
              <Feather
                name="home"
                size={22}
                color={focused ? "#fff" : INACTIVE_COLOR}
              />
            </View>
          ),
        }}
      />

      {/* 4 — 채팅 */}
      <Tabs.Screen
        name="chat-list"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Entypo
                name="chat"
                size={22}
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
              {label("채팅", focused)}
            </>
          ),
        }}
      />

      {/* 5 — 마이 */}
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
              {label("마이", focused)}
            </>
          ),
        }}
      />
    </Tabs>
  );
}
