/**
 * @file features/hi/components/SwipeCard.tsx
 * @description Swipe card display — photo, info, tags, bio, like/pass stamps
 */

import React from 'react';
import { View, Text, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { MatchProfile, TYPE_META } from '../types';

interface Props {
  profile: MatchProfile;
  panX?: Animated.Value;
  behind?: 1 | 2;
}

const SwipeCard: React.FC<Props> = ({ profile, panX, behind }) => {
  const meta = TYPE_META[profile.type];

  const likeOpacity = panX
    ? panX.interpolate({ inputRange: [0, 50], outputRange: [0, 1], extrapolate: 'clamp' })
    : 0;
  const passOpacity = panX
    ? panX.interpolate({ inputRange: [-50, 0], outputRange: [1, 0], extrapolate: 'clamp' })
    : 0;

  const scaleStyle = behind === 2
    ? { transform: [{ scale: 0.91 }, { translateY: 14 }], opacity: 0.35 }
    : behind === 1
    ? { transform: [{ scale: 0.96 }, { translateY: 7 }], opacity: 0.6 }
    : undefined;

  return (
    <Animated.View
      className="absolute inset-0 bg-ef-surface rounded-[22px] overflow-hidden"
      style={[
        { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: behind ? 0 : 4 },
        scaleStyle,
      ]}
    >
      {/* ── Photo area ── */}
      <View className="h-[62%] relative items-center justify-center" style={{ backgroundColor: profile.bgColor, minHeight: 250 }}>
        <Text style={{ fontSize: 96 }}>{profile.emoji}</Text>

        {/* Subtle bottom fade overlay */}
        <View
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 70, backgroundColor: 'rgba(255,255,255,0.15)' }}
        />

        {/* Match type tag */}
        <View
          className="absolute top-3 left-3 flex-row items-center gap-[5px] rounded-[20px] px-[12px] py-[5px]"
          style={{ backgroundColor: meta.tagBg }}
        >
          <Text className="text-[11px] font-extrabold text-white">{meta.label}</Text>
        </View>

        {/* Score badge */}
        <View
          className="absolute top-3 right-3 rounded-[13px] px-[10px] py-[4px]"
          style={{ backgroundColor: 'rgba(0,0,0,0.42)' }}
        >
          <Text className="text-[12px] font-extrabold text-white">{profile.match}%</Text>
        </View>

        {/* LIKE stamp */}
        {!behind && (
          <Animated.View
            className="absolute top-7 left-[18px] border-[3px] rounded-[10px] px-[14px] py-[6px]"
            style={{ borderColor: COLORS.greenVivid, opacity: likeOpacity, transform: [{ rotate: '-14deg' }] }}
          >
            <Text className="text-[18px] font-extrabold" style={{ color: COLORS.greenVivid }}>LIKE 💜</Text>
          </Animated.View>
        )}

        {/* PASS stamp */}
        {!behind && (
          <Animated.View
            className="absolute top-7 right-[18px] border-[3px] rounded-[10px] px-[14px] py-[6px]"
            style={{ borderColor: COLORS.red, opacity: passOpacity, transform: [{ rotate: '14deg' }] }}
          >
            <Text className="text-[18px] font-extrabold" style={{ color: COLORS.red }}>PASS</Text>
          </Animated.View>
        )}
      </View>

      {/* ── Card body ── */}
      <ScrollView
        className="flex-1 bg-ef-surface"
        contentContainerStyle={{ padding: 14, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!behind}
      >
        {/* Name & age */}
        <View className="flex-row items-baseline gap-[8px] mb-[2px]">
          <Text className="text-[22px] font-extrabold text-ef-text" style={{ letterSpacing: -0.6 }}>
            {profile.name}
          </Text>
          <Text className="text-[15px] font-bold text-ef-text-sub">{profile.age}세</Text>
        </View>

        {/* Location & MBTI */}
        <View className="flex-row items-center gap-[5px] mb-[8px]">
          <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
          <Text className="text-[11.5px] font-sans text-ef-text-muted">{profile.loc}</Text>
          <Text className="text-[11.5px] font-sans text-ef-text-muted">·</Text>
          <Text className="text-[11.5px] font-sans text-ef-text-muted">{profile.mbti}</Text>
        </View>

        {/* Score bar */}
        <View className="flex-row items-center gap-[8px] mb-[9px]">
          <View className="flex-1 h-[4px] rounded-[2px] bg-ef-divider overflow-hidden">
            <View
              className="h-full rounded-[2px]"
              style={{ width: `${profile.match}%`, backgroundColor: meta.barColor }}
            />
          </View>
          <Text className="text-[12px] font-extrabold" style={{ color: meta.scoreColor }}>
            {profile.match}%
          </Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-[4px] mb-[8px]">
          {profile.tags.map(tag => (
            <View
              key={tag}
              className="rounded-[13px] px-[9px] py-[3px]"
              style={{ backgroundColor: `${meta.tagBg.replace('0.88', '0.12')}`, borderWidth: 1, borderColor: meta.tagBg.replace('0.88', '0.22') }}
            >
              <Text className="text-[11px] font-bold" style={{ color: meta.scoreColor }}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        <Text className="text-[12.5px] font-sans text-ef-text-sub" style={{ lineHeight: 20 }}>
          {profile.bio}
        </Text>
      </ScrollView>
    </Animated.View>
  );
};

export default SwipeCard;
