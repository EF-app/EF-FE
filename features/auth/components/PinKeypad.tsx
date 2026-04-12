/**
 * @file features/auth/components/PinKeypad.tsx
 * @description 보안코드 입력 공용 컴포넌트
 *
 * - 4개 도트 인디케이터 (빈/채움/에러 상태)
 * - 에러 시 shake 애니메이션
 * - 3×3 숫자 키패드 + 뒤로가기(옵션) / 삭제 키
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const KEYS: { num: string; sub: string }[] = [
  { num: '1', sub: '' },
  { num: '2', sub: 'ABC' },
  { num: '3', sub: 'DEF' },
  { num: '4', sub: 'GHI' },
  { num: '5', sub: 'JKL' },
  { num: '6', sub: 'MNO' },
  { num: '7', sub: 'PQRS' },
  { num: '8', sub: 'TUV' },
  { num: '9', sub: 'WXYZ' },
];

interface PinKeypadProps {
  /** 현재 입력값 (최대 4자) */
  value: string;
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  /** 왼쪽 하단 뒤로가기 화살표. undefined이면 빈 셀 */
  onBack?: () => void;
  /** true일 때 도트가 빨갛게 바뀌고 shake 애니메이션 발동 */
  isError?: boolean;
  /** true일 때 키패드 전체 비활성화 (5회 실패 잠김) */
  isLocked?: boolean;
}

export default function PinKeypad({
  value,
  onKeyPress,
  onDelete,
  onBack,
  isError = false,
  isLocked = false,
}: PinKeypadProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  /* isError가 true로 바뀔 때마다 shake 실행 */
  useEffect(() => {
    if (!isError) return;
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 9,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 55, useNativeDriver: true }),
    ]).start();
  }, [isError]);

  /* 도트 색상 */
  const dotColor = (index: number) => {
    if (isError) return COLORS.danger;
    if (index < value.length) return COLORS.primary;
    return COLORS.surface2;
  };

  return (
    <View className="w-full items-center">
      {/* ── 도트 4개 ── */}
      <Animated.View
        className="flex-row gap-x-[20px] justify-center mb-[12px]"
        style={{ transform: [{ translateX: shakeAnim }] }}
      >
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: dotColor(i),
            }}
          />
        ))}
      </Animated.View>

      {/* ── 키패드 ── */}
      <View
        className="w-full px-[8px]"
        style={{ opacity: isLocked ? 0.35 : 1 }}
        pointerEvents={isLocked ? 'none' : 'auto'}
      >
        {/* 숫자 1–9 (3행) */}
        <View className="flex-row gap-[12px] mb-[12px]">
          {KEYS.slice(0, 3).map(k => <NumKey key={k.num} {...k} onPress={() => onKeyPress(k.num)} />)}
        </View>
        <View className="flex-row gap-[12px] mb-[12px]">
          {KEYS.slice(3, 6).map(k => <NumKey key={k.num} {...k} onPress={() => onKeyPress(k.num)} />)}
        </View>
        <View className="flex-row gap-[12px] mb-[12px]">
          {KEYS.slice(6, 9).map(k => <NumKey key={k.num} {...k} onPress={() => onKeyPress(k.num)} />)}
        </View>

        {/* 하단 행: 뒤로가기 | 0 | 삭제 */}
        <View className="flex-row gap-[12px]">
          {/* 왼쪽: 뒤로가기 화살표 or 빈 셀 */}
          {onBack ? (
            <FuncKey onPress={onBack}>
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </FuncKey>
          ) : (
            <View className="flex-1 h-[68px]" />
          )}

          {/* 0 */}
          <NumKey num="0" sub="+" onPress={() => onKeyPress('0')} />

          {/* 삭제 */}
          <FuncKey onPress={onDelete}>
            {/* backspace 아이콘: Ionicons의 backspace */}
            <Ionicons name="backspace-outline" size={22} color={COLORS.textPrimary} />
          </FuncKey>
        </View>
      </View>
    </View>
  );
}

/* ── 숫자 키 ── */
function NumKey({
  num,
  sub,
  onPress,
}: {
  num: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-1 h-[68px] bg-ef-surface rounded-[18px] items-center justify-center"
      style={{
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        className="text-[22px] font-extrabold text-ef-text"
        style={{ letterSpacing: -0.5, lineHeight: 26 }}
      >
        {num}
      </Text>
      {sub ? (
        <Text
          className="text-[8px] font-bold text-ef-text-muted"
          style={{ letterSpacing: 1.5, marginTop: 2 }}
        >
          {sub}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

/* ── 기능 키 (뒤로/삭제) ── */
function FuncKey({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      className="flex-1 h-[68px] items-center justify-center rounded-[18px]"
      activeOpacity={0.6}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
