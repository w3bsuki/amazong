import { requireDashboardAccess } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { OrderDetailView } from "../../../_components/order-detail-view"

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>
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
        sku,
        price
      )
    `)
    .eq('seller_id', sellerId)
    .eq('order_id', orderId)
  
  if (itemsError || !orderItems?.length) {
    return null
  }
  
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
        email,
        full_name,
        phone
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
    product: { id: string; title: string; images: string[] | null; sku: string | null; price: number } | null
  }>
  
  return {
    order: order as unknown as {
      id: string
      status: string | null
      created_at: string
      total_amount: number
      shipping_address: Record<string, unknown> | null
      user: { id: string; email: string | null; full_name: string | null; phone: string | null } | null
    },
    items: typedItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price_at_time: item.price_at_purchase, // Map to expected interface name
      status: item.status,
      tracking_number: item.tracking_number,
      shipping_carrier: item.shipping_carrier,
      product: item.product,
    })),
    subtotal: typedItems.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0),
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params
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
