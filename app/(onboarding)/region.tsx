/**
 * @file app/(onboarding)/region.tsx
 * @description 회원가입 5단계 – 거주 지역 설정 (ver2)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@components/AppHeader';
import CtaButton from '@components/CtaButton';
import { COLORS } from '@/constants/colors';
import { FONT_FAMILY, FONT_BOLD } from '@/constants/typography';

const ITEM_H = 52;
const COL_H  = 260;
const PAD_V  = (COL_H - ITEM_H) / 2; // 104

// ── 지역 데이터 ─────────────────────────────────────────────────────────────
const REGION_DATA: Record<string, string[] | null> = {
  서울: ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],
  경기: ['가평군','고양시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시','수원시','시흥시','안산시','안성시','안양시','양주시','양평군','여주시','연천군','오산시','용인시','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'],
  인천: ['강화군','계양구','남동구','동구','미추홀구','부평구','서구','연수구','옹진군','중구'],
  대전: ['대덕구','동구','서구','유성구','중구'],
  충북: ['괴산군','단양군','보은군','영동군','옥천군','음성군','제천시','증평군','진천군','청주시','충주시'],
  충남: ['계룡시','공주시','금산군','논산시','당진시','보령시','부여군','서산시','서천군','아산시','예산군','천안시','청양군','태안군','홍성군'],
  강원: ['강릉시','고성군','동해시','삼척시','속초시','양구군','양양군','영월군','원주시','인제군','정선군','철원군','춘천시','태백시','평창군','홍천군','화천군','횡성군'],
  부산: ['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'],
  경북: ['경산시','경주시','고령군','구미시','군위군','김천시','문경시','봉화군','상주시','성주군','안동시','영덕군','영양군','영주시','영천시','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군','포항시'],
  경남: ['거제시','거창군','고성군','김해시','남해군','밀양시','사천시','산청군','양산시','의령군','진주시','창녕군','창원시','통영시','하동군','함안군','함양군','합천군'],
  대구: ['군위군','남구','달서구','달성군','동구','북구','서구','수성구','중구'],
  울산: ['남구','동구','북구','울주군','중구'],
  광주: ['광산구','남구','동구','북구','서구'],
  전북: ['고창군','군산시','김제시','남원시','무주군','부안군','순창군','완주군','익산시','임실군','장수군','전주시','정읍시','진안군'],
  전남: ['강진군','고흥군','곡성군','광양시','구례군','나주시','담양군','목포시','무안군','보성군','순천시','신안군','여수시','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군'],
  세종: ['세종시 전체'],
  해외: null,
};

const CITY_ORDER = ['서울','경기','인천','대전','충북','충남','강원','부산','경북','경남','대구','울산','광주','전북','전남','세종','해외'];

const COUNTRIES = [
  '그리스','나이지리아','남아프리카공화국','네덜란드','노르웨이',
  '뉴질랜드','대만','덴마크','독일','라오스','러시아','루마니아',
  '말레이시아','멕시코','모로코','몽골','미국','미얀마','바레인',
  '베트남','벨기에','볼리비아','브라질','사우디아라비아','서반아(스페인)',
  '스웨덴','스위스','싱가포르','아랍에미리트','아르헨티나','아이슬란드',
  '영국','오스트레일리아(호주)','오스트리아','요르단','우크라이나',
  '이스라엘','이집트','이탈리아','인도','인도네시아','일본',
  '중국','체코','칠레','카타르','캄보디아','캐나다','케냐',
  '콜롬비아','쿠웨이트','태국','터키(튀르키예)','튀니지','파키스탄',
  '페루','포르투갈','폴란드','프랑스','필리핀','핀란드','헝가리','홍콩',
];

function getDistricts(city: string): string[] {
  if (city === '해외') return [];
  const raw = REGION_DATA[city];
  if (!raw) return ['선택안함'];
  return ['선택안함', ...[...raw].sort((a, b) => a.localeCompare(b, 'ko'))];
}

// ── 피커 컬럼 컴포넌트 ────────────────────────────────────────────────────
interface PickerColProps {
  items: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

const PickerCol: React.FC<PickerColProps> = ({ items, selectedIdx, onSelect }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [liveIdx, setLiveIdx] = useState(selectedIdx);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIdx * ITEM_H, animated: false });
    setLiveIdx(selectedIdx);
  }, [selectedIdx, items]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setLiveIdx(Math.round(y / ITEM_H));
  }, []);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      setLiveIdx(clamped);
      onSelect(clamped);
    },
    [items.length, onSelect],
  );

  return (
    <View className="flex-1 overflow-hidden relative" style={{ height: COL_H }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: PAD_V }}
        style={{ height: COL_H }}
      >
        {items.map((item, idx) => {
          const diff = Math.abs(idx - liveIdx);
          return (
            <View key={`${idx}-${item}`} className="items-center justify-center px-1" style={{ height: ITEM_H }}>
              <Text
                style={[
                  { fontSize: 16, fontFamily: FONT_FAMILY, color: COLORS.textMuted, letterSpacing: -0.3 },
                  diff === 0 && { fontSize: 19, fontFamily: FONT_BOLD, color: COLORS.textPrimary },
                  diff === 1 && { color: COLORS.textSecondary },
                ]}
                numberOfLines={1}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View
        className="absolute left-0 right-0 top-0 bg-ef-bg"
        style={{ height: 90, zIndex: 2, opacity: 0.88 }}
        pointerEvents="none"
      />
      <View
        className="absolute left-0 right-0 bottom-0 bg-ef-bg"
        style={{ height: 90, zIndex: 2, opacity: 0.88 }}
        pointerEvents="none"
      />
    </View>
  );
};

// ── 메인 화면 ─────────────────────────────────────────────────────────────
export default function RegionScreen() {
  const router = useRouter();
  const [cityIdx, setCityIdx]         = useState(0);
  const [districtIdx, setDistrictIdx] = useState(0);
  const [countryIdx, setCountryIdx]   = useState(0);

  const city       = CITY_ORDER[cityIdx];
  const isOverseas = city === '해외';
  const districts  = getDistricts(city);

  const handleCitySelect = useCallback((idx: number) => {
    setCityIdx(idx);
    setDistrictIdx(0);
    setCountryIdx(0);
  }, []);

  const chipText = isOverseas
    ? `해외 · ${COUNTRIES[countryIdx] ?? ''}`
    : districtIdx === 0
      ? `${city} · 구/군 선택안함`
      : `${city} ${districts[districtIdx] ?? ''}`;

  const handleNext = useCallback(() => {
    router.push('/(onboarding)/profile-creation');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-ef-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <AppHeader />

      <View className="flex-1 px-7 pt-6">
        <Text className="text-[11px] font-bold tracking-[1.4px] text-ef-primary mb-[10px] uppercase">
          지역 설정
        </Text>
        <Text
          className="text-[26px] font-sans text-ef-text mb-2"
          style={{ letterSpacing: -0.5, lineHeight: 34 }}
        >
          처음 오셨군요,{'\n'}반가워요! 👋
        </Text>
        <Text className="text-[13.5px] font-sans text-ef-text-sub leading-[22px] mb-7">
          자주 활동하는 지역을 선택하면{'\n'}그 지역 사람들과 만날 수 있어요.
        </Text>

        {/* ── 피커 영역 ── */}
        <View className="flex-row items-center relative" style={{ height: COL_H, marginHorizontal: -8 }}>
          {/* 중앙 하이라이트 바 */}
          <View
            className="absolute left-3 right-3 rounded-[14px] bg-ef-primary-tint"
            style={{ top: COL_H / 2 - ITEM_H / 2, height: ITEM_H, zIndex: 0 }}
            pointerEvents="none"
          />

          <PickerCol
            items={CITY_ORDER}
            selectedIdx={cityIdx}
            onSelect={handleCitySelect}
          />

          <View className="bg-ef-surface2" style={{ width: 1, height: 180, zIndex: 3 }} />

          {isOverseas ? (
            <PickerCol
              key="country"
              items={COUNTRIES}
              selectedIdx={countryIdx}
              onSelect={setCountryIdx}
            />
          ) : (
            <PickerCol
              key={city}
              items={districts}
              selectedIdx={districtIdx}
              onSelect={setDistrictIdx}
            />
          )}
        </View>

        {/* ── 선택된 지역 칩 ── */}
        <View className="items-center py-4">
          <View className="flex-row items-center gap-[6px] bg-ef-primary-tint rounded-[20px] py-[7px] px-[14px]">
            <Text className="text-[12px]">📍</Text>
            <Text className="text-[13px] font-bold text-ef-primary">{chipText}</Text>
          </View>
        </View>
      </View>

      {/* ── CTA ── */}
      <View
        className="px-6"
        style={{ paddingBottom: Platform.OS === 'ios' ? 34 : 24 }}
      >
        <CtaButton label="다음으로" active={true} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}
