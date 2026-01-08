"use client"

import React, { createContext, useContext, useCallback } from "react"

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
import { DEFAULT_MESSAGE_CONTEXT } from "@/lib/types/messages"

// Hooks
import { useMessagesState } from "@/hooks/use-messages-state"
import { useMessagesRealtime, useTypingIndicator } from "@/hooks/use-messages-realtime"
import { useMessagesActions } from "@/hooks/use-messages-actions"

const MessageContext = createContext<MessageContextValue | undefined>(undefined)

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

export function MessageProvider({ children }: { children: React.ReactNode }) {
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
      {children}
    </MessageContext.Provider>
  )
}
