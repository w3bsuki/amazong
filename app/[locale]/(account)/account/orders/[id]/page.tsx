import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { redirect } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { locales } from "@/i18n/routing"
import { canBuyerRateSeller } from "../../../../../actions/orders-rating"
import { requestOrderCancellation, reportOrderIssue, requestReturn } from "../../../../../actions/orders-support"
import { buyerConfirmDelivery } from "../../../../../actions/orders-status"
import { submitSellerFeedback } from "../../../../../actions/seller-feedback"
import { OrderDetailContent } from "./_components/order-detail-content"
import type { OrderItemStatus } from "@/lib/order-status"
import type { OrderDetailItem, OrderDetailOrder } from "./_components/order-detail-types"

// Return placeholder param for build validation (required by cacheComponents)
// Actual pages are rendered server-side for authenticated users
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, id: "__placeholder__" }))
}

interface OrderDetailPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export const metadata = {
  title: "Order Details | Treido",
  description: "View order details and delivery status.",
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale: localeParam, id } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  
  // Enable static generation for this locale
  setRequestLocale(locale)
  
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Fetch order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("id,user_id,total_amount,status,shipping_address,created_at,stripe_payment_intent_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (orderError || !orderData) {
    notFound()
  }

  // Fetch order items - cast to expected shape
  const { data: orderItemsRaw } = await supabase
    .from("order_items")
    .select(
      "id,order_id,product_id,seller_id,quantity,price_at_purchase,status,seller_received_at,tracking_number,shipping_carrier,shipped_at,delivered_at"
    )
    .eq("order_id", id)

  const orderItemsData = (orderItemsRaw || []) as Array<{
    id: string
    order_id: string
    product_id: string
    seller_id: string
    quantity: number
    price_at_purchase: number
    status: OrderItemStatus | null
    seller_received_at: string | null
    tracking_number: string | null
    shipping_carrier: string | null
    shipped_at: string | null
    delivered_at: string | null
  }>

  // Fetch products for order items
  const productIds = orderItemsData.map((item) => item.product_id)
  const { data: productsRaw } = productIds.length > 0
    ? await supabase
        .from("products")
        .select("id, title, slug, images, price")
        .in("id", productIds)
    : { data: [] }

  const productsData = (productsRaw || []) as unknown as Array<{
    id: string
    title: string
    slug: string | null
    images: string[] | null
    price: number
  }>

  // Fetch seller profiles for order items (seller_id references profiles.id)
  const sellerIds = orderItemsData.map((item) => item.seller_id)
  const { data: sellerProfilesRaw } = sellerIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, business_name, username")
        .in("id", sellerIds)
    : { data: [] }

  const sellerProfilesData = (sellerProfilesRaw || []) as unknown as Array<{
    id: string
    full_name: string | null
    avatar_url: string | null
    business_name: string | null
    username: string | null
  }>

  // Create lookup maps
  const productsMap = new Map(productsData.map((p) => [p.id, p]))
  const sellerProfilesMap = new Map(sellerProfilesData.map((p) => [p.id, p]))

  // Build order items with relations
  const orderItems: OrderDetailItem[] = orderItemsData.map((item) => {
    const product = productsMap.get(item.product_id)
    const sellerProfile = sellerProfilesMap.get(item.seller_id)
    return {
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      seller_id: item.seller_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
      status: item.status,
      seller_received_at: item.seller_received_at,
      tracking_number: item.tracking_number,
      shipping_carrier: item.shipping_carrier,
      shipped_at: item.shipped_at,
      delivered_at: item.delivered_at,
      product: product || null,
      seller: sellerProfile ? {
        id: sellerProfile.id,
        store_name: sellerProfile.business_name || sellerProfile.full_name || "Unknown Seller",
        username: sellerProfile.username,
        profile: {
          full_name: sellerProfile.full_name,
          avatar_url: sellerProfile.avatar_url,
        }
      } : null,
    }
  })

  // Build final order object with proper typing
  const order: OrderDetailOrder = {
    id: orderData.id,
    user_id: orderData.user_id,
    total_amount: orderData.total_amount,
    status: orderData.status,
    shipping_address: orderData.shipping_address as OrderDetailOrder["shipping_address"],
    created_at: orderData.created_at,
    stripe_payment_intent_id: orderData.stripe_payment_intent_id,
    order_items: orderItems,
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("order_id", id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .maybeSingle()

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">
        {locale === "bg" ? `Поръчка #${id.slice(0, 8)}` : `Order #${id.slice(0, 8)}`}
      </h1>
      <OrderDetailContent 
        locale={locale} 
        order={order}
        conversationId={conversation?.id ?? null}
        actions={{ 
          requestReturn, 
          submitSellerFeedback,
          buyerConfirmDelivery,
          canBuyerRateSeller,
          requestOrderCancellation,
          reportOrderIssue,
        }}
      />
    </div>
  )
}
