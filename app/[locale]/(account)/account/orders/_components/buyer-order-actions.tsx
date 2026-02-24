"use client"

import { useState, useEffect, useTransition } from "react"
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
import { Loader2, Package, CheckCircle, MessageSquare, XCircle, AlertTriangle, Star } from "lucide-react"
import { type OrderItemStatus } from "@/lib/order-status"
import { toast } from "sonner"
import { Link, useRouter } from "@/i18n/routing"
import { StarRatingDialogShell } from "../../../../_components/orders/star-rating-dialog-shell"

export type IssueType =
  | 'not_received'
  | 'wrong_item'
  | 'damaged'
  | 'not_as_described'
  | 'missing_parts'
  | 'other'

type BuyerOrderActionsCopy = {
  confirmDelivery: string
  rateSeller: string
  ratedSeller: string
  chat: string
  cancelOrder: string
  reportIssue: string
  ratingTitle: string
  ratingDescription: string
  commentLabel: string
  commentPlaceholder: string
  submitRating: string
  cancel: string
  cancelTitle: string
  cancelDescription: string
  cancelReasonLabel: string
  cancelReasonPlaceholder: string
  confirmCancel: string
  issueTitle: string
  issueDescription: string
  issueTypeLabel: string
  issueTypePlaceholder: string
  issueDescLabel: string
  issueDescPlaceholder: string
  submitIssue: string
  submitting: string
  errors: {
    failedToConfirmDelivery: string
    failedToSubmitRating: string
    failedToCancelOrder: string
    failedToReportIssue: string
    unexpected: string
    issueTypeRequired: string
    issueDescriptionMinLength: string
  }
  toasts: {
    deliveryConfirmed: string
    feedbackSubmitted: string
    orderCancelled: string
    issueReported: string
  }
  issueTypes: Record<IssueType, string>
}

const BUYER_ORDER_ACTIONS_COPY_EN: BuyerOrderActionsCopy = {
  confirmDelivery: "Confirm Delivery",
  rateSeller: "Rate Seller",
  ratedSeller: "Rated",
  chat: "Chat",
  cancelOrder: "Cancel Order",
  reportIssue: "Report Issue",
  ratingTitle: "How would you rate the seller?",
  ratingDescription: "Your rating helps other buyers make informed decisions.",
  commentLabel: "Comment (optional)",
  commentPlaceholder: "Share your experience with this seller...",
  submitRating: "Submit Review",
  cancel: "Cancel",
  cancelTitle: "Cancel Order",
  cancelDescription: "Are you sure you want to cancel this order? This action cannot be undone.",
  cancelReasonLabel: "Reason for cancellation (optional)",
  cancelReasonPlaceholder: "Describe why you are cancelling...",
  confirmCancel: "Confirm Cancellation",
  issueTitle: "Report an Issue",
  issueDescription: "Describe the issue with your order and we will help.",
  issueTypeLabel: "Issue Type",
  issueTypePlaceholder: "Select issue type",
  issueDescLabel: "Description",
  issueDescPlaceholder: "Describe the issue in detail (minimum 10 characters)...",
  submitIssue: "Submit Report",
  submitting: "Submitting...",
  errors: {
    failedToConfirmDelivery: "Failed to confirm delivery",
    failedToSubmitRating: "Failed to submit rating",
    failedToCancelOrder: "Failed to cancel order",
    failedToReportIssue: "Failed to report issue",
    unexpected: "An unexpected error occurred",
    issueTypeRequired: "Please select an issue type",
    issueDescriptionMinLength: "Description must be at least 10 characters",
  },
  toasts: {
    deliveryConfirmed: "Delivery confirmed!",
    feedbackSubmitted: "Thank you for your feedback!",
    orderCancelled: "Order cancelled!",
    issueReported: "Issue reported!",
  },
  issueTypes: {
    not_received: "Item Not Received",
    wrong_item: "Wrong Item Received",
    damaged: "Item Damaged",
    not_as_described: "Not As Described",
    missing_parts: "Missing Parts",
    other: "Other",
  },
}

