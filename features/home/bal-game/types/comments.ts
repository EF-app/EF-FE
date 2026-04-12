/**
 * @file features/home/bal-game/types/comments.ts
 */

export interface CommentReply {
  id: number;
  userId: string;
  nick: string;
  letter: string;
  avColor: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  deleted: boolean;
}

export interface Comment {
  id: number;
  userId: string;
  nick: string;
  letter: string;
  avColor: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  deleted: boolean;
  replies: CommentReply[];
}
