
import { useCallback } from "react"
import {
  closeConversationInDb,
  fetchSenderProfile,
  getOrCreateConversation,
  markConversationRead,
  sendMessageToConversation,
} from "@/lib/supabase/messages"
import {
  addMessageOptimistic,
  markMessagesAsReadInState,
  resetUnreadCount,
  updateConversationLastMessage,
} from "./message-context-list"
import type { Message } from "@/lib/types/messages"
import type { UseMessagesActionsParams } from "./message-context.types"

export function useMessagesActions({
  supabase,
  currentUserId,
  currentConversation,
  setMessages,
  setConversations,
  setCurrentConversation,
  setError,
  refreshUnreadCount,
  loadConversations,
}: UseMessagesActionsParams) {
  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!currentUserId) return

      try {
        await markConversationRead(supabase, conversationId)

        setMessages((prev) => markMessagesAsReadInState(prev, conversationId))
        setConversations((prev) => resetUnreadCount(prev, conversationId, currentUserId))

        await refreshUnreadCount()
      } catch (err) {
        console.error("Error marking messages as read:", err)
      }
    },
    [supabase, currentUserId, refreshUnreadCount, setMessages, setConversations],
  )

  const sendMessage = useCallback(
    async (content: string, _attachmentUrl?: string) => {
      if (!currentConversation || !currentUserId || !content.trim()) return
      void _attachmentUrl

      try {
        const newMsgRow = await sendMessageToConversation(supabase, currentConversation.id, currentUserId, content)

        const senderProfile = await fetchSenderProfile(supabase, currentUserId)

        const fullMsg: Message = {
          id: newMsgRow.id,
          conversation_id: newMsgRow.conversation_id,
          sender_id: newMsgRow.sender_id,
          content: newMsgRow.content,
          message_type: newMsgRow.message_type as "text" | "image" | "system",
          is_read: newMsgRow.is_read,
          read_at: newMsgRow.read_at,
          created_at: newMsgRow.created_at,
          ...(senderProfile
            ? {
                sender: {
                  id: senderProfile.id,
                  full_name: senderProfile.full_name,
                  avatar_url: senderProfile.avatar_url,
                },
              }
            : {}),
        }

        setMessages((prev) => addMessageOptimistic(prev, fullMsg))

        setConversations((prev) =>
          updateConversationLastMessage(prev, currentConversation.id, content.trim(), currentUserId),
        )
      } catch (err) {
        console.error("Error sending message:", err)
        setError("Failed to send message")
        throw err
      }
    },
    [supabase, currentConversation, currentUserId, setMessages, setConversations, setError],
  )

  const startConversation = useCallback(
    async (sellerId: string, productId?: string, subject?: string): Promise<string> => {
      try {
        const conversationId = await getOrCreateConversation(supabase, sellerId, productId, subject)

        await loadConversations()

        return conversationId
      } catch (err) {
        console.error("Error starting conversation:", err)
        setError("Failed to start conversation")
        throw err
      }
    },
    [supabase, loadConversations, setError],
  )

  const closeConversation = useCallback(
    async (conversationId: string) => {
      try {
        await closeConversationInDb(supabase, conversationId)

        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, status: "closed" as const } : conv)),
        )

        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) => (prev ? { ...prev, status: "closed" as const } : null))
        }
      } catch (err) {
        console.error("Error closing conversation:", err)
        setError("Failed to close conversation")
      }
    },
    [supabase, currentConversation, setConversations, setCurrentConversation, setError],
  )

  return {
    markAsRead,
    sendMessage,
    startConversation,
    closeConversation,
  }
}
