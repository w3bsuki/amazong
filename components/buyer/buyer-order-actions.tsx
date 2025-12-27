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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Package, Star, CheckCircle, MessageSquare, XCircle, AlertTriangle } from "lucide-react"
import { buyerConfirmDelivery, canBuyerRateSeller, requestOrderCancellation, reportOrderIssue, type IssueType } from "@/app/actions/orders"
import { submitSellerFeedback } from "@/app/actions/seller-feedback"
import { type OrderItemStatus } from "@/lib/order-status"
import { toast } from "sonner"
import { Link, useRouter } from "@/i18n/routing"
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
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [issueDescription, setIssueDescription] = useState("")
  const [canRate, setCanRate] = useState(false)
  const [hasRated, setHasRated] = useState(false)

  const isShipped = currentStatus === 'shipped'
  const isDelivered = currentStatus === 'delivered'
  const isPending = currentStatus === 'pending'
  const isProcessing = currentStatus === 'processing'
  const isReceived = currentStatus === 'received'
  const canCancel = isPending || isProcessing || isReceived

  // Check if can rate when delivered
  async function checkRatingStatus() {
    if (isDelivered) {
      const result = await canBuyerRateSeller(orderItemId)
      setCanRate(result.canRate)
      setHasRated(result.hasRated)
    }
  }

  // Run check on mount for delivered orders
  useEffect(() => {
    checkRatingStatus()
  }, [isDelivered, orderItemId])

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

  async function handleCancelOrder() {
    setIsLoading(true)
    try {
      const result = await requestOrderCancellation(orderItemId, cancelReason || undefined)
      if (result.success) {
        toast.success(locale === 'bg' ? 'Поръчката е отменена!' : 'Order cancelled!')
        setShowCancelDialog(false)
        setCancelReason("")
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to cancel order')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReportIssue() {
    if (!issueType) {
      toast.error(locale === 'bg' ? 'Моля, изберете тип проблем' : 'Please select an issue type')
      return
    }
    if (issueDescription.length < 10) {
      toast.error(locale === 'bg' ? 'Описанието трябва да е поне 10 символа' : 'Description must be at least 10 characters')
      return
    }

    setIsLoading(true)
    try {
      const result = await reportOrderIssue(orderItemId, issueType as IssueType, issueDescription)
      if (result.success) {
        toast.success(locale === 'bg' ? 'Проблемът е докладван!' : 'Issue reported!')
        setShowIssueDialog(false)
        setIssueType("")
        setIssueDescription("")
        // Navigate to conversation if available
        if (result.conversationId) {
          router.push(`/chat?conversation=${result.conversationId}`)
        } else {
          router.refresh()
        }
      } else {
        toast.error(result.error || 'Failed to report issue')
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
    cancelOrder: locale === 'bg' ? 'Отмени поръчка' : 'Cancel Order',
    reportIssue: locale === 'bg' ? 'Докладвай проблем' : 'Report Issue',
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
    cancelTitle: locale === 'bg' ? 'Отмени поръчка' : 'Cancel Order',
    cancelDescription: locale === 'bg' 
      ? 'Сигурни ли сте, че искате да отмените тази поръчка? Това действие не може да бъде отменено.'
      : 'Are you sure you want to cancel this order? This action cannot be undone.',
    cancelReasonLabel: locale === 'bg' ? 'Причина за отмяна (по избор)' : 'Reason for cancellation (optional)',
    cancelReasonPlaceholder: locale === 'bg' ? 'Опишете защо отменяте...' : 'Describe why you are cancelling...',
    confirmCancel: locale === 'bg' ? 'Потвърди отмяна' : 'Confirm Cancellation',
    issueTitle: locale === 'bg' ? 'Докладвай проблем' : 'Report an Issue',
    issueDescription: locale === 'bg' 
      ? 'Опишете проблема с поръчката си и ние ще помогнем.'
      : 'Describe the issue with your order and we will help.',
    issueTypeLabel: locale === 'bg' ? 'Тип проблем' : 'Issue Type',
    issueTypePlaceholder: locale === 'bg' ? 'Изберете тип проблем' : 'Select issue type',
    issueDescLabel: locale === 'bg' ? 'Описание' : 'Description',
    issueDescPlaceholder: locale === 'bg' 
      ? 'Опишете проблема подробно (минимум 10 символа)...'
      : 'Describe the issue in detail (minimum 10 characters)...',
    submitIssue: locale === 'bg' ? 'Изпрати доклад' : 'Submit Report',
    stars: ['Много лошо', 'Лошо', 'Добре', 'Много добре', 'Отлично'],
    starsEn: ['Very Poor', 'Poor', 'Good', 'Very Good', 'Excellent'],
    issueTypes: {
      not_received: locale === 'bg' ? 'Не е получено' : 'Item Not Received',
      wrong_item: locale === 'bg' ? 'Грешен артикул' : 'Wrong Item Received',
      damaged: locale === 'bg' ? 'Повреден артикул' : 'Item Damaged',
      not_as_described: locale === 'bg' ? 'Не отговаря на описанието' : 'Not As Described',
      missing_parts: locale === 'bg' ? 'Липсващи части' : 'Missing Parts',
      other: locale === 'bg' ? 'Друго' : 'Other',
    } as Record<IssueType, string>,
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Chat Link */}
      {conversationId && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/chat?conversation=${conversationId}`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            {t.chat}
          </Link>
        </Button>
      )}

      {/* Cancel Order Button - only for pending/processing orders */}
      {canCancel && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCancelDialog(true)}
          disabled={isLoading}
          className="text-status-error hover:bg-status-error/10"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {t.cancelOrder}
        </Button>
      )}

      {/* Report Issue Button - for shipped or delivered orders */}
      {(isShipped || isDelivered) && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowIssueDialog(true)}
          disabled={isLoading}
          className="text-status-warning hover:bg-status-warning/10"
        >
          <AlertTriangle className="h-4 w-4 mr-1.5" />
          {t.reportIssue}
        </Button>
      )}

      {/* Confirm Delivery Button - only for shipped orders */}
      {isShipped && (
        <Button
          size="sm"
          onClick={handleConfirmDelivery}
          disabled={isLoading}
          className="bg-status-success text-white hover:brightness-95"
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
        <span className="inline-flex items-center gap-1 text-sm text-status-success">
          <CheckCircle className="h-4 w-4" />
          {t.ratedSeller}
        </span>
      )}

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-error">
              <XCircle className="h-5 w-5" />
              {t.cancelTitle}
            </DialogTitle>
            <DialogDescription>{t.cancelDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">{t.cancelReasonLabel}</Label>
              <Textarea
                id="cancelReason"
                placeholder={t.cancelReasonPlaceholder}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelOrder} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1.5" />
                  {t.confirmCancel}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-warning">
              <AlertTriangle className="h-5 w-5" />
              {t.issueTitle}
            </DialogTitle>
            <DialogDescription>{t.issueDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issueType">{t.issueTypeLabel}</Label>
              <Select value={issueType} onValueChange={(val) => setIssueType(val as IssueType)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.issueTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(t.issueTypes) as IssueType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t.issueTypes[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDesc">{t.issueDescLabel}</Label>
              <Textarea
                id="issueDesc"
                placeholder={t.issueDescPlaceholder}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowIssueDialog(false)}
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={handleReportIssue} 
              disabled={isLoading || !issueType || issueDescription.length < 10}
              className="bg-status-warning text-white hover:brightness-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  {t.submitIssue}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    className="p-1"
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
