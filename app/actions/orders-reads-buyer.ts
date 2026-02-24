import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { logger } from "@/lib/logger"
import {
  ORDER_ITEM_DETAIL_SELECT,
  ORDER_ITEM_LIST_SELECT,
  type OrderItem,
} from "./orders-shared"
import {
  NOT_AUTHENTICATED_ERROR,
  OrderIdSchema,
  UNEXPECTED_ERROR,
  requireOrdersReadAuth,
  type BuyerOrderDetailsResult,
  type OrdersReadResult,
} from "./orders-reads-shared"

export async function getBuyerOrdersImpl(): Promise<OrdersReadResult> {
  try {
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({ orders: [], error: NOT_AUTHENTICATED_ERROR })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)

    if (ordersError) {
      return errorEnvelope({ orders: [], error: "Failed to fetch orders" })
    }

    const orderIds = orders?.map((order) => order.id) || []
    if (orderIds.length === 0) {
      return successEnvelope({ orders: [] })
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_LIST_SELECT)
      .in("order_id", orderIds)
      .order("created_at", { ascending: false, foreignTable: "orders" })
      .limit(200)

    if (itemsError) {
      return errorEnvelope({ orders: [], error: "Failed to fetch order items" })
    }

    const itemsWithCreatedAt = (orderItems ?? []).map((item) => ({
      ...item,
      created_at: item.order?.created_at ?? new Date().toISOString(),
    }))

    return successEnvelope({ orders: itemsWithCreatedAt as OrderItem[] })
  } catch (error) {
    logger.error("[orders-reads] get_buyer_orders_unexpected", error)
    return errorEnvelope({ orders: [], error: UNEXPECTED_ERROR })
  }
}

export async function getBuyerOrderDetailsImpl(
  orderId: string
): Promise<BuyerOrderDetailsResult> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return errorEnvelope({ order: null, error: "Invalid orderId" })
  }

  try {
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({ order: null, error: NOT_AUTHENTICATED_ERROR })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        shipping_address,
        created_at,
        order_items (
          ${ORDER_ITEM_DETAIL_SELECT}
        )
      `)
      .eq("id", parsedOrderId.data)
      .eq("user_id", userId)
      .single<{
        id: string
        status: string | null
        total_amount: number
        shipping_address: Record<string, unknown> | null
        created_at: string
        order_items: OrderItem[]
      }>()

    if (orderError || !order) {
      return errorEnvelope({ order: null, error: "Order not found" })
    }

    return successEnvelope({
      order: {
        id: order.id,
        status: order.status || "pending",
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        items: order.order_items.map((item) => ({ ...item, created_at: order.created_at })) as OrderItem[],
      },
    })
  } catch (error) {
    logger.error("[orders-reads] get_buyer_order_details_unexpected", error, {
      orderId: parsedOrderId.data,
    })
    return errorEnvelope({ order: null, error: UNEXPECTED_ERROR })
  }
}
