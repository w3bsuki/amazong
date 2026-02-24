import type { OrderItemStatus } from "@/lib/order-status"
import type { IssueType } from "./buyer-order-actions.copy"

export type BuyerOrderActionsServerActions = {
  buyerConfirmDelivery: (orderItemId: string) => Promise<{ success: boolean; error?: string }>
  canBuyerRateSeller: (orderItemId: string) => Promise<{ canRate: boolean; hasRated: boolean }>
  requestOrderCancellation: (
    orderItemId: string,
    reason?: string,
  ) => Promise<{ success: boolean; error?: string }>
  reportOrderIssue: (
    orderItemId: string,
    issueType: IssueType,
    description: string,
  ) => Promise<{ success: boolean; error?: string; conversationId?: string }>
  submitSellerFeedback: (input: {
    sellerId: string
    orderId: string
    rating: number
    comment?: string
    itemAsDescribed: boolean
    shippingSpeed: boolean
    communication: boolean
  }) => Promise<{ success: boolean; error?: string }>
}

export type BuyerOrderActionsProps = {
  orderItemId: string
  currentStatus: OrderItemStatus
  sellerId: string
  conversationId?: string | null
  locale?: string
  orderId: string
  actions: BuyerOrderActionsServerActions
  mode?: "full" | "report-only"
}
