/**
 * @file common/components/NoticeList.tsx
 * @description 점 + 줄글 형식의 안내/주의사항 박스
 */

import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  items: string[];
  /** 점/박스 강조 색 */
  accentColor?: string;
  /** 박스 배경 (기본: 강조색의 5%) */
  backgroundColor?: string;
  /** 텍스트 색상 (기본: 강조색의 어두운 톤) */
  textColor?: string;
}

const NoticeList: React.FC<Props> = ({
  items,
  accentColor = '#E84C7A',
  backgroundColor,
  textColor = '#9A4060',
}) => {
  const bg = backgroundColor ?? `${accentColor}0D`; // ~5%
  const border = `${accentColor}1F`;                 // ~12%

  return (
    <View
      className="rounded-[12px] px-[14px] py-[12px]"
      style={{
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      {items.map((t, i) => (
        <View
          key={i}
          className="flex-row items-start"
          style={{ marginBottom: i === items.length - 1 ? 0 : 4 }}
        >
          <View
            className="rounded-full"
            style={{
              width: 4,
              height: 4,
              marginTop: 6,
              marginRight: 6,
              backgroundColor: accentColor,
            }}
          />
          <Text
            className="text-[11.5px]"
            style={{
              color: textColor,
              flex: 1,
              lineHeight: 18,
            }}
          >
            {t}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default NoticeList;
