"use server"

import type { IssueType } from "./orders-shared"
import { requestOrderCancellationImpl } from "./orders-support-request-cancellation"
import { reportOrderIssueImpl } from "./orders-support-report-issue"
import { requestReturnImpl } from "./orders-support-request-return"
import type { OrdersSupportResult } from "./orders-support-shared"

export async function requestReturn(
  orderItemId: string,
  reason: string
): Promise<OrdersSupportResult> {
  return requestReturnImpl(orderItemId, reason)
}

export async function requestOrderCancellation(
  orderItemId: string,
  reason?: string
): Promise<OrdersSupportResult> {
  return requestOrderCancellationImpl(orderItemId, reason)
}

export async function reportOrderIssue(
  orderItemId: string,
  issueType: IssueType,
  description: string
): Promise<OrdersSupportResult> {
  return reportOrderIssueImpl(orderItemId, issueType, description)
}
