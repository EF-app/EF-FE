/**
 * @file features/likes/components/SuperLikeCard.tsx
 * @description 슈퍼 좋아요(보낸/받은) 강조 카드
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
  onCancel?: (requestId: string) => void;
  onAccept?: (requestId: string) => void;
  onPass?: (requestId: string) => void;
}

const SuperLikeCard: React.FC<Props> = ({
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
      className="bg-ef-surface rounded-[18px] mb-[10px] flex-row p-[14px]"
      style={{
        borderWidth: 2,
        borderColor: COLORS.primary,
        gap: 14,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* large avatar with dashed wrap */}
      <View
        className="rounded-[14px]"
        style={{
          width: 110,
          height: 110,
          borderWidth: 1.5,
          borderColor: 'rgba(150,134,191,0.55)',
          borderStyle: 'dashed',
          padding: 4,
        }}
      >
        <View
          className="rounded-[10px] items-center justify-center"
          style={{
            flex: 1,
            backgroundColor: user.avatarBgColor,
          }}
        >
          <Text style={{ fontSize: 34 }}>{user.avatarEmoji}</Text>
          {user.isOnline && (
            <View
              className="absolute rounded-full"
              style={{
                bottom: 4,
                right: 4,
                width: 11,
                height: 11,
                backgroundColor: COLORS.greenVivid,
                borderWidth: 2,
                borderColor: COLORS.surface,
              }}
            />
          )}
        </View>
        <View
          className="absolute rounded-full items-center justify-center"
          style={{
            bottom: -4,
            left: -4,
            width: 22,
            height: 22,
            backgroundColor: COLORS.primary,
            borderWidth: 2,
            borderColor: COLORS.surface,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>+</Text>
        </View>
      </View>

      {/* right column */}
      <View className="flex-1 justify-between">
        <View>
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-[6px]">
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
            <Text className="text-[10.5px] text-ef-text-muted">
              {formatRelative(request.createdAt, variant === 'sent' ? '전송' : '')}
            </Text>
          </View>

          <View className="flex-row items-center gap-[3px] mt-[2px] mb-[4px]">
            <Ionicons name="location-outline" size={10} color={COLORS.textMuted} />
            <Text className="text-[11px] text-ef-text-muted">서울 {user.region}</Text>
          </View>

          {!!request.message && (
            <Text
              className="text-[12px] text-ef-text-sub mb-[6px]"
              numberOfLines={2}
              style={{ lineHeight: 18 }}
            >
              {request.message}
            </Text>
          )}

          <View className="flex-row gap-[4px]">
            {user.tags.slice(0, 2).map(t => (
              <View
                key={t}
                className="rounded-full"
                style={{
                  backgroundColor: COLORS.primaryTint,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                }}
              >
                <Text
                  className="text-[10px] font-bold"
                  style={{ color: COLORS.primaryDeep }}
                >
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* status / actions */}
        {variant === 'sent' ? (
          <View
            className="flex-row items-center justify-between rounded-[12px] mt-[8px]"
            style={{
              backgroundColor: COLORS.primaryTint,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: 'rgba(150,134,191,0.18)',
            }}
          >
            <View className="flex-row items-center gap-[6px]">
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 7,
                  backgroundColor: COLORS.primary,
                }}
              />
              <Text
                className="text-[11.5px] font-extrabold"
                style={{ color: COLORS.primaryDeep, letterSpacing: -0.2 }}
              >
                답장 대기중
              </Text>
            </View>
            {onCancel && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onCancel(request.requestId)}
              >
                <Text
                  className="text-[10.5px] font-bold"
                  style={{ color: COLORS.textSecondary }}
                >
                  취소
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="flex-row items-center justify-end gap-[8px] mt-[8px]">
            {onPass && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onPass(request.requestId)}
                className="w-[34px] h-[34px] rounded-full items-center justify-center"
                style={{
                  backgroundColor: COLORS.surface,
                  borderWidth: 1,
                  borderColor: COLORS.divider,
                }}
              >
                <Ionicons name="close" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
            {onAccept && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onAccept(request.requestId)}
                className="flex-row items-center justify-center"
                style={{
                  flex: 1,
                  backgroundColor: COLORS.primary,
                  paddingVertical: 9,
                  paddingHorizontal: 16,
                  borderRadius: 22,
                  gap: 5,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 4,
                }}
              >
                <Ionicons name="heart" size={12} color="#fff" />
                <Text
                  className="text-[12px] font-extrabold text-white"
                  style={{ letterSpacing: -0.1 }}
                >
                  매칭하기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SuperLikeCard;
