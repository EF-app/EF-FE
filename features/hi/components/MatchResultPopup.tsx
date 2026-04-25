/**
 * @file features/hi/components/MatchResultPopup.tsx
 * @description Hi탭에서 양쪽이 모두 좋아요 했을 때 표시되는 매칭 완료 팝업
 *
 * 사용 예:
 *   const [matched, setMatched] = useState<MatchSummary | null>(null);
 *   <MatchResultPopup match={matched} myInitial="나" onClose={() => setMatched(null)} />
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { MatchSummary } from '@/features/likes/types';

interface Props {
  match: MatchSummary | null;
  myInitial?: string;
  myAvatarBgColor?: string;
  /** 공통 키워드 — 호출자가 계산해서 넘기거나 matchedUser.tags 일부 사용 */
  commonKeywords?: string[];
  onClose: () => void;
  onStartChat?: (chatRoomId: string) => void;
  onSendLetter?: (userId: string) => void;
}

const MatchResultPopup: React.FC<Props> = ({
  match,
  myInitial = '나',
  myAvatarBgColor = COLORS.primary,
  commonKeywords,
  onClose,
  onStartChat,
  onSendLetter,
}) => {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (match) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 110,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [match, scale, opacity]);

  if (!match) return null;
  const u = match.matchedUser;
  const keywords = commonKeywords ?? u.tags.slice(0, 3);

  const goChat = () => {
    onClose();
    onStartChat
      ? onStartChat(match.chatRoomId)
      : router.push({
          pathname: '/chat-room',
          params: { chatRoomId: match.chatRoomId },
        });
  };

  const goLetter = () => {
    onClose();
    onSendLetter && onSendLetter(u.id);
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      {/* dim */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(18,16,26,0.58)',
          opacity,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ ...StyleSheetAbsolute }}
          accessibilityLabel="팝업 닫기"
        />

        <Animated.View
          style={{
            transform: [{ scale }],
            opacity,
            width: '100%',
            maxWidth: 330,
            backgroundColor: COLORS.surface,
            borderRadius: 28,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.28,
            shadowRadius: 60,
            elevation: 20,
          }}
        >
          {/* close */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 5,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(0,0,0,0.06)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* hero */}
          <View
            style={{
              backgroundColor: '#EDE8F8',
              paddingTop: 28,
              paddingBottom: 22,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}
          >
            {/* avatar pair */}
            <View
              className="flex-row items-center"
              style={{ marginBottom: 16 }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: myAvatarBgColor,
                  borderWidth: 3,
                  borderColor: 'rgba(255,255,255,0.85)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>
                  {myInitial}
                </Text>
                {/* heart badge */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#E84C7A',
                    borderWidth: 2.5,
                    borderColor: '#EDE8F8',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                  }}
                >
                  <Ionicons name="heart" size={11} color="#fff" />
                </View>
              </View>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: u.avatarBgColor,
                  borderWidth: 3,
                  borderColor: 'rgba(255,255,255,0.85)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: -16,
                  zIndex: 1,
                }}
              >
                <Text style={{ fontSize: 24 }}>{u.avatarEmoji}</Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 22,
                fontWeight: '800',
                color: COLORS.textPrimary,
                letterSpacing: -0.6,
                marginBottom: 5,
              }}
            >
              <Text style={{ color: COLORS.primary }}>매칭</Text>되었어요! 🎉
            </Text>
            <Text
              style={{
                fontSize: 12.5,
                color: COLORS.textMuted,
                lineHeight: 20,
                textAlign: 'center',
              }}
            >
              서로 좋아요를 눌렀어요{'\n'}지금 바로 대화해보세요!
            </Text>
          </View>

          {/* profile section */}
          <View
            style={{
              paddingHorizontal: 18,
              paddingTop: 16,
              paddingBottom: 14,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.divider,
            }}
          >
            <View className="flex-row items-center gap-[12px] mb-[12px]">
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: u.avatarBgColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(139,191,168,0.3)',
                  shadowColor: COLORS.greenVivid,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 18 }}>{u.avatarEmoji}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-[6px]">
                  <Text
                    className="text-[15px] font-extrabold text-ef-text"
                    style={{ letterSpacing: -0.3 }}
                  >
                    {u.nickname}
                  </Text>
                  <Text
                    className="text-[10px] font-bold"
                    style={{
                      color: COLORS.primary,
                      backgroundColor: COLORS.primaryTint,
                      paddingHorizontal: 7,
                      paddingVertical: 1,
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  >
                    {u.age}
                  </Text>
                </View>
                <View className="flex-row items-center gap-[3px] mt-[2px]">
                  <Ionicons name="location-outline" size={10} color={COLORS.textMuted} />
                  <Text className="text-[11px] text-ef-text-muted">{u.region}</Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                }}
              >
                <Text className="text-[13px] font-extrabold text-white">
                  ✨ {u.matchScore}%
                </Text>
              </View>
            </View>

            <Text
              className="text-[9.5px] font-extrabold text-ef-text-muted mb-[7px]"
              style={{ letterSpacing: 0.6 }}
            >
              공통 키워드
            </Text>
            <View className="flex-row flex-wrap gap-[5px]">
              {keywords.map(k => (
                <View
                  key={k}
                  className="rounded-full"
                  style={{
                    backgroundColor: COLORS.primaryTint,
                    paddingHorizontal: 11,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    className="text-[11.5px] font-bold"
                    style={{ color: COLORS.primaryDeep }}
                  >
                    {k}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* actions */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 14,
              paddingBottom: 18,
              gap: 8,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={goChat}
              className="flex-row items-center justify-center rounded-[14px]"
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 14,
                gap: 8,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.38,
                shadowRadius: 18,
                elevation: 6,
              }}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
              <Text
                className="text-[14px] font-extrabold text-white"
                style={{ letterSpacing: -0.3 }}
              >
                지금 대화 시작하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={goLetter}
              className="flex-row items-center justify-center rounded-[14px]"
              style={{
                backgroundColor: '#F0EBF8',
                paddingVertical: 13,
                gap: 8,
              }}
            >
              <Ionicons name="mail-outline" size={15} color={COLORS.primaryDeep} />
              <Text
                className="text-[13.5px] font-bold"
                style={{ color: COLORS.primaryDeep, letterSpacing: -0.3 }}
              >
                편지 보내기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="items-center justify-center"
              style={{ paddingVertical: 4 }}
            >
              <Text
                className="text-[12.5px]"
                style={{ color: COLORS.textMuted }}
              >
                나중에 할게요
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const StyleSheetAbsolute = {
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

export default MatchResultPopup;
