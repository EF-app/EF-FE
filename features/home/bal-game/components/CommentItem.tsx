/**
 * @file features/home/bal-game/components/CommentItem.tsx
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { Comment, CommentReply } from '../types/comments';

const AV_COLORS: Record<string, { bg: string; color: string }> = {
  purple: { bg: COLORS.primaryTint,              color: COLORS.primary },
  green:  { bg: 'rgba(139,191,168,0.15)',          color: '#6aad94' },
  amber:  { bg: 'rgba(196,136,90,0.12)',           color: '#b07840' },
  pink:   { bg: 'rgba(191,150,170,0.14)',          color: '#a8607a' },
  blue:   { bg: 'rgba(100,150,210,0.12)',          color: '#5580b0' },
};

const MY_USER_ID = 'me';

interface AvatarProps { letter: string; avColor: string; size?: number }
const Avatar: React.FC<AvatarProps> = ({ letter, avColor, size = 30 }) => {
  const c = AV_COLORS[avColor] ?? AV_COLORS.purple;
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}
    >
      <Text style={{ fontSize: size === 30 ? 11 : 9, fontFamily: 'NanumSquareNeo-dEb', color: c.color }}>
        {letter}
      </Text>
    </View>
  );
};

interface ReplyItemProps {
  reply: CommentReply;
  onLike: (replyId: number) => void;
}
const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onLike }) => {
  const isMe = reply.userId === MY_USER_ID;
  return (
    <View className="mb-[10px]">
      <View className="flex-row items-start gap-[8px]">
        <Avatar letter={reply.letter} avColor={reply.avColor} size={24} />
        <View className="flex-1">
          <View className="flex-row items-center gap-[6px] mb-[2px]">
            <Text className="font-extrabold" style={{ fontSize: 11, color: COLORS.primary }}>{reply.nick}</Text>
            {isMe && (
              <View className="rounded-[8px] px-[6px] py-[1px]" style={{ backgroundColor: COLORS.primaryTint }}>
                <Text style={{ fontSize: 9, fontFamily: 'NanumSquareNeo-cBd', color: COLORS.primary }}>나</Text>
              </View>
            )}
          </View>
          {reply.deleted ? (
            <Text style={{ fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', fontFamily: 'NanumSquareNeo-bRg' }}>
              삭제된 댓글입니다.
            </Text>
          ) : (
            <Text style={{ fontSize: 12.5, color: COLORS.textPrimary, lineHeight: 19, fontFamily: 'NanumSquareNeo-bRg' }}>
              {reply.text}
            </Text>
          )}
          <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, fontFamily: 'NanumSquareNeo-bRg' }}>
            {reply.time}
          </Text>
          {!reply.deleted && (
            <View className="flex-row items-center gap-[8px] mt-[6px]">
              <TouchableOpacity className="flex-row items-center gap-[3px]" onPress={() => onLike(reply.id)}>
                <Ionicons
                  name={reply.liked ? 'heart' : 'heart-outline'}
                  size={12}
                  color={reply.liked ? COLORS.primary : COLORS.textMuted}
                />
                <Text style={{ fontSize: 11, fontFamily: 'NanumSquareNeo-cBd', color: reply.liked ? COLORS.primary : COLORS.textMuted }}>
                  {reply.likes}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

interface Props {
  comment: Comment;
  onLike: (commentId: number) => void;
  onReplyLike: (commentId: number, replyId: number) => void;
  onReply: (commentId: number, nick: string) => void;
  onDelete: (commentId: number) => void;
}

const CommentItem: React.FC<Props> = ({ comment, onLike, onReplyLike, onReply, onDelete }) => {
  const isMe = comment.userId === MY_USER_ID;

  return (
    <View className="mb-[14px]">
      <View className="flex-row items-start gap-[9px]">
        <Avatar letter={comment.letter} avColor={comment.avColor} size={30} />
        <View className="flex-1">
          <View className="flex-row items-center gap-[6px] mb-[2px]">
            <Text className="font-extrabold" style={{ fontSize: 11.5, color: COLORS.primary }}>{comment.nick}</Text>
            {isMe && (
              <View className="rounded-[8px] px-[6px] py-[1px]" style={{ backgroundColor: COLORS.primaryTint }}>
                <Text style={{ fontSize: 9, fontFamily: 'NanumSquareNeo-cBd', color: COLORS.primary }}>나</Text>
              </View>
            )}
          </View>
          {comment.deleted ? (
            <Text style={{ fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', fontFamily: 'NanumSquareNeo-bRg' }}>
              삭제된 댓글입니다.
            </Text>
          ) : (
            <Text style={{ fontSize: 13, color: COLORS.textPrimary, lineHeight: 20, fontFamily: 'NanumSquareNeo-bRg' }}>
              {comment.text}
            </Text>
          )}
          <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, fontFamily: 'NanumSquareNeo-bRg' }}>
            {comment.time}
          </Text>
          {!comment.deleted && (
            <View className="flex-row items-center gap-[8px] mt-[6px]">
              <TouchableOpacity className="flex-row items-center gap-[3px]" onPress={() => onLike(comment.id)}>
                <Ionicons
                  name={comment.liked ? 'heart' : 'heart-outline'}
                  size={12}
                  color={comment.liked ? COLORS.primary : COLORS.textMuted}
                />
                <Text style={{ fontSize: 11, fontFamily: 'NanumSquareNeo-cBd', color: comment.liked ? COLORS.primary : COLORS.textMuted }}>
                  {comment.likes}
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 10, color: COLORS.divider }}>·</Text>
              <TouchableOpacity onPress={() => onReply(comment.id, comment.nick)}>
                <Text style={{ fontSize: 11, fontFamily: 'NanumSquareNeo-cBd', color: COLORS.textMuted }}>답글</Text>
              </TouchableOpacity>
              {isMe && (
                <>
                  <Text style={{ fontSize: 10, color: COLORS.divider }}>·</Text>
                  <TouchableOpacity onPress={() => onDelete(comment.id)}>
                    <Text style={{ fontSize: 11, fontFamily: 'NanumSquareNeo-cBd', color: COLORS.danger }}>삭제</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>

      {/* 대댓글 */}
      {comment.replies.length > 0 && (
        <View
          className="ml-[38px] mt-[10px] pl-[12px]"
          style={{ borderLeftWidth: 2, borderLeftColor: COLORS.divider }}
        >
          {comment.replies.map(r => (
            <ReplyItem key={r.id} reply={r} onLike={id => onReplyLike(comment.id, id)} />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;
