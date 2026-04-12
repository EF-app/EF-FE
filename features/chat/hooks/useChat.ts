/**
 * @file features/chat/hooks/useChat.ts
 */

import { useQuery } from '@tanstack/react-query';
import { fetchChats } from '../api/chatApi';

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 1000 * 60,
  });
}
