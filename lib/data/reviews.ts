import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export type ReviewInsertResult = {
  id: string
  rating: number
  comment: string | null
  created_at: string
}

export async function fetchProductForReview(params: {
  supabase: DbClient
  productId: string
}): Promise<{ ok: true; product: { id: string; title: string; seller_id: string } } | { ok: false; error: unknown }> {
  const { supabase, productId } = params

  const { data, error } = await supabase
    .from("products")
    .select("id, title, seller_id")
    .eq("id", productId)
    .single()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Product not found") }
  }

  return { ok: true, product: data }
}

export async function hasExistingReview(params: {
  supabase: DbClient
  productId: string
  userId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, productId, userId } = params

  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function hasVerifiedPurchase(params: {
  supabase: DbClient
  productId: string
  userId: string
}): Promise<{ ok: true; verified: boolean } | { ok: false; error: unknown }> {
  const { supabase, productId, userId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      order:orders!inner(user_id, status)
    `
    )
    .eq("product_id", productId)
    .eq("orders.user_id", userId)
    .in("orders.status", ["paid", "processing", "shipped", "delivered"])
    .limit(1)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, verified: Boolean(data) }
}

export async function insertReview(params: {
  supabase: DbClient
  productId: string
  userId: string
  rating: number
  title: string | null
  comment: string | null
  verifiedPurchase: boolean
}): Promise<{ ok: true; review: ReviewInsertResult } | { ok: false; error: unknown }> {
  const { supabase, productId, userId, rating, title, comment, verifiedPurchase } = params

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      title,
      comment,
      verified_purchase: verifiedPurchase,
    })
    .select("id, rating, comment, created_at")
    .single()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Failed to insert review") }
  }

  return { ok: true, review: data as ReviewInsertResult }
}

