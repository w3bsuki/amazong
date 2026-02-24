import type { Conversation, Message } from "@/lib/types/messages"

export function addMessageOptimistic(prev: Message[], newMsg: Message): Message[] {
  if (prev.some((m) => m.id === newMsg.id)) return prev
  return [...prev, newMsg]
}

export function markMessagesAsReadInState(prev: Message[], conversationId: string): Message[] {
  return prev.map((msg) =>
    msg.conversation_id === conversationId && !msg.is_read
      ? { ...msg, is_read: true, read_at: new Date().toISOString() }
      : msg
  )
}

export function resetUnreadCount(
  prev: Conversation[],
  conversationId: string,
  currentUserId: string
): Conversation[] {
  return prev.map((conv) => {
    if (conv.id !== conversationId) return conv
    if (conv.buyer_id === currentUserId) {
      return { ...conv, buyer_unread_count: 0 }
    }
    return { ...conv, seller_unread_count: 0 }
  })
}

export function updateConversationLastMessage(
  prev: Conversation[],
  conversationId: string,
  content: string,
  senderId: string
): Conversation[] {
  return prev
    .map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            last_message_at: new Date().toISOString(),
            last_message: {
              content,
              sender_id: senderId,
              message_type: "text",
              created_at: new Date().toISOString(),
            },
          }
        : conv
    )
    .sort(
      (a, b) =>
        new Date(b.last_message_at || b.created_at).getTime() -
        new Date(a.last_message_at || a.created_at).getTime()
    )
}

export function incrementUnreadCount(
  prev: Conversation[],
  conversationId: string,
  currentUserId: string,
  newMessage: {
    content: string
    sender_id: string
    message_type: string
    created_at: string
  }
): Conversation[] {
  return prev
    .map((conv) => {
      if (conv.id !== conversationId) return conv
      const isBuyer = conv.buyer_id === currentUserId
      return {
        ...conv,
        last_message_at: newMessage.created_at,
        last_message: newMessage,
        ...(isBuyer
          ? { buyer_unread_count: (conv.buyer_unread_count || 0) + 1 }
          : { seller_unread_count: (conv.seller_unread_count || 0) + 1 }),
      }
    })
    .sort(
      (a, b) =>
        new Date(b.last_message_at || b.created_at).getTime() -
        new Date(a.last_message_at || a.created_at).getTime()
    )
}
