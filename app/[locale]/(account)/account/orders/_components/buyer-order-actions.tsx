"use client"

import { useTransition } from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getBuyerOrderActionsCopy } from "./buyer-order-actions.copy"
import { CancelAction } from "./buyer-order-actions/cancel-action"
import { DisputeAction } from "./buyer-order-actions/dispute-action"
import { ReturnAction } from "./buyer-order-actions/return-action"
import type { BuyerOrderActionsProps } from "./buyer-order-actions.types"

export type { IssueType } from "./buyer-order-actions.copy"
export type { BuyerOrderActionsServerActions } from "./buyer-order-actions.types"

export function BuyerOrderActions({
  orderItemId,
  currentStatus,
  sellerId,
  conversationId,
  locale = "en",
  orderId,
  actions,
  mode = "full",
}: BuyerOrderActionsProps) {
  const copy = getBuyerOrderActionsCopy(locale)
  const isReportOnly = mode === "report-only"
  const [isSubmitting, startTransition] = useTransition()

  const isShipped = currentStatus === "shipped"
  const isDelivered = currentStatus === "delivered"
  const isPending = currentStatus === "pending"
  const isProcessing = currentStatus === "processing"
  const isReceived = currentStatus === "received"
  const canCancel = isPending || isProcessing || isReceived

  return (
    <div className="flex flex-wrap items-center gap-2">
      {conversationId && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/chat/${conversationId}`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            {copy.chat}
          </Link>
        </Button>
      )}

      <CancelAction
        canRender={!isReportOnly && canCancel}
        isSubmitting={isSubmitting}
        orderItemId={orderItemId}
        requestOrderCancellation={actions.requestOrderCancellation}
        startTransition={startTransition}
        copy={copy}
      />

      <DisputeAction
        canRender={isShipped || isDelivered}
        isSubmitting={isSubmitting}
        orderItemId={orderItemId}
        reportOrderIssue={actions.reportOrderIssue}
        startTransition={startTransition}
        copy={copy}
      />

      <ReturnAction
        canRenderConfirmDelivery={isShipped}
        canRenderRateSeller={isDelivered}
        canRenderRatedBadge={isDelivered}
        isReportOnly={isReportOnly}
        isSubmitting={isSubmitting}
        orderItemId={orderItemId}
        sellerId={sellerId}
        orderId={orderId}
        locale={locale}
        actions={{
          buyerConfirmDelivery: actions.buyerConfirmDelivery,
          canBuyerRateSeller: actions.canBuyerRateSeller,
          submitSellerFeedback: actions.submitSellerFeedback,
        }}
        startTransition={startTransition}
        copy={copy}
      />
    </div>
  )
}
