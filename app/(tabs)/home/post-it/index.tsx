/**
 * @file app/(tabs)/home/post-it/index.tsx
 * @description 포스트잇 보드 — 메모 목록 화면
 */

import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import LetterCard from "@home/post-it/components/LetterCard";
import WritePostItModal from "@home/post-it/components/WritePostItModal";
import { useLetters, useLikeLetter } from "@home/post-it/hooks/useLetters";
import type { LetterTag } from "@home/post-it/types";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ── 보드 배경색 ── */
const BOARD_BG = "#F5F3F1"; //EAE2F5

const FILTER_CHIPS: { label: string; value: LetterTag }[] = [
  { label: "전체", value: "전체" },
  { label: "✉️ 일상", value: "일상" },
  { label: "💛 따뜻해요", value: "따뜻해요" },
  { label: "🌿 담백해요", value: "담백해요" },
  { label: "🌙 감성적이에요", value: "감성적이에요" },
  { label: "🤔 고민이에요", value: "고민이에요" },
  { label: "🎉 신나요", value: "신나요" },
  { label: "💜 그냥요", value: "그냥요" },
];

export default function PostItScreen() {
  const router = useRouter();
  const { data: letters, isLoading } = useLetters();
  const likeMutation = useLikeLetter();
  const [activeTag, setActiveTag] = useState<LetterTag>("전체");
  const [replyModal, setReplyModal] = useState<{ visible: boolean; targetId: number | null; targetNick: string }>({
    visible: false, targetId: null, targetNick: '',
  });

  const filtered = useMemo(() => {
    if (!letters) return [];
    if (activeTag === "전체") return letters;
    return letters.filter((l) => l.tag === activeTag);
  }, [letters, activeTag]);

  /* 2열 분리 (홀수/짝수 인덱스) */
  const leftCol = useMemo(
    () => filtered.filter((_, i) => i % 2 === 0),
    [filtered],
  );
  const rightCol = useMemo(
    () => filtered.filter((_, i) => i % 2 === 1),
    [filtered],
  );

  const handleLike = useCallback(
    (id: number, liked: boolean) => {
      likeMutation.mutate({ id, liked });
    },
    [likeMutation],
  );
  const handleReply = useCallback((id: number, nick: string) => {
    setReplyModal({ visible: true, targetId: id, targetNick: nick });
  }, []);

  const handleReplyClose = useCallback(() => {
    setReplyModal({ visible: false, targetId: null, targetNick: '' });
  }, []);

  const handleReplySubmit = useCallback((message: string, anonymous: boolean) => {
    // TODO: API 연결 시 replyModal.targetId와 함께 전송
    console.log('reply submitted', { targetId: replyModal.targetId, message, anonymous });
    handleReplyClose();
  }, [replyModal.targetId, handleReplyClose]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BOARD_BG }}
      edges={["top"]}
    >
      {/* ── 탑 네비 ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 18,
          paddingVertical: 12,
          backgroundColor: BOARD_BG,
        }}
      >
        {/* 뒤로 + 타이틀 */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.65)",
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 6,
              elevation: 2,
            }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={COLORS.primaryDeep}
            />
          </TouchableOpacity>

          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ fontSize: 18 }}>📌</Text>
              <Text
                style={{
                  fontSize: 15.5,
                  fontFamily: "NanumSquareneodEb",
                  color: COLORS.textPrimary,
                  letterSpacing: -0.3,
                }}
              >
                포스트잇 보드
              </Text>
            </View>
            <Text
              style={{
                fontSize: 10.5,
                fontFamily: "NanumSquareNeoaLt",
                color: COLORS.primaryMid,
                marginTop: 1,
              }}
            >
              강남구 · {filtered.length}개의 메모
            </Text>
          </View>
        </View>

        {/* 메모 쓰기 버튼 */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            borderRadius: 20,
            paddingHorizontal: 13,
            paddingVertical: 7,
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => router.push("/(tabs)/home/post-it/write")}
          activeOpacity={0.85}
        >
          <Ionicons name="pencil" size={11} color="#fff" />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "NanumSquareNeocBd",
              color: "#fff",
            }}
          >
            메모 쓰기
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── 필터 칩 ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 7,
        }}
        style={{
          flexGrow: 0,
          backgroundColor: "rgba(255,255,255,0.35)",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(150,134,191,0.18)",
        }}
      >
        {FILTER_CHIPS.map((chip) => {
          const active = activeTag === chip.value;
          return (
            <TouchableOpacity
              key={chip.value}
              style={{
                borderRadius: 20,
                paddingHorizontal: 13,
                paddingVertical: 5,
                flexShrink: 0,
                backgroundColor: active
                  ? COLORS.primary
                  : "rgba(255,255,255,0.7)",
                borderWidth: 1.5,
                borderColor: active ? COLORS.primary : "rgba(150,134,191,0.25)",
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: active ? 0.2 : 0.08,
                shadowRadius: 4,
                elevation: active ? 2 : 1,
              }}
              onPress={() => setActiveTag(chip.value)}
              activeOpacity={0.75}
            >
              <Text
                style={{
                  fontSize: 11.5,
                  fontFamily: "NanumSquareNeocBd",
                  color: active ? "#fff" : COLORS.textSecondary,
                }}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── 보드 본체 ── */}
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 44 }}>📝</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "NanumSquareNeocBd",
              color: COLORS.textMuted,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            아직 메모가 없어요{"\n"}첫 포스트잇을 붙여봐요!
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 4,
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 9,
              backgroundColor: COLORS.primary,
            }}
            onPress={() => router.push("/(tabs)/home/post-it/write")}
            activeOpacity={0.85}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "NanumSquareNeocBd",
                color: "#fff",
              }}
            >
              메모 쓰기
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 110,
            paddingTop: 4,
          }}
        >
          {/* 보드 헤더 텍스트 */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              gap: 6,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(150,134,191,0.2)",
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontFamily: "NanumSquareNeoaLt",
                color: COLORS.primaryMid,
                letterSpacing: 0.5,
              }}
            >
              오늘의 이야기들 ✨
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(150,134,191,0.2)",
              }}
            />
          </View>

          {/* 2열 포스트잇 그리드 */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* 왼쪽 열 */}
            <View style={{ flex: 1, gap: 2 }}>
              {leftCol.map((letter, i) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  colorIndex={i * 2}
                  onLike={handleLike}
                  onReply={handleReply}
                />
              ))}
            </View>

            {/* 오른쪽 열 */}
            <View style={{ flex: 1, gap: 2 }}>
              {rightCol.map((letter, i) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  colorIndex={i * 2 + 1}
                  onLike={handleLike}
                  onReply={handleReply}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── 답장 모달 ── */}
      <WritePostItModal
        visible={replyModal.visible}
        onClose={handleReplyClose}
        onSubmit={handleReplySubmit}
        replyToNick={replyModal.targetNick}
      />

      {/* ── FAB ── */}
      <View style={{ position: "absolute", bottom: 24, right: 20, zIndex: 10 }}>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
            elevation: 8,
          }}
          onPress={() => router.push("/(tabs)/home/post-it/write")}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 20 }}>📝</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
