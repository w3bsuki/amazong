"use server"

import type Stripe from "stripe"
import { z } from "zod"

import { logError } from "@/lib/logger"
import { ensureOrderConversations } from "@/lib/order-conversations"
import type { Json } from "@/lib/supabase/database.types"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

import { parseSessionItemsJson, type SessionItem } from "./checkout-helpers"

const SESSION_ID_SCHEMA = z.string().trim().min(1).startsWith("cs_")

export type VerifyAndCreateOrderErrorCode =
  | "invalidSession"
  | "authRequired"
  | "notAuthorized"
  | "paymentNotCompleted"
  | "missingPaymentIntent"
  | "missingItems"
  | "database"
  | "unknown"

export type VerifyAndCreateOrderResult =
  | { ok: true; orderId: string; totalAmount: number; itemCount: number; isExisting: boolean }
  | { ok: false; error: string; errorCode: VerifyAndCreateOrderErrorCode }

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>
type ExistingOrder = { id: string; user_id: string } | null

type ValidOrderItem = {
  order_id: string
  product_id: string
  seller_id: string
  variant_id?: string
  quantity: number
  price_at_purchase: number
}

function createVerificationError(
  error: string,
  errorCode: VerifyAndCreateOrderErrorCode
): VerifyAndCreateOrderResult {
  return { ok: false, error, errorCode }
}

function getSessionBuyerId(session: Stripe.Checkout.Session): string | null {
  const buyerId = session.client_reference_id ?? session.metadata?.user_id ?? null
  return typeof buyerId === "string" && buyerId.length > 0 ? buyerId : null
}

function buildShippingAddress(session: Stripe.Checkout.Session): Json {
  if (!session.customer_details?.address) {
    return null
  }

  return {
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
}

function buildValidOrderItems(
  itemsData: SessionItem[],
  productSellerMap: Map<string, string | null>,
  orderId: string
): ValidOrderItem[] {
  return itemsData
    .map((item): ValidOrderItem | null => {
      const sellerId = productSellerMap.get(item.id)
      if (!sellerId) return null

      return {
        order_id: orderId,
        product_id: item.id,
        seller_id: sellerId,
        ...(item.variantId ? { variant_id: item.variantId } : {}),
        quantity: item.qty,
        price_at_purchase: item.price,
      }
    })
    .filter((item): item is ValidOrderItem => Boolean(item))
}

function resolveExistingOrderResult(params: {
  existingOrder: ExistingOrder
  userId: string
  totalAmount: number
  itemCount: number
}): VerifyAndCreateOrderResult | null {
  const { existingOrder, userId, totalAmount, itemCount } = params

  if (!existingOrder?.id) {
    return null
  }

  if (existingOrder.user_id !== userId) {
    return createVerificationError("Not authorized to verify this session.", "notAuthorized")
  }

  return {
    ok: true,
    orderId: existingOrder.id,
    totalAmount,
    itemCount,
    isExisting: true,
  }
}

async function getAuthenticatedUserId(
  supabase: SupabaseServerClient
): Promise<{ ok: true; userId: string } | { ok: false; result: VerifyAndCreateOrderResult }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    logError("checkout_verify_auth_get_user_failed", authError)
    return {
      ok: false,
      result: createVerificationError("User not authenticated.", "authRequired"),
    }
  }

  if (!user) {
    return {
      ok: false,
      result: createVerificationError("User not authenticated.", "authRequired"),
    }
  }

  return { ok: true, userId: user.id }
}

async function findExistingOrderByPaymentIntent(
  supabase: SupabaseServerClient,
  paymentIntentId: string
): Promise<ExistingOrder> {
  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("orders")
    .select("id,user_id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingOrderError) {
    logError("checkout_verify_existing_order_lookup_failed", existingOrderError, {
      paymentIntentId,
    })
  }

  return existingOrder
}

