import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import type {
  Conversation,
  Message,
  MessageType,
  RawConversationRow,
  RawMessageRow,
  RawProfileRow,
} from "@/lib/types/messages"

import { logger } from "@/lib/logger"
export const CONVERSATION_SELECT = `
  id,
  buyer_id,
  seller_id,
  product_id,
  order_id,
  subject,
  status,
  last_message_at,
  buyer_unread_count,
  seller_unread_count,
  created_at,
  updated_at,
  product:products(id, title, images)
`

export const MESSAGE_SELECT =
  "id, conversation_id, sender_id, content, message_type, is_read, read_at, created_at"

export function isNoRowsError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "PGRST116"
  )
}

/**
 * Fetch profiles for a list of user IDs
 */
export async function fetchProfiles(
  supabase: SupabaseClient<Database>,
  userIds: string[]
): Promise<Map<string, RawProfileRow>> {
  if (userIds.length === 0) return new Map()

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, display_name, business_name, username")
    .in("id", userIds)
  if (error) {
    logger.error("[Chat] Error fetching profiles", error, { userIds })
    return new Map()
  }

  return new Map(profiles?.map((p) => [p.id, p]) || [])
}

/**
 * Transform raw conversation row to Conversation type with profile data
 */
export function transformConversation(
  conv: RawConversationRow,
  profileMap: Map<string, RawProfileRow>
): Conversation {
  const buyerProfile = profileMap.get(conv.buyer_id)
  const sellerProfile = profileMap.get(conv.seller_id)
  const productRow = Array.isArray(conv.product) ? conv.product[0] ?? null : conv.product

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
    product: productRow
      ? {
          id: productRow.id,
          title: productRow.title,
          images: productRow.images || [],
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
