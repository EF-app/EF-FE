/**
 * @file features/home/components/Greeting.tsx
 * @description 홈 인사말 섹션
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

const Greeting: React.FC = () => {
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wave, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: -1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [wave]);

  const rotate = wave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '14deg'],
  });

  return (
    <View className="px-[22px] pt-[14px] pb-[6px]">
      <View className="flex-row items-center gap-[6px]">
        <Animated.Text
          style={{ fontSize: 18, transform: [{ rotate }] }}
        >
          👋
        </Animated.Text>
        <Text
          className="text-[23px] text-ef-text font-extrabold"
          style={{ letterSpacing: -0.6, lineHeight: 30 }}
        >
          안녕하세요!
        </Text>
      </View>

      <Text
        className="text-[23px] text-ef-text font-extrabold mt-[2px]"
        style={{ letterSpacing: -0.6, lineHeight: 32 }}
      >
        <Text
          className="text-ef-primary-deep"
          style={{
            backgroundColor: 'rgba(150,134,191,0.18)',
          }}
        >
          오늘의 밸런스
        </Text>
        <Text className="text-ef-text">에 참여해볼까요?</Text>
      </Text>

      <Text
        className="text-[13px] text-ef-text-sub font-bold mt-2"
        style={{ letterSpacing: -0.2 }}
      >
        당신의 선택이 궁금해요 🌷
      </Text>
    </View>
  );
};

export default Greeting;
