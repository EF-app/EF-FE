/**
 * @file features/my/components/ProfileHeroCard.tsx
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onEdit: () => void;
}

const BADGE_STYLES: Record<'expert' | 'level' | 'hot', { bg: string; color: string }> = {
  expert: { bg: COLORS.primaryTint,           color: COLORS.primary },
  level:  { bg: 'rgba(91,185,140,0.12)',       color: COLORS.greenVivid },
  hot:    { bg: 'rgba(212,101,90,0.10)',       color: COLORS.red },
};

const ProfileHeroCard: React.FC<Props> = ({ profile, onEdit }) => (
  <View
    className="mx-[20px] mt-[16px] mb-[12px] bg-ef-surface rounded-[22px] px-[20px] pt-[22px] pb-[20px]"
    style={{
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.13,
      shadowRadius: 32,
      elevation: 4,
    }}
  >
    {/* Top row: avatar + info */}
    <View className="flex-row items-center gap-[16px] mb-[18px]">
      {/* Avatar */}
      <View className="relative">
        <View
          className="w-[66px] h-[66px] rounded-[22px] items-center justify-center"
          style={{ background: undefined, backgroundColor: COLORS.primary }}
        >
          <Text className="text-[26px] font-extrabold text-white" style={{ letterSpacing: -0.4 }}>
            {profile.initial}
          </Text>
        </View>
        {/* Edit badge */}
        <TouchableOpacity
          className="absolute bottom-[-4px] right-[-4px] w-[22px] h-[22px] rounded-[8px] items-center justify-center border-[2px]"
          style={{ backgroundColor: COLORS.primary, borderColor: COLORS.surface }}
          onPress={onEdit}
        >
          <Ionicons name="pencil" size={10} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-[19px] font-extrabold text-ef-text mb-[4px]" style={{ letterSpacing: -0.5 }}>
          {profile.name}
        </Text>
        <View className="flex-row flex-wrap gap-[6px] mb-[5px]">
          {profile.badges.map(b => {
            const style = BADGE_STYLES[b.variant];
            return (
              <View key={b.label} className="rounded-[8px] px-[9px] py-[3px]" style={{ backgroundColor: style.bg }}>
                <Text className="text-[10px] font-bold" style={{ color: style.color }}>{b.label}</Text>
              </View>
            );
          })}
        </View>
        <Text className="text-[12px] font-sans text-ef-text-sub" style={{ lineHeight: 18 }}>
          {profile.bio}{'\n'}
          {profile.location} · 가입 {profile.joinedDate}
        </Text>
      </View>
    </View>

    {/* Stats row */}
    <View className="flex-row border-t border-ef-divider pt-[16px]">
      {profile.stats.map((stat, i) => (
        <View
          key={stat.label}
          className="flex-1 items-center gap-[3px]"
          style={i > 0 ? { borderLeftWidth: 1, borderLeftColor: COLORS.divider } : {}}
        >
          <Text className="text-[18px] font-extrabold text-ef-text" style={{ letterSpacing: -0.4 }}>
            {stat.value}
          </Text>
          <Text className="text-[10px] font-sans text-ef-text-muted">{stat.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default ProfileHeroCard;
