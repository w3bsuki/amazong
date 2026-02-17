import { useEffect, useRef, useCallback, type Dispatch, type SetStateAction } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { Conversation, Message, MessageType } from "@/lib/types/messages"
import { fetchSenderProfile } from "@/lib/supabase/messages"
import { addMessageOptimistic, incrementUnreadCount } from "./use-messages-state"

interface RealtimeMessagePayload {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: string
  is_read: boolean
  created_at: string
}

interface UseMessagesRealtimeParams {
  currentUserId: string | null
  conversations: Conversation[]
  currentConversationId: string | null
  // State updaters
  setMessages: Dispatch<SetStateAction<Message[]>>
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setTotalUnreadCount: Dispatch<SetStateAction<number>>
  // Callbacks
  loadConversations: () => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
}

/**
 * Hook to manage realtime subscriptions for messages
 */
export function useMessagesRealtime({
  currentUserId,
  conversations,
  currentConversationId,
  setMessages,
  setConversations,
  setTotalUnreadCount,
  loadConversations,
  markAsRead,
}: UseMessagesRealtimeParams) {
  const supabase = createClient()

  // Refs to avoid stale closures
  const channelRef = useRef<RealtimeChannel | null>(null)
  const currentConversationIdRef = useRef<string | null>(null)
  const conversationIdsRef = useRef<string[]>([])

  // Keep refs in sync
  useEffect(() => {
    currentConversationIdRef.current = currentConversationId
  }, [currentConversationId])

  useEffect(() => {
    conversationIdsRef.current = conversations.map((c) => c.id)
  }, [conversations])

  // =============================================================================
  // REALTIME SUBSCRIPTION - Single channel, stable dependencies
  // =============================================================================

  useEffect(() => {
    if (!currentUserId) return

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Create a single channel for all messages
    const channel = supabase
      .channel(`chat-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as RealtimeMessagePayload

          // Skip our own messages (already added optimistically)
          if (newMessage.sender_id === currentUserId) return

          // Check if this belongs to one of our conversations using ref
          const isOurConversation = conversationIdsRef.current.includes(
            newMessage.conversation_id
          )

          if (!isOurConversation) {
            // New conversation - reload all
            await loadConversations()
            return
          }

          // If viewing this conversation, add the message
          if (currentConversationIdRef.current === newMessage.conversation_id) {
            // Fetch sender profile
            const senderProfile = await fetchSenderProfile(
              supabase,
              newMessage.sender_id
            )

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

            // Mark as read since we're viewing
            await markAsRead(newMessage.conversation_id)
          } else {
            // Not viewing - increment unread count
            setConversations((prev) =>
              incrementUnreadCount(prev, newMessage.conversation_id, currentUserId, {
                content: newMessage.content,
                sender_id: newMessage.sender_id,
                message_type: newMessage.message_type,
                created_at: newMessage.created_at,
              })
            )

            setTotalUnreadCount((prev) => prev + 1)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [
    supabase,
    currentUserId,
    loadConversations,
    markAsRead,
    setMessages,
    setConversations,
    setTotalUnreadCount,
  ])
}

/**
 * Hook to manage typing indicator state
 */
export function useTypingIndicator() {
  const lastTypingSentRef = useRef<number>(0)

  const sendTypingIndicator = useCallback(() => {
    // Throttle typing events
    const now = Date.now()
    if (now - lastTypingSentRef.current < 2000) return
    lastTypingSentRef.current = now
    // Typing indicator via broadcast could be added here if needed
  }, [])

  return { sendTypingIndicator }
}

