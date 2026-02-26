import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope, type ErrorEnvelope } from "@/lib/api/envelope"
import { getOrderActionContext, OrderActionItemIdSchema } from "./order-action-context"

export const IssueTypeSchema = z.enum([
  "not_received",
  "wrong_item",
  "damaged",
  "not_as_described",
  "missing_parts",
  "other",
])
export const ReportOrderIssueInputSchema = z.object({
  orderItemId: OrderActionItemIdSchema,
  issueType: IssueTypeSchema,
  description: z.string(),
})

export type OrdersSupportErrorCode =
  | "invalid_input"
  | "not_authenticated"
  | "not_found"
  | "not_authorized"
  | "invalid_status"
  | "already_exists"
  | "validation_failed"
  | "create_failed"
  | "update_failed"
  | "unexpected"

export type OrdersSupportResult = Envelope<
  { conversationId?: string },
  { error: string; code: OrdersSupportErrorCode }
>

export type OrdersSupportFailure = ErrorEnvelope<{
  error: string
  code: OrdersSupportErrorCode
}>

type OrdersSupportContext = Envelope<
  {
    orderItemId: string
    userId: string
    supabase: Awaited<ReturnType<typeof getOrderActionContext>> extends infer Context
      ? Context extends { success: true; supabase: infer Client }
        ? Client
        : never
      : never
  },
  { error: string; code: OrdersSupportErrorCode }
>

export function supportFailure(code: OrdersSupportErrorCode, error: string): OrdersSupportFailure {
  return errorEnvelope({ code, error })
}

export function supportSuccess(conversationId?: string): OrdersSupportResult {
  if (conversationId) {
    return successEnvelope({ conversationId })
  }

  return successEnvelope<{ conversationId?: string }>()
}

export async function requireSupportContext(
  orderItemId: string
): Promise<OrdersSupportContext> {
  const context = await getOrderActionContext(orderItemId)
  if (!context.success) {
    return context.error === "invalid_order_item_id"
      ? supportFailure("invalid_input", "Invalid orderItemId")
      : supportFailure("not_authenticated", "Not authenticated")
  }

  return successEnvelope({
    orderItemId: context.orderItemId,
    userId: context.userId,
    supabase: context.supabase,
  })
}
