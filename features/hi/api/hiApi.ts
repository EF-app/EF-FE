/**
 * @file features/hi/api/hiApi.ts
 */

import { MatchProfile } from '../types';

const MOCK_PROFILES: MatchProfile[] = [
  { id:1,  type:'interest',   name:'지수', age:26, loc:'서울 마포구',  mbti:'INFP', emoji:'🌸', bgColor:'#C5BAE0', tags:['홈카페','전시회','인디음악','클라이밍','드로잉'],       bio:'서울에서 디자이너로 일하고 있어요. 주말엔 홈카페 만들거나 전시회 가는 걸 좋아해요 :)', match:78 },
  { id:2,  type:'interest',   name:'하준', age:28, loc:'서울 성수동',  mbti:'INFJ', emoji:'🌿', bgColor:'#A8D5BA', tags:['독서','카페투어','필름사진','재테크','캠핑'],             bio:'책 읽고 커피 마시는 게 최고의 주말이에요. 같이 필름 찍으러 다니실 분 있나요?', match:75 },
  { id:3,  type:'interest',   name:'소연', age:25, loc:'경기 판교',    mbti:'ISFP', emoji:'🌺', bgColor:'#F0D5C0', tags:['캠핑','맛집탐방','요가','드로잉','피크닉'],              bio:'자연이랑 사람이랑 같이 있을 때 가장 행복해요. 같이 캠핑 가실 분 구해요!', match:76 },
  { id:4,  type:'interest',   name:'민준', age:29, loc:'서울 강남',    mbti:'ENTP', emoji:'⚡', bgColor:'#B8D4F0', tags:['독서','국내여행','K-POP','웹툰','재테크'],               bio:'다양한 관심사를 가진 사람이에요. 새로운 것 배우는 게 즐거워요! 함께 성장해요.', match:75 },
  { id:5,  type:'interest',   name:'하늘', age:27, loc:'서울 홍대',    mbti:'INFP', emoji:'🌙', bgColor:'#D5B8F0', tags:['뮤지컬','필름사진','카공','명상','반려식물'],            bio:'뮤지컬 보고 울기 선수예요. 감수성 풍부하고 혼자도 잘 놀아요 😊', match:77 },
  { id:6,  type:'ideal',      name:'준서', age:30, loc:'서울 용산',    mbti:'ENTJ', emoji:'🦁', bgColor:'#F0E0C0', tags:['러닝','커리어개발','와인','스키','독서'],                bio:'목표 있게 살아가는 걸 좋아해요. 함께 성장할 수 있는 분을 원해요. 주말엔 러닝!', match:91 },
  { id:7,  type:'ideal',      name:'아린', age:24, loc:'서울 연남동',  mbti:'INFJ', emoji:'🌌', bgColor:'#B8C8F0', tags:['드로잉','고양이','차','필사','향수'],                    bio:'조용하지만 깊은 대화를 좋아해요. 취향 잘 맞는 분 만나고 싶어요.', match:88 },
  { id:8,  type:'ideal',      name:'태양', age:27, loc:'인천 송도',    mbti:'INTJ', emoji:'🦅', bgColor:'#3A4A6A', tags:['연극','인디음악','필름사진','재테크','캠핑'],            bio:'독특한 취향의 소유자예요. 같은 공간에서 각자의 시간을 즐기는 걸 좋아해요.', match:85 },
  { id:9,  type:'ideal',      name:'나연', age:26, loc:'서울 마포구',  mbti:'ISFJ', emoji:'🛡️', bgColor:'#E8D8F0', tags:['요리','홈카페','뜨개질','산책','영화'],                 bio:'집에서 조용히 뜨개질하거나 요리하는 게 행복이에요. 따뜻한 대화 좋아요 🍵', match:83 },
  { id:10, type:'attraction', name:'서준', age:27, loc:'서울 이태원',  mbti:'ESTP', emoji:'⚡', bgColor:'#F0C8C0', tags:['헬스','클라이밍','맥주','드라이브','볼링'],             bio:'에너지 넘치고 즉흥적인 편이에요. 재미있는 거 같이 해요! 어디든 잘 따라가요.', match:62 },
  { id:11, type:'attraction', name:'유나', age:26, loc:'서울 신촌',    mbti:'ENFJ', emoji:'🌟', bgColor:'#F8F0B8', tags:['춤','K-POP','칵테일','페스티벌','코인노래방'],         bio:'밝고 명랑한 성격이에요. 함께 있으면 즐거운 시간 보장해요 🎉', match:58 },
  { id:12, type:'attraction', name:'우진', age:29, loc:'서울 건대',    mbti:'ISTP', emoji:'🔧', bgColor:'#C8E0C8', tags:['자전거','요리','보드게임','캠핑','드라이브'],           bio:'말수는 적지만 행동파예요. 맛있는 거 같이 먹으면 다 통해요. 요리 잘해요!', match:60 },
  { id:13, type:'attraction', name:'채원', age:25, loc:'서울 상수',    mbti:'ENFP', emoji:'🦋', bgColor:'#F0D0E8', tags:['춤','SNS','페스티벌','맛집탐방','여행'],               bio:'새로운 것에 호기심이 많아요. 낯선 곳 여행하고 춤추는 게 취미예요 💃', match:55 },
  { id:14, type:'random',     name:'채린', age:25, loc:'서울 합정',    mbti:'ESFP', emoji:'🎉', bgColor:'#F8D0E8', tags:['코인노래방','쇼핑','브런치','SNS','방탈출'],           bio:'활기차고 트렌디한 편이에요. 새로운 장소 탐방하는 것 좋아해요! 같이 가요~', match:48 },
  { id:15, type:'random',     name:'도현', age:31, loc:'서울 강동',    mbti:'ISTJ', emoji:'📋', bgColor:'#D8D8E8', tags:['독서','주식','등산','골프','신문읽기'],                 bio:'차분하고 안정적인 성격이에요. 서로 다른 매력이 끌릴 수도 있지 않을까요?', match:45 },
  { id:16, type:'random',     name:'지우', age:28, loc:'서울 종로',    mbti:'ESFJ', emoji:'🌈', bgColor:'#D0F0D0', tags:['봉사활동','플로깅','친환경','요리','피크닉'],           bio:'지구를 사랑하는 사람이에요. 함께 플로깅하고 건강한 음식 나눠먹어요 🌱', match:43 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchProfiles(): Promise<MatchProfile[]> {
  await new Promise(r => setTimeout(r, 400));
  return shuffle(MOCK_PROFILES);
}
