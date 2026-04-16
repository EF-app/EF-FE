/**
 * @file features/home/bal-game/apply/components/StepHeader.tsx
 * @description Step eyebrow + title + desc 헤더
 */

import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}

const StepHeader: React.FC<Props> = ({ eyebrow, title, description }) => (
  <View className="mb-5">
    <Text
      className="text-[10px] text-ef-primary font-bold mb-[6px]"
      style={{ letterSpacing: 1.4, textTransform: 'uppercase' }}
    >
      {eyebrow}
    </Text>
    <Text
      className="text-[20px] text-ef-text font-extrabold mb-1"
      style={{ letterSpacing: -0.4, lineHeight: 26 }}
    >
      {title}
    </Text>
    <Text
      className="text-[12.5px] text-ef-text-sub font-sans"
      style={{ lineHeight: 20 }}
    >
      {description}
    </Text>
  </View>
);

export default StepHeader;
