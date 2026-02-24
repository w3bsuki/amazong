"use server"

import type { OrderItemStatus } from "@/lib/order-status"
import {
  getBuyerOrderDetailsImpl,
  getBuyerOrdersImpl,
} from "./orders-reads-buyer"
import { getOrderConversationImpl } from "./orders-reads-conversation"
import { getSellerOrderStatsImpl, getSellerOrdersImpl } from "./orders-reads-seller"
import {
  SELLER_ORDERS_DEFAULT_PAGE_SIZE,
  type BuyerOrderDetailsResult,
  type OrderConversationResult,
  type OrdersReadResult,
  type SellerOrderStatsResult,
  type SellerOrdersReadResult,
} from "./orders-reads-shared"

export async function getSellerOrders(
  statusFilter?: OrderItemStatus | "all" | "active",
  page = 1,
  pageSize = SELLER_ORDERS_DEFAULT_PAGE_SIZE
): Promise<SellerOrdersReadResult> {
  return getSellerOrdersImpl(statusFilter, page, pageSize)
}

export async function getSellerOrderStats(): Promise<SellerOrderStatsResult> {
  return getSellerOrderStatsImpl()
}

export async function getBuyerOrders(): Promise<OrdersReadResult> {
  return getBuyerOrdersImpl()
}

export async function getOrderConversation(
  orderId: string
): Promise<OrderConversationResult> {
  return getOrderConversationImpl(orderId)
}

export async function getBuyerOrderDetails(
  orderId: string
): Promise<BuyerOrderDetailsResult> {
  return getBuyerOrderDetailsImpl(orderId)
}
