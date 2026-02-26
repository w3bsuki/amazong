import type { OrderItemStatus } from "@/lib/order-status"
import type { Envelope } from "@/lib/api/envelope"
import type { IssueType } from "./buyer-order-actions.copy"

export type BuyerOrderActionsServerActions = {
  buyerConfirmDelivery: (orderItemId: string) => Promise<Envelope<{ sellerId?: string }, { error: string }>>
  canBuyerRateSeller: (orderItemId: string) => Promise<
    Envelope<
      { canRate: boolean; hasRated: boolean; sellerId?: string },
      { canRate: boolean; hasRated: boolean; sellerId?: string; error: string }
    >
  >
  requestOrderCancellation: (
    orderItemId: string,
    reason?: string,
  ) => Promise<Envelope<{ conversationId?: string }, { error: string }>>
  reportOrderIssue: (
    orderItemId: string,
    issueType: IssueType,
    description: string,
  ) => Promise<Envelope<{ conversationId?: string }, { error: string }>>
  submitSellerFeedback: (input: {
    sellerId: string
    orderId: string
    rating: number
    comment?: string
    itemAsDescribed: boolean
    shippingSpeed: boolean
    communication: boolean
  }) => Promise<Envelope<{ id: string }, { error: string }>>
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