async function createOrderItemsAndConversations(params: {
  supabase: SupabaseServerClient
  itemsData: SessionItem[]
  orderId: string
  userId: string
}): Promise<{ ok: true; itemCount: number } | { ok: false; result: VerifyAndCreateOrderResult }> {
  const { supabase, itemsData, orderId, userId } = params

  const productIds = itemsData.map((item) => item.id).filter(Boolean)
  if (productIds.length === 0) {
    return {
      ok: false,
      result: createVerificationError("Checkout session items are missing.", "missingItems"),
    }
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, seller_id")
    .in("id", productIds)

  if (productsError) {
    logError("checkout_verify_products_fetch_failed", productsError, {
      orderId,
      productIds,
    })
    return {
      ok: false,
      result: createVerificationError("Failed to load products for order.", "database"),
    }
  }

  const productSellerMap = new Map(products?.map((product) => [product.id, product.seller_id]) ?? [])
  const validItems = buildValidOrderItems(itemsData, productSellerMap, orderId)

  if (validItems.length === 0) {
    return {
      ok: false,
      result: createVerificationError("No valid order items found.", "missingItems"),
    }
  }

  const { error: orderItemsError } = await supabase.from("order_items").insert(validItems)
  if (orderItemsError) {
    logError("checkout_verify_order_items_insert_failed", orderItemsError, {
      orderId,
      itemCount: validItems.length,
    })
    return {
      ok: false,
      result: createVerificationError("Failed to create order items.", "database"),
    }
  }

  try {
    await ensureOrderConversations(
      supabase,
      validItems.map((item) => ({
        orderId,
        buyerId: userId,
        sellerId: item.seller_id,
        productId: item.product_id,
      }))
    )
  } catch (error) {
    logError("checkout_verify_ensure_order_conversations_failed", error, {
      orderId,
    })
  }

  return {
    ok: true,
    itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export async function verifyAndCreateOrder(sessionId: string): Promise<VerifyAndCreateOrderResult> {
  const parsedSessionId = SESSION_ID_SCHEMA.safeParse(sessionId)
  if (!parsedSessionId.success) {
    return createVerificationError("Invalid checkout session.", "invalidSession")
  }

  const safeSessionId = parsedSessionId.data

  try {
    const supabase = await createClient()
    const auth = await getAuthenticatedUserId(supabase)
    if (!auth.ok) {
      return auth.result
    }
    const { userId } = auth

    const session = await stripe.checkout.sessions.retrieve(safeSessionId)
    const sessionBuyerId = getSessionBuyerId(session)

    if (!sessionBuyerId || sessionBuyerId !== userId) {
      return createVerificationError("Not authorized to verify this session.", "notAuthorized")
    }

    if (session.payment_status !== "paid") {
      return createVerificationError("Payment not completed.", "paymentNotCompleted")
    }

    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null
    if (!paymentIntentId) {
      return createVerificationError("Missing payment intent.", "missingPaymentIntent")
    }

    const totalAmount = (session.amount_total || 0) / 100
    const itemsData = parseSessionItemsJson(session.metadata?.items_json)
    const itemCount = itemsData?.reduce((sum, item) => sum + item.qty, 0) ?? 0

    const existingOrderResult = resolveExistingOrderResult({
      existingOrder: await findExistingOrderByPaymentIntent(supabase, paymentIntentId),
      userId,
      totalAmount,
      itemCount,
    })
    if (existingOrderResult) {
      return existingOrderResult
    }

    if (!itemsData || itemsData.length === 0) {
      return createVerificationError("Checkout session items are missing.", "missingItems")
    }

    const orderData = {
      user_id: userId,
      total_amount: totalAmount,
      status: "paid",
      shipping_address: buildShippingAddress(session),
      stripe_payment_intent_id: paymentIntentId,
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select("id")
      .single()

    if (orderError) {
      const racedOrderResult = resolveExistingOrderResult({
        existingOrder: await findExistingOrderByPaymentIntent(supabase, paymentIntentId),
        userId,
        totalAmount,
        itemCount,
      })
      if (racedOrderResult) {
        return racedOrderResult
      }

      logError("checkout_verify_order_insert_failed", orderError, {
        paymentIntentId,
        userId,
      })
      return createVerificationError("Failed to create order.", "database")
    }

    const orderItemsResult = await createOrderItemsAndConversations({
      supabase,
      itemsData,
      orderId: order.id,
      userId,
    })

    if (!orderItemsResult.ok) {
      return orderItemsResult.result
    }

    return {
      ok: true,
      orderId: order.id,
      totalAmount,
      itemCount: orderItemsResult.itemCount,
      isExisting: false,
    }
  } catch (error) {
    logError("checkout_verify_session_failed", error, {
      sessionId: safeSessionId,
    })

    return createVerificationError(
      "Failed to verify checkout session. Please contact support if payment was charged.",
      "unknown"
    )
  }
}
