import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { logger } from "@/lib/logger"
import {
  NOT_AUTHENTICATED_ERROR,
  OrderIdSchema,
  UNEXPECTED_ERROR,
  requireOrdersReadAuth,
  type OrderConversationResult,
} from "./orders-reads-shared"

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

    const { data: conversation, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("order_id", parsedOrderId.data)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return successEnvelope({ conversationId: null })
      }

      logger.error("[orders-reads] get_order_conversation_failed", error, {
        orderId: parsedOrderId.data,
        userId,
      })
      return errorEnvelope({ conversationId: null, error: "Failed to fetch conversation" })
    }

    return successEnvelope({ conversationId: conversation?.id || null })
  } catch {
    return errorEnvelope({ conversationId: null, error: UNEXPECTED_ERROR })
  }
}
