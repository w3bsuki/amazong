"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/app/actions/reviews";

interface WriteReviewDialogProps {
  productId: string;
  productTitle?: string;
  locale?: string;
  onReviewSubmitted?: () => void;
  trigger?: React.ReactNode;
}

const translations = {
  en: {
    writeReview: "Write a Review",
    title: "Share Your Experience",
    description: "Help other buyers by sharing your thoughts about this product.",
    ratingLabel: "Your Rating",
    selectRating: "Select a rating",
    commentLabel: "Your Review (optional)",
    commentPlaceholder: "What did you like or dislike? How was the quality?",
    submit: "Submit Review",
    submitting: "Submitting...",
    cancel: "Cancel",
    success: "Review submitted successfully!",
    error: "Failed to submit review",
    loginRequired: "Please sign in to write a review",
    stars: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
  },
  bg: {
    writeReview: "Напиши отзив",
    title: "Споделете впечатленията си",
    description: "Помогнете на другите купувачи, като споделите мнението си за този продукт.",
    ratingLabel: "Вашата оценка",
    selectRating: "Изберете оценка",
    commentLabel: "Вашият отзив (по избор)",
    commentPlaceholder: "Какво ви хареса или не? Как беше качеството?",
    submit: "Изпрати отзив",
    submitting: "Изпращане...",
    cancel: "Отказ",
    success: "Отзивът е изпратен успешно!",
    error: "Неуспешно изпращане на отзив",
    loginRequired: "Моля, влезте, за да напишете отзив",
    stars: ["Слабо", "Средно", "Добро", "Много добро", "Отлично"],
  },
};

export function WriteReviewDialog({
  productId,
  productTitle,
  locale = "en",
  onReviewSubmitted,
  trigger,
}: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const t = translations[locale as keyof typeof translations] || translations.en;
  const activeRating = hoverRating || rating;

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(t.selectRating);
      return;
    }

    startTransition(async () => {
      const result = await submitReview({
        productId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (result.success) {
        toast.success(t.success);
        setOpen(false);
        setRating(0);
        setComment("");
        onReviewSubmitted?.();
      } else {
        if (result.error?.includes("logged in")) {
          toast.error(t.loginRequired, {
            action: {
              label: locale === "bg" ? "Вход" : "Sign In",
              onClick: () => {
                window.location.href = `/${locale}/auth/login`;
              },
            },
          });
        } else {
          toast.error(result.error || t.error);
        }
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setRating(0);
      setHoverRating(0);
      setComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            {t.writeReview}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {productTitle ? (
              <span className="line-clamp-1">{productTitle}</span>
            ) : (
              t.description
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>{t.ratingLabel}</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`${star} ${locale === "bg" ? "звезди" : "stars"}`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= activeRating
                        ? "fill-rating text-rating"
                        : "text-muted-foreground/30 hover:text-muted-foreground/50"
                    }`}
                  />
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <p className="text-sm text-muted-foreground">
                {t.stars[activeRating - 1]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">{t.commentLabel}</Label>
            <Textarea
              id="review-comment"
              placeholder={t.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={2000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/2000
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
          >
            {isPending ? t.submitting : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
