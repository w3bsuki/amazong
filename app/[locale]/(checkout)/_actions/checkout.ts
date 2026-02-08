"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getFeesForSeller, calculateTransactionFees } from "@/lib/stripe-connect"
import { getTranslations } from "next-intl/server"
import type { CartItem } from "@/components/providers/cart-context"
import { ensureOrderConversations } from "@/lib/order-conversations"
import type { Json } from "@/lib/supabase/database.types"
import type Stripe from "stripe"

type SellerInfo = {
  sellerId: string
  stripeAccountId: string | null
  chargesEnabled: boolean
}

const MAX_CHECKOUT_QUANTITY = 99

function isValidQuantity(value: unknown): value is number {
  return typeof value === "number"
    && Number.isFinite(value)
    && Number.isSafeInteger(value)
    && value > 0
    && value <= MAX_CHECKOUT_QUANTITY
}

export type CreateCheckoutSessionResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

type SessionItem = { id: string; variantId?: string | null; qty: number; price: number }

function parseSessionItemsJson(itemsJson: string | undefined): SessionItem[] | null {
  if (!itemsJson) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(itemsJson) as unknown
  } catch {
    return null
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return null

  const items: SessionItem[] = []

  for (const rawItem of parsed) {
    if (!rawItem || typeof rawItem !== "object") return null
    const record = rawItem as Record<string, unknown>

    const id = typeof record.id === "string" ? record.id : ""
    const qty = typeof record.qty === "number" ? record.qty : Number.NaN
    const price = typeof record.price === "number" ? record.price : Number.NaN

    const variantIdRaw = record.variantId
    const variantId =
      typeof variantIdRaw === "string"
        ? variantIdRaw
        : variantIdRaw === null
          ? null
          : null

    if (!id) return null
    if (!Number.isFinite(qty) || !Number.isSafeInteger(qty) || qty <= 0 || qty > MAX_CHECKOUT_QUANTITY) return null
    if (!Number.isFinite(price) || price <= 0) return null

    items.push({ id, variantId, qty, price })
  }

  return items
}

