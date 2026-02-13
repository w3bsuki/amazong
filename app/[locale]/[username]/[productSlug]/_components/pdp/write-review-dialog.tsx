"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing"

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

function stripLocalePrefix(pathname: string, locale?: string): string {
  const segments = pathname.split("/").filter(Boolean)
  const normalizedLocale = locale?.trim().toLowerCase()
  const firstSegment = segments[0]?.toLowerCase()
  const shouldStripExplicitLocale = Boolean(normalizedLocale) && normalizedLocale === firstSegment
  const maybeLocale = segments[0]
  if (shouldStripExplicitLocale || (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale))) {
    segments.shift()
  }
  const normalized = `/${segments.join("/")}`
  return normalized === "/" ? "/" : normalized.replace(/\/+$/, "")
}

// Type for the review submission result
export interface ReviewResult {
  success: boolean;
  error?: string;
}

// Type for the submit function (allows dependency injection)
export type SubmitReviewFn = (input: {
  productId: string;
  rating: number;
  comment?: string;
}) => Promise<ReviewResult>;

interface WriteReviewDialogProps {
  productId: string;
  productTitle?: string;
  locale?: string;
  onReviewSubmitted?: () => void;
  trigger?: React.ReactNode;
  /** Server action to submit review - must be passed from route-level component */
  submitReview: SubmitReviewFn;
}

export function WriteReviewDialog({
  productId,
  productTitle,
  locale = "en",
  onReviewSubmitted,
  trigger,
  submitReview,
}: WriteReviewDialogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const tReviews = useTranslations("Reviews");
  const tAuth = useTranslations("Auth");
  const activeRating = hoverRating || rating;

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(tReviews("selectRating"));
      return;
    }

    startTransition(async () => {
      const trimmedComment = comment.trim()
      const result = await submitReview({
        productId,
        rating,
        ...(trimmedComment ? { comment: trimmedComment } : {}),
      });

      if (result.success) {
        toast.success(tReviews("reviewSuccess"));
        setOpen(false);
        setRating(0);
        setComment("");
        onReviewSubmitted?.();
      } else {
        if (result.error?.includes("logged in")) {
          const next = stripLocalePrefix(pathname, locale)
          toast.error(tReviews("signInRequired"), {
            action: {
              label: tAuth("signIn"),
              onClick: () => {
                router.push({ pathname: "/auth/login", query: { next } })
              },
            },
          });
        } else {
          toast.error(result.error || tReviews("reviewFailed"));
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
            {tReviews("writeReview")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-(--write-review-dialog-max-w)">
        <DialogHeader>
          <DialogTitle>{tReviews("reviewThisProduct")}</DialogTitle>
          <DialogDescription>
            {productTitle ? (
              <span className="line-clamp-1">{productTitle}</span>
            ) : (
              tReviews("shareThoughts")
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>{tReviews("overallRating")}</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`${star} ${tReviews("star")}`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= activeRating
                        ? "fill-rating text-rating"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">{tReviews("reviewComment")}</Label>
            <Textarea
              id="review-comment"
              placeholder={tReviews("reviewCommentPlaceholder")}
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
            {tReviews("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
          >
            {isPending ? tReviews("submitting") : tReviews("submitReview")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
