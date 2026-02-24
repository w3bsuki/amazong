import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import type { RawMessageRow } from "@/lib/types/messages"
import { MESSAGE_SELECT } from "./messages.helpers"

/**
 * Send a new message
 */
export async function sendMessageToConversation(
  supabase: SupabaseClient<Database>,
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
  supabase: SupabaseClient<Database>,
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
  supabase: SupabaseClient<Database>,
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
  supabase: SupabaseClient<Database>,
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
