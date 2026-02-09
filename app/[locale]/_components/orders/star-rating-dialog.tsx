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
import { Loader2, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const STAR_LABELS_BG = ['Много лошо', 'Лошо', 'Добре', 'Много добре', 'Отлично']
const STAR_LABELS_EN = ['Very Poor', 'Poor', 'Good', 'Very Good', 'Excellent']

export interface StarRatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (rating: number, comment: string) => Promise<void>
  title: string
  description: string
  commentLabel: string
  commentPlaceholder: string
  submitLabel: string
  cancelLabel: string
  locale?: string
  isLoading?: boolean
}

/**
 * Reusable star rating dialog for rating sellers/buyers.
 * Used by BuyerOrderActions and SellerRateBuyerActions.
 */
export function StarRatingDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  commentLabel,
  commentPlaceholder,
  submitLabel,
  cancelLabel,
  locale = 'en',
  isLoading = false,
}: StarRatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const starLabels = locale === 'bg' ? STAR_LABELS_BG : STAR_LABELS_EN
  const activeRating = hoverRating || rating

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await onSubmit(rating, comment)
      // Reset state on successful submit
      setRating(0)
      setComment("")
    } finally {
      setSubmitting(false)
    }
  }

  const loading = isLoading || submitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
                  disabled={loading}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      activeRating >= star
                        ? "fill-rating text-rating"
                        : "text-rating-empty"
                    )}
                  />
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <p className="text-sm text-muted-foreground">
                {starLabels[activeRating - 1]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="rating-comment">{commentLabel}</Label>
            <Textarea
              id="rating-comment"
              placeholder={commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || rating === 0}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ...
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-1.5" />
                {submitLabel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
