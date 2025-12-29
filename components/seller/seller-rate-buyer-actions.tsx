"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, UserCheck } from "lucide-react"
import { canSellerRateBuyer } from "@/app/actions/orders"
import { submitBuyerFeedback } from "@/app/actions/buyer-feedback"
import { type OrderItemStatus } from "@/lib/order-status"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { StarRatingDialog } from "@/components/shared/star-rating-dialog"

interface SellerRateBuyerActionsProps {
  orderItemId: string
  currentStatus: OrderItemStatus
  locale?: string
}

export function SellerRateBuyerActions({
  orderItemId,
  currentStatus,
  locale = 'en',
}: SellerRateBuyerActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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
        const result = await canSellerRateBuyer(orderItemId)
        setCanRate(result.canRate)
        setHasRated(result.hasRated)
        setBuyerId(result.buyerId)
        setOrderId(result.orderId)
      }
    }
    checkRatingStatus()
  }, [isDelivered, orderItemId])

  async function handleSubmitRating(rating: number, comment: string) {
    if (!buyerId || !orderId) {
      toast.error('Buyer or order not found')
      return
    }

    setIsLoading(true)
    try {
      const result = await submitBuyerFeedback({
        buyer_id: buyerId,
        order_id: orderId,
        rating,
        comment: comment || undefined,
      })
      
      if (result.success) {
        toast.success(locale === 'bg' ? 'Благодарим за отзива!' : 'Thank you for your feedback!')
        setShowRatingDialog(false)
        setHasRated(true)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to submit rating')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const t = {
    rateBuyer: locale === 'bg' ? 'Оцени купувача' : 'Rate Buyer',
    ratedBuyer: locale === 'bg' ? 'Оценен' : 'Rated',
    ratingTitle: locale === 'bg' ? 'Как бихте оценили купувача?' : 'How would you rate the buyer?',
    ratingDescription: locale === 'bg' 
      ? 'Вашата оценка помага на други продавачи да познават клиентите си.'
      : 'Your rating helps other sellers know their customers better.',
    commentLabel: locale === 'bg' ? 'Коментар (по избор)' : 'Comment (optional)',
    commentPlaceholder: locale === 'bg' 
      ? 'Споделете опита си с този купувач...'
      : 'Share your experience with this buyer...',
    submitRating: locale === 'bg' ? 'Изпрати отзив' : 'Submit Review',
    cancel: locale === 'bg' ? 'Отмени' : 'Cancel',
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
          disabled={isLoading}
        >
          <UserCheck className="h-4 w-4 mr-1.5" />
          {t.rateBuyer}
        </Button>
      )}

      {/* Already Rated Badge */}
      {hasRated && (
        <span className="inline-flex items-center gap-1 text-sm text-success">
          <CheckCircle className="h-4 w-4" />
          {t.ratedBuyer}
        </span>
      )}

      {/* Rating Dialog */}
      <StarRatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        onSubmit={handleSubmitRating}
        title={t.ratingTitle}
        description={t.ratingDescription}
        commentLabel={t.commentLabel}
        commentPlaceholder={t.commentPlaceholder}
        submitLabel={t.submitRating}
        cancelLabel={t.cancel}
        locale={locale}
        isLoading={isLoading}
      />
    </>
  )
}
