"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, UserCheck } from "lucide-react"
import { type OrderItemStatus } from "@/lib/order-status"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { StarRatingDialogShell } from "../../../../_components/orders/star-rating-dialog-shell"
import type { Envelope } from "@/lib/api/envelope"

type SubmitBuyerFeedbackInput = {
  buyer_id: string
  order_id: string
  rating: number
  comment?: string
  payment_promptness?: boolean
  communication?: boolean
  reasonable_expectations?: boolean
}

export type SellerRateBuyerActionsServerActions = {
  canSellerRateBuyer: (
    orderItemId: string
  ) => Promise<
    Envelope<
      { canRate: boolean; hasRated: boolean; buyerId?: string; orderId?: string },
      { canRate: boolean; hasRated: boolean; buyerId?: string; orderId?: string; error: string }
    >
  >
  submitBuyerFeedback: (
    input: SubmitBuyerFeedbackInput
  ) => Promise<Envelope<{ data: unknown }, { error: string }>>
}

interface SellerRateBuyerActionsProps {
  orderItemId: string
  currentStatus: OrderItemStatus
  locale?: string
  actions: SellerRateBuyerActionsServerActions
}

type SellerRateBuyerCopy = {
  rateBuyer: string
  ratedBuyer: string
  ratingTitle: string
  ratingDescription: string
  commentLabel: string
  commentPlaceholder: string
  submitRating: string
  cancel: string
  errors: {
    buyerOrOrderMissing: string
    submitFailed: string
    unexpected: string
  }
  toasts: {
    feedbackSent: string
  }
}

function getSellerRateBuyerCopy(locale: string): SellerRateBuyerCopy {
  if (locale === "bg") {
    return {
      rateBuyer: "Оцени купувача",
      ratedBuyer: "Оценен",
      ratingTitle: "Как бихте оценили купувача?",
      ratingDescription: "Вашата оценка помага на други продавачи да опознаят клиентите си.",
      commentLabel: "Коментар (по избор)",
      commentPlaceholder: "Споделете опита си с този купувач...",
      submitRating: "Изпрати отзив",
      cancel: "Откажи",
      errors: {
        buyerOrOrderMissing: "Липсва информация за купувача или поръчката",
        submitFailed: "Неуспешно изпращане на оценката",
        unexpected: "Възникна неочаквана грешка",
      },
      toasts: {
        feedbackSent: "Благодарим за отзива!",
      },
    }
  }

  return {
    rateBuyer: "Rate Buyer",
    ratedBuyer: "Rated",
    ratingTitle: "How would you rate the buyer?",
    ratingDescription: "Your rating helps other sellers understand their customers better.",
    commentLabel: "Comment (optional)",
    commentPlaceholder: "Share your experience with this buyer...",
    submitRating: "Submit Review",
    cancel: "Cancel",
    errors: {
      buyerOrOrderMissing: "Buyer or order not found",
      submitFailed: "Failed to submit rating",
      unexpected: "An unexpected error occurred",
    },
    toasts: {
      feedbackSent: "Thank you for your feedback!",
    },
  }
}

export function SellerRateBuyerActions({
  orderItemId,
  currentStatus,
  locale = 'en',
  actions,
}: SellerRateBuyerActionsProps) {
  const router = useRouter()
  const copy = getSellerRateBuyerCopy(locale)
  const [isPending, startTransition] = useTransition()
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [canRate, setCanRate] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [buyerId, setBuyerId] = useState<string | undefined>()
  const [orderId, setOrderId] = useState<string | undefined>()

  const isDelivered = currentStatus === 'delivered'

  // Check if can rate when delivered
  useEffect(() => {
    async function checkRatingStatus() {
      if (isDelivered) {
        const result = await actions.canSellerRateBuyer(orderItemId)
        setCanRate(result.canRate)
        setHasRated(result.hasRated)
        setBuyerId(result.buyerId)
        setOrderId(result.orderId)
      }
    }
    checkRatingStatus()
  }, [actions, isDelivered, orderItemId])

  async function handleSubmitRating(rating: number, comment: string) {
    if (!buyerId || !orderId) {
      toast.error(copy.errors.buyerOrOrderMissing)
      return
    }

    startTransition(async () => {
      try {
        const result = await actions.submitBuyerFeedback({
          buyer_id: buyerId,
          order_id: orderId,
          rating,
          ...(comment ? { comment } : {}),
        })
        
        if (result.success) {
          toast.success(copy.toasts.feedbackSent)
          setShowRatingDialog(false)
          setHasRated(true)
          router.refresh()
        } else {
          toast.error(copy.errors.submitFailed)
        }
      } catch {
        toast.error(copy.errors.unexpected)
      }
    })
  }

  // Don't render if order is not delivered
  if (!isDelivered) {
    return null
  }

  return (
    <>
      {/* Rate Buyer Button - only for delivered orders that haven't been rated */}
      {canRate && !hasRated && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRatingDialog(true)}
          disabled={isPending}
        >
          <UserCheck className="h-4 w-4 mr-1.5" />
          {copy.rateBuyer}
        </Button>
      )}

      {/* Already Rated Badge */}
      {hasRated && (
        <span className="inline-flex items-center gap-1 text-sm text-success">
          <CheckCircle className="h-4 w-4" />
          {copy.ratedBuyer}
        </span>
      )}

      {/* Rating Dialog */}
      <StarRatingDialogShell
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        onSubmit={handleSubmitRating}
        copy={copy}
        locale={locale}
        isLoading={isPending}
      />
    </>
  )
}
