"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useRouter } from "@/i18n/routing"

import { createClient } from "@/lib/supabase/client"
import {
  closeConversationInDb,
  fetchConversation,
  fetchConversations,
  fetchMessages,
  fetchSenderProfile,
  fetchTotalUnreadCount,
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
import { useMessagesRealtime, useTypingIndicator } from "./message-context-realtime"
import type {
  MessageAutoStartConversationProps,
  MessageProviderProps,
  SupabaseBrowserClient,
  UseMessagesActionsParams,
  UseMessagesStateReturn,
} from "./message-context.types"

// =============================================================================
// TYPES - Re-exported from lib/types/messages.ts
// =============================================================================

export type {
  Conversation,
  Message,
  MessageContextValue,
  ConversationBuyerProfile,
  ConversationSellerProfile,
  ConversationProduct,
  ConversationLastMessage,
  MessageSender,
  MessageType,
} from "@/lib/types/messages"

import type { Conversation, Message, MessageContextValue } from "@/lib/types/messages"

const MessageContext = createContext<MessageContextValue | undefined>(undefined)

const DEFAULT_MESSAGE_CONTEXT: MessageContextValue = {
  conversations: [],
  currentConversation: null,
  messages: [],
  totalUnreadCount: 0,
  isLoading: false,
  isLoadingMessages: false,
  error: null,
  currentUserId: null,
  isOtherUserTyping: false,
  loadConversations: async () => {},
  selectConversation: async () => {},
  sendMessage: async () => {},
  markAsRead: async () => {},
  startConversation: async () => "",
  closeConversation: async () => {},
  refreshUnreadCount: async () => {},
  sendTypingIndicator: () => {},
}

function useMessagesState({
  supabase,
  enabled = true,
}: {
  supabase: SupabaseBrowserClient
  enabled?: boolean
}): UseMessagesStateReturn {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setCurrentUserId(null)
      setConversations([])
      setCurrentConversation(null)
      setMessages([])
      setTotalUnreadCount(0)
      setError(null)
      setIsLoading(false)
      setIsLoadingMessages(false)
      setIsOtherUserTyping(false)
      return
    }

    let cancelled = false

    const getUser = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return

      if (user) {
        setCurrentUserId(user.id)
      } else {
        setIsLoading(false)
      }
    }

    void getUser()

    return () => {
      cancelled = true
    }
  }, [enabled, supabase])

  const refreshUnreadCount = useCallback(async () => {
    if (!enabled || !currentUserId) return

    try {
      const count = await fetchTotalUnreadCount(supabase)
      setTotalUnreadCount(count)
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }, [enabled, supabase, currentUserId])

  const loadConversations = useCallback(async () => {
    if (!enabled || !currentUserId) return

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
  }, [enabled, supabase, currentUserId])

  const selectConversation = useCallback(
    async (conversationId: string) => {
      setIsLoadingMessages(true)
      setError(null)

      try {
        let conv = conversations.find((c) => c.id === conversationId)

        if (!conv) {
          conv = await fetchConversation(supabase, conversationId)
        }

        setCurrentConversation(conv)

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

  useEffect(() => {
    if (!enabled || !currentUserId) return
    void loadConversations()
  }, [enabled, currentUserId, loadConversations])

  return {
    currentUserId,
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    isOtherUserTyping,
    setConversations,
    setCurrentConversation,
    setMessages,
    setTotalUnreadCount,
    setError,
    loadConversations,
    selectConversation,
    refreshUnreadCount,
  }
}

function useMessagesActions({
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
    [supabase, currentUserId, refreshUnreadCount, setMessages, setConversations]
  )

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

        const senderProfile = await fetchSenderProfile(supabase, currentUserId)

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

        setMessages((prev) => addMessageOptimistic(prev, fullMsg))

        setConversations((prev) =>
          updateConversationLastMessage(prev, currentConversation.id, content.trim(), currentUserId)
        )
      } catch (err) {
        console.error("Error sending message:", err)
        setError("Failed to send message")
        throw err
      }
    },
    [supabase, currentConversation, currentUserId, setMessages, setConversations, setError]
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
    [supabase, loadConversations, setError]
  )

  const closeConversation = useCallback(
    async (conversationId: string) => {
      try {
        await closeConversationInDb(supabase, conversationId)

        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, status: "closed" as const } : conv))
        )

        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) => (prev ? { ...prev, status: "closed" as const } : null))
        }
      } catch (err) {
        console.error("Error closing conversation:", err)
        setError("Failed to close conversation")
      }
    },
    [supabase, currentConversation, setConversations, setCurrentConversation, setError]
  )

  return {
    markAsRead,
    sendMessage,
    startConversation,
    closeConversation,
  }
}

