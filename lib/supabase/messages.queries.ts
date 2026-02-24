import type { SupabaseClient } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"
import type { Database } from "@/lib/supabase/database.types"
import type { Conversation, Message, RawConversationRow, RawMessageRow, RawProfileRow } from "@/lib/types/messages"
import {
  CONVERSATION_SELECT,
  MESSAGE_SELECT,
  fetchProfiles,
  isNoRowsError,
  transformConversation,
  transformMessage,
} from "./messages.helpers"

type UserConversationRpcRow = {
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
  product_title: string | null
  product_images: string[] | null
  last_message_content: string | null
  last_message_sender_id: string | null
  last_message_type: string | null
  last_message_created_at: string | null
}

/**
 * Fetch all conversations for a user
 */
export async function fetchConversations(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{ conversations: Conversation[]; unreadCount: number }> {
  const { data: rows, error } = await supabase.rpc("get_user_conversations", {
    p_user_id: userId,
  })

  if (error) throw error

  const convs = (rows ?? []) as UserConversationRpcRow[]

  if (convs.length === 0) {
    return { conversations: [], unreadCount: 0 }
  }

  // Collect all unique user IDs
  const userIds = new Set<string>()
  convs.forEach((conv) => {
    userIds.add(conv.buyer_id)
    userIds.add(conv.seller_id)
  })

  // Fetch profiles for richer display_name/username fields
  const profileMap = await fetchProfiles(supabase, [...userIds])

  // Transform conversations with last message data
  const conversations = convs.map((conv) => {
    const raw: RawConversationRow = {
      id: conv.id,
      buyer_id: conv.buyer_id,
      seller_id: conv.seller_id,
      product_id: conv.product_id,
      order_id: conv.order_id,
      subject: conv.subject,
      status: conv.status,
      last_message_at: conv.last_message_at,
      buyer_unread_count: conv.buyer_unread_count,
      seller_unread_count: conv.seller_unread_count,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      product:
        conv.product_id && conv.product_title
          ? { id: conv.product_id, title: conv.product_title, images: conv.product_images }
          : null,
    }

    const transformed = transformConversation(raw, profileMap)

    if (
      conv.last_message_content &&
      conv.last_message_sender_id &&
      conv.last_message_type &&
      conv.last_message_created_at
    ) {
      transformed.last_message = {
        content: conv.last_message_content,
        sender_id: conv.last_message_sender_id,
        message_type: conv.last_message_type,
        created_at: conv.last_message_created_at,
      }
    }

    return transformed
  })

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
  supabase: SupabaseClient<Database>,
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

  // Fetch last message for this conversation
  const { data: lastMsgData, error: lastMsgError } = await supabase
    .from("messages")
    .select("content, sender_id, message_type, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (lastMsgError && !isNoRowsError(lastMsgError)) {
    logger.error("[Chat] Error fetching conversation last message", lastMsgError, {
      conversationId,
    })
  }

  const transformed = transformConversation(data as RawConversationRow, profileMap)
  if (lastMsgData) {
    transformed.last_message = {
      content: lastMsgData.content,
      sender_id: lastMsgData.sender_id,
      message_type: lastMsgData.message_type ?? "text",
      created_at: lastMsgData.created_at,
    }
  }
  return transformed
}

/**
 * Fetch messages for a conversation
 */
export async function fetchMessages(
  supabase: SupabaseClient<Database>,
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
  supabase: SupabaseClient<Database>,
  senderId: string
): Promise<Pick<RawProfileRow, "id" | "full_name" | "avatar_url"> | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", senderId)
    .maybeSingle()
  if (error && !isNoRowsError(error)) {
    logger.error("[Chat] Error fetching sender profile", error, { senderId })
    return null
  }

  return data ?? null
}

/**
 * Refresh unread count via RPC
 */
export async function fetchTotalUnreadCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { data, error } = await supabase.rpc("get_total_unread_messages")

  if (error) {
    logger.error("[Chat] Error fetching unread count", error)
    return 0
  }

  return data ?? 0
}
