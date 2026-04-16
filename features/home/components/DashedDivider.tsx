/**
 * @file features/home/components/DashedDivider.tsx
 * @description 섹션 구분용 점선 divider
 */

import React from 'react';
import { View } from 'react-native';

const DASHES = Array.from({ length: 40 });

const DashedDivider: React.FC = () => (
  <View
    className="flex-row items-center mx-6 my-[28px]"
    style={{ height: 1, overflow: 'hidden' }}
  >
    {DASHES.map((_, i) => (
      <View
        key={i}
        style={{
          flex: 1,
          height: 1,
          backgroundColor: i % 2 === 0 ? 'rgba(150,134,191,0.22)' : 'transparent',
          marginRight: 2,
        }}
      />
    ))}
  </View>
);

export default DashedDivider;
