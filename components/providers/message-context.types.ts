import type { Dispatch, ReactNode, SetStateAction } from "react"
import type { createClient } from "@/lib/supabase/client"
import type { Conversation, Message } from "@/lib/types/messages"

export type SupabaseBrowserClient = ReturnType<typeof createClient>

export interface UseMessagesStateReturn {
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

export interface UseMessagesActionsParams {
  supabase: SupabaseBrowserClient
  currentUserId: string | null
  currentConversation: Conversation | null
  setMessages: Dispatch<SetStateAction<Message[]>>
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>
  setError: (error: string | null) => void
  refreshUnreadCount: () => Promise<void>
  loadConversations: () => Promise<void>
}

export interface UseMessagesRealtimeParams {
  supabase: SupabaseBrowserClient
  currentUserId: string | null
  conversations: Conversation[]
  currentConversationId: string | null
  setMessages: Dispatch<SetStateAction<Message[]>>
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setTotalUnreadCount: Dispatch<SetStateAction<number>>
  loadConversations: () => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
}

export interface MessageProviderProps {
  children: ReactNode
  initialSellerId?: string | undefined
  initialProductId?: string | undefined
  enabled?: boolean
}

export interface MessageAutoStartConversationProps {
  initialSellerId: string
  initialProductId?: string | undefined
  currentUserId: string | null
  isLoading: boolean
  conversations: Array<{ id: string; seller_id: string; buyer_id: string; product?: { id?: string | null } | null }>
  selectConversation: (conversationId: string) => Promise<void>
  startConversation: (sellerId: string, productId?: string | undefined) => Promise<string>
}
