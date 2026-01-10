import type { SupabaseClient } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"
import type {
  Conversation,
  Message,
  RawConversationRow,
  RawProfileRow,
  RawMessageRow,
  MessageType,
} from "@/lib/types/messages"

// =============================================================================
// PROFILE HELPERS
// =============================================================================

/**
 * Fetch profiles for a list of user IDs
 */
export async function fetchProfiles(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Map<string, RawProfileRow>> {
  if (userIds.length === 0) return new Map()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, display_name, business_name, username")
    .in("id", userIds)

  return new Map(profiles?.map((p) => [p.id, p]) || [])
}

// =============================================================================
// CONVERSATION TRANSFORMERS
// =============================================================================

/**
 * Transform raw conversation row to Conversation type with profile data
 */
export function transformConversation(
  conv: RawConversationRow,
  profileMap: Map<string, RawProfileRow>
): Conversation {
  const buyerProfile = profileMap.get(conv.buyer_id)
  const sellerProfile = profileMap.get(conv.seller_id)

  return {
    ...conv,
    status: (conv.status || "open") as "open" | "closed" | "archived",
    buyer_unread_count: conv.buyer_unread_count || 0,
    seller_unread_count: conv.seller_unread_count || 0,
    buyer_profile: buyerProfile
      ? {
          id: buyerProfile.id,
          full_name: buyerProfile.full_name,
          avatar_url: buyerProfile.avatar_url,
          display_name: buyerProfile.display_name,
          username: buyerProfile.username,
        }
      : null,
    seller_profile: sellerProfile
      ? {
          id: sellerProfile.id,
          full_name: sellerProfile.full_name,
          avatar_url: sellerProfile.avatar_url,
          display_name: sellerProfile.display_name,
          business_name: sellerProfile.business_name,
          username: sellerProfile.username,
        }
      : null,
    product: conv.product
      ? {
          id: conv.product.id,
          title: conv.product.title,
          images: conv.product.images || [],
        }
      : null,
    // Legacy compatibility mappings
    buyer: buyerProfile
      ? {
          id: buyerProfile.id,
          full_name: buyerProfile.display_name || buyerProfile.full_name,
          avatar_url: buyerProfile.avatar_url,
        }
      : { id: conv.buyer_id, full_name: null, avatar_url: null },
    seller: sellerProfile
      ? {
          id: sellerProfile.id,
          business_name:
            sellerProfile.business_name ||
            sellerProfile.display_name ||
            sellerProfile.full_name,
          user_id: sellerProfile.id,
          profile: {
            full_name: sellerProfile.display_name || sellerProfile.full_name,
            avatar_url: sellerProfile.avatar_url,
          },
        }
      : { id: conv.seller_id, business_name: null, user_id: conv.seller_id },
  }
}

/**
 * Transform raw message row to Message type with sender profile
 */
export function transformMessage(
  msg: RawMessageRow,
  senderProfile?: RawProfileRow
): Message {
  const base = {
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender_id: msg.sender_id,
    content: msg.content,
    message_type: (msg.message_type || "text") as MessageType,
    is_read: msg.is_read,
    read_at: msg.read_at,
    created_at: msg.created_at,
  }

  if (senderProfile) {
    return {
      ...base,
      sender: {
        id: senderProfile.id,
        full_name: senderProfile.full_name,
        avatar_url: senderProfile.avatar_url,
      },
    }
  }

  return base
}

// =============================================================================
// CONVERSATION QUERIES
// =============================================================================

const CONVERSATION_SELECT = `
  *,
  product:products(id, title, images)
`

/**
 * Fetch all conversations for a user
 */
export async function fetchConversations(
  supabase: SupabaseClient,
  userId: string
): Promise<{ conversations: Conversation[]; unreadCount: number }> {
  const { data: convs, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false })

  if (error) throw error

  if (!convs || convs.length === 0) {
    return { conversations: [], unreadCount: 0 }
  }

  // Collect all unique user IDs
  const userIds = new Set<string>()
  convs.forEach((conv) => {
    userIds.add(conv.buyer_id)
    userIds.add(conv.seller_id)
  })

  // Fetch profiles
  const profileMap = await fetchProfiles(supabase, Array.from(userIds))

  // Transform conversations
  const conversations = convs.map((conv) =>
    transformConversation(conv as RawConversationRow, profileMap)
  )

  // Calculate total unread
  const unreadCount = conversations.reduce((sum, conv) => {
    if (conv.buyer_id === userId) {
      return sum + (conv.buyer_unread_count || 0)
    }
    return sum + (conv.seller_unread_count || 0)
  }, 0)

  return { conversations, unreadCount }
}

