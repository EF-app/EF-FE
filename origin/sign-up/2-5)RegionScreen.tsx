import React, {useState, useCallback, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// ─── 색상 테마 ───
const C = {
  bg: '#F5F3F1',
  surface: '#FFFFFF',
  surface2: '#EDEAE7',
  primary: '#9686BF',
  primaryTint: 'rgba(150,134,191,0.10)',
  divider: '#EAE7E3',
  textPrimary: '#1C1A1F',
  textSecondary: '#6B6670',
  textMuted: '#ADA8B2',
};

const FONT = 'NanumSquareNeo';
const ITEM_H = 52;
const {height: SCREEN_H} = Dimensions.get('window');

// ─── 지역 데이터 ───
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

const COUNTRIES = [
  '그리스','나이지리아','남아프리카공화국','네덜란드','노르웨이',
  '뉴질랜드','대만','덴마크','독일','라오스','러시아','루마니아',
  '말레이시아','멕시코','모로코','몽골','미국','미얀마','바레인',
  '베트남','벨기에','볼리비아','브라질','사우디아라비아','스페인',
  '스웨덴','스위스','싱가포르','아랍에미리트','아르헨티나','아이슬란드',
  '영국','호주','오스트리아','요르단','우크라이나',
  '이스라엘','이집트','이탈리아','인도','인도네시아','일본',
  '중국','체코','칠레','카타르','캄보디아','캐나다','케냐',
  '콜롬비아','쿠웨이트','태국','튀르키예','튀니지','파키스탄',
  '페루','포르투갈','폴란드','프랑스','필리핀','핀란드','헝가리','홍콩',
];

const CITIES = Object.keys(REGION_DATA);

const getDistricts = (city: string): string[] => {
  if (city === '해외') return [];
  const arr = REGION_DATA[city];
  if (!arr) return ['선택안함'];
  return ['선택안함', ...arr.sort((a, b) => a.localeCompare(b, 'ko'))];
};

// ─── 피커 컬럼 컴포넌트 ───
interface PickerColumnProps {
  data: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const PickerColumn: React.FC<PickerColumnProps> = ({data, selectedIndex, onSelect}) => {
  const scrollRef = useRef<ScrollView>(null);
  const isScrolling = useRef(false);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / ITEM_H);
      const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
      scrollRef.current?.scrollTo({y: clampedIdx * ITEM_H, animated: true});
      onSelect(clampedIdx);
      isScrolling.current = false;
    },
    [data.length, onSelect],
  );

  // 피커 높이 계산 (5개 아이템)
  const pickerHeight = ITEM_H * 5;
  const topPadding = ITEM_H * 2;

  return (
    <View style={[styles.pickerCol, {height: pickerHeight}]}>
      {/* 페이드 마스크 */}
      <View style={[styles.fadeMask, styles.fadeTop]} pointerEvents="none" />
      <View style={[styles.fadeMask, styles.fadeBottom]} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{paddingVertical: topPadding}}>
        {data.map((item, idx) => {
          const diff = Math.abs(idx - selectedIndex);
          const isSelected = diff === 0;
          const isNear = diff === 1;

          return (
            <TouchableOpacity
              key={`${item}-${idx}`}
              style={styles.pickerItem}
              onPress={() => {
                scrollRef.current?.scrollTo({y: idx * ITEM_H, animated: true});
                onSelect(idx);
              }}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.pickerItemText,
                  isSelected && styles.pickerItemSelected,
                  isNear && styles.pickerItemNear,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ─── 메인 스크린 ───
const RegionScreen: React.FC = () => {
  const navigation = useNavigation();

  const [cityIdx, setCityIdx] = useState(0);
  const [districtIdx, setDistrictIdx] = useState(0);
  const [countryIdx, setCountryIdx] = useState(0);

  const selectedCity = CITIES[cityIdx];
  const isOverseas = selectedCity === '해외';
  const districts = useMemo(() => getDistricts(selectedCity), [selectedCity]);

  const chipText = useMemo(() => {
    if (isOverseas) {
      return `해외 · ${COUNTRIES[countryIdx] || ''}`;
    }
    const dist = districts[districtIdx] || '';
    return dist === '선택안함'
      ? `${selectedCity} · 구/군 선택안함`
      : `${selectedCity} ${dist}`;
  }, [isOverseas, selectedCity, districts, districtIdx, countryIdx]);

  const handleCitySelect = useCallback((idx: number) => {
    setCityIdx(idx);
    setDistrictIdx(0);
    setCountryIdx(0);
  }, []);

  const handleNext = useCallback(() => {
    // TODO: Zustand store에 region 저장
    // navigation.navigate('ProfileCreation');
    console.log('지역 설정 완료:', chipText);
  }, [chipText]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ─── 앱 헤더 ─── */}
      <View style={styles.appHeader}>
        <View style={styles.logoMark}>
          <Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>◇</Text>
        </View>
        <Text style={styles.appName}>이프</Text>
      </View>

      {/* ─── Content ─── */}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>지역 설정</Text>
        <Text style={styles.pageTitle}>어디에 살고 계신가요?</Text>
        <Text style={styles.pageSub}>
          가까운 사람을 추천해드리기 위해{'\n'}지역 정보가 필요해요
        </Text>
      </View>

      {/* ─── 피커 영역 ─── */}
      <View style={styles.pickerArea}>
        {/* 하이라이트 바 */}
        <View style={styles.pickerHighlight} pointerEvents="none" />

        {/* 시/도 컬럼 */}
        <PickerColumn
          data={CITIES}
          selectedIndex={cityIdx}
          onSelect={handleCitySelect}
        />

        {/* 구분선 */}
        <View style={styles.pickerDivider} />

        {/* 구/군 또는 나라 컬럼 */}
        {isOverseas ? (
          <PickerColumn
            data={COUNTRIES}
            selectedIndex={countryIdx}
            onSelect={setCountryIdx}
          />
        ) : (
          <PickerColumn
            data={districts}
            selectedIndex={districtIdx}
            onSelect={setDistrictIdx}
          />
        )}
      </View>

      {/* ─── 선택된 지역 칩 ─── */}
      <View style={styles.selectedRegion}>
        <View style={styles.regionChip}>
          <Text style={styles.regionChipIcon}>📍</Text>
          <Text style={styles.regionChipText}>{chipText}</Text>
        </View>
      </View>

      {/* ─── CTA ─── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.btnNext, styles.btnNextActive]}
          onPress={handleNext}
          activeOpacity={0.85}>
          <Text style={[styles.btnNextText, {color: '#fff'}]}>다음으로</Text>
          <Text style={{color: '#fff', fontSize: 16}}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},

  appHeader: {
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 14 : 20,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  appName: {fontSize: 15, fontWeight: '800', color: C.textPrimary, fontFamily: FONT},

  content: {paddingHorizontal: 28, paddingTop: 32},

  eyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: C.primary,
    fontFamily: FONT, marginBottom: 10, textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 26, fontWeight: '400', color: C.textPrimary, fontFamily: FONT,
    letterSpacing: -0.5, lineHeight: 34, marginBottom: 8,
  },
  pageSub: {
    fontSize: 13.5, fontWeight: '400', color: C.textSecondary, fontFamily: FONT,
    lineHeight: 22, marginBottom: 20,
  },

  // ─── Picker ───
  pickerArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  pickerHighlight: {
    position: 'absolute',
    left: 20, right: 20,
    height: ITEM_H,
    borderRadius: 14,
    backgroundColor: C.primaryTint,
  },
  pickerCol: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  fadeMask: {
    position: 'absolute',
    left: 0, right: 0,
    height: 90,
    zIndex: 2,
  },
  fadeTop: {
    top: 0,
    // React Native doesn't support CSS gradients, so we use opacity workaround
    backgroundColor: C.bg,
    opacity: 0.7,
  },
  fadeBottom: {
    bottom: 0,
    backgroundColor: C.bg,
    opacity: 0.7,
  },
  pickerItem: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemText: {
    fontSize: 17, fontWeight: '400', color: C.textMuted,
    fontFamily: FONT, letterSpacing: -0.3,
  },
  pickerItemSelected: {
    fontSize: 19, fontWeight: '700', color: C.textPrimary,
  },
  pickerItemNear: {
    fontSize: 16, color: C.textSecondary, fontWeight: '400',
  },
  pickerDivider: {
    width: 1, height: 180,
    backgroundColor: C.divider,
    zIndex: 3,
  },

  // ─── Selected region chip ───
  selectedRegion: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 28,
    minHeight: 60,
  },
  regionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.primaryTint,
    borderRadius: 20,
    paddingVertical: 7, paddingHorizontal: 14,
  },
  regionChipIcon: {fontSize: 12},
  regionChipText: {fontSize: 13, fontWeight: '700', color: C.primary, fontFamily: FONT},

  // ─── CTA ───
  ctaWrap: {paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 24},
  btnNext: {
    width: '100%', backgroundColor: '#E8E5E1', borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnNextActive: {
    backgroundColor: C.primary,
    ...Platform.select({
      ios: {shadowColor: C.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 24},
      android: {elevation: 8},
    }),
  },
  btnNextText: {fontSize: 15, fontWeight: '800', color: '#B0ABB5', fontFamily: FONT},
});

export default RegionScreen;
