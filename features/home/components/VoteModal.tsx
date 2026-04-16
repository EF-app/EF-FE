/**
 * @file features/home/components/VoteModal.tsx
 * @description 밸런스 투표 확인 모달 — 바텀시트
 */

import { COLORS } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  emoji: string;
  choiceLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

const VoteModal: React.FC<Props> = ({
  visible,
  emoji,
  choiceLabel,
  onConfirm,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} statusBarTranslucent>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(47,42,63,0.45)',
          opacity,
          justifyContent: 'flex-end',
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <Animated.View
          style={{
            backgroundColor: COLORS.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 40,
            borderTopWidth: 1.5,
            borderLeftWidth: 1.5,
            borderRightWidth: 1.5,
            borderColor: COLORS.primaryBorder,
            transform: [{ translateY }],
          }}
        >
          <View className="items-center">
            <View className="w-[40px] h-[4px] rounded-[2px] bg-ef-divider mb-5" />
          </View>

          <Text className="text-[40px] text-center mb-[6px]">{emoji}</Text>

          <Text
            className="text-[13px] text-center font-bold text-ef-text-sub mb-2"
            style={{ letterSpacing: -0.1 }}
          >
            이 선택에 투표할게요! ✨
          </Text>

          <View
            className="rounded-[16px] px-4 py-[14px] items-center mb-5"
            style={{
              backgroundColor: 'rgba(150,134,191,0.08)',
              borderWidth: 2,
              borderColor: 'rgba(150,134,191,0.18)',
            }}
          >
            <Text
              className="text-[17px] font-extrabold text-ef-text text-center"
              style={{ letterSpacing: -0.4, lineHeight: 24 }}
            >
              {choiceLabel}
            </Text>
          </View>

          <TouchableOpacity
            className="w-full py-[15px] rounded-[16px] bg-ef-primary items-center mb-[10px]"
            activeOpacity={0.88}
            onPress={onConfirm}
          >
            <Text
              className="text-[14px] text-white font-extrabold"
              style={{ letterSpacing: -0.3 }}
            >
              나도 이거야! 투표하기 🗳️
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full py-[13px] rounded-[16px] items-center"
            activeOpacity={0.75}
            onPress={onClose}
            style={{ borderWidth: 2, borderColor: COLORS.divider }}
          >
            <Text className="text-[13px] text-ef-text-sub font-bold">
              다시 생각해볼게요
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default VoteModal;
