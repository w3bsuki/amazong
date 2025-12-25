"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Star, CheckCircle, UserCheck } from "lucide-react"
import { canSellerRateBuyer } from "@/app/actions/orders"
import { submitBuyerFeedback } from "@/app/actions/buyer-feedback"
import { type OrderItemStatus } from "@/lib/order-status"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
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

  async function handleSubmitRating() {
    if (rating === 0) {
      toast.error(locale === 'bg' ? 'Моля, изберете оценка' : 'Please select a rating')
      return
    }

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
    stars: ['Много лошо', 'Лошо', 'Добре', 'Много добре', 'Отлично'],
    starsEn: ['Very Poor', 'Poor', 'Good', 'Very Good', 'Excellent'],
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
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.ratingTitle}</DialogTitle>
            <DialogDescription>{t.ratingDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverRating || rating) >= star
                          ? "fill-rating text-rating"
                          : "text-rating-empty"
                      )}
                    />
                  </button>
                ))}
              </div>
              {(hoverRating || rating) > 0 && (
                <p className="text-sm text-muted-foreground">
                  {locale === 'bg' 
                    ? t.stars[(hoverRating || rating) - 1]
                    : t.starsEn[(hoverRating || rating) - 1]
                  }
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="seller-comment">{t.commentLabel}</Label>
              <Textarea
                id="seller-comment"
                placeholder={t.commentPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRatingDialog(false)}
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button onClick={handleSubmitRating} disabled={isLoading || rating === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ...
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-1.5" />
                  {t.submitRating}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
