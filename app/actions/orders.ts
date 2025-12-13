"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { OrderItemStatus, ShippingCarrier } from "@/lib/order-status"

// =====================================================
// ORDER MANAGEMENT SERVER ACTIONS
// For sellers to manage their incoming orders
// =====================================================

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus
  seller_received_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  tracking_number: string | null
  shipping_carrier: string | null
  created_at: string
  // Joined data
  product?: {
    id: string
    title: string
    images: string[]
    slug: string
  }
  order?: {
    id: string
    user_id: string
    total_amount: number
    status: string
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
  }
  buyer?: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }
}

/**
 * Update the status of an order item (seller only)
 */
export async function updateOrderItemStatus(
  orderItemId: string,
  newStatus: OrderItemStatus,
  trackingNumber?: string,
  shippingCarrier?: ShippingCarrier
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    // Verify user is authenticated and is the seller
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Build update payload
    const updateData: Record<string, unknown> = { status: newStatus }
    
    // Add tracking info if shipping
    if (newStatus === 'shipped') {
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber
      }
      if (shippingCarrier) {
        updateData.shipping_carrier = shippingCarrier
      }
    }

    // Update the order item (RLS will verify seller_id)
    const { error: updateError } = await supabase
      .from('order_items')
      .update(updateData)
      .eq('id', orderItemId)
      .eq('seller_id', user.id) // Extra safety check

    if (updateError) {
      console.error('Error updating order item status:', updateError)
      return { success: false, error: "Failed to update order status" }
    }

    // Revalidate relevant pages
    revalidatePath('/[locale]/sell/orders', 'page')
    revalidatePath('/[locale]/account/orders', 'page')
    revalidatePath('/[locale]/chat', 'page')

    return { success: true }
  } catch (error) {
    console.error('Error in updateOrderItemStatus:', error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get all order items for the current seller
 */
export async function getSellerOrders(
  statusFilter?: OrderItemStatus | 'all'
): Promise<{ orders: OrderItem[]; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { orders: [], error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { orders: [], error: "Not authenticated" }
    }

    // Build query
    let query = supabase
      .from('order_items')
      .select(`
        *,
        product:products(id, title, images, slug),
        order:orders(id, user_id, total_amount, status, shipping_address, created_at)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data: orderItems, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching seller orders:', fetchError)
      return { orders: [], error: "Failed to fetch orders" }
    }

    // Get buyer profiles for each unique buyer
    const buyerIds = [...new Set(orderItems?.map(item => item.order?.user_id).filter(Boolean))]
    
    let buyersMap = new Map<string, OrderItem['buyer']>()
    
    if (buyerIds.length > 0) {
      const { data: buyers } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', buyerIds)

      buyers?.forEach(buyer => {
        buyersMap.set(buyer.id, buyer)
      })
    }

    // Attach buyer info to each order item
    const ordersWithBuyers = orderItems?.map(item => ({
      ...item,
      buyer: item.order?.user_id ? buyersMap.get(item.order.user_id) : undefined
    })) || []

    return { orders: ordersWithBuyers as OrderItem[] }
  } catch (error) {
    console.error('Error in getSellerOrders:', error)
    return { orders: [], error: "An unexpected error occurred" }
  }
}

/**
 * Get order counts by status for dashboard stats
 */
export async function getSellerOrderStats(): Promise<{
  pending: number
  received: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  total: number
}> {
  const defaultStats = {
    pending: 0,
    received: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0
  }

  try {
    const supabase = await createClient()
    if (!supabase) return defaultStats

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return defaultStats

    const { data: orderItems } = await supabase
      .from('order_items')
      .select('status')
      .eq('seller_id', user.id)

    if (!orderItems) return defaultStats

    const stats = { ...defaultStats }
    orderItems.forEach(item => {
      const status = item.status as OrderItemStatus
      if (status in stats) {
        stats[status]++
      }
      stats.total++
    })

    return stats
  } catch {
    return defaultStats
  }
}

/**
 * Get all orders for the current buyer
 */
export async function getBuyerOrders(): Promise<{ orders: OrderItem[]; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { orders: [], error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { orders: [], error: "Not authenticated" }
    }

    // Get orders for current user
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)

    if (ordersError) {
      return { orders: [], error: "Failed to fetch orders" }
    }

    const orderIds = orders?.map(o => o.id) || []
    if (orderIds.length === 0) {
      return { orders: [] }
    }

    // Get order items with product and seller info
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(id, title, images, slug),
        order:orders(id, user_id, total_amount, status, shipping_address, created_at)
      `)
      .in('order_id', orderIds)
      .order('created_at', { ascending: false })

    if (itemsError) {
      return { orders: [], error: "Failed to fetch order items" }
    }

    // Get seller profiles
    const sellerIds = [...new Set(orderItems?.map(item => item.seller_id).filter(Boolean))]
    
    let sellersMap = new Map<string, { id: string; full_name: string; avatar_url: string | null }>()
    
    if (sellerIds.length > 0) {
      const { data: sellers } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', sellerIds)

      sellers?.forEach(seller => {
        sellersMap.set(seller.id, seller)
      })
    }

    return { orders: orderItems as OrderItem[] }
  } catch (error) {
    console.error('Error in getBuyerOrders:', error)
    return { orders: [], error: "An unexpected error occurred" }
  }
}

/**
 * Get conversation ID for an order item (to link to chat)
 */
export async function getOrderConversation(
  orderId: string,
  _sellerId: string
): Promise<{ conversationId: string | null; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { conversationId: null, error: "Failed to connect to database" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { conversationId: null, error: "Not authenticated" }
    }

    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('order_id', orderId)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .single()

    return { conversationId: conversation?.id || null }
  } catch {
    return { conversationId: null }
  }
}
