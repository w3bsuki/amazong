import { z } from "zod"
import type { Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import type { OrderItemStatus } from "@/lib/order-status"
import type { OrderItem } from "@/lib/types/order-item"

export const OrderItemStatusSchema = z.enum([
  "pending",
  "received",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
])
export const SellerOrdersStatusFilterSchema = z
  .union([OrderItemStatusSchema, z.literal("all"), z.literal("active")])
  .optional()
export const OrderIdSchema = z.string().uuid()
export const PositiveIntegerSchema = z.number().int().positive()
export const NOT_AUTHENTICATED_ERROR = "Not authenticated"
export const UNEXPECTED_ERROR = "An unexpected error occurred"
export const SELLER_ORDERS_DEFAULT_PAGE_SIZE = 10

export type OrdersReadResult = Envelope<
  { orders: OrderItem[] },
  { orders: OrderItem[]; error: string }
>

export type SellerOrdersReadResult = Envelope<
  {
    orders: OrderItem[]
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  },
  {
    orders: OrderItem[]
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
    error: string
  }
>

export type SellerOrderStats = {
  pending: number
  received: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  total: number
}

export type SellerOrderStatsResult = Envelope<
  SellerOrderStats,
  SellerOrderStats & { error: string }
>

export type OrderConversationResult = Envelope<
  { conversationId: string | null },
  { conversationId: string | null; error: string }
>

export type BuyerOrderDetails = {
  id: string
  status: string
  total_amount: number
  shipping_address: Record<string, unknown> | null
  created_at: string
  items: OrderItem[]
}

export type BuyerOrderDetailsResult = Envelope<
  { order: BuyerOrderDetails },
  { order: null; error: string }
>

export async function requireOrdersReadAuth<TFailure>(
  onFailure: () => TFailure
): Promise<
  | {
      success: true
      userId: string
      supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>>["supabase"]
    }
  | {
      success: false
      failure: TFailure
    }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, failure: onFailure() }
  }

  return { success: true, userId: auth.user.id, supabase: auth.supabase }
}

export type SellerOrdersStatusFilter = OrderItemStatus | "all" | "active"