const BUYER_ORDER_ACTIONS_COPY_BG: BuyerOrderActionsCopy = {
  confirmDelivery: "Потвърди получаване",
  rateSeller: "Оцени продавача",
  ratedSeller: "Оценено",
  chat: "Чат",
  cancelOrder: "Отмени поръчка",
  reportIssue: "Докладвай проблем",
  ratingTitle: "Как бихте оценили продавача?",
  ratingDescription: "Вашата оценка помага на други купувачи да направят информиран избор.",
  commentLabel: "Коментар (по избор)",
  commentPlaceholder: "Споделете опита си с този продавач...",
  submitRating: "Изпрати отзив",
  cancel: "Отмени",
  cancelTitle: "Отмени поръчка",
  cancelDescription: "Сигурни ли сте, че искате да отмените тази поръчка? Това действие не може да бъде отменено.",
  cancelReasonLabel: "Причина за отмяна (по избор)",
  cancelReasonPlaceholder: "Опишете защо отменяте...",
  confirmCancel: "Потвърди отмяна",
  issueTitle: "Докладвай проблем",
  issueDescription: "Опишете проблема с поръчката си и ние ще помогнем.",
  issueTypeLabel: "Тип проблем",
  issueTypePlaceholder: "Изберете тип проблем",
  issueDescLabel: "Описание",
  issueDescPlaceholder: "Опишете проблема подробно (минимум 10 символа)...",
  submitIssue: "Изпрати доклад",
  submitting: "Изпращане...",
  errors: {
    failedToConfirmDelivery: "Неуспешно потвърждение на доставката",
    failedToSubmitRating: "Неуспешно изпращане на оценката",
    failedToCancelOrder: "Неуспешна отмяна на поръчката",
    failedToReportIssue: "Неуспешно докладване на проблема",
    unexpected: "Възникна неочаквана грешка",
    issueTypeRequired: "Моля, изберете тип проблем",
    issueDescriptionMinLength: "Описанието трябва да е поне 10 символа",
  },
  toasts: {
    deliveryConfirmed: "Доставката е потвърдена!",
    feedbackSubmitted: "Благодарим за отзива!",
    orderCancelled: "Поръчката е отменена!",
    issueReported: "Проблемът е докладван!",
  },
  issueTypes: {
    not_received: "Не е получено",
    wrong_item: "Грешен артикул",
    damaged: "Повреден артикул",
    not_as_described: "Не отговаря на описанието",
    missing_parts: "Липсващи части",
    other: "Друго",
  },
}

function getBuyerOrderActionsCopy(locale: string): BuyerOrderActionsCopy {
  return locale === "bg" ? BUYER_ORDER_ACTIONS_COPY_BG : BUYER_ORDER_ACTIONS_COPY_EN
}

export type BuyerOrderActionsServerActions = {
  buyerConfirmDelivery: (orderItemId: string) => Promise<{ success: boolean; error?: string }>
  canBuyerRateSeller: (orderItemId: string) => Promise<{ canRate: boolean; hasRated: boolean }>
  requestOrderCancellation: (
    orderItemId: string,
    reason?: string
  ) => Promise<{ success: boolean; error?: string }>
  reportOrderIssue: (
    orderItemId: string,
    issueType: IssueType,
    description: string
  ) => Promise<{ success: boolean; error?: string; conversationId?: string }>
  submitSellerFeedback: (input: {
    sellerId: string
    orderId: string
    rating: number
    comment?: string
    itemAsDescribed: boolean
    shippingSpeed: boolean
    communication: boolean
  }) => Promise<{ success: boolean; error?: string }>
}

interface BuyerOrderActionsProps {
  orderItemId: string
  currentStatus: OrderItemStatus
  sellerId: string
  conversationId?: string | null
  locale?: string
  orderId: string
  actions: BuyerOrderActionsServerActions
  mode?: "full" | "report-only"
}

