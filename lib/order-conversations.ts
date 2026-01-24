import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type ConversationSeed = {
  orderId: string
  buyerId: string
  sellerId: string
  productId: string
}

function formatSupabaseError(error: unknown): string {
  if (!error) return "unknown error"
  if (typeof error === "string") return error
  if (error instanceof Error) return error.message
  if (typeof error === "object") {
    const record = error as Record<string, unknown>
    const code = typeof record.code === "string" ? record.code : null
    const message = typeof record.message === "string" ? record.message : null
    return [code, message].filter(Boolean).join(": ") || "unknown error"
  }
  return String(error)
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
      console.error("Error checking order conversation:", formatSupabaseError(existingError))
      continue
    }

    if (existing?.id) {
      if (!existing.order_id) {
        const { error: updateError } = await supabase
          .from("conversations")
          .update({ order_id: seed.orderId, updated_at: now })
          .eq("id", existing.id)

        if (updateError) {
          console.error("Error linking order to conversation:", formatSupabaseError(updateError))
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
      console.error("Error creating order conversation:", formatSupabaseError(insertError))
    }
  }
}
