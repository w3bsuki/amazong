"use server"

import type { IssueType } from "@/lib/types/orders"
import { OrderActionItemIdSchema } from "./order-action-context"
import { requestOrderCancellationImpl } from "./orders-support-request-cancellation"
import { reportOrderIssueImpl } from "./orders-support-report-issue"
import { requestReturnImpl } from "./orders-support-request-return"
import { ReportOrderIssueInputSchema, supportFailure, type OrdersSupportResult } from "./orders-support-shared"

export async function requestReturn(
  orderItemId: string,
  reason: string
): Promise<OrdersSupportResult> {
  const parsedOrderItemId = OrderActionItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) {
    return supportFailure("invalid_input", "Invalid orderItemId")
  }

  return requestReturnImpl(parsedOrderItemId.data, reason)
}

export async function requestOrderCancellation(
  orderItemId: string,
  reason?: string
): Promise<OrdersSupportResult> {
  const parsedOrderItemId = OrderActionItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) {
    return supportFailure("invalid_input", "Invalid orderItemId")
  }

  return requestOrderCancellationImpl(parsedOrderItemId.data, reason)
}

export async function reportOrderIssue(
  orderItemId: string,
  issueType: IssueType,
  description: string
): Promise<OrdersSupportResult> {
  const parsedInput = ReportOrderIssueInputSchema.safeParse({
    orderItemId,
    issueType,
    description,
  })
  if (!parsedInput.success) {
    return supportFailure("invalid_input", "Invalid input")
  }

  return reportOrderIssueImpl(parsedInput.data.orderItemId, parsedInput.data.issueType, parsedInput.data.description)
}