// =============================================================================
// HOOK - Safe to use anywhere (returns defaults if outside provider)
// =============================================================================

export function useMessages(): MessageContextValue {
  const context = useContext(MessageContext)

  // Return safe defaults for use outside MessageProvider (e.g., MobileTabBar)
  if (!context) {
    return DEFAULT_MESSAGE_CONTEXT
  }

  return context
}

// =============================================================================
// PROVIDER - Clean, thin wrapper using extracted hooks
// =============================================================================

function MessageAutoStartConversation({
  initialSellerId,
  initialProductId,
  currentUserId,
  isLoading,
  conversations,
  selectConversation,
  startConversation,
}: MessageAutoStartConversationProps) {
  const router = useRouter()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!currentUserId || hasInitialized.current) return
    if (isLoading) return // Wait for conversations to load first

    hasInitialized.current = true

    const initConversation = async () => {
      try {
        // Check if conversation already exists with this seller/product
        const existingConv = conversations.find(
          (conv) =>
            (conv.seller_id === initialSellerId || conv.buyer_id === initialSellerId) &&
            (!initialProductId || conv.product?.id === initialProductId)
        )

        if (existingConv) {
          // Select existing conversation and navigate
          await selectConversation(existingConv.id)
          router.replace(`/chat/${existingConv.id}`)
        } else {
          // Start new conversation
          const conversationId = await startConversation(initialSellerId, initialProductId)
          router.replace(`/chat/${conversationId}`)
        }
      } catch (err) {
        console.error("Error initializing conversation:", err)
      }
    }

    initConversation()
  }, [currentUserId, initialSellerId, initialProductId, isLoading, conversations, selectConversation, startConversation, router])

  return null
}

export function MessageProvider({
  children,
  initialSellerId,
  initialProductId,
  enabled = true,
}: MessageProviderProps) {
  const supabase = createClient()

  // State management hook
  const {
    currentUserId,
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    isOtherUserTyping,
    setMessages,
    setConversations,
    setCurrentConversation,
    setTotalUnreadCount,
    setError,
    loadConversations,
    selectConversation: selectConversationBase,
    refreshUnreadCount,
  } = useMessagesState({ supabase, enabled })

  // Actions hook
  const { markAsRead, sendMessage, startConversation, closeConversation } =
    useMessagesActions({
      supabase,
      currentUserId,
      currentConversation,
      setMessages,
      setConversations,
      setCurrentConversation,
      setError,
      refreshUnreadCount,
      loadConversations,
    })

  // Wrap selectConversation to also mark as read
  const selectConversation = useCallback(
    async (conversationId: string) => {
      await selectConversationBase(conversationId)
      await markAsRead(conversationId)
    },
    [selectConversationBase, markAsRead]
  )

  // Realtime subscription hook
  useMessagesRealtime({
    supabase,
    currentUserId,
    conversations,
    currentConversationId: currentConversation?.id || null,
    setMessages,
    setConversations,
    setTotalUnreadCount,
    loadConversations,
    markAsRead,
  })

  // Typing indicator hook
  const { sendTypingIndicator } = useTypingIndicator()

  // =============================================================================
  // AUTO-START CONVERSATION
  // If initialSellerId is provided, start or find existing conversation
  // =============================================================================
  
  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const value: MessageContextValue = {
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    currentUserId,
    isOtherUserTyping,
    loadConversations,
    selectConversation,
    sendMessage,
    markAsRead,
    startConversation,
    closeConversation,
    refreshUnreadCount,
    sendTypingIndicator,
  }

  return (
    <MessageContext.Provider value={value}>
      {initialSellerId ? (
        <MessageAutoStartConversation
          initialSellerId={initialSellerId}
          initialProductId={initialProductId}
          currentUserId={currentUserId}
          isLoading={isLoading}
          conversations={conversations}
          selectConversation={selectConversation}
          startConversation={startConversation}
        />
      ) : null}
      {children}
    </MessageContext.Provider>
  )
}


