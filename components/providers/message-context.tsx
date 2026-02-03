"use client"

import React, { createContext, useContext, useCallback, useEffect, useRef } from "react"
import { useRouter } from "@/i18n/routing"

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

import type { MessageContextValue } from "@/lib/types/messages"

// Hooks
import { useMessagesState } from "@/components/providers/messages/use-messages-state"
import { useMessagesRealtime, useTypingIndicator } from "@/components/providers/messages/use-messages-realtime"
import { useMessagesActions } from "@/components/providers/messages/use-messages-actions"

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

interface MessageProviderProps {
  children: React.ReactNode
  initialSellerId?: string | undefined
  initialProductId?: string | undefined
}

function MessageAutoStartConversation({
  initialSellerId,
  initialProductId,
  currentUserId,
  isLoading,
  conversations,
  selectConversation,
  startConversation,
}: {
  initialSellerId: string
  initialProductId?: string | undefined
  currentUserId: string | null
  isLoading: boolean
  conversations: Array<{ id: string; seller_id: string; buyer_id: string; product?: { id?: string | null } | null }>
  selectConversation: (conversationId: string) => Promise<void>
  startConversation: (sellerId: string, productId?: string | undefined) => Promise<string>
}) {
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

export function MessageProvider({ children, initialSellerId, initialProductId }: MessageProviderProps) {
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
  } = useMessagesState()

  // Actions hook
  const { markAsRead, sendMessage, startConversation, closeConversation } =
    useMessagesActions({
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

