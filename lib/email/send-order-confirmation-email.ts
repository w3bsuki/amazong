import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

import { logError, logger } from "@/lib/logger"
import { buildLocaleUrl, getAppUrl, normalizeLocale, type SupportedLocale } from "@/lib/stripe-locale"
import { safeAvatarSrc } from "@/lib/utils"
import type { Database } from "@/lib/supabase/database.types"

import {
  renderOrderConfirmationEmailHtml,
  type OrderConfirmationEmailItem,
  type OrderConfirmationEmailSeller,
} from "@/lib/email/templates/order-confirmation"

export type OrderItemMetadata = {
  id: string
  variantId?: string | null
  qty: number
  price: number
}

function getEmailSubject(locale: SupportedLocale) {
  return locale === "bg" ? "Поръчката ви е потвърдена · Treido" : "Your order is confirmed · Treido"
}

function getFallbackItemTitle(locale: SupportedLocale) {
  return locale === "bg" ? "Артикул" : "Item"
}

function toAbsoluteUrl(src: string): string {
  if (src.startsWith("/")) return `${getAppUrl()}${src}`
  return src
}

export async function sendOrderConfirmationEmail(params: {
  supabase: SupabaseClient<Database>
  to: string
  orderId: string
  items: OrderItemMetadata[]
  sellerId: string | null
  locale?: unknown
  currency?: string | null
  totalAmount?: number
}): Promise<void> {
  const locale = normalizeLocale(params.locale)
  const currency = (params.currency || "eur").toUpperCase()
  const subject = getEmailSubject(locale)
  const orderUrl = buildLocaleUrl(`account/orders/${params.orderId}`, locale)

  const productIds = params.items.map((item) => item.id).filter(Boolean)
  const productTitleById = new Map<string, string>()
  if (productIds.length > 0) {
    const { data: products, error: productsError } = await params.supabase
      .from("products")
      .select("id, title")
      .in("id", productIds)

    if (productsError) {
      logError("order_confirmation_email_products_fetch_failed", productsError, {
        orderId: params.orderId,
      })
    }

    for (const product of products ?? []) {
      productTitleById.set(product.id, product.title)
    }
  }

  const emailItems: OrderConfirmationEmailItem[] = params.items.map((item) => ({
    title: productTitleById.get(item.id) ?? getFallbackItemTitle(locale),
    quantity: item.qty,
    unitPrice: item.price,
  }))

  let seller: OrderConfirmationEmailSeller | null = null
  if (params.sellerId) {
    const { data: profile, error: profileError } = await params.supabase
      .from("profiles")
      .select("username, display_name, business_name, avatar_url")
      .eq("id", params.sellerId)
      .maybeSingle()

    if (profileError) {
      logError("order_confirmation_email_seller_profile_fetch_failed", profileError, {
        sellerId: params.sellerId,
        orderId: params.orderId,
      })
    }

    const sellerName =
      profile?.business_name || profile?.display_name || profile?.username || (locale === "bg" ? "Продавач" : "Seller")

    const avatarSrc = safeAvatarSrc(profile?.avatar_url)
    const avatarUrl = avatarSrc ? toAbsoluteUrl(avatarSrc) : null

    seller = { name: sellerName, avatarUrl }
  }

  const computedTotal = emailItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
  const totalAmount = typeof params.totalAmount === "number" ? params.totalAmount : computedTotal

  const html = renderOrderConfirmationEmailHtml({
    locale,
    subject,
    orderId: params.orderId,
    orderUrl,
    items: emailItems,
    currency,
    totalAmount,
    seller,
  })

  // TODO(PH1-BUYER-001): Wire up a transactional email provider (Resend/Postmark/etc).
  // For now, generate the HTML and log that it would have been sent.
  logger.info("order_confirmation_email_stub_send", {
    to: params.to,
    locale,
    orderId: params.orderId,
    subject,
    itemCount: emailItems.length,
    hasSeller: Boolean(seller),
    htmlBytes: html.length,
  })
}

