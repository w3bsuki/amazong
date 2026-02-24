"use server"

import { getTranslations } from "next-intl/server"
import type Stripe from "stripe"

import type { CartItem } from "@/components/providers/cart-context"
import { logError, logger } from "@/lib/logger"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { calculateTransactionFees, getFeesForSeller } from "@/lib/stripe-connect"

import { hasValidCartItems, type SellerInfo } from "./checkout-helpers"

export type CreateCheckoutSessionErrorCode =
  | "authRequired"
  | "ownProducts"
  | "generic"
  | "invalidCart"
  | "multiSeller"
  | "missingProducts"

export type CreateCheckoutSessionResult =
  | { ok: true; url: string }
  | { ok: false; error: string; errorCode: CreateCheckoutSessionErrorCode }

type CheckoutProduct = {
  id: string
  seller_id: string | null
  title: string
}

type PayoutStatus = {
  seller_id: string
  stripe_connect_account_id: string | null
  charges_enabled: boolean | null
}

function getCheckoutBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

function getSafeCheckoutLocale(locale?: "en" | "bg") {
  return locale === "bg" ? "bg" : "en"
}

function createCheckoutError(
  error: string,
  errorCode: CreateCheckoutSessionErrorCode
): CreateCheckoutSessionResult {
  return { ok: false, error, errorCode }
}

function getOwnProductsError(products: CheckoutProduct[], userId: string): string | null {
  const ownProducts = products.filter((p) => p.seller_id === userId)
  if (ownProducts.length === 0) {
    return null
  }

  return ownProducts.map((p) => p.title).join(", ")
}

function buildSellerInfoMap(sellerIds: string[], payoutStatuses?: PayoutStatus[] | null) {
  const sellerMap = new Map<string, SellerInfo>()
  for (const sellerId of sellerIds) {
    const status = payoutStatuses?.find((s) => s.seller_id === sellerId)
    sellerMap.set(sellerId, {
      sellerId,
      stripeAccountId: status?.stripe_connect_account_id ?? null,
      chargesEnabled: status?.charges_enabled ?? false,
    })
  }
  return sellerMap
}

function groupItemsBySeller(items: CartItem[], products: CheckoutProduct[]) {
  const itemsBySeller = new Map<string, CartItem[]>()
  for (const item of items) {
    const product = products.find((p) => p.id === item.id)
    if (!product?.seller_id) {
      continue
    }

    const existing = itemsBySeller.get(product.seller_id) || []
    existing.push(item)
    itemsBySeller.set(product.seller_id, existing)
  }
  return itemsBySeller
}

function getSingleSellerSelection(
  itemsBySeller: Map<string, CartItem[]>
):
  | { ok: true; sellerId: string; sellerItems: CartItem[] }
  | { ok: false; error: string; errorCode: "multiSeller" | "missingProducts" } {
  if (itemsBySeller.size > 1) {
    return {
      ok: false,
      error: "Please checkout items from one seller at a time. Multi-seller checkout coming soon.",
      errorCode: "multiSeller",
    }
  }

  const firstEntry = [...itemsBySeller.entries()][0]
  if (!firstEntry) {
    return { ok: false, error: "No products found for checkout", errorCode: "missingProducts" }
  }

  const [sellerId, sellerItems] = firstEntry
  return { ok: true, sellerId, sellerItems }
}

function buildLineItems(
  sellerItems: CartItem[],
  baseUrl: string
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return sellerItems.map((item) => ({
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
  }))
}

function getCheckoutErrorMessage(error: unknown) {
  if (error instanceof Error && process.env.NODE_ENV === "development") {
    return `Checkout error: ${error.message}`
  }
  return "Failed to create checkout session. Please try again."
}

export async function createCheckoutSession(
  items: CartItem[],
  locale?: "en" | "bg"
): Promise<CreateCheckoutSessionResult> {
  if (!hasValidCartItems(items)) {
    return createCheckoutError(
      "Invalid cart item data. Please refresh and try again.",
      "invalidCart"
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id

    if (!userId) {
      return createCheckoutError("Please sign in to checkout.", "authRequired")
    }

    const productIds = items.map((item) => item.id).filter(Boolean)
    if (productIds.length === 0) {
      return createCheckoutError("No products found for checkout.", "missingProducts")
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, seller_id, title")
      .in("id", productIds)

    if (productsError || !products) {
      logError("checkout_session_products_fetch_failed", productsError, {
        productIds,
        userId,
      })
      return createCheckoutError("Failed to load product information.", "generic")
    }

    const checkoutProducts: CheckoutProduct[] = products.map((product) => ({
      id: product.id,
      seller_id: product.seller_id,
      title: product.title,
    }))

    const ownProductsError = getOwnProductsError(checkoutProducts, userId)
    if (ownProductsError) {
      return createCheckoutError(ownProductsError, "ownProducts")
    }

    const sellerIds = [
      ...new Set(
        checkoutProducts
          .map((product) => product.seller_id)
          .filter((sellerId): sellerId is string => typeof sellerId === "string" && sellerId.length > 0)
      ),
    ]
    if (sellerIds.length === 0) {
      return createCheckoutError("No products found for checkout.", "missingProducts")
    }

    const { data: payoutStatusesData, error: payoutStatusesError } = await supabase
      .from("seller_payout_status")
      .select("seller_id, stripe_connect_account_id, charges_enabled")
      .in("seller_id", sellerIds)

    if (payoutStatusesError) {
      logError("checkout_session_seller_payout_status_fetch_failed", payoutStatusesError, {
        sellerIds,
      })
    }

    const payoutStatuses: PayoutStatus[] = (payoutStatusesData ?? []).map((status) => ({
      seller_id: status.seller_id,
      stripe_connect_account_id: status.stripe_connect_account_id,
      charges_enabled: status.charges_enabled,
    }))

    const sellerMap = buildSellerInfoMap(sellerIds, payoutStatuses)
    const itemsBySeller = groupItemsBySeller(items, checkoutProducts)
    const sellerSelection = getSingleSellerSelection(itemsBySeller)
    if (!sellerSelection.ok) {
      return createCheckoutError(sellerSelection.error, sellerSelection.errorCode)
    }

    const { sellerId, sellerItems } = sellerSelection
    const sellerInfo = sellerMap.get(sellerId)

    const baseUrl = getCheckoutBaseUrl()
    const safeLocale = getSafeCheckoutLocale(locale)
    const t = await getTranslations({ locale: safeLocale, namespace: "CheckoutPage" })

    const fees = await getFeesForSeller(sellerId)
    const itemTotalEur = sellerItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    )
    const feeBreakdown = calculateTransactionFees(itemTotalEur, fees)

    const buyerProtectionFeeCents = Math.round(feeBreakdown.buyerProtectionFee * 100)
    const applicationFeeCents = Math.round(feeBreakdown.platformRevenue * 100)

    const lineItems = buildLineItems(sellerItems, baseUrl)

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
      logger.warn("checkout_session_seller_payout_not_ready", {
        sellerId,
      })
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      return createCheckoutError("Failed to start checkout session.", "generic")
    }

    return { ok: true, url: session.url }
  } catch (error) {
    logError("checkout_session_create_failed", error, {
      locale: getSafeCheckoutLocale(locale),
      itemCount: items.length,
    })
    return createCheckoutError(getCheckoutErrorMessage(error), "generic")
  }
}
