"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getFeesForSeller, calculateTransactionFees } from "@/lib/stripe-connect"
import { getTranslations } from "next-intl/server"
import type { CartItem } from "@/components/providers/cart-context"
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

export async function createCheckoutSession(items: CartItem[], locale?: "en" | "bg") {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { error: "Stripe configuration is missing. Please check your server logs." }
  }

  // Validate items before proceeding
  if (!items || items.length === 0) {
    return { error: "No items in cart" }
  }

  // Validate each item has required fields
  for (const item of items) {
    if (!item.id || !item.title || typeof item.price !== "number" || !Number.isFinite(item.price) || item.price <= 0 || !isValidQuantity(item.quantity)) {
      console.error("Invalid cart item:", item)
      return { error: "Invalid cart item data. Please refresh and try again." }
    }
  }

  try {
    const supabase = await createClient()
    let userId: string | undefined

    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id

    const productIds = items.map((item) => item.id).filter(Boolean)

    // Get products with seller info
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, seller_id, title")
      .in("id", productIds)

    if (productsError || !products) {
      return { error: "Failed to load product information" }
    }

    // Check for own products
    if (userId) {
      const ownProducts = products.filter((p) => p.seller_id === userId)
      if (ownProducts.length > 0) {
        const ownProductTitles = ownProducts.map((p) => p.title).join(", ")
        return { error: `You cannot purchase your own products: ${ownProductTitles}` }
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
      return { error: "Please checkout items from one seller at a time. Multi-seller checkout coming soon." }
    }

    if (itemsBySeller.size === 0) {
      return { error: "No products found for checkout" }
    }

    const entries = Array.from(itemsBySeller.entries())
    const [sellerId, sellerItems] = entries[0]!
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
      ...(userId ? { client_reference_id: userId } : {}),
      metadata: {
        user_id: userId || "guest",
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

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    // Return more specific error messages for debugging
    if (error instanceof Error) {
      // Check for common Stripe errors
      if (error.message.includes("API key")) {
        return { error: "Stripe API key configuration error. Please contact support." }
      }
      if (error.message.includes("Invalid")) {
        return { error: `Stripe validation error: ${error.message}` }
      }
      // In development, show the actual error; in production, show generic message
      if (process.env.NODE_ENV === "development") {
        return { error: `Checkout error: ${error.message}` }
      }
    }
    return { error: "Failed to create checkout session. Please try again." }
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
    let userId: string | undefined

    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id

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

export async function verifyAndCreateOrder(sessionId: string) {
  if (!sessionId) {
    return { error: "No session ID provided" }
  }

  try {
    const supabase = await createClient()
    if (!supabase) {
      console.error("Supabase client creation failed")
      return { error: "Failed to connect to database" }
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Authentication error" }
    }

    if (!user) {
      console.error("No user found in session")
      return { error: "User not authenticated" }
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

    if (session.payment_status !== "paid") {
      return { error: "Payment not completed" }
    }

    if (session.payment_intent) {
      const { data: existingOrder, error: existingOrderError } = await supabase
        .from("orders")
        .select("id,user_id")
        .eq("stripe_payment_intent_id", session.payment_intent as string)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existingOrderError) {
        console.error("Error checking existing order:", existingOrderError)
      }

      if (existingOrder?.id) {
        if (existingOrder.user_id !== user.id) {
          return { error: "Not authorized" }
        }
        return { success: true, orderId: existingOrder.id, message: "Order already exists" }
      }
    }

    let itemsData: { id: string; variantId?: string | null; qty: number; price: number }[] = []
    try {
      if (session.metadata?.items_json) {
        itemsData = JSON.parse(session.metadata.items_json)
      }
    } catch (e) {
      console.warn("Could not parse items_json from metadata:", e)
    }

    const shippingAddress = session.customer_details?.address
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
      shipping_address: shippingAddress as import("@/lib/supabase/database.types").Json,
      stripe_payment_intent_id: session.payment_intent as string,
    }

    const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

    if (orderError) {
      // If the webhook won the race and created the order first, we try to fetch it.
      if (session.payment_intent) {
        const { data: racedOrder } = await supabase
          .from("orders")
          .select("id,user_id")
          .eq("stripe_payment_intent_id", session.payment_intent as string)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (racedOrder?.id) {
          if (racedOrder.user_id !== user.id) {
            return { error: "Not authorized" }
          }
          return { success: true, orderId: racedOrder.id, message: "Order already exists" }
        }
      }
      return { error: `Failed to create order: ${orderError.message}` }
    }

    const productIds = itemsData.map((item) => item.id).filter(Boolean)
    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from("products")
        .select("id, seller_id")
        .in("id", productIds)

      const productSellerMap = new Map(products?.map((p) => [p.id, p.seller_id]) || [])

      const validItems = itemsData
        .filter((item) => item.id && productSellerMap.get(item.id))
        .map((item) => ({
          order_id: order.id,
          product_id: item.id,
          seller_id: productSellerMap.get(item.id)!,
          ...(item.variantId ? { variant_id: item.variantId } : {}),
          quantity: item.qty || 1,
          price_at_purchase: item.price,
        }))

      if (validItems.length > 0) {
        // Stock decrement is enforced in the database on insert (trigger), so we don't
        // need a service-role client here.
        const { error: orderItemsError } = await supabase.from("order_items").insert(validItems)
        if (orderItemsError) {
          return { error: `Failed to create order items: ${orderItemsError.message}` }
        }
      }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    return {
      error: `Failed to verify checkout session: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
