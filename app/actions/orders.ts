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

    // Fetch existing timestamps so we don't clobber them.
    const { data: existingItem, error: existingError } = await supabase
      .from("order_items")
      .select("id, seller_id, seller_received_at, shipped_at, delivered_at")
      .eq("id", orderItemId)
      .eq("seller_id", user.id)
      .single()

    if (existingError || !existingItem) {
      return { success: false, error: "Order item not found" }
    }

    // Build update payload
    const updateData: Record<string, unknown> = { status: newStatus }

    const now = new Date().toISOString()

    if (newStatus === "received" && !existingItem.seller_received_at) {
      updateData.seller_received_at = now
    }

    if (newStatus === "shipped" && !existingItem.shipped_at) {
      updateData.shipped_at = now
    }

    if (newStatus === "delivered" && !existingItem.delivered_at) {
      updateData.delivered_at = now
    }
    
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

// =====================================================
// BUYER ORDER MANAGEMENT ACTIONS
// For buyers to manage their orders
// =====================================================

/**
 * Request cancellation of an order item (buyer only)
 * Can only cancel items that are not yet shipped
 */
export async function requestOrderCancellation(
  orderItemId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify the order item belongs to this user's order and check status
    const { data: orderItem, error: fetchError } = await supabase
      .from('order_items')
      .select(`
        id,
        status,
        seller_id,
        product:products(title),
        order:orders!inner(id, user_id, status)
      `)
      .eq('id', orderItemId)
      .single()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    const order = orderItem.order as unknown as { id: string; user_id: string; status: string }
    
    // Verify user owns this order
    if (order.user_id !== user.id) {
      return { success: false, error: "Not authorized to cancel this order" }
    }

    // Check if cancellation is allowed (not shipped or delivered)
    const nonCancellableStatuses = ['shipped', 'delivered']
    const currentStatus = orderItem.status || 'pending'
    if (nonCancellableStatuses.includes(currentStatus)) {
      return { 
        success: false, 
        error: currentStatus === 'shipped' 
          ? "Cannot cancel - item has already been shipped"
          : "Cannot cancel - item has already been delivered"
      }
    }

    if (currentStatus === 'cancelled') {
      return { success: false, error: "This item has already been cancelled" }
    }

    // Update order item status to cancelled
    const { error: updateError } = await supabase
      .from('order_items')
      .update({ 
        status: 'cancelled',
        // Store cancellation reason in a metadata field if needed
      })
      .eq('id', orderItemId)

    if (updateError) {
      console.error('Error cancelling order item:', updateError)
      return { success: false, error: "Failed to cancel order" }
    }

    // Create a notification for the seller
    const { error: notifyError } = await supabase
      .from('notifications')
      .insert({
        user_id: orderItem.seller_id,
        type: 'order_status',
        title: 'Order Cancellation Request',
        body: `A buyer has cancelled their order${reason ? `: ${reason}` : ''}`,
        data: { 
          order_item_id: orderItemId, 
          order_id: order.id,
          reason 
        },
        order_id: order.id,
      })

    if (notifyError) {
      console.error('Error creating cancellation notification:', notifyError)
      // Don't fail the cancellation if notification fails
    }

    // Revalidate pages
    revalidatePath('/[locale]/account/orders', 'page')
    revalidatePath('/[locale]/sell/orders', 'page')

    return { success: true }
  } catch (error) {
    console.error('Error in requestOrderCancellation:', error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Report an issue with an order item (buyer only)
 */
export type IssueType = 
  | 'not_received' 
  | 'wrong_item' 
  | 'damaged' 
  | 'not_as_described' 
  | 'missing_parts'
  | 'other'

export async function reportOrderIssue(
  orderItemId: string,
  issueType: IssueType,
  description: string
): Promise<{ success: boolean; error?: string; conversationId?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    if (!description || description.trim().length < 10) {
      return { success: false, error: "Please provide a detailed description (minimum 10 characters)" }
    }

    // Verify the order item belongs to this user's order
    const { data: orderItem, error: fetchError } = await supabase
      .from('order_items')
      .select(`
        id,
        status,
        seller_id,
        product:products(id, title),
        order:orders!inner(id, user_id)
      `)
      .eq('id', orderItemId)
      .single()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    const order = orderItem.order as unknown as { id: string; user_id: string }
    const product = orderItem.product as unknown as { id: string; title: string } | null
    
    // Verify user owns this order
    if (order.user_id !== user.id) {
      return { success: false, error: "Not authorized to report issues for this order" }
    }

    // Map issue type to readable subject
    const issueSubjects: Record<IssueType, string> = {
      'not_received': 'Item Not Received',
      'wrong_item': 'Wrong Item Received',
      'damaged': 'Item Damaged',
      'not_as_described': 'Item Not As Described',
      'missing_parts': 'Missing Parts',
      'other': 'Order Issue',
    }

    const subject = `${issueSubjects[issueType]}${product?.title ? ` - ${product.title}` : ''}`

    // Create or find existing conversation with the seller
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('seller_id', orderItem.seller_id)
      .eq('order_id', order.id)
      .single()

    let conversationId = existingConversation?.id

    if (!conversationId) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          buyer_id: user.id,
          seller_id: orderItem.seller_id,
          product_id: product?.id || null,
          order_id: order.id,
          subject,
          status: 'open',
          last_message_at: new Date().toISOString(),
          seller_unread_count: 1,
        })
        .select('id')
        .single()

      if (convError || !newConversation) {
        console.error('Error creating conversation:', convError)
        return { success: false, error: "Failed to create conversation" }
      }

      conversationId = newConversation.id
    }

    // Send the issue report as a message
    const messageContent = `⚠️ **Issue Report: ${issueSubjects[issueType]}**\n\n${description}`
    
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: messageContent,
        message_type: 'text',
      })

    if (messageError) {
      console.error('Error creating message:', messageError)
      return { success: false, error: "Failed to send issue report" }
    }

    // Update conversation last_message_at and unread count
    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        seller_unread_count: 1, // Set unread
        status: 'open',
      })
      .eq('id', conversationId)

    // Create notification for seller
    await supabase
      .from('notifications')
      .insert({
        user_id: orderItem.seller_id,
        type: 'message',
        title: `Issue Report: ${issueSubjects[issueType]}`,
        body: `A buyer has reported an issue with their order`,
        data: { 
          order_item_id: orderItemId, 
          order_id: order.id,
          issue_type: issueType,
          conversation_id: conversationId
        },
        order_id: order.id,
        conversation_id: conversationId,
      })

    // Revalidate pages
    revalidatePath('/[locale]/account/orders', 'page')
    revalidatePath('/[locale]/chat', 'page')

    return { success: true, conversationId }
  } catch (error) {
    console.error('Error in reportOrderIssue:', error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get detailed order information for a buyer
 */
export async function getBuyerOrderDetails(
  orderId: string
): Promise<{ 
  order: {
    id: string
    status: string
    total_amount: number
    shipping_address: Record<string, unknown> | null
    created_at: string
    items: OrderItem[]
  } | null
  error?: string 
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { order: null, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { order: null, error: "Not authenticated" }
    }

    // Get order with all items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        shipping_address,
        created_at,
        order_items (
          *,
          product:products(id, title, images, slug),
          seller:profiles!order_items_seller_id_fkey(id, full_name, avatar_url, username)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return { order: null, error: "Order not found" }
    }

    return {
      order: {
        id: order.id,
        status: order.status || 'pending',
        total_amount: order.total_amount,
        shipping_address: order.shipping_address as Record<string, unknown> | null,
        created_at: order.created_at,
        items: order.order_items as unknown as OrderItem[],
      }
    }
  } catch (error) {
    console.error('Error in getBuyerOrderDetails:', error)
    return { order: null, error: "An unexpected error occurred" }
  }
}
