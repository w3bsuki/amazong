import { requireDashboardAccess } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import { OrderDetailView } from "@/components/business/order-detail-view"

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
      price_at_time,
      created_at,
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
      updated_at,
      shipping_address,
      billing_address,
      shipping_method,
      shipping_cost,
      notes,
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
  
  return {
    order,
    items: orderItems,
    subtotal: orderItems.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0),
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await connection()
  
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
