import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { fetchOrderConversationId } from "@/lib/data/orders/reads"
import {
  NOT_AUTHENTICATED_ERROR,
  OrderIdSchema,
  UNEXPECTED_ERROR,
  requireOrdersReadAuth,
  type OrderConversationResult,
} from "./orders-reads-shared"

import { logger } from "@/lib/logger"
export async function getOrderConversationImpl(
  orderId: string
): Promise<OrderConversationResult> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return errorEnvelope({ conversationId: null, error: "Invalid orderId" })
  }

  try {
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({ conversationId: null, error: NOT_AUTHENTICATED_ERROR })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult

    const result = await fetchOrderConversationId({ supabase, orderId: parsedOrderId.data, userId })

    if (!result.ok) {
      logger.error("[orders-reads] get_order_conversation_failed", result.error, {
        orderId: parsedOrderId.data,
        userId,
      })
      return errorEnvelope({ conversationId: null, error: "Failed to fetch conversation" })
    }

    return successEnvelope({ conversationId: result.conversationId })
  } catch {
    return errorEnvelope({ conversationId: null, error: UNEXPECTED_ERROR })
  }
}
