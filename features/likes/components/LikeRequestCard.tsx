/**
 * @file features/likes/components/LikeRequestCard.tsx
 * @description 매칭 요청(좋아요) 1건을 표현하는 카드. variant로 sent/received 구분
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { MatchRequestSummary, UserMini } from '../types';
import { formatRelative } from '../utils/time';

interface Props {
  request: MatchRequestSummary;
  variant: 'sent' | 'received';
  onPress?: (user: UserMini) => void;
  onCancel?: (requestId: string) => void;     // sent
  onAccept?: (requestId: string) => void;     // received
  onPass?: (requestId: string) => void;       // received
}

const LikeRequestCard: React.FC<Props> = ({
  request,
  variant,
  onPress,
  onCancel,
  onAccept,
  onPass,
}) => {
  const user = variant === 'sent' ? request.toUser : request.fromUser;
  if (!user) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.97}
      onPress={() => onPress?.(user)}
      className="bg-ef-surface rounded-[18px] mb-[10px] overflow-hidden flex-row"
      style={{
        borderWidth: 1,
        borderColor: 'rgba(150,134,191,0.10)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {/* avatar */}
      <View className="pl-[14px] py-[14px] flex-shrink-0">
        <View
          className="w-[50px] h-[50px] rounded-full items-center justify-center"
          style={{ backgroundColor: user.avatarBgColor }}
        >
          <Text style={{ fontSize: 20 }}>{user.avatarEmoji}</Text>
          {user.isOnline && (
            <View
              className="absolute rounded-full"
              style={{
                bottom: 1,
                right: 1,
                width: 11,
                height: 11,
                backgroundColor: COLORS.greenVivid,
                borderWidth: 2,
                borderColor: COLORS.surface,
              }}
            />
          )}
        </View>
      </View>

      {/* body */}
      <View className="flex-1 px-[12px] py-[14px]">
        <View className="flex-row items-start justify-between mb-[2px]">
          <View className="flex-row items-center gap-[6px] flex-shrink">
            <Text
              className="text-[14px] font-extrabold text-ef-text"
              style={{ letterSpacing: -0.3 }}
              numberOfLines={1}
            >
              {user.nickname}
            </Text>
            <Text
              className="text-[10px] font-bold"
              style={{
                color: COLORS.primary,
                backgroundColor: COLORS.primaryTint,
                borderRadius: 20,
                paddingHorizontal: 6,
                paddingVertical: 1,
                overflow: 'hidden',
              }}
            >
              {user.age}
            </Text>
          </View>
          <Text className="text-[10.5px] text-ef-text-muted ml-[6px]">
            {formatRelative(request.createdAt, variant === 'sent' ? '보냄' : '')}
          </Text>
        </View>

        <View className="flex-row items-center gap-[3px] mb-[6px]">
          <Ionicons name="location-outline" size={10} color={COLORS.textMuted} />
          <Text className="text-[11px] text-ef-text-muted">서울 {user.region}</Text>
        </View>

        {!!request.message && (
          <Text
            className="text-[12.5px] text-ef-text-sub mb-[8px]"
            style={{ lineHeight: 18 }}
            numberOfLines={1}
          >
            {request.message}
          </Text>
        )}

        <View className="flex-row gap-[5px]">
          {user.tags.slice(0, 3).map(t => (
            <View
              key={t}
              className="rounded-full px-[8px] py-[2px]"
              style={{ backgroundColor: COLORS.primaryTint }}
            >
              <Text
                className="text-[10.5px] font-bold"
                style={{ color: COLORS.primaryDeep }}
              >
                {t}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* actions */}
      <View className="px-[10px] py-[14px] items-center justify-center gap-[6px] flex-shrink-0">
        {variant === 'sent' && onCancel && (
          <>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onCancel(request.requestId)}
              className="w-[34px] h-[34px] rounded-full items-center justify-center"
              style={{ backgroundColor: COLORS.divider }}
            >
              <Ionicons name="close" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <Text
              className="text-[9.5px] font-bold"
              style={{ color: COLORS.primary }}
            >
              취소
            </Text>
          </>
        )}

        {variant === 'received' && (
          <>
            {onAccept && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onAccept(request.requestId)}
                className="w-[34px] h-[34px] rounded-full items-center justify-center"
                style={{
                  backgroundColor: COLORS.primary,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 4,
                }}
              >
                <Ionicons name="heart" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            {onPass && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onPass(request.requestId)}
                className="w-[34px] h-[34px] rounded-full items-center justify-center"
                style={{ backgroundColor: COLORS.divider }}
              >
                <Ionicons name="close" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LikeRequestCard;
