"use client"

import { useState, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Conversation, Message } from "@/lib/types/messages"
import {
  fetchConversations,
  fetchConversation,
  fetchMessages,
  fetchSenderProfile,
  fetchTotalUnreadCount,
} from "@/lib/supabase/messages"

export interface MessagesState {
  currentUserId: string | null
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  totalUnreadCount: number
  isLoading: boolean
  isLoadingMessages: boolean
  error: string | null
  isOtherUserTyping: boolean
}

export interface MessagesStateActions {
  setCurrentUserId: (id: string | null) => void
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setTotalUnreadCount: React.Dispatch<React.SetStateAction<number>>
  setIsLoading: (loading: boolean) => void
  setIsLoadingMessages: (loading: boolean) => void
  setError: (error: string | null) => void
  setIsOtherUserTyping: (typing: boolean) => void
}

export interface UseMessagesStateReturn extends MessagesState, MessagesStateActions {
  // Data fetching
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

/**
 * Hook to manage messages state - state management + data fetching
 */
export function useMessagesState(): UseMessagesStateReturn {
  const supabase = createClient()

  // Core state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)

  // =============================================================================
  // FETCH USER ID ON MOUNT
  // =============================================================================

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    getUser()
  }, [supabase])

  // =============================================================================
  // REFRESH UNREAD COUNT
  // =============================================================================

  const refreshUnreadCount = useCallback(async () => {
    if (!currentUserId) return

    try {
      const count = await fetchTotalUnreadCount(supabase)
      setTotalUnreadCount(count)
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }, [supabase, currentUserId])

  // =============================================================================
  // LOAD CONVERSATIONS
  // =============================================================================

  const loadConversations = useCallback(async () => {
    if (!currentUserId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchConversations(supabase, currentUserId)
      setConversations(result.conversations)
      setTotalUnreadCount(result.unreadCount)
    } catch (err) {
      console.error("Error loading conversations:", err)
      setError("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, currentUserId])

  // =============================================================================
  // SELECT CONVERSATION & LOAD MESSAGES
  // =============================================================================

  const selectConversation = useCallback(
    async (conversationId: string) => {
      setIsLoadingMessages(true)
      setError(null)

      try {
        // Find in existing conversations or fetch fresh
        let conv = conversations.find((c) => c.id === conversationId)

        if (!conv) {
          conv = await fetchConversation(supabase, conversationId)
        }

        setCurrentConversation(conv)

        // Load messages
        const msgs = await fetchMessages(supabase, conversationId)
        setMessages(msgs)
      } catch (err) {
        console.error("Error loading messages:", err)
        setError("Failed to load messages")
      } finally {
        setIsLoadingMessages(false)
      }
    },
    [supabase, conversations]
  )

  // =============================================================================
  // LOAD CONVERSATIONS ON MOUNT / USER CHANGE
  // =============================================================================

  useEffect(() => {
    if (currentUserId) {
      loadConversations()
    }
  }, [currentUserId, loadConversations])

  return {
    // State
    currentUserId,
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    isOtherUserTyping,
    // Setters
    setCurrentUserId,
    setConversations,
    setCurrentConversation,
    setMessages,
    setTotalUnreadCount,
    setIsLoading,
    setIsLoadingMessages,
    setError,
    setIsOtherUserTyping,
    // Data fetching
    loadConversations,
    selectConversation,
    refreshUnreadCount,
  }
}

/**
 * Helper to add a message to the local state (optimistic update)
 */
export function addMessageOptimistic(
  prev: Message[],
  newMsg: Message
): Message[] {
  if (prev.some((m) => m.id === newMsg.id)) return prev
  return [...prev, newMsg]
}

/**
 * Helper to update messages as read
 */
export function markMessagesAsReadInState(
  prev: Message[],
  conversationId: string
): Message[] {
  return prev.map((msg) =>
    msg.conversation_id === conversationId && !msg.is_read
      ? { ...msg, is_read: true, read_at: new Date().toISOString() }
      : msg
  )
}

/**
 * Helper to update conversation unread counts
 */
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

/**
 * Helper to update conversation with new last message
 */
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

/**
 * Helper to increment unread count for a conversation
 */
export function incrementUnreadCount(
  prev: Conversation[],
  conversationId: string,
  currentUserId: string,
  newMessage: { content: string; sender_id: string; message_type: string; created_at: string }
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
