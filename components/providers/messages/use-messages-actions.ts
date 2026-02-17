import { useCallback, type Dispatch, type SetStateAction } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Conversation, Message } from "@/lib/types/messages"
import {
  sendMessageToConversation,
  markConversationRead,
  closeConversationInDb,
  getOrCreateConversation,
  fetchSenderProfile,
} from "@/lib/supabase/messages"
import {
  addMessageOptimistic,
  markMessagesAsReadInState,
  resetUnreadCount,
  updateConversationLastMessage,
} from "./use-messages-state"

interface UseMessagesActionsParams {
  currentUserId: string | null
  currentConversation: Conversation | null
  // State updaters
  setMessages: Dispatch<SetStateAction<Message[]>>
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>
  setError: (error: string | null) => void
  // Callbacks
  refreshUnreadCount: () => Promise<void>
  loadConversations: () => Promise<void>
}

/**
 * Hook to manage message actions (send, mark read, close, start)
 */
export function useMessagesActions({
  currentUserId,
  currentConversation,
  setMessages,
  setConversations,
  setCurrentConversation,
  setError,
  refreshUnreadCount,
  loadConversations,
}: UseMessagesActionsParams) {
  const supabase = createClient()

  // =============================================================================
  // MARK AS READ
  // =============================================================================

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!currentUserId) return

      try {
        await markConversationRead(supabase, conversationId)

        // Update local state
        setMessages((prev) => markMessagesAsReadInState(prev, conversationId))
        setConversations((prev) =>
          resetUnreadCount(prev, conversationId, currentUserId)
        )

        await refreshUnreadCount()
      } catch (err) {
        console.error("Error marking messages as read:", err)
      }
    },
    [supabase, currentUserId, refreshUnreadCount, setMessages, setConversations]
  )

  // =============================================================================
  // SEND MESSAGE
  // =============================================================================

  const sendMessage = useCallback(
    async (content: string, _attachmentUrl?: string) => {
      if (!currentConversation || !currentUserId || !content.trim()) return
      void _attachmentUrl

      try {
        const newMsgRow = await sendMessageToConversation(
          supabase,
          currentConversation.id,
          currentUserId,
          content
        )

        // Fetch sender profile
        const senderProfile = await fetchSenderProfile(supabase, currentUserId)

        // Create full message with sender
        const baseMsg = {
          id: newMsgRow.id,
          conversation_id: newMsgRow.conversation_id,
          sender_id: newMsgRow.sender_id,
          content: newMsgRow.content,
          message_type: newMsgRow.message_type as "text" | "image" | "system",
          is_read: newMsgRow.is_read,
          read_at: newMsgRow.read_at,
          created_at: newMsgRow.created_at,
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

        // Add to local state immediately (optimistic update)
        setMessages((prev) => addMessageOptimistic(prev, fullMsg))

        // Update conversation list
        setConversations((prev) =>
          updateConversationLastMessage(
            prev,
            currentConversation.id,
            content.trim(),
            currentUserId
          )
        )
      } catch (err) {
        console.error("Error sending message:", err)
        setError("Failed to send message")
        throw err
      }
    },
    [
      supabase,
      currentConversation,
      currentUserId,
      setMessages,
      setConversations,
      setError,
    ]
  )

  // =============================================================================
  // START CONVERSATION
  // =============================================================================

  const startConversation = useCallback(
    async (sellerId: string, productId?: string, subject?: string): Promise<string> => {
      try {
        const conversationId = await getOrCreateConversation(
          supabase,
          sellerId,
          productId,
          subject
        )

        // Reload conversations to include the new one
        await loadConversations()

        return conversationId
      } catch (err) {
        console.error("Error starting conversation:", err)
        setError("Failed to start conversation")
        throw err
      }
    },
    [supabase, loadConversations, setError]
  )

  // =============================================================================
  // CLOSE CONVERSATION
  // =============================================================================

  const closeConversation = useCallback(
    async (conversationId: string) => {
      try {
        await closeConversationInDb(supabase, conversationId)

        // Update local state
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? { ...conv, status: "closed" as const }
              : conv
          )
        )

        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, status: "closed" as const } : null
          )
        }
      } catch (err) {
        console.error("Error closing conversation:", err)
        setError("Failed to close conversation")
      }
    },
    [
      supabase,
      currentConversation,
      setConversations,
      setCurrentConversation,
      setError,
    ]
  )

  return {
    markAsRead,
    sendMessage,
    startConversation,
    closeConversation,
  }
}

