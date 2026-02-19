import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useRouter } from "@/i18n/routing"
import type { RealtimeChannel } from "@supabase/supabase-js"

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

import type { Conversation, Message, MessageContextValue, MessageType } from "@/lib/types/messages"

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

interface UseMessagesStateReturn {
  currentUserId: string | null
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  totalUnreadCount: number
  isLoading: boolean
  isLoadingMessages: boolean
  error: string | null
  isOtherUserTyping: boolean
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>
  setMessages: Dispatch<SetStateAction<Message[]>>
  setTotalUnreadCount: Dispatch<SetStateAction<number>>
  setError: (error: string | null) => void
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

function useMessagesState({
  supabase,
  enabled = true,
}: {
  supabase: ReturnType<typeof createClient>
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

function addMessageOptimistic(prev: Message[], newMsg: Message): Message[] {
  if (prev.some((m) => m.id === newMsg.id)) return prev
  return [...prev, newMsg]
}

function markMessagesAsReadInState(prev: Message[], conversationId: string): Message[] {
  return prev.map((msg) =>
    msg.conversation_id === conversationId && !msg.is_read
      ? { ...msg, is_read: true, read_at: new Date().toISOString() }
      : msg
  )
}

function resetUnreadCount(prev: Conversation[], conversationId: string, currentUserId: string): Conversation[] {
  return prev.map((conv) => {
    if (conv.id !== conversationId) return conv
    if (conv.buyer_id === currentUserId) {
      return { ...conv, buyer_unread_count: 0 }
    }
    return { ...conv, seller_unread_count: 0 }
  })
}

function updateConversationLastMessage(
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

function incrementUnreadCount(
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
}: {
  supabase: ReturnType<typeof createClient>
  currentUserId: string | null
  currentConversation: Conversation | null
  setMessages: Dispatch<SetStateAction<Message[]>>
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>
  setError: (error: string | null) => void
  refreshUnreadCount: () => Promise<void>
  loadConversations: () => Promise<void>
}) {
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

function useMessagesRealtime({
  supabase,
  currentUserId,
  conversations,
  currentConversationId,
  setMessages,
  setConversations,
  setTotalUnreadCount,
  loadConversations,
  markAsRead,
}: {
  supabase: ReturnType<typeof createClient>
  currentUserId: string | null
  conversations: Conversation[]
  currentConversationId: string | null
  setMessages: Dispatch<SetStateAction<Message[]>>
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setTotalUnreadCount: Dispatch<SetStateAction<number>>
  loadConversations: () => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
}) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const currentConversationIdRef = useRef<string | null>(null)
  const conversationIdsRef = useRef<string[]>([])

  useEffect(() => {
    currentConversationIdRef.current = currentConversationId
  }, [currentConversationId])

  useEffect(() => {
    conversationIdsRef.current = conversations.map((c) => c.id)
  }, [conversations])

  useEffect(() => {
    if (!currentUserId) return

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

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
          const newMessage = payload.new as {
            id: string
            conversation_id: string
            sender_id: string
            content: string
            message_type: string
            is_read: boolean
            created_at: string
          }

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
  }, [supabase, currentUserId, loadConversations, markAsRead, setMessages, setConversations, setTotalUnreadCount])
}

function useTypingIndicator() {
  const lastTypingSentRef = useRef<number>(0)

  const sendTypingIndicator = useCallback(() => {
    const now = Date.now()
    if (now - lastTypingSentRef.current < 2000) return
    lastTypingSentRef.current = now
  }, [])

  return { sendTypingIndicator }
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
  enabled?: boolean
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


