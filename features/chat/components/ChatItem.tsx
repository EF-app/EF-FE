/**
 * @file features/chat/components/ChatItem.tsx
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { Chat } from '../types';

interface Props {
  chat: Chat;
  onPress: (chat: Chat) => void;
  onMemoPress: (chat: Chat) => void;
}

const ChatItem: React.FC<Props> = ({ chat, onPress, onMemoPress }) => {
  const hasMemo = !!chat.memo;

  return (
    <TouchableOpacity
      className="flex-row items-center px-[18px] py-[13px] gap-[12px]"
      activeOpacity={0.85}
      onPress={() => onPress(chat)}
    >
      {/* 아바타 */}
      <View
        className="w-[52px] h-[52px] rounded-full items-center justify-center flex-shrink-0"
        style={{ backgroundColor: chat.gradColors[1] }}
      >
        <Text style={{ fontSize: 26 }}>{chat.emoji}</Text>
        {chat.online && (
          <View
            className="absolute bottom-[1px] right-[1px] w-[12px] h-[12px] rounded-full border-[2px]"
            style={{ backgroundColor: COLORS.greenVivid, borderColor: COLORS.bg }}
          />
        )}
      </View>

      {/* 텍스트 */}
      <View className="flex-1 min-w-0 gap-[4px]">
        <View className="flex-row items-center justify-between gap-[6px]">
          <Text className="text-[15px] text-ef-text font-extrabold flex-shrink" numberOfLines={1} style={{ letterSpacing: -0.4 }}>
            {chat.name}
          </Text>
          <Text className="text-[11px] text-ef-text-muted font-bold flex-shrink-0">{chat.time}</Text>
        </View>
        <View className="flex-row items-center gap-[6px]">
          <Text
            className="flex-1 text-[12.5px] font-sans"
            style={{ color: chat.mine ? COLORS.textMuted : COLORS.textSecondary }}
            numberOfLines={1}
          >
            {chat.mine ? `나: ${chat.preview}` : chat.preview}
          </Text>
          {chat.unread > 0 && (
            <View
              className="min-w-[20px] h-[20px] rounded-[10px] px-[5px] items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-[11px] font-extrabold text-white">
                {chat.unread > 99 ? '99+' : chat.unread}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 메모 버튼 */}
      <TouchableOpacity
        className="w-[32px] h-[32px] rounded-[10px] items-center justify-center ml-[4px]"
        style={{ backgroundColor: hasMemo ? COLORS.primaryTint : 'transparent' }}
        onPress={() => onMemoPress(chat)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="pencil-outline"
          size={16}
          color={hasMemo ? COLORS.primary : COLORS.textMuted}
        />
        {hasMemo && (
          <View
            className="absolute top-[4px] right-[4px] w-[6px] h-[6px] rounded-full"
            style={{ backgroundColor: COLORS.primary }}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ChatItem;