/**
 * Fetch a single conversation by ID
 */
export async function fetchConversation(
  supabase: SupabaseClient,
  conversationId: string
): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .eq("id", conversationId)
    .single()

  if (error) throw error

  // Fetch profiles for buyer and seller
  const profileMap = await fetchProfiles(supabase, [data.buyer_id, data.seller_id])

  return transformConversation(data as RawConversationRow, profileMap)
}

// =============================================================================
// MESSAGE QUERIES
// =============================================================================

const MESSAGE_SELECT =
  "id, conversation_id, sender_id, content, message_type, is_read, read_at, created_at"

/**
 * Fetch messages for a conversation
 */
export async function fetchMessages(
  supabase: SupabaseClient,
  conversationId: string
): Promise<Message[]> {
  const { data: msgs, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) throw error

  if (!msgs || msgs.length === 0) return []

  // Fetch sender profiles
  const senderIds = [...new Set(msgs.map((m) => m.sender_id))]
  const senderMap = await fetchProfiles(supabase, senderIds)

  return msgs.map((msg) =>
    transformMessage(msg as RawMessageRow, senderMap.get(msg.sender_id))
  )
}

/**
 * Fetch a single sender profile
 */
export async function fetchSenderProfile(
  supabase: SupabaseClient,
  senderId: string
): Promise<Pick<RawProfileRow, "id" | "full_name" | "avatar_url"> | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", senderId)
    .single()

  return data
}

// =============================================================================
// MESSAGE MUTATIONS
// =============================================================================

/**
 * Send a new message
 */
export async function sendMessageToConversation(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  content: string
): Promise<RawMessageRow> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      message_type: "text",
    })
    .select(MESSAGE_SELECT)
    .single()

  if (error) throw error

  return data as RawMessageRow
}

/**
 * Mark messages as read in a conversation
 */
export async function markConversationRead(
  supabase: SupabaseClient,
  conversationId: string
): Promise<void> {
  const { error } = await supabase.rpc("mark_messages_read", {
    p_conversation_id: conversationId,
  })

  if (error) throw error
}

/**
 * Close a conversation
 */
export async function closeConversationInDb(
  supabase: SupabaseClient,
  conversationId: string
): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({ status: "closed" })
    .eq("id", conversationId)

  if (error) throw error
}

/**
 * Get or create a conversation
 */
export async function getOrCreateConversation(
  supabase: SupabaseClient,
  sellerId: string,
  productId?: string,
  subject?: string
): Promise<string> {
  const { data, error } = await supabase.rpc("get_or_create_conversation", {
    p_seller_id: sellerId,
    ...(productId ? { p_product_id: productId } : {}),
    ...(subject ? { p_subject: subject } : {}),
  })

  if (error) throw error

  return data as string
}

/**
 * Refresh unread count via RPC
 */
export async function fetchTotalUnreadCount(
  supabase: SupabaseClient
): Promise<number> {
  const { data, error } = await supabase.rpc("get_total_unread_messages")

  if (error) {
    logger.error("[Chat] Error fetching unread count", error)
    return 0
  }

  return data ?? 0
}
