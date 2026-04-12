/**
 * @file features/auth/components/TermItem.tsx
 * @description 약관 동의 화면에서 사용하는 약관 단일 항목 컴포넌트
 */

import { COLORS } from "@/constants/colors";
import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface TermData {
  id: number;
  badge: "required" | "optional";
  title: string;
  buttonText: string;
  content: string;
}

interface TermItemProps {
  term: TermData;
  isChecked: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onCheck: (val?: boolean) => void;
  onInnerScrollStart?: () => void;
  onInnerScrollEnd?: () => void;
}

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 11,
  color = "#fff",
}) => (
  <Text style={{ fontSize: size, color, fontFamily: "NanumSquareNeo-dEb" }}>
    ✓
  </Text>
);

const TermItem: React.FC<TermItemProps> = ({
  term,
  isChecked,
  isOpen,
  onToggleOpen,
  onCheck,
  onInnerScrollStart,
  onInnerScrollEnd,
}) => {
  return (
    <View
      className="bg-ef-surface rounded-[16px] border border-ef-primary-border mb-[10px] overflow-hidden"
      style={Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        android: { elevation: 3 },
      })}
    >
      <TouchableOpacity
        className="flex-row items-center gap-3 py-[14px] px-4"
        activeOpacity={0.7}
        onPress={onToggleOpen}
      >
        <TouchableOpacity
          className={`w-[22px] h-[22px] rounded-[11px] border-2 items-center justify-center ${
            isChecked
              ? "bg-ef-primary border-ef-primary"
              : "bg-ef-bg border-ef-primary-border"
          }`}
          onPress={() => onCheck()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isChecked && <CheckIcon size={11} />}
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row items-center gap-[5px]">
            <View
              className={`px-[7px] py-[2px] rounded-[8px] ${
                term.badge === "required"
                  ? "bg-ef-primary-soft"
                  : "bg-[rgba(173,168,178,0.15)]"
              }`}
            >
              <Text
                className={`text-[9px] font-extrabold ${
                  term.badge === "required"
                    ? "text-ef-primary-mid"
                    : "text-ef-text-muted"
                }`}
              >
                {term.badge === "required" ? "필수" : "선택"}
              </Text>
            </View>
            <Text
              className="text-[13px] text-ef-text font-extrabold shrink"
              style={{ letterSpacing: -0.3 }}
              numberOfLines={1}
            >
              {term.title}
            </Text>
          </View>
        </View>

        <Text
          className="text-[14px] text-ef-text-muted"
          style={isOpen ? { transform: [{ rotate: "180deg" }] } : undefined}
        >
          ▾
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="border-t border-ef-divider">
          <ScrollView
            className="px-4 py-3"
            style={{ maxHeight: 190 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            onTouchStart={onInnerScrollStart}
            onMomentumScrollEnd={onInnerScrollEnd}
            onScrollEndDrag={onInnerScrollEnd}
          >
            <Text className="text-[11px] text-ef-text-sub font-sans leading-5">
              {term.content}
            </Text>
          </ScrollView>

          <View className="flex-row justify-end items-center px-4 pt-[10px] pb-3 border-t border-ef-divider gap-2">
            <TouchableOpacity
              className="bg-ef-bg border border-ef-divider px-4 py-[6px] rounded-[20px]"
              onPress={() => onCheck(false)}
              activeOpacity={0.7}
            >
              <Text className="text-[11px] text-ef-text-muted font-extrabold">
                동의 안 함
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-ef-primary px-4 py-[6px] rounded-[20px]"
              style={Platform.select({
                ios: {
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                },
                android: { elevation: 4 },
              })}
              onPress={() => onCheck(true)}
              activeOpacity={0.7}
            >
              <Text className="text-[11px] text-white font-extrabold">
                {term.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default TermItem;
