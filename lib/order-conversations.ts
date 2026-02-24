import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"
import type { Database } from "@/lib/supabase/database.types"

type ConversationSeed = {
  orderId: string
  buyerId: string
  sellerId: string
  productId: string
}

export async function ensureOrderConversations(
  supabase: SupabaseClient<Database>,
  seeds: ConversationSeed[]
): Promise<void> {
  if (!Array.isArray(seeds) || seeds.length === 0) return

  const now = new Date().toISOString()
  const seen = new Set<string>()

  for (const seed of seeds) {
    if (!seed.orderId || !seed.buyerId || !seed.sellerId || !seed.productId) continue

    const key = `${seed.buyerId}:${seed.sellerId}:${seed.productId}`
    if (seen.has(key)) continue
    seen.add(key)

    const { data: existing, error: existingError } = await supabase
      .from("conversations")
      .select("id, order_id")
      .eq("buyer_id", seed.buyerId)
      .eq("seller_id", seed.sellerId)
      .eq("product_id", seed.productId)
      .maybeSingle()

    if (existingError) {
      logger.error("order_conversations_check_failed", existingError)
      continue
    }

    if (existing?.id) {
      if (!existing.order_id) {
        const { error: updateError } = await supabase
          .from("conversations")
          .update({ order_id: seed.orderId, updated_at: now })
          .eq("id", existing.id)

        if (updateError) {
          logger.error("order_conversations_link_failed", updateError)
        }
      }
      continue
    }

    const { error: insertError } = await supabase.from("conversations").insert({
      buyer_id: seed.buyerId,
      seller_id: seed.sellerId,
      product_id: seed.productId,
      order_id: seed.orderId,
      status: "open",
      last_message_at: now,
      updated_at: now,
    })

    if (insertError) {
      logger.error("order_conversations_create_failed", insertError)
    }
  }
}
