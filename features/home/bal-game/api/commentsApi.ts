/**
 * @file features/home/bal-game/api/commentsApi.ts
 */

import { Comment } from '../types/comments';

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 1, userId: 'u1', nick: '차茶123', letter: '차', avColor: 'purple',
    text: '이거 무조건 닥 전 아님? ㅋㅋㅋ 교통카드는 진짜 망한거잖아',
    time: '5분 전', likes: 12, liked: false, deleted: false,
    replies: [
      { id: 11, userId: 'u2', nick: '녹차러버', letter: '녹', avColor: 'green',
        text: '맞아ㅋㅋ 이어폰은 그냥 음악 못 듣는 거고', time: '4분 전', likes: 4, liked: false, deleted: false },
      { id: 12, userId: 'u5', nick: '수달친구🦦', letter: '수', avColor: 'blue',
        text: '그래도 이어폰 없는 출근길은 지옥이야...', time: '4분 전', likes: 2, liked: false, deleted: false },
    ],
  },
  {
    id: 2, userId: 'u2', nick: '녹차러버', letter: '녹', avColor: 'green',
    text: '교통카드가 훨씬 치명적이지… 게이트 안 열려서 뒤에 줄 서있던 사람들 눈빛',
    time: '3분 전', likes: 8, liked: false, deleted: false, replies: [],
  },
  {
    id: 3, userId: 'u3', nick: '빵먹는곰🐻', letter: '빵', avColor: 'amber',
    text: '나는 둘 다 해봤는데 교통카드가 더 창피함 확실히',
    time: '2분 전', likes: 5, liked: false, deleted: false,
    replies: [
      { id: 31, userId: 'u4', nick: '뽀글이🐑', letter: '뽀', avColor: 'pink',
        text: 'ㅋㅋㅋ 경험자 말씀이시군요', time: '1분 전', likes: 1, liked: false, deleted: false },
    ],
  },
  {
    id: 4, userId: 'u6', nick: '하품하는팬더🐼', letter: '하', avColor: 'green',
    text: '이어폰 두고온 건 그냥 조용히 출근하면 되잖아요',
    time: '1분 전', likes: 3, liked: false, deleted: false, replies: [],
  },
];

export async function fetchComments(gameId: string): Promise<Comment[]> {
  await new Promise(r => setTimeout(r, 500));
  return MOCK_COMMENTS;
}