export async function createCheckoutSession(
  items: CartItem[],
  locale?: "en" | "bg"
): Promise<CreateCheckoutSessionResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { ok: false, error: "Stripe configuration is missing. Please check your server logs." }
  }

  // Validate items before proceeding
  if (!items || items.length === 0) {
    return { ok: false, error: "No items in cart" }
  }

  // Validate each item has required fields
  for (const item of items) {
    if (!item.id || !item.title || typeof item.price !== "number" || !Number.isFinite(item.price) || item.price <= 0 || !isValidQuantity(item.quantity)) {
      console.error("Invalid cart item:", item)
      return { ok: false, error: "Invalid cart item data. Please refresh and try again." }
    }
  }

  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    // Orders are owned by a user_id (uuid) and are created by webhook/verify flows.
    // Prevent guest checkout sessions that would be impossible to convert into a valid order.
    if (!userId) {
      return { ok: false, error: "Please sign in to checkout." }
    }

    const productIds = items.map((item) => item.id).filter(Boolean)

    // Get products with seller info
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, seller_id, title")
      .in("id", productIds)

    if (productsError || !products) {
      return { ok: false, error: "Failed to load product information" }
    }

    // Check for own products
    if (userId) {
      const ownProducts = products.filter((p) => p.seller_id === userId)
      if (ownProducts.length > 0) {
        const ownProductTitles = ownProducts.map((p) => p.title).join(", ")
        return { ok: false, error: `You cannot purchase your own products: ${ownProductTitles}` }
      }
    }

    // Get unique seller IDs
    const sellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))]

    // Get seller payout status for Connect payments
    const { data: payoutStatuses } = await supabase
      .from("seller_payout_status")
      .select("seller_id, stripe_connect_account_id, charges_enabled")
      .in("seller_id", sellerIds)

    const sellerMap = new Map<string, SellerInfo>()
    for (const sellerId of sellerIds) {
      const status = payoutStatuses?.find((s) => s.seller_id === sellerId)
      sellerMap.set(sellerId, {
        sellerId,
        stripeAccountId: status?.stripe_connect_account_id ?? null,
        chargesEnabled: status?.charges_enabled ?? false,
      })
    }

    // Group items by seller
    const itemsBySeller = new Map<string, CartItem[]>()
    for (const item of items) {
      const product = products.find((p) => p.id === item.id)
      if (product?.seller_id) {
        const existing = itemsBySeller.get(product.seller_id) || []
        existing.push(item)
        itemsBySeller.set(product.seller_id, existing)
      }
    }

    // For now, we only support single-seller checkout with Connect
    // Multi-seller checkout would require separate payment intents
    if (itemsBySeller.size > 1) {
      return { ok: false, error: "Please checkout items from one seller at a time. Multi-seller checkout coming soon." }
    }

    if (itemsBySeller.size === 0) {
      return { ok: false, error: "No products found for checkout" }
    }

    const entries = Array.from(itemsBySeller.entries())
    const firstEntry = entries[0]
    if (!firstEntry) {
      return { ok: false, error: "No products found for checkout" }
    }

    const [sellerId, sellerItems] = firstEntry
    const sellerInfo = sellerMap.get(sellerId)

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "")
    const safeLocale = locale === "bg" ? "bg" : "en"
    const t = await getTranslations({ locale: safeLocale, namespace: "CheckoutPage" })

    // Calculate fees based on seller's subscription tier
    const fees = await getFeesForSeller(sellerId)
    
    // Calculate total item price for fee calculation
    const itemTotalEur = sellerItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
    
    // Calculate transaction fees using the new buyer protection model
    const feeBreakdown = calculateTransactionFees(itemTotalEur, fees)
    
    // Convert buyer protection fee to cents for Stripe
    const buyerProtectionFeeCents = Math.round(feeBreakdown.buyerProtectionFee * 100)
    
    // Calculate total application fee (seller fee + buyer protection)
    const applicationFeeCents = Math.round(feeBreakdown.platformRevenue * 100)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = sellerItems.map((item: CartItem) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
          images: [
            item.image.startsWith("http")
              ? item.image
              : `${baseUrl}${item.image}`,
          ],
          metadata: {
            product_id: item.id,
            ...(item.variantId ? { variant_id: item.variantId } : {}),
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))
    
    // Add buyer protection fee as a separate line item (visible to buyer)
    if (buyerProtectionFeeCents > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: t("buyerProtection"),
            description: t("buyerProtectionDescription"),
          },
          unit_amount: buyerProtectionFeeCents,
        },
        quantity: 1,
      })
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        seller_id: sellerId,
        items_json: JSON.stringify(items.map((i) => ({ id: i.id, variantId: i.variantId ?? null, qty: i.quantity, price: i.price }))),
        buyer_protection_fee: feeBreakdown.buyerProtectionFee.toFixed(2),
        seller_fee: feeBreakdown.sellerFee.toFixed(2),
      },
      success_url: `${baseUrl}/${safeLocale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${safeLocale}/cart`,
    }

    // Add Connect destination charges if seller has completed onboarding
    if (sellerInfo?.stripeAccountId && sellerInfo.chargesEnabled) {
      sessionParams.payment_intent_data = {
        application_fee_amount: applicationFeeCents,
        transfer_data: {
          destination: sellerInfo.stripeAccountId,
        },
      }
    } else {
      // Seller hasn't set up payouts - funds go to platform
      // TODO: Consider blocking checkout or warning buyer
      console.warn(`Seller ${sellerId} has not completed payout setup. Funds will go to platform.`)
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      return { ok: false, error: "Failed to start checkout session" }
    }

    return { ok: true, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    // Return more specific error messages for debugging
    if (error instanceof Error) {
      // Check for common Stripe errors
      if (error.message.includes("API key")) {
        return { ok: false, error: "Stripe API key configuration error. Please contact support." }
      }
      if (error.message.includes("Invalid")) {
        return { ok: false, error: `Stripe validation error: ${error.message}` }
      }
      // In development, show the actual error; in production, show generic message
      if (process.env.NODE_ENV === "development") {
        return { ok: false, error: `Checkout error: ${error.message}` }
      }
    }
    return { ok: false, error: "Failed to create checkout session. Please try again." }
  }
}

export type CheckoutFeeQuoteResult =
  | { ok: true; buyerProtectionFee: number }
  | { ok: false }

export async function getCheckoutFeeQuote(items: CartItem[]): Promise<CheckoutFeeQuoteResult> {
  // Validate items before proceeding (client may call this as items change)
  if (!items || items.length === 0) {
    return { ok: false }
  }

  for (const item of items) {
    if (!item.id || !item.title || typeof item.price !== "number" || !Number.isFinite(item.price) || item.price <= 0 || !isValidQuantity(item.quantity)) {
      return { ok: false }
    }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id

    const productIds = items.map((item) => item.id).filter(Boolean)

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, seller_id, title")
      .in("id", productIds)

    if (productsError || !products) {
      return { ok: false }
    }

    if (userId) {
      const ownsAny = products.some((p) => p.seller_id === userId)
      if (ownsAny) {
        return { ok: false }
      }
    }

    const sellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))]
    if (sellerIds.length !== 1) {
      return { ok: false }
    }

    const sellerId = sellerIds[0]
    if (!sellerId) {
      return { ok: false }
    }

    const fees = await getFeesForSeller(sellerId)
    const itemTotalEur = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
    const feeBreakdown = calculateTransactionFees(itemTotalEur, fees)

    return { ok: true, buyerProtectionFee: feeBreakdown.buyerProtectionFee }
  } catch {
    return { ok: false }
  }
}

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

    const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select("id, user_id").single()

    if (orderError) {
      // If the webhook won the race and created the order first, we try to fetch it.
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

      // Stock decrement is enforced in the database on insert (trigger), so we don't
      // need a service-role client here.
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
      error: `Failed to verify checkout session: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
