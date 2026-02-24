import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/server"
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

export type OrdersSupportFailure = {
  success: false
  error: string
  code: OrdersSupportErrorCode
}

type OrdersSupportSuccess = {
  success: true
  conversationId?: string
}

export type OrdersSupportResult = OrdersSupportSuccess | OrdersSupportFailure

export function supportFailure(
  code: OrdersSupportErrorCode,
  error: string
): OrdersSupportFailure {
  return { success: false, error, code }
}

export async function requireSupportContext(
  orderItemId: string
): Promise<
  | {
      success: true
      orderItemId: string
      userId: string
      supabase: Awaited<ReturnType<typeof createAdminClient>>
    }
  | OrdersSupportFailure
> {
  const context = await getOrderActionContext(orderItemId)
  if (!context.success) {
    return context.error === "invalid_order_item_id"
      ? supportFailure("invalid_input", "Invalid orderItemId")
      : supportFailure("not_authenticated", "Not authenticated")
  }

  return {
    success: true,
    orderItemId: context.orderItemId,
    userId: context.userId,
    supabase: context.supabase,
  }
}
