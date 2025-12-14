"use client"

import { useState } from "react"
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
import { Loader2, Package, Star, CheckCircle, MessageSquare } from "lucide-react"
import { buyerConfirmDelivery, canBuyerRateSeller } from "@/app/actions/orders"
import { submitSellerFeedback } from "@/app/actions/seller-feedback"
import { type OrderItemStatus } from "@/lib/order-status"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BuyerOrderActionsProps {
  orderItemId: string
  currentStatus: OrderItemStatus
  sellerId: string
  conversationId?: string | null
  locale?: string
  orderId: string
}

export function BuyerOrderActions({
  orderItemId,
  currentStatus,
  sellerId,
  conversationId,
  locale = 'en',
  orderId,
}: BuyerOrderActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [canRate, setCanRate] = useState(false)
  const [hasRated, setHasRated] = useState(false)

  const isShipped = currentStatus === 'shipped'
  const isDelivered = currentStatus === 'delivered'

  // Check if can rate when delivered
  async function checkRatingStatus() {
    if (isDelivered) {
      const result = await canBuyerRateSeller(orderItemId)
      setCanRate(result.canRate)
      setHasRated(result.hasRated)
    }
  }

  // Run check on mount for delivered orders
  useState(() => {
    checkRatingStatus()
  })

  async function handleConfirmDelivery() {
    setIsLoading(true)
    try {
      const result = await buyerConfirmDelivery(orderItemId)
      if (result.success) {
        toast.success(locale === 'bg' ? 'Доставката е потвърдена!' : 'Delivery confirmed!')
        router.refresh()
        // Ask to rate the seller
        setTimeout(() => {
          setShowRatingDialog(true)
        }, 500)
      } else {
        toast.error(result.error || 'Failed to confirm delivery')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmitRating() {
    if (rating === 0) {
      toast.error(locale === 'bg' ? 'Моля, изберете оценка' : 'Please select a rating')
      return
    }

    setIsLoading(true)
    try {
      const result = await submitSellerFeedback({
        sellerId,
        orderId,
        rating,
        comment: comment || undefined,
        itemAsDescribed: true,
        shippingSpeed: true,
        communication: true,
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
    confirmDelivery: locale === 'bg' ? 'Потвърди получаване' : 'Confirm Delivery',
    rateSeller: locale === 'bg' ? 'Оцени продавача' : 'Rate Seller',
    ratedSeller: locale === 'bg' ? 'Оценено' : 'Rated',
    chat: locale === 'bg' ? 'Чат' : 'Chat',
    ratingTitle: locale === 'bg' ? 'Как бихте оценили продавача?' : 'How would you rate the seller?',
    ratingDescription: locale === 'bg' 
      ? 'Вашата оценка помага на други купувачи да направят информиран избор.'
      : 'Your rating helps other buyers make informed decisions.',
    commentLabel: locale === 'bg' ? 'Коментар (по избор)' : 'Comment (optional)',
    commentPlaceholder: locale === 'bg' 
      ? 'Споделете опита си с този продавач...'
      : 'Share your experience with this seller...',
    submitRating: locale === 'bg' ? 'Изпрати отзив' : 'Submit Review',
    cancel: locale === 'bg' ? 'Отмени' : 'Cancel',
    stars: ['Много лошо', 'Лошо', 'Добре', 'Много добре', 'Отлично'],
    starsEn: ['Very Poor', 'Poor', 'Good', 'Very Good', 'Excellent'],
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Chat Link */}
      {conversationId && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/chat?conversation=${conversationId}`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            {t.chat}
          </Link>
        </Button>
      )}

      {/* Confirm Delivery Button - only for shipped orders */}
      {isShipped && (
        <Button
          size="sm"
          onClick={handleConfirmDelivery}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Package className="h-4 w-4 mr-1.5" />
          )}
          {isLoading ? '...' : t.confirmDelivery}
        </Button>
      )}

      {/* Rate Seller Button - only for delivered orders that haven't been rated */}
      {isDelivered && canRate && !hasRated && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRatingDialog(true)}
          disabled={isLoading}
        >
          <Star className="h-4 w-4 mr-1.5" />
          {t.rateSeller}
        </Button>
      )}

      {/* Already Rated Badge */}
      {isDelivered && hasRated && (
        <span className="inline-flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          {t.ratedSeller}
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
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
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
              <Label htmlFor="comment">{t.commentLabel}</Label>
              <Textarea
                id="comment"
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
    </div>
  )
}
