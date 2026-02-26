"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Envelope } from "@/lib/api/envelope"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LoaderCircle as SpinnerGap } from "lucide-react"

interface FeedbackOrderItem {
  seller: {
    id: string
    store_name: string
  } | null
  delivered_at: string | null
}

interface OrderDetailFeedbackProps {
  locale: string
  orderId: string
  orderItems: FeedbackOrderItem[]
  existingSellerFeedbackSellerIds?: string[]
  submitSellerFeedback: (input: {
    sellerId: string
    orderId: string
    rating: number
    comment?: string
    itemAsDescribed: boolean
    shippingSpeed: boolean
    communication: boolean
  }) => Promise<Envelope<{ id: string }, { error: string }>>
}

export function OrderDetailFeedback({
  locale,
  orderId,
  orderItems,
  existingSellerFeedbackSellerIds,
  submitSellerFeedback,
}: OrderDetailFeedbackProps) {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [feedbackSellerId, setFeedbackSellerId] = useState<string | null>(null)
  const [feedbackRating, setFeedbackRating] = useState<number>(5)
  const [feedbackComment, setFeedbackComment] = useState<string>("")
  const [itemAsDescribed, setItemAsDescribed] = useState(true)
  const [shippingSpeed, setShippingSpeed] = useState(true)
  const [communication, setCommunication] = useState(true)
  const [feedbackDismissed, setFeedbackDismissed] = useState(false)
  const [submittedSellerIds, setSubmittedSellerIds] = useState<Set<string>>(new Set())
  const [isSubmittingFeedback, startFeedbackTransition] = useTransition()

  useEffect(() => {
    try {
      const key = `seller_feedback_prompt_dismissed_order_${orderId}`
      setFeedbackDismissed(localStorage.getItem(key) === "1")
    } catch {
      // Ignore read failures.
    }
  }, [orderId])

  const pendingFeedbackSellers = useMemo(() => {
    const existing = new Set(existingSellerFeedbackSellerIds || [])
    const map = new Map<string, { sellerId: string; storeName: string }>()
    const nowMs = Date.now()

    for (const item of orderItems) {
      if (!item.seller?.id) continue
      const sellerId = item.seller.id
      if (existing.has(sellerId)) continue
      if (submittedSellerIds.has(sellerId)) continue

      if (!item.delivered_at) continue
      const delivered = new Date(item.delivered_at)
      if (Number.isNaN(delivered.getTime())) continue

      const threeDaysMs = 3 * 24 * 60 * 60 * 1000
      if (nowMs - delivered.getTime() < threeDaysMs) continue

      if (!map.has(sellerId)) {
        map.set(sellerId, { sellerId, storeName: item.seller.store_name })
      }
    }

    return [...map.values()]
  }, [orderItems, existingSellerFeedbackSellerIds, submittedSellerIds])

  const shouldShowFeedbackPrompt = pendingFeedbackSellers.length > 0 && !feedbackDismissed

  const openFeedbackDialog = (sellerId: string) => {
    setFeedbackSellerId(sellerId)
    setFeedbackRating(5)
    setFeedbackComment("")
    setItemAsDescribed(true)
    setShippingSpeed(true)
    setCommunication(true)
    setIsFeedbackDialogOpen(true)
  }

  const dismissFeedbackPrompt = () => {
    try {
      const key = `seller_feedback_prompt_dismissed_order_${orderId}`
      localStorage.setItem(key, "1")
    } catch {
      // Ignore write failures.
    }
    setFeedbackDismissed(true)
  }

  const submitFeedback = () => {
    if (!feedbackSellerId) return
    startFeedbackTransition(async () => {
      const result = await submitSellerFeedback({
        sellerId: feedbackSellerId,
        orderId,
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        itemAsDescribed,
        shippingSpeed,
        communication,
      })

      if (result.success) {
        toast.success(locale === "bg" ? "Благодарим за обратната връзка" : "Thanks for your feedback")
        setSubmittedSellerIds((prev) => new Set(prev).add(feedbackSellerId))
        setIsFeedbackDialogOpen(false)
        setFeedbackSellerId(null)
      } else {
        toast.error(locale === "bg" ? "Възникна грешка" : "An error occurred")
      }
    })
  }

  if (!shouldShowFeedbackPrompt) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                {locale === "bg" ? "Оценете продавача" : "Rate your seller"}
              </CardTitle>
              <CardDescription>
                {locale === "bg"
                  ? "Помогнете на други купувачи с обратна връзка."
                  : "Help other buyers with quick feedback."}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissFeedbackPrompt}>
              {locale === "bg" ? "Скрий" : "Dismiss"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {pendingFeedbackSellers.map((seller) => (
            <div key={seller.sellerId} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{seller.storeName}</div>
                <div className="text-xs text-muted-foreground">
                  {locale === "bg" ? "Оставете оценка за поръчката" : "Leave feedback for this order"}
                </div>
              </div>
              <Button size="sm" onClick={() => openFeedbackDialog(seller.sellerId)}>
                {locale === "bg" ? "Оцени" : "Review"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "bg" ? "Обратна връзка" : "Seller feedback"}</DialogTitle>
            <DialogDescription>
              {locale === "bg"
                ? "Оценете качеството на поръчката и комуникацията."
                : "Rate the order experience and communication."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === "bg" ? "Оценка" : "Rating"}</Label>
              <RadioGroup
                value={String(feedbackRating)}
                onValueChange={(value) => setFeedbackRating(Number(value))}
                className="flex flex-wrap gap-3"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <RadioGroupItem value={String(rating)} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>{locale === "bg" ? "Детайли" : "Details"}</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={itemAsDescribed} onCheckedChange={(checked) => setItemAsDescribed(Boolean(checked))} />
                  {locale === "bg" ? "Описанието отговаря" : "Item as described"}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={shippingSpeed} onCheckedChange={(checked) => setShippingSpeed(Boolean(checked))} />
                  {locale === "bg" ? "Бърза доставка" : "Fast shipping"}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={communication} onCheckedChange={(checked) => setCommunication(Boolean(checked))} />
                  {locale === "bg" ? "Добра комуникация" : "Good communication"}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-feedback-comment">{locale === "bg" ? "Коментар (по избор)" : "Comment (optional)"}</Label>
              <Textarea
                id="seller-feedback-comment"
                value={feedbackComment}
                onChange={(event) => setFeedbackComment(event.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
              {locale === "bg" ? "Отказ" : "Cancel"}
            </Button>
            <Button onClick={submitFeedback} disabled={isSubmittingFeedback}>
              {isSubmittingFeedback ? (
                <>
                  <SpinnerGap className="size-4 mr-2 animate-spin" />
                  {locale === "bg" ? "Изпращане..." : "Submitting..."}
                </>
              ) : (
                locale === "bg" ? "Изпрати" : "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
