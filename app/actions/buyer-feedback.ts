"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"

// =====================================================
// BUYER FEEDBACK SERVER ACTIONS
// For SELLERS to rate BUYERS after completed orders
// This is the reverse of seller_feedback (buyer rates seller)
// =====================================================

export interface BuyerFeedbackInput {
  buyer_id: string
  order_id: string
  rating: number // 1-5
  comment?: string
  payment_promptness?: boolean // Did they pay on time?
  communication?: boolean // Were they responsive?
  reasonable_expectations?: boolean // Were their expectations fair?
}

export interface BuyerFeedback {
  id: string
  seller_id: string
  buyer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  payment_promptness: boolean | null
  communication: boolean | null
  reasonable_expectations: boolean | null
  seller_response: string | null
  seller_response_at: string | null
  created_at: string | null
  updated_at: string | null
  // Joined data from profiles
  seller?: {
    display_name: string | null
    username: string | null
  } | null
}

// =====================================================
// SUBMIT BUYER FEEDBACK (Seller rates Buyer)
// =====================================================
export async function submitBuyerFeedback(
  input: BuyerFeedbackInput
): Promise<{ success: boolean; error?: string; data?: BuyerFeedback }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    // Get current user (must be seller)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify user is a seller (has is_seller flag)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, is_seller")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profile not found" }
    }

    if (!profile.is_seller) {
      return { success: false, error: "Only sellers can rate buyers" }
    }

    // Verify the order exists and belongs to this seller
    const { data: orderItem, error: orderError } = await supabase
      .from("order_items")
      .select(`
        id,
        order_id,
        seller_id,
        status,
        order:orders!inner(
          id,
          user_id,
          status
        )
      `)
      .eq("order_id", input.order_id)
      .eq("seller_id", user.id)
      .single()

    if (orderError || !orderItem) {
      return { success: false, error: "Order not found or you are not the seller" }
    }

    // Verify order is in a rateable state (delivered or completed)
    if (!["delivered", "completed", "shipped"].includes(orderItem.status || "")) {
      return { success: false, error: "Can only rate buyers for delivered or completed orders" }
    }

    // Verify buyer_id matches order user_id
    const order = orderItem.order as unknown as { id: string; user_id: string; status: string }
    if (order.user_id !== input.buyer_id) {
      return { success: false, error: "Buyer ID does not match order" }
    }

    // Check if feedback already exists
    const { data: existing } = await supabase
      .from("buyer_feedback")
      .select("id")
      .eq("seller_id", user.id)
      .eq("order_id", input.order_id)
      .maybeSingle()

    if (existing) {
      return { success: false, error: "You have already rated this buyer for this order" }
    }

    // Validate rating
    if (input.rating < 1 || input.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" }
    }

    // Insert feedback
    const { data, error } = await supabase
      .from("buyer_feedback")
      .insert({
        seller_id: user.id,
        buyer_id: input.buyer_id,
        order_id: input.order_id,
        rating: input.rating,
        comment: input.comment || null,
        payment_promptness: input.payment_promptness ?? true,
        communication: input.communication ?? true,
        reasonable_expectations: input.reasonable_expectations ?? true,
      })
      .select("id, seller_id, buyer_id, order_id, rating, comment, payment_promptness, communication, reasonable_expectations, seller_response, seller_response_at, created_at, updated_at")
      .single()

    if (error) {
      console.error("Error submitting buyer feedback:", error)
      return { success: false, error: "Failed to submit feedback" }
    }

    revalidateTag("buyer-stats", "max")
    revalidateTag("orders", "max")

    return { success: true, data: data as unknown as BuyerFeedback }
  } catch (error) {
    console.error("submitBuyerFeedback error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// CHECK IF SELLER CAN RATE BUYER
// =====================================================
export async function canSellerRateBuyer(
  orderId: string
): Promise<{ canRate: boolean; reason?: string; buyerId?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { canRate: false, reason: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { canRate: false, reason: "Not authenticated" }
    }

    // Check if user is seller and has this order
    const { data: orderItem, error } = await supabase
      .from("order_items")
      .select(`
        id,
        status,
        order:orders!inner(
          id,
          user_id
        )
      `)
      .eq("order_id", orderId)
      .eq("seller_id", user.id)
      .single()

    if (error || !orderItem) {
      return { canRate: false, reason: "Order not found" }
    }

    // Check order status
    if (!["delivered", "completed", "shipped"].includes(orderItem.status || "")) {
      return { canRate: false, reason: "Order must be delivered before rating" }
    }

    // Check if already rated
    const { data: existing } = await supabase
      .from("buyer_feedback")
      .select("id")
      .eq("seller_id", user.id)
      .eq("order_id", orderId)
      .maybeSingle()

    if (existing) {
      return { canRate: false, reason: "Already rated this buyer" }
    }

    const order = orderItem.order as unknown as { id: string; user_id: string }
    return { canRate: true, buyerId: order.user_id }
  } catch (error) {
    console.error("canSellerRateBuyer error:", error)
    return { canRate: false, reason: "Error checking rating status" }
  }
}

// =====================================================
// GET BUYER'S RECEIVED RATINGS (for /account/ratings page)
// =====================================================
export async function getBuyerReceivedRatings(
  options?: {
    limit?: number
    offset?: number
  }
): Promise<{
  success: boolean
  data?: BuyerFeedback[]
  total?: number
  averageRating?: number
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const limit = options?.limit || 20
    const offset = options?.offset || 0

    // Get feedback received
    const { data, error, count } = await supabase
      .from("buyer_feedback")
      .select(`
        id,
        seller_id,
        buyer_id,
        order_id,
        rating,
        comment,
        payment_promptness,
        communication,
        reasonable_expectations,
        seller_response,
        seller_response_at,
        created_at,
        updated_at,
        seller:profiles!buyer_feedback_seller_id_fkey(
          display_name,
          username
        )
      `, { count: "exact" })
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("getBuyerReceivedRatings error:", error)
      return { success: false, error: "Failed to fetch ratings" }
    }

    // Get buyer stats for average
    const { data: stats } = await supabase
      .from("buyer_stats")
      .select("average_rating")
      .eq("user_id", user.id)
      .single()

    return {
      success: true,
      data: (data || []) as unknown as BuyerFeedback[],
      total: count || 0,
      averageRating: Number(stats?.average_rating) || 0,
    }
  } catch (error) {
    console.error("getBuyerReceivedRatings error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// GET FEEDBACK FOR A SPECIFIC BUYER (public view)
// =====================================================
export async function getPublicBuyerFeedback(
  buyerId: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  success: boolean
  data?: BuyerFeedback[]
  stats?: {
    averageRating: number
    totalRatings: number
    positivePercentage: number
  }
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const limit = options?.limit || 10
    const offset = options?.offset || 0

    // Get feedback
    const { data, error } = await supabase
      .from("buyer_feedback")
      .select(`
        id,
        rating,
        comment,
        payment_promptness,
        communication,
        reasonable_expectations,
        created_at,
        seller:profiles!buyer_feedback_seller_id_fkey(
          display_name,
          username
        )
      `)
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("getPublicBuyerFeedback error:", error)
      return { success: false, error: "Failed to fetch feedback" }
    }

    // Get stats
    const { data: stats } = await supabase
      .from("buyer_stats")
      .select("average_rating, total_ratings")
      .eq("user_id", buyerId)
      .single()

    // Calculate positive percentage (ratings >= 4)
    const { count: positiveCount } = await supabase
      .from("buyer_feedback")
      .select("id", { count: "exact", head: true })
      .eq("buyer_id", buyerId)
      .gte("rating", 4)

    const positivePercentage = stats?.total_ratings && stats.total_ratings > 0
      ? Math.round(((positiveCount || 0) / stats.total_ratings) * 100)
      : 0

    return {
      success: true,
      data: (data || []) as unknown as BuyerFeedback[],
      stats: {
        averageRating: Number(stats?.average_rating) || 0,
        totalRatings: stats?.total_ratings || 0,
        positivePercentage,
      },
    }
  } catch (error) {
    console.error("getPublicBuyerFeedback error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// GET FEEDBACK SELLER LEFT FOR BUYERS (seller dashboard)
// =====================================================
export async function getSellerGivenFeedback(
  options?: { limit?: number; offset?: number }
): Promise<{
  success: boolean
  data?: (BuyerFeedback & { buyer_profile?: { full_name: string | null; avatar_url: string | null } })[]
  total?: number
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const limit = options?.limit || 20
    const offset = options?.offset || 0

    const { data, error, count } = await supabase
      .from("buyer_feedback")
      .select(`
        id,
        seller_id,
        buyer_id,
        order_id,
        rating,
        comment,
        payment_promptness,
        communication,
        reasonable_expectations,
        seller_response,
        seller_response_at,
        created_at,
        updated_at,
        buyer_profile:profiles!buyer_feedback_buyer_id_fkey(
          full_name,
          avatar_url
        )
      `, { count: "exact" })
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("getSellerGivenFeedback error:", error)
      return { success: false, error: "Failed to fetch feedback" }
    }

    return {
      success: true,
      data: (data || []) as unknown as (BuyerFeedback & { buyer_profile?: { full_name: string | null; avatar_url: string | null } })[],
      total: count || 0,
    }
  } catch (error) {
    console.error("getSellerGivenFeedback error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPDATE BUYER FEEDBACK (edit within time window)
// =====================================================
export async function updateBuyerFeedback(
  feedbackId: string,
  updates: Partial<Pick<BuyerFeedbackInput, "rating" | "comment" | "payment_promptness" | "communication" | "reasonable_expectations">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify ownership and check time window (7 days)
    const { data: existing, error: fetchError } = await supabase
      .from("buyer_feedback")
      .select("id, seller_id, buyer_id, created_at")
      .eq("id", feedbackId)
      .eq("seller_id", user.id)
      .single()

    if (fetchError || !existing) {
      return { success: false, error: "Feedback not found or access denied" }
    }

    // Check 7-day edit window
    const createdAt = new Date(existing.created_at || Date.now())
    const now = new Date()
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceCreation > 7) {
      return { success: false, error: "Edit window expired (7 days)" }
    }

    // Validate rating if provided
    if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
      return { success: false, error: "Rating must be between 1 and 5" }
    }

    const { error } = await supabase
      .from("buyer_feedback")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", feedbackId)

    if (error) {
      console.error("updateBuyerFeedback error:", error)
      return { success: false, error: "Failed to update feedback" }
    }

    revalidateTag("buyer-stats", "max")
    return { success: true }
  } catch (error) {
    console.error("updateBuyerFeedback error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// DELETE BUYER FEEDBACK
// =====================================================
export async function deleteBuyerFeedback(
  feedbackId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify ownership
    const { error } = await supabase
      .from("buyer_feedback")
      .delete()
      .eq("id", feedbackId)
      .eq("seller_id", user.id)

    if (error) {
      console.error("deleteBuyerFeedback error:", error)
      return { success: false, error: "Failed to delete feedback" }
    }

    revalidateTag("buyer-stats", "max")
    return { success: true }
  } catch (error) {
    console.error("deleteBuyerFeedback error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
