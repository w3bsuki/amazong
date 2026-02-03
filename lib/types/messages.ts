// =============================================================================
// MESSAGE TYPES - Clean interfaces matching actual database schema
// =============================================================================

export interface ConversationBuyerProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  display_name: string | null
  username: string | null
}

export interface ConversationSellerProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  display_name: string | null
  business_name: string | null
  username: string | null
}

export interface ConversationProduct {
  id: string
  title: string
  images: string[]
}

export interface ConversationLastMessage {
  content: string
  sender_id: string
  message_type: string
  created_at: string
}

// Legacy buyer format (for backwards compatibility)
export interface LegacyBuyer {
  id: string
  full_name: string | null
  avatar_url: string | null
}

// Legacy seller format (for backwards compatibility)
export interface LegacySeller {
  id: string
  business_name: string | null
  user_id: string
  profile?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string | null
  order_id: string | null
  subject: string | null
  status: "open" | "closed" | "archived"
  last_message_at: string | null
  buyer_unread_count: number
  seller_unread_count: number
  created_at: string
  updated_at: string
  // Joined profile data (from direct foreign key joins)
  buyer_profile: ConversationBuyerProfile | null
  seller_profile: ConversationSellerProfile | null
  product: ConversationProduct | null
  last_message?: ConversationLastMessage
  // Legacy compatibility fields (mapped from new structure)
  buyer?: LegacyBuyer
  seller?: LegacySeller
}

export interface MessageSender {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export type MessageType = "text" | "image" | "system"

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: MessageType
  is_read: boolean
  read_at: string | null
  created_at: string
  sender?: MessageSender
  // Legacy field for compatibility
  attachment_url?: string | null
}

// Raw database row types for Supabase queries
export interface RawConversationRow {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string | null
  order_id: string | null
  subject: string | null
  status: string | null
  last_message_at: string | null
  buyer_unread_count: number | null
  seller_unread_count: number | null
  created_at: string
  updated_at: string
  // NOTE: Supabase typed relationship for products may be `T[]` when `isOneToOne` is false.
  // Normalize in transformer.
  product:
    | {
        id: string
        title: string
        images: string[] | null
      }
    | Array<{
        id: string
        title: string
        images: string[] | null
      }>
    | null
}

export interface RawProfileRow {
  id: string
  full_name: string | null
  avatar_url: string | null
  display_name: string | null
  business_name: string | null
  username: string | null
}

export interface RawMessageRow {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

// Context value interface
export interface MessageContextValue {
  // State
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  totalUnreadCount: number
  isLoading: boolean
  isLoadingMessages: boolean
  error: string | null
  currentUserId: string | null
  isOtherUserTyping: boolean

  // Actions
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  sendMessage: (content: string, attachmentUrl?: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  startConversation: (sellerId: string, productId?: string, subject?: string) => Promise<string>
  closeConversation: (conversationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
  sendTypingIndicator: () => void
}
