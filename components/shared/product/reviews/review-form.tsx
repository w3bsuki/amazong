"use client"

import { useState, useEffect } from "react"
import { Star, ShoppingBag } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null)
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false)
  const t = useTranslations("Reviews")

  // Check if user has purchased this product when dialog opens
  useEffect(() => {
    if (open) {
      checkPurchaseStatus()
    }
  }, [open, productId])

  const checkPurchaseStatus = async () => {
    setIsCheckingPurchase(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setHasPurchased(false)
        return
      }

      // Check if user has purchased this product via order_items
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          id,
          orders!inner (
            id,
            user_id,
            status
          )
        `)
        .eq("product_id", productId)
        .eq("orders.user_id", user.id)
        .in("orders.status", ["delivered", "shipped", "processing"])
        .limit(1)

      if (error) {
        console.error("Error checking purchase status:", error)
        setHasPurchased(false)
      } else {
        setHasPurchased(data && data.length > 0)
      }
    } catch (error) {
      console.error("Error checking purchase:", error)
      setHasPurchased(false)
    } finally {
      setIsCheckingPurchase(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error(t("selectRating") || "Please select a rating")
      return
    }

    if (!hasPurchased) {
      toast.error(t("purchaseRequired") || "You must purchase this product before reviewing")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error(t("signInRequired") || "Please sign in to write a review")
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        comment,
      })

      if (error) {
        if (error.code === "23505") {
          toast.error(t("alreadyReviewed") || "You have already reviewed this product")
        } else {
          throw error
        }
      } else {
        toast.success(t("reviewSuccess") || "Review submitted successfully!")
        setOpen(false)
        setRating(0)
        setTitle("")
        setComment("")
        onReviewSubmitted?.()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(t("reviewFailed") || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 px-3 text-[10px] font-bold uppercase tracking-tight rounded-sm border-border hover:bg-muted shrink-0">
          {t("writeReview")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold uppercase tracking-tight">{t("writeReview")}</DialogTitle>
          <DialogDescription className="text-xs">
            {t("shareThoughts")}
          </DialogDescription>
        </DialogHeader>

        {isCheckingPurchase ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="size-8 text-verified" />
          </div>
        ) : hasPurchased === false ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-sm bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base uppercase tracking-tight">{t("purchaseRequiredTitle") || "Purchase Required"}</h3>
              <p className="text-muted-foreground text-xs max-w-xs">
                {t("purchaseRequiredDescription") || "You need to purchase this product before you can leave a review. This helps ensure authentic feedback from real customers."}
              </p>
            </div>
            <Button variant="outline" className="rounded-sm text-xs uppercase font-bold" onClick={() => setOpen(false)}>
              {t("close") || "Close"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Verified Purchase Badge */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-verified bg-verified/10 px-3 py-2 rounded-sm border border-verified/10">
              <ShoppingBag weight="fill" className="w-3.5 h-3.5" />
              <span>{t("verifiedPurchase") || "Verified Purchase"}</span>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">{t("overallRating")}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none rounded-sm"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        (hoverRating || rating) >= star
                          ? "text-verified"
                          : "text-muted-foreground"
                      )}
                      size={32}
                      weight={(hoverRating || rating) >= star ? "fill" : "regular"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-tight">{t("reviewTitle")}</Label>
              <Input
                id="title"
                className="rounded-sm text-sm"
                placeholder={t("reviewTitlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Review Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-xs font-bold uppercase tracking-tight">{t("reviewComment")}</Label>
              <Textarea
                id="comment"
                className="rounded-sm text-sm min-h-[120px]"
                placeholder={t("reviewCommentPlaceholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={2000}
              />
              <p className="text-[10px] text-muted-foreground text-right">
                {comment.length}/2000
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="rounded-sm text-xs uppercase font-bold"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-verified hover:bg-verified/90 text-white rounded-sm text-xs uppercase font-bold px-6"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? <><Spinner className="size-3 mr-2" />{t("submitting")}</> : t("submitReview")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
