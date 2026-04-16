/**
 * @file features/home/api/homeApi.ts
 * @description 홈 화면 Mock API — 실제 백엔드 연동 전 임시 데이터 + 지연 시뮬레이션
 */

import type {
  BalanceGamePreview,
  HomeFeed,
  PostitPreview,
  VoteSide,
} from '@home/types';

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const MOCK_BALANCE: BalanceGamePreview = {
  id: 'bal-home-001',
  participantCount: 2431,
  isHot: true,
  commentCount: 328,
  optionA: {
    key: 'a',
    emoji: '💳',
    scenario: '출근길 지하철\n개찰구 앞에서',
    label: '교통카드\n놓고온 거 인지함',
    votes: 620,
  },
  optionB: {
    key: 'b',
    emoji: '🎧',
    scenario: '출근길 지하철\n개찰구 앞에서',
    label: '이어폰\n두고온 거 인지함',
    votes: 380,
  },
  comments: [
    {
      id: 'bc-1',
      avatar: '🌙',
      nickname: '달빛여행자',
      message: '교통카드는 진짜 멘붕이죠 ㅋㅋ 뒤에 줄 서있는 사람 눈빛…',
    },
    {
      id: 'bc-2',
      avatar: '🍓',
      nickname: '딸기우유',
      message: '이어폰은 조용히 가면 되는데 교통카드는 게이트 막혀서 큰일',
    },
    {
      id: 'bc-3',
      avatar: '☕',
      nickname: '카페라떼',
      message: '둘 다 겪어봤는데 교통카드가 훨씬 창피함 확실히',
    },
  ],
};

const MOCK_POSTITS: PostitPreview[] = [
  {
    id: 'pi-home-1',
    avatar: '🌙',
    nickname: '달빛여행자',
    timeAgo: '3분 전',
    message: '오늘 하루도 수고했어요. 내일은 분명 더 좋은 일이 기다리고 있을 거예요 🌿',
    likeCount: 124,
    isLiked: true,
    tone: 'p1',
  },
  {
    id: 'pi-home-2',
    avatar: '🍓',
    nickname: '딸기우유',
    timeAgo: '12분 전',
    message: '요즘 새로운 취미를 찾고 있어요. 혹시 비슷한 분 계신가요? 같이 이야기 나눠봐요 :)',
    likeCount: 87,
    isLiked: false,
    tone: 'p2',
  },
  {
    id: 'pi-home-3',
    avatar: '🌿',
    nickname: '초록초록',
    timeAgo: '28분 전',
    message: '창 밖으로 봄이 왔어요. 벚꽃이 피기 시작했는데 올해는 누구랑 같이 보러 갈까요 🌸',
    likeCount: 56,
    isLiked: false,
    tone: 'p3',
  },
  {
    id: 'pi-home-4',
    avatar: '☕',
    nickname: '카페라떼',
    timeAgo: '1시간 전',
    message: '따뜻한 커피 한 잔과 함께 보내는 오후. 이 순간이 누군가에게도 작은 위로가 되길 🤍',
    likeCount: 42,
    isLiked: false,
    tone: 'p4',
  },
  {
    id: 'pi-home-5',
    avatar: '🌻',
    nickname: '민들레',
    timeAgo: '2시간 전',
    message: '첫 월급 받았어요! 오늘 하루가 특별하게 느껴지는 날 ✨ 같이 기쁨 나눠요!',
    likeCount: 198,
    isLiked: true,
    tone: 'p5',
  },
];

export const fetchHomeFeed = async (): Promise<HomeFeed> => {
  await delay(600);
  return {
    balance: MOCK_BALANCE,
    postits: MOCK_POSTITS,
  };
};

export const voteBalance = async (
  gameId: string,
  side: VoteSide,
): Promise<BalanceGamePreview> => {
  await delay(300);
  const next: BalanceGamePreview = {
    ...MOCK_BALANCE,
    id: gameId,
    participantCount: MOCK_BALANCE.participantCount + 1,
    optionA: {
      ...MOCK_BALANCE.optionA,
      votes: MOCK_BALANCE.optionA.votes + (side === 'a' ? 1 : 0),
    },
    optionB: {
      ...MOCK_BALANCE.optionB,
      votes: MOCK_BALANCE.optionB.votes + (side === 'b' ? 1 : 0),
    },
  };
  return next;
};

export const togglePostitLike = async (
  postitId: string,
  currentLiked: boolean,
): Promise<{ id: string; isLiked: boolean; likeCount: number }> => {
  await delay(250);
  const item = MOCK_POSTITS.find((p) => p.id === postitId);
  if (!item) throw new Error('Postit not found');
  return {
    id: postitId,
    isLiked: !currentLiked,
    likeCount: currentLiked ? item.likeCount - 1 : item.likeCount + 1,
  };
};
