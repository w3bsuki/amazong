import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { connection } from "next/server"
import { OrderDetailContent } from "./order-detail-content"
import type { OrderItemStatus } from "@/lib/order-status"

interface OrderDetailPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

// Types matching the OrderDetailContent expectations
interface OrderItemProduct {
  id: string
  title: string
  slug: string | null
  images: string[] | null
  price: number
}

interface OrderItemSeller {
  id: string
  store_name: string
  profile?: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus | null
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  product: OrderItemProduct | null
  seller: OrderItemSeller | null
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string | null
  shipping_address: {
    name?: string
    email?: string
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  } | null
  created_at: string
  stripe_payment_intent_id: string | null
  order_items: OrderItem[]
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await connection()
  const { locale, id } = await params
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (orderError || !orderData) {
    notFound()
  }

  // Fetch order items - cast to expected shape
  const { data: orderItemsRaw } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)

  const orderItemsData = (orderItemsRaw || []) as Array<{
    id: string
    order_id: string
    product_id: string
    seller_id: string
    quantity: number
    price_at_purchase: number
    status: OrderItemStatus | null
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
        .select("id, full_name, avatar_url, business_name")
        .in("id", sellerIds)
    : { data: [] }

  const sellerProfilesData = (sellerProfilesRaw || []) as unknown as Array<{
    id: string
    full_name: string | null
    avatar_url: string | null
    business_name: string | null
  }>

  // Create lookup maps
  const productsMap = new Map(productsData.map((p) => [p.id, p]))
  const sellerProfilesMap = new Map(sellerProfilesData.map((p) => [p.id, p]))

  // Build order items with relations
  const orderItems: OrderItem[] = orderItemsData.map((item) => {
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
      tracking_number: item.tracking_number,
      shipping_carrier: item.shipping_carrier,
      shipped_at: item.shipped_at,
      delivered_at: item.delivered_at,
      product: product || null,
      seller: sellerProfile ? {
        id: sellerProfile.id,
        store_name: sellerProfile.business_name || sellerProfile.full_name || "Unknown Seller",
        profile: {
          full_name: sellerProfile.full_name,
          avatar_url: sellerProfile.avatar_url,
        }
      } : null,
    }
  })

  // Build final order object with proper typing
  const order: Order = {
    id: orderData.id,
    user_id: orderData.user_id,
    total_amount: orderData.total_amount,
    status: orderData.status,
    shipping_address: orderData.shipping_address as Order["shipping_address"],
    created_at: orderData.created_at,
    stripe_payment_intent_id: orderData.stripe_payment_intent_id,
    order_items: orderItems,
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">
        {locale === "bg" ? `Поръчка #${id.slice(0, 8)}` : `Order #${id.slice(0, 8)}`}
      </h1>
      <OrderDetailContent 
        locale={locale} 
        order={order}
      />
    </div>
  )
}
