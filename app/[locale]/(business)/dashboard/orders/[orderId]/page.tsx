import { requireDashboardAccess } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { locales, notFound } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { OrderDetailView } from "../../../_components/order-detail-view"

// Return placeholder param for build validation (required by cacheComponents)
// Actual pages are rendered server-side for authenticated sellers
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, orderId: "__placeholder__" }))
}

interface OrderDetailPageProps {
  params: Promise<{ locale: string; orderId: string }>
}

async function getOrderDetails(orderId: string, sellerId: string) {
  const supabase = await createClient()
  
  // Get order items for this order that belong to this seller
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      price_at_purchase,
      status,
      tracking_number,
      shipping_carrier,
      product:products(
        id,
        title,
        images,
        price
      )
    `)
    .eq('seller_id', sellerId)
    .eq('order_id', orderId)
  
  if (itemsError || !orderItems?.length) {
    return null
  }

  const productIds = [...new Set(orderItems.map((i) => i.product?.id).filter(Boolean))]
  const { data: privateRows } = productIds.length
    ? await supabase
        .from('product_private')
        .select('product_id, sku')
        .eq('seller_id', sellerId)
        .in('product_id', productIds)
    : { data: [] as Array<{ product_id: string; sku: string | null }> }

  const skuByProductId = new Map((privateRows || []).map((r) => [r.product_id, r.sku]))
  
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      total_amount,
      shipping_address,
      user:profiles(
        id,
        full_name
      )
    `)
    .eq('id', orderId)
    .single()
  
  if (orderError || !order) {
    return null
  }
  
  // Cast to correct types
  const typedItems = orderItems as unknown as Array<{
    id: string
    quantity: number
    price_at_purchase: number
    status: string | null
    tracking_number: string | null
    shipping_carrier: string | null
    product: { id: string; title: string; images: string[] | null; price: number } | null
  }>

  const shippingAddress = order.shipping_address as Record<string, unknown> | null
  const email = typeof shippingAddress?.email === 'string' ? shippingAddress.email : null
  const phone = typeof shippingAddress?.phone === 'string' ? shippingAddress.phone : null
  const nameFromShipping = typeof shippingAddress?.name === 'string' ? shippingAddress.name : null

  const baseUser = Array.isArray(order.user) ? (order.user.at(0) ?? null) : order.user
  const typedOrderUser = baseUser
    ? {
        id: baseUser.id,
        email,
        full_name: baseUser.full_name ?? nameFromShipping,
        phone,
      }
    : null

  const typedOrder = {
    ...order,
    shipping_address: shippingAddress,
    user: typedOrderUser,
  } as unknown as {
    id: string
    status: string | null
    created_at: string
    total_amount: number
    shipping_address: Record<string, unknown> | null
    user: { id: string; email: string | null; full_name: string | null; phone: string | null } | null
  }
  
  return {
    order: typedOrder,
    items: typedItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price_at_time: item.price_at_purchase, // Map to expected interface name
      status: item.status,
      tracking_number: item.tracking_number,
      shipping_carrier: item.shipping_carrier,
      product: item.product ? { ...item.product, sku: skuByProductId.get(item.product.id) ?? null } : null,
    })),
    subtotal: typedItems.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0),
  }
}

export const metadata = {
  title: "Order Details | Treido",
  description: "View order details in your business dashboard.",
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale: localeParam, orderId } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  
  // Enable static generation for this locale
  setRequestLocale(locale)
  
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const orderData = await getOrderDetails(orderId, businessSeller.id)
  
  if (!orderData) {
    notFound()
  }
  
  return (
    <OrderDetailView 
      order={orderData.order}
      items={orderData.items}
      subtotal={orderData.subtotal}
      sellerId={businessSeller.id}
    />
  )
}
