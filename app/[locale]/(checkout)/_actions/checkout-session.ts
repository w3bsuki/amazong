"use server"

import { getTranslations } from "next-intl/server"
import type Stripe from "stripe"

import type { CartItem } from "@/components/providers/cart-context"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { calculateTransactionFees, getFeesForSeller } from "@/lib/stripe-connect"

import { hasValidCartItems, type SellerInfo } from "./checkout-helpers"

export type CreateCheckoutSessionResult = { ok: true; url: string } | { ok: false; error: string }

export async function createCheckoutSession(
  items: CartItem[],
  locale?: "en" | "bg"
): Promise<CreateCheckoutSessionResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { ok: false, error: "Stripe configuration is missing. Please check your server logs." }
  }

  if (!hasValidCartItems(items)) {
    return { ok: false, error: "Invalid cart item data. Please refresh and try again." }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id

    if (!userId) {
      return { ok: false, error: "Please sign in to checkout." }
    }

    const productIds = items.map((item) => item.id).filter(Boolean)

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, seller_id, title")
      .in("id", productIds)

    if (productsError || !products) {
      return { ok: false, error: "Failed to load product information" }
    }

    const ownProducts = products.filter((p) => p.seller_id === userId)
    if (ownProducts.length > 0) {
      const ownProductTitles = ownProducts.map((p) => p.title).join(", ")
      return { ok: false, error: `You cannot purchase your own products: ${ownProductTitles}` }
    }

    const sellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))]

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

    const itemsBySeller = new Map<string, CartItem[]>()
    for (const item of items) {
      const product = products.find((p) => p.id === item.id)
      if (product?.seller_id) {
        const existing = itemsBySeller.get(product.seller_id) || []
        existing.push(item)
        itemsBySeller.set(product.seller_id, existing)
      }
    }

    if (itemsBySeller.size > 1) {
      return {
        ok: false,
        error: "Please checkout items from one seller at a time. Multi-seller checkout coming soon.",
      }
    }

    if (itemsBySeller.size === 0) {
      return { ok: false, error: "No products found for checkout" }
    }

    const firstEntry = [...itemsBySeller.entries()][0]
    if (!firstEntry) {
      return { ok: false, error: "No products found for checkout" }
    }

    const [sellerId, sellerItems] = firstEntry
    const sellerInfo = sellerMap.get(sellerId)

    const baseUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "")
    const safeLocale = locale === "bg" ? "bg" : "en"
    const t = await getTranslations({ locale: safeLocale, namespace: "CheckoutPage" })

    const fees = await getFeesForSeller(sellerId)
    const itemTotalEur = sellerItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    )
    const feeBreakdown = calculateTransactionFees(itemTotalEur, fees)

    const buyerProtectionFeeCents = Math.round(feeBreakdown.buyerProtectionFee * 100)
    const applicationFeeCents = Math.round(feeBreakdown.platformRevenue * 100)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = sellerItems.map(
      (item: CartItem) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            images: [item.image.startsWith("http") ? item.image : `${baseUrl}${item.image}`],
            metadata: {
              product_id: item.id,
              ...(item.variantId ? { variant_id: item.variantId } : {}),
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    )

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
        items_json: JSON.stringify(
          items.map((i) => ({
            id: i.id,
            variantId: i.variantId ?? null,
            qty: i.quantity,
            price: i.price,
          }))
        ),
        buyer_protection_fee: feeBreakdown.buyerProtectionFee.toFixed(2),
        seller_fee: feeBreakdown.sellerFee.toFixed(2),
      },
      success_url: `${baseUrl}/${safeLocale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${safeLocale}/cart`,
    }

    if (sellerInfo?.stripeAccountId && sellerInfo.chargesEnabled) {
      sessionParams.payment_intent_data = {
        application_fee_amount: applicationFeeCents,
        transfer_data: {
          destination: sellerInfo.stripeAccountId,
        },
      }
    } else {
      console.warn(
        `Seller ${sellerId} has not completed payout setup. Funds will go to platform.`
      )
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      return { ok: false, error: "Failed to start checkout session" }
    }

    return { ok: true, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return { ok: false, error: "Stripe API key configuration error. Please contact support." }
      }
      if (error.message.includes("Invalid")) {
        return { ok: false, error: `Stripe validation error: ${error.message}` }
      }
      if (process.env.NODE_ENV === "development") {
        return { ok: false, error: `Checkout error: ${error.message}` }
      }
    }
    return { ok: false, error: "Failed to create checkout session. Please try again." }
  }
}