export function BuyerOrderActions({
  orderItemId,
  currentStatus,
  sellerId,
  conversationId,
  locale = 'en',
  orderId,
  actions,
  mode = "full",
}: BuyerOrderActionsProps) {
  const t = getBuyerOrderActionsCopy(locale)
  const router = useRouter()
  const isReportOnly = mode === "report-only"
  const [isSubmitting, startTransition] = useTransition()
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showIssueDialog, setShowIssueDialog] = useState(false)
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

  useEffect(() => {
    if (!isDelivered || isReportOnly) {
      return
    }

    let canceled = false

    const fetchRatingStatus = async () => {
      try {
        const result = await actions.canBuyerRateSeller(orderItemId)
        if (canceled) {
          return
        }
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
  }, [actions, isDelivered, isReportOnly, orderItemId])

  async function handleConfirmDelivery() {
    startTransition(async () => {
      try {
        const result = await actions.buyerConfirmDelivery(orderItemId)
        if (result.success) {
          toast.success(t.toasts.deliveryConfirmed)
          router.refresh()
          // Ask to rate the seller
          setTimeout(() => {
            setShowRatingDialog(true)
          }, 500)
        } else {
          toast.error(t.errors.failedToConfirmDelivery)
        }
      } catch {
        toast.error(t.errors.unexpected)
      }
    })
  }

  async function handleSubmitRating(rating: number, comment: string) {
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
          toast.success(t.toasts.feedbackSubmitted)
          setShowRatingDialog(false)
          setHasRated(true)
          router.refresh()
        } else {
          toast.error(t.errors.failedToSubmitRating)
        }
      } catch {
        toast.error(t.errors.unexpected)
      }
    })
  }

  async function handleCancelOrder() {
    startTransition(async () => {
      try {
        const result = await actions.requestOrderCancellation(orderItemId, cancelReason || undefined)
        if (result.success) {
          toast.success(t.toasts.orderCancelled)
          setShowCancelDialog(false)
          setCancelReason("")
          router.refresh()
        } else {
          toast.error(t.errors.failedToCancelOrder)
        }
      } catch {
        toast.error(t.errors.unexpected)
      }
    })
  }

  async function handleReportIssue() {
    if (!issueType) {
      toast.error(t.errors.issueTypeRequired)
      return
    }
    if (issueDescription.length < 10) {
      toast.error(t.errors.issueDescriptionMinLength)
      return
    }

    startTransition(async () => {
      try {
        const result = await actions.reportOrderIssue(orderItemId, issueType as IssueType, issueDescription)
        if (result.success) {
          toast.success(t.toasts.issueReported)
          setShowIssueDialog(false)
          setIssueType("")
          setIssueDescription("")
          // Navigate to conversation if available
          if (result.conversationId) {
            router.push(`/chat/${result.conversationId}`)
          } else {
            router.refresh()
          }
        } else {
          toast.error(t.errors.failedToReportIssue)
        }
      } catch {
        toast.error(t.errors.unexpected)
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Chat Link */}
      {conversationId && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/chat/${conversationId}`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            {t.chat}
          </Link>
        </Button>
      )}

      {/* Cancel Order Button - only for pending/processing orders */}
      {!isReportOnly && canCancel && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCancelDialog(true)}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          className="text-status-warning hover:bg-status-warning/10"
        >
          <AlertTriangle className="h-4 w-4 mr-1.5" />
          {t.reportIssue}
        </Button>
      )}

      {/* Confirm Delivery Button - only for shipped orders */}
      {!isReportOnly && isShipped && (
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
          {isSubmitting ? t.submitting : t.confirmDelivery}
        </Button>
      )}

      {/* Rate Seller Button - only for delivered orders that haven't been rated */}
      {!isReportOnly && isDelivered && canRate && !hasRated && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRatingDialog(true)}
          disabled={isSubmitting}
        >
          <Star className="h-4 w-4 mr-1.5" />
          {t.rateSeller}
        </Button>
      )}

      {/* Already Rated Badge */}
      {!isReportOnly && isDelivered && hasRated && (
        <span className="inline-flex items-center gap-1 text-sm text-status-success">
          <CheckCircle className="h-4 w-4" />
          {t.ratedSeller}
        </span>
      )}

      {/* Cancel Order Dialog */}
      {!isReportOnly && (
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
                disabled={isSubmitting}
              >
                {t.cancel}
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelOrder} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    {t.submitting}
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
      )}

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
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={handleReportIssue} 
              disabled={isSubmitting || !issueType || issueDescription.length < 10}
              className="bg-status-warning text-badge-fg-on-solid hover:brightness-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  {t.submitting}
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
      {!isReportOnly && (
        <StarRatingDialogShell
          open={showRatingDialog}
          onOpenChange={setShowRatingDialog}
          onSubmit={handleSubmitRating}
          copy={t}
          locale={locale}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}
