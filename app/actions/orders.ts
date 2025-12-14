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
    full_name: string | null
    email: string | null
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
    
    let sellersMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>()
    
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

/**
 * Buyer confirms delivery of an order item
 * This allows the buyer to mark an item as delivered once they receive it
 */
export async function buyerConfirmDelivery(
  orderItemId: string
): Promise<{ success: boolean; error?: string; sellerId?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // First verify this order item belongs to an order by this user
    const { data: orderItem, error: fetchError } = await supabase
      .from('order_items')
      .select(`
        id,
        status,
        seller_id,
        order:orders!inner(user_id)
      `)
      .eq('id', orderItemId)
      .single()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    // Verify the user owns this order
    const order = orderItem.order as unknown as { user_id: string }
    if (order.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this order" }
    }

    // Only allow confirmation if status is 'shipped'
    if (orderItem.status !== 'shipped') {
      return { 
        success: false, 
        error: orderItem.status === 'delivered' 
          ? "Order already marked as delivered" 
          : "Order must be shipped before confirming delivery"
      }
    }

    // Update status to delivered
    const { error: updateError } = await supabase
      .from('order_items')
      .update({ 
        status: 'delivered',
        delivered_at: new Date().toISOString()
      })
      .eq('id', orderItemId)

    if (updateError) {
      console.error('Error confirming delivery:', updateError)
      return { success: false, error: "Failed to confirm delivery" }
    }

    // Revalidate pages
    revalidatePath('/[locale]/account/orders', 'page')
    revalidatePath('/[locale]/sell/orders', 'page')

    return { success: true, sellerId: orderItem.seller_id }
  } catch (error) {
    console.error('Error in buyerConfirmDelivery:', error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Check if buyer can leave feedback for a seller after delivery
 */
export async function canBuyerRateSeller(
  orderItemId: string
): Promise<{ canRate: boolean; hasRated: boolean; sellerId?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { canRate: false, hasRated: false }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { canRate: false, hasRated: false }
    }

    // Get order item with order info
    const { data: orderItem } = await supabase
      .from('order_items')
      .select(`
        id,
        status,
        seller_id,
        order_id,
        order:orders!inner(user_id)
      `)
      .eq('id', orderItemId)
      .single()

    if (!orderItem) {
      return { canRate: false, hasRated: false }
    }

    const order = orderItem.order as unknown as { user_id: string }
    if (order.user_id !== user.id) {
      return { canRate: false, hasRated: false }
    }

    // Must be delivered to rate
    if (orderItem.status !== 'delivered') {
      return { canRate: false, hasRated: false, sellerId: orderItem.seller_id }
    }

    // Check if already rated
    const { data: existingFeedback } = await supabase
      .from('seller_feedback')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('seller_id', orderItem.seller_id)
      .eq('order_id', orderItem.order_id)
      .single()

    return {
      canRate: !existingFeedback,
      hasRated: !!existingFeedback,
      sellerId: orderItem.seller_id
    }
  } catch {
    return { canRate: false, hasRated: false }
  }
}

/**
 * Check if seller can rate buyer after delivery
 */
export async function canSellerRateBuyer(
  orderItemId: string
): Promise<{ canRate: boolean; hasRated: boolean; buyerId?: string; orderId?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { canRate: false, hasRated: false }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { canRate: false, hasRated: false }
    }

    // Get order item - seller must own it
    const { data: orderItem } = await supabase
      .from('order_items')
      .select(`
        id,
        status,
        seller_id,
        order_id,
        order:orders!inner(user_id)
      `)
      .eq('id', orderItemId)
      .eq('seller_id', user.id)
      .single()

    if (!orderItem) {
      return { canRate: false, hasRated: false }
    }

    const order = orderItem.order as unknown as { user_id: string }
    const buyerId = order.user_id

    // Must be delivered to rate
    if (orderItem.status !== 'delivered') {
      return { canRate: false, hasRated: false, buyerId, orderId: orderItem.order_id }
    }

    // Check if already rated - buyer_feedback uses order_id, not order_item_id
    const { data: existingFeedback } = await supabase
      .from('buyer_feedback')
      .select('id')
      .eq('seller_id', user.id)
      .eq('buyer_id', buyerId)
      .eq('order_id', orderItem.order_id)
      .single()

    return {
      canRate: !existingFeedback,
      hasRated: !!existingFeedback,
      buyerId,
      orderId: orderItem.order_id
    }
  } catch {
    return { canRate: false, hasRated: false }
  }
}
