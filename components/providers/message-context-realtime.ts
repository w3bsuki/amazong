import { useCallback, useEffect, useMemo, useRef } from "react"
import { useSupabasePostgresChanges } from "@/hooks/use-supabase-postgres-changes"
import { fetchSenderProfile } from "@/lib/supabase/messages"
import type { Message, MessageType } from "@/lib/types/messages"
import { addMessageOptimistic, incrementUnreadCount } from "./message-context-list"
import type { UseMessagesRealtimeParams } from "./message-context.types"

export function useMessagesRealtime({
  supabase,
  currentUserId,
  conversations,
  currentConversationId,
  setMessages,
  setConversations,
  setTotalUnreadCount,
  loadConversations,
  markAsRead,
}: UseMessagesRealtimeParams) {
  const currentConversationIdRef = useRef<string | null>(null)
  const conversationIdsRef = useRef<string[]>([])

  useEffect(() => {
    currentConversationIdRef.current = currentConversationId
  }, [currentConversationId])

  useEffect(() => {
    conversationIdsRef.current = conversations.map((c) => c.id)
  }, [conversations])

  const realtimeSpecs = useMemo(() => {
    if (!currentUserId) return [] as const

    return [
      {
        channel: `chat-${currentUserId}`,
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
    ] as const
  }, [currentUserId])

  const handleMessageInsert = useCallback(
    async (payload: unknown) => {
      if (!currentUserId) return

      const newMessage = (payload as { new: {
        id: string
        conversation_id: string
        sender_id: string
        content: string
        message_type: string
        is_read: boolean
        created_at: string
      } }).new

      if (newMessage.sender_id === currentUserId) return

      const isOurConversation = conversationIdsRef.current.includes(newMessage.conversation_id)
      if (!isOurConversation) {
        await loadConversations()
        return
      }

      if (currentConversationIdRef.current === newMessage.conversation_id) {
        const senderProfile = await fetchSenderProfile(supabase, newMessage.sender_id)

        const baseMsg = {
          id: newMessage.id,
          conversation_id: newMessage.conversation_id,
          sender_id: newMessage.sender_id,
          content: newMessage.content,
          message_type: newMessage.message_type as MessageType,
          is_read: newMessage.is_read,
          read_at: null,
          created_at: newMessage.created_at,
        }

        const fullMsg: Message = senderProfile
          ? {
              ...baseMsg,
              sender: {
                id: senderProfile.id,
                full_name: senderProfile.full_name,
                avatar_url: senderProfile.avatar_url,
              },
            }
          : baseMsg

        setMessages((prev) => addMessageOptimistic(prev, fullMsg))

        await markAsRead(newMessage.conversation_id)
        return
      }

      setConversations((prev) =>
        incrementUnreadCount(prev, newMessage.conversation_id, currentUserId, {
          content: newMessage.content,
          sender_id: newMessage.sender_id,
          message_type: newMessage.message_type,
          created_at: newMessage.created_at,
        })
      )

      setTotalUnreadCount((prev) => prev + 1)
    },
    [currentUserId, loadConversations, markAsRead, setMessages, setConversations, setTotalUnreadCount, supabase]
  )

  useSupabasePostgresChanges({
    enabled: Boolean(currentUserId),
    specs: realtimeSpecs,
    onPayload: handleMessageInsert,
    supabase,
  })
}

export function useTypingIndicator() {
  const lastTypingSentRef = useRef<number>(0)

  const sendTypingIndicator = useCallback(() => {
    const now = Date.now()
    if (now - lastTypingSentRef.current < 2000) return
    lastTypingSentRef.current = now
  }, [])

  return { sendTypingIndicator }
}
