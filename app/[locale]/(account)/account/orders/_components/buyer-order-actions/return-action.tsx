
import { useEffect, useState, type TransitionStartFunction } from "react"
import { toast } from "sonner"
import { CheckCircle, Loader2, Package, Star } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { StarRatingDialogShell } from "../../../../../_components/orders/star-rating-dialog-shell"
import type { BuyerOrderActionsCopy } from "../buyer-order-actions.copy"
import type { BuyerOrderActionsServerActions } from "../buyer-order-actions.types"

type ReturnActionProps = {
  canRenderConfirmDelivery: boolean
  canRenderRateSeller: boolean
  canRenderRatedBadge: boolean
  isReportOnly: boolean
  isSubmitting: boolean
  orderItemId: string
  sellerId: string
  orderId: string
  locale: string
  actions: Pick<
    BuyerOrderActionsServerActions,
    "buyerConfirmDelivery" | "canBuyerRateSeller" | "submitSellerFeedback"
  >
  startTransition: TransitionStartFunction
  copy: BuyerOrderActionsCopy
}

export function ReturnAction({
  canRenderConfirmDelivery,
  canRenderRateSeller,
  canRenderRatedBadge,
  isReportOnly,
  isSubmitting,
  orderItemId,
  sellerId,
  orderId,
  locale,
  actions,
  startTransition,
  copy,
}: ReturnActionProps) {
  const router = useRouter()
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [canRate, setCanRate] = useState(false)
  const [hasRated, setHasRated] = useState(false)

  useEffect(() => {
    if (!canRenderRateSeller && !canRenderRatedBadge) {
      return
    }

    let canceled = false

    const fetchRatingStatus = async () => {
      try {
        const result = await actions.canBuyerRateSeller(orderItemId)
        if (canceled) return
        setCanRate(result.canRate)
        setHasRated(result.hasRated)
      } catch {
        // ignore, fallback to default state
      }
    }

    fetchRatingStatus()

    return () => {
      canceled = true
    }
  }, [actions, canRenderRateSeller, canRenderRatedBadge, orderItemId])

  const handleConfirmDelivery = () => {
    startTransition(async () => {
      try {
        const result = await actions.buyerConfirmDelivery(orderItemId)
        if (result.success) {
          toast.success(copy.toasts.deliveryConfirmed)
          router.refresh()
          setTimeout(() => {
            setShowRatingDialog(true)
          }, 500)
        } else {
          toast.error(copy.errors.failedToConfirmDelivery)
        }
      } catch {
        toast.error(copy.errors.unexpected)
      }
    })
  }

  const handleSubmitRating = async (rating: number, comment: string): Promise<void> => {
    startTransition(async () => {
      try {
        const result = await actions.submitSellerFeedback({
          sellerId,
          orderId,
          rating,
          ...(comment ? { comment } : {}),
          itemAsDescribed: true,
          shippingSpeed: true,
          communication: true,
        })

        if (result.success) {
          toast.success(copy.toasts.feedbackSubmitted)
          setShowRatingDialog(false)
          setHasRated(true)
          router.refresh()
        } else {
          toast.error(copy.errors.failedToSubmitRating)
        }
      } catch {
        toast.error(copy.errors.unexpected)
      }
    })
  }

  return (
    <>
      {!isReportOnly && canRenderConfirmDelivery && (
        <Button
          size="sm"
          onClick={handleConfirmDelivery}
          disabled={isSubmitting}
          className="bg-status-success text-badge-fg-on-solid hover:brightness-95"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Package className="h-4 w-4 mr-1.5" />
          )}
          {isSubmitting ? copy.submitting : copy.confirmDelivery}
        </Button>
      )}

      {!isReportOnly && canRenderRateSeller && canRate && !hasRated && (
        <Button size="sm" variant="outline" onClick={() => setShowRatingDialog(true)} disabled={isSubmitting}>
          <Star className="h-4 w-4 mr-1.5" />
          {copy.rateSeller}
        </Button>
      )}

      {!isReportOnly && canRenderRatedBadge && hasRated && (
        <span className="inline-flex items-center gap-1 text-sm text-status-success">
          <CheckCircle className="h-4 w-4" />
          {copy.ratedSeller}
        </span>
      )}

      {!isReportOnly && (
        <StarRatingDialogShell
          open={showRatingDialog}
          onOpenChange={setShowRatingDialog}
          onSubmit={handleSubmitRating}
          copy={copy}
          locale={locale}
          isLoading={isSubmitting}
        />
      )}
    </>
  )
}
