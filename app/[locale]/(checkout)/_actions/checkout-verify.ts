"use server"

import type { Json } from "@/lib/supabase/database.types"
import { ensureOrderConversations } from "@/lib/order-conversations"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

import { parseSessionItemsJson } from "./checkout-helpers"

export type VerifyAndCreateOrderResult =
  | { ok: true; orderId: string; message?: string }
  | { ok: false; error: string }

export async function verifyAndCreateOrder(sessionId: string): Promise<VerifyAndCreateOrderResult> {
  if (!sessionId) {
    return { ok: false, error: "No session ID provided" }
  }

  try {
    const supabase = await createClient()
    if (!supabase) {
      console.error("Supabase client creation failed")
      return { ok: false, error: "Failed to connect to database" }
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Auth error:", authError)
      return { ok: false, error: "Authentication error" }
    }

    if (!user) {
      console.error("No user found in session")
      return { ok: false, error: "User not authenticated" }
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

    if (session.payment_status !== "paid") {
      return { ok: false, error: "Payment not completed" }
    }

    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null
    if (!paymentIntentId) {
      return { ok: false, error: "Missing payment intent" }
    }

    {
      const { data: existingOrder, error: existingOrderError } = await supabase
        .from("orders")
        .select("id,user_id")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existingOrderError) {
        console.error("Error checking existing order:", existingOrderError)
      }

      if (existingOrder?.id) {
        if (existingOrder.user_id !== user.id) {
          return { ok: false, error: "Not authorized" }
        }
        return { ok: true, orderId: existingOrder.id, message: "Order already exists" }
      }
    }

    const itemsData = parseSessionItemsJson(session.metadata?.items_json)
    if (!itemsData || itemsData.length === 0) {
      return { ok: false, error: "Checkout session items missing" }
    }

    const shippingAddress: Json = session.customer_details?.address
      ? {
          name: session.customer_details.name || null,
          email: session.customer_details.email || null,
          address: {
            city: session.customer_details.address.city || null,
            country: session.customer_details.address.country || null,
            line1: session.customer_details.address.line1 || null,
            line2: session.customer_details.address.line2 || null,
            postal_code: session.customer_details.address.postal_code || null,
            state: session.customer_details.address.state || null,
          },
        }
      : null

    const orderData = {
      user_id: user.id,
      total_amount: (session.amount_total || 0) / 100,
      status: "paid",
      shipping_address: shippingAddress,
      stripe_payment_intent_id: paymentIntentId,
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select("id, user_id")
      .single()

    if (orderError) {
      {
        const { data: racedOrder } = await supabase
          .from("orders")
          .select("id,user_id")
          .eq("stripe_payment_intent_id", paymentIntentId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (racedOrder?.id) {
          if (racedOrder.user_id !== user.id) {
            return { ok: false, error: "Not authorized" }
          }
          return { ok: true, orderId: racedOrder.id, message: "Order already exists" }
        }
      }
      return { ok: false, error: `Failed to create order: ${orderError.message}` }
    }

    const productIds = itemsData.map((item) => item.id).filter(Boolean)
    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, seller_id")
        .in("id", productIds)

      if (productsError) {
        return { ok: false, error: "Failed to load products for order" }
      }

      const productSellerMap = new Map(products?.map((p) => [p.id, p.seller_id]) || [])

      const validItems = itemsData
        .map((item) => {
          const sellerId = productSellerMap.get(item.id)
          if (!sellerId) return null

          return {
            order_id: order.id,
            product_id: item.id,
            seller_id: sellerId,
            ...(item.variantId ? { variant_id: item.variantId } : {}),
            quantity: item.qty,
            price_at_purchase: item.price,
          }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))

      if (validItems.length === 0) {
        return { ok: false, error: "No valid order items found" }
      }

      const { error: orderItemsError } = await supabase.from("order_items").insert(validItems)
      if (orderItemsError) {
        return { ok: false, error: `Failed to create order items: ${orderItemsError.message}` }
      }

      await ensureOrderConversations(
        supabase,
        validItems.map((item) => ({
          orderId: order.id,
          buyerId: user.id,
          sellerId: item.seller_id,
          productId: item.product_id,
        }))
      )
    }

    return { ok: true, orderId: order.id }
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    return {
      ok: false,
      error: `Failed to verify checkout session: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    }
  }
}
