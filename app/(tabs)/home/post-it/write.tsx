/**
 * @file app/(tabs)/home/post-it/write.tsx
 * @description 포스트잇 붙이기 — 편지 작성 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { POST_IT_COLORS, type PostItColor, type LetterTag } from '@home/post-it/types';

const MY_NICK = '졸린고양이🐱';
const MY_LOC  = '서울 강남구';
const MY_AGE  = 25;

const COLOR_ENTRIES = Object.entries(POST_IT_COLORS) as [PostItColor, string][];

const MOOD_TAGS: { label: string; value: Exclude<LetterTag, '전체'> }[] = [
  { label: '📌 일상',     value: '일상' },
  { label: '💛 따뜻해요', value: '따뜻해요' },
  { label: '🌿 담백해요', value: '담백해요' },
  { label: '🌙 감성적이에요', value: '감성적이에요' },
  { label: '🤔 고민이에요', value: '고민이에요' },
  { label: '🎉 신나요',   value: '신나요' },
  { label: '💜 그냥요',   value: '그냥요' },
];

const SCOPE_OPTIONS = [
  { icon: '📍', name: '내 동네', desc: '강남구',     value: '동네' as const },
  { icon: '🏙️', name: '서울',  desc: '서울 전체',  value: '서울' as const },
  { icon: '🗺️', name: '전국',  desc: '모든 지역',  value: '전국' as const },
];

export default function WritePostItScreen() {
  const router = useRouter();

  const [color, setColor]   = useState<PostItColor>('yellow');
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [mood, setMood]     = useState<Exclude<LetterTag, '전체'>>('일상');
  const [scope, setScope]   = useState<'동네' | '서울' | '전국'>('동네');
  const [posted, setPosted] = useState(false);

  const charCount = body.length;
  const isReady = body.trim().length >= 2;

  const nick    = isAnon ? '익명' : MY_NICK;
  const locText = isAnon ? '비공개' : MY_LOC;

  const handlePost = () => {
    if (!isReady || posted) return;
    setPosted(true);
    // TODO: API call
    setTimeout(() => router.back(), 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-ef-bg" edges={['top']}>
      {/* ── 탑 네비 ── */}
      <View className="flex-row items-center justify-between px-[20px] py-[12px] border-b border-ef-divider">
        <View className="flex-row items-center gap-[10px]">
          <TouchableOpacity
            className="w-[34px] h-[34px] rounded-full items-center justify-center bg-ef-surface-2"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text className="text-[15px] font-extrabold text-ef-text">📌 포스트잇 붙이기</Text>
        </View>

        <View
          className="rounded-[20px] px-[10px] py-[4px]"
          style={{ backgroundColor: COLORS.surface2 }}
        >
          <Text
            className="text-[11px] font-bold"
            style={{
              color: charCount >= 185 ? COLORS.danger
                   : charCount >= 160 ? COLORS.amber
                   : COLORS.textMuted,
            }}
          >
            {charCount} / 200
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 내 정보 카드 ── */}
          <View
            className="flex-row items-center gap-[12px] bg-ef-surface rounded-[16px] px-[15px] py-[13px] mb-[16px]"
            style={{
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View
              className="w-[40px] h-[40px] rounded-full items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-[15px] font-extrabold text-white">나</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-[6px]">
                <Text className="text-[13.5px] font-extrabold text-ef-text" style={{ letterSpacing: -0.2 }}>
                  {nick}
                </Text>
                {!isAnon && (
                  <View
                    className="rounded-[20px] px-[7px] py-[1px]"
                    style={{ backgroundColor: COLORS.primaryTint }}
                  >
                    <Text className="text-[10px] font-bold" style={{ color: COLORS.primary }}>{MY_AGE}</Text>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-[3px] mt-[2px]">
                <Ionicons name="location-outline" size={9} color={COLORS.textMuted} />
                <Text className="text-[11px] font-sans text-ef-text-muted">{locText}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-[6px]">
              <Text className="text-[11px] font-bold text-ef-text-muted">익명</Text>
              <TouchableOpacity
                className="w-[36px] h-[20px] rounded-[10px] justify-center"
                style={{
                  backgroundColor: isAnon ? COLORS.primary : COLORS.surface2,
                  paddingHorizontal: 2,
                }}
                onPress={() => setIsAnon(v => !v)}
                activeOpacity={0.8}
              >
                <View
                  className="w-[16px] h-[16px] rounded-full bg-white"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.18,
                    shadowRadius: 4,
                    elevation: 2,
                    alignSelf: isAnon ? 'flex-end' : 'flex-start',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── 포스트잇 카드 ── */}
          <View className="mb-[16px]">
            <View
              className="rounded-[2px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px]"
              style={{
                backgroundColor: POST_IT_COLORS[color],
                shadowColor: '#000',
                shadowOffset: { width: 3, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              {/* Color toolbar */}
              <View
                className="flex-row items-center gap-[8px] px-[16px] py-[10px]"
                style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}
              >
                <Text className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.35)', letterSpacing: 1 }}>
                  색상
                </Text>
                <View className="flex-row gap-[6px]">
                  {COLOR_ENTRIES.map(([key, hex]) => (
                    <TouchableOpacity
                      key={key}
                      className="w-[18px] h-[18px] rounded-full"
                      style={{
                        backgroundColor: hex,
                        borderWidth: color === key ? 2 : 0,
                        borderColor: 'rgba(0,0,0,0.25)',
                        transform: [{ scale: color === key ? 1.15 : 1 }],
                      }}
                      onPress={() => setColor(key)}
                      activeOpacity={0.8}
                    />
                  ))}
                </View>
              </View>

              {/* Title input */}
              <View
                className="px-[18px] pt-[14px] pb-[11px]"
                style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' }}
              >
                <TextInput
                  className="text-[15px] font-extrabold text-ef-text"
                  style={{ letterSpacing: -0.3 }}
                  placeholder="제목 (선택)"
                  placeholderTextColor="rgba(0,0,0,0.25)"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={30}
                />
              </View>

              {/* Body textarea — grid line background */}
              <View
                className="px-[18px] py-[12px]"
                style={{ minHeight: 180 }}
              >
                <TextInput
                  className="text-[13.5px] font-sans text-ef-text"
                  style={{ lineHeight: 24, minHeight: 180 }}
                  placeholder={'오늘 하루 어땠나요?\n짧게라도 마음을 적어 붙여보세요 📌\n\n이 게시판을 보는 누군가에게\n전하고 싶은 한 마디도 좋아요.'}
                  placeholderTextColor="rgba(0,0,0,0.28)"
                  value={body}
                  onChangeText={setBody}
                  maxLength={200}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Signature */}
              <View
                className="flex-row items-center justify-end gap-[5px] px-[18px] py-[10px] pb-[14px]"
                style={{ borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}
              >
                <Text className="text-[11px] font-sans" style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>from.</Text>
                <Text className="text-[12px] font-extrabold" style={{ color: COLORS.primary }}>{nick}</Text>
              </View>
            </View>
          </View>

          {/* ── 분위기 태그 ── */}
          <View className="mb-[14px]">
            <Text
              className="text-[11px] font-bold mb-[8px]"
              style={{ color: COLORS.textMuted, letterSpacing: 1 }}
            >
              분위기 태그
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
              {MOOD_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag.value}
                  className="flex-shrink-0 rounded-[20px] px-[13px] py-[7px]"
                  style={{
                    backgroundColor: mood === tag.value ? COLORS.primaryTint : COLORS.surface,
                    borderWidth: 1.5,
                    borderColor: mood === tag.value ? COLORS.primary : COLORS.divider,
                  }}
                  onPress={() => setMood(tag.value)}
                  activeOpacity={0.75}
                >
                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: mood === tag.value ? COLORS.primary : COLORS.textSecondary }}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── 공개 범위 ── */}
          <View className="mb-[14px]">
            <Text
              className="text-[11px] font-bold mb-[8px]"
              style={{ color: COLORS.textMuted, letterSpacing: 1 }}
            >
              공개 범위
            </Text>
            <View className="flex-row gap-[8px]">
              {SCOPE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  className="flex-1 items-center gap-[3px] rounded-[14px] py-[11px] px-[8px]"
                  style={{
                    backgroundColor: scope === opt.value ? COLORS.primaryTint : COLORS.surface,
                    borderWidth: 1.5,
                    borderColor: scope === opt.value ? COLORS.primary : COLORS.divider,
                  }}
                  onPress={() => setScope(opt.value)}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 18 }}>{opt.icon}</Text>
                  <Text
                    className="text-[12px] font-extrabold"
                    style={{ color: scope === opt.value ? COLORS.primary : COLORS.textPrimary }}
                  >
                    {opt.name}
                  </Text>
                  <Text className="text-[10px] font-sans text-ef-text-muted">{opt.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── 안내 카드 ── */}
          <View
            className="flex-row items-start gap-[8px] rounded-[12px] px-[13px] py-[10px] mb-[14px]"
            style={{
              backgroundColor: COLORS.primaryTint,
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
            }}
          >
            <View
              className="w-[18px] h-[18px] rounded-full items-center justify-center flex-shrink-0 mt-[1px]"
              style={{ backgroundColor: COLORS.primaryTint, borderWidth: 1, borderColor: COLORS.primaryBorder }}
            >
              <Ionicons name="information" size={10} color={COLORS.primary} />
            </View>
            <Text className="flex-1 text-[11px] font-sans text-ef-text-sub" style={{ lineHeight: 18 }}>
              붙인 포스트잇은 <Text className="font-extrabold" style={{ color: COLORS.primary }}>게시판 벽면</Text>에 공개됩니다.{'\n'}
              욕설·혐오 표현은 제재될 수 있어요. 누구나 좋아요와 댓글을 달 수 있습니다.
            </Text>
          </View>
        </ScrollView>

        {/* ── 전송 버튼 ── */}
        <View
          className="px-[16px] py-[10px] border-t border-ef-divider"
          style={{ backgroundColor: COLORS.bg }}
        >
          <TouchableOpacity
            className="w-full flex-row items-center justify-center gap-[8px] rounded-[16px] py-[15px]"
            style={{
              backgroundColor: posted
                ? COLORS.green
                : isReady ? COLORS.primary : COLORS.surface2,
              shadowColor: isReady ? COLORS.primary : 'transparent',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isReady ? 0.3 : 0,
              shadowRadius: 20,
              elevation: isReady ? 6 : 0,
            }}
            onPress={handlePost}
            activeOpacity={0.85}
            disabled={!isReady || posted}
          >
            <Ionicons
              name={posted ? 'checkmark-circle-outline' : 'document-text-outline'}
              size={15}
              color={isReady || posted ? '#fff' : COLORS.textMuted}
            />
            <Text
              className="text-[15px] font-extrabold"
              style={{ color: isReady || posted ? '#fff' : COLORS.textMuted }}
            >
              {posted ? '붙였어요! 📌' : '게시판에 붙이기'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
