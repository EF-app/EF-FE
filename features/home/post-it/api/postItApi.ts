/**
 * @file features/home/post-it/api/postItApi.ts
 * @description 종이비행기 우체통 Mock API (백엔드 연결 전 임시 데이터)
 */

import type { PostIt } from '@home/post-it/types';

const MOCK_POST_ITS: PostIt[] = [
  {
    id: 'pi-001',
    avatarEmoji: '🌙',
    avatarColor: '#9686BF',
    nickname: '달빛여행자',
    timeAgo: '3분 전',
    message: '오늘 처음 가입했는데 다들 반가워요 ☺️ 좋은 인연 만나고 싶어요!',
    likeCount: 12,
    isLiked: false,
  },
  {
    id: 'pi-002',
    avatarEmoji: '🍓',
    avatarColor: '#BF9696',
    nickname: '딸기우유',
    timeAgo: '11분 전',
    message: '밸런스 게임 결과 보고 깜짝 놀랐어요 여러분은 어떻게 생각해요?',
    likeCount: 7,
    isLiked: true,
  },
  {
    id: 'pi-003',
    avatarEmoji: '🌿',
    avatarColor: '#8BBFA8',
    nickname: '초록초록',
    timeAgo: '24분 전',
    message: '날씨 너무 좋다 산책 같이 갈 사람~',
    likeCount: 21,
    isLiked: false,
  },
  {
    id: 'pi-004',
    avatarEmoji: '☕',
    avatarColor: '#C4885A',
    nickname: '카페라떼',
    timeAgo: '1시간 전',
    message: '혼자 카페 왔는데 옆자리 분이 너무 예쁘셔서 심장이 두근두근...',
    likeCount: 34,
    isLiked: false,
  },
  {
    id: 'pi-005',
    avatarEmoji: '🌸',
    avatarColor: '#EDE9F6',
    nickname: '봄날',
    timeAgo: '2시간 전',
    message: '요즘 드라마 뭐 보세요? 추천해주시면 같이 얘기해요 💜',
    likeCount: 9,
    isLiked: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchRecentPostIts = async (): Promise<PostIt[]> => {
  await delay(700);
  return MOCK_POST_ITS;
};

export const togglePostItLike = async (
  postItId: string,
  currentLiked: boolean,
): Promise<{ id: string; isLiked: boolean; likeCount: number }> => {
  await delay(300);
  const item = MOCK_POST_ITS.find((p) => p.id === postItId);
  if (!item) throw new Error('PostIt not found');
  return {
    id: postItId,
    isLiked: !currentLiked,
    likeCount: currentLiked ? item.likeCount - 1 : item.likeCount + 1,
  };
};
