/**
 * @file features/home/bal-game/apply/components/StepProgressBar.tsx
 * @description Step 진행 상태 바
 */

import { COLORS } from '@/constants/colors';
import React from 'react';
import { View } from 'react-native';

interface Props {
  total: number;
  /** 현재 진행 중인 step (1-based). 이 step 앞의 segment는 done, 현재는 active, 이후는 pending. */
  current: number;
}

const StepProgressBar: React.FC<Props> = ({ total, current }) => (
  <View className="flex-row gap-[5px] mb-6">
    {Array.from({ length: total }).map((_, i) => {
      const idx = i + 1;
      const done = idx < current;
      const active = idx === current;
      return (
        <View
          key={i}
          className="flex-1 rounded-[2px]"
          style={{
            height: 3,
            backgroundColor:
              done || active ? COLORS.primary : COLORS.surface2,
            opacity: active && !done ? 0.45 : 1,
          }}
        />
      );
    })}
  </View>
);

export default StepProgressBar;
