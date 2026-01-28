"use client";

import { Star, PencilLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { WriteReviewDialog, type SubmitReviewFn } from "./write-review-dialog";

export interface CustomerReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface CustomerReviewsHybridProps {
  rating: number;
  reviewCount: number;
  reviews: CustomerReview[];
  productId?: string;
  productTitle?: string;
  locale?: string;
  /** Server action to submit review - must be passed from route-level component */
  submitReview?: SubmitReviewFn;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.slice(0, 1).toUpperCase()).join("");
}

export function CustomerReviewsHybrid({ 
  rating, 
  reviewCount, 
  reviews,
  productId,
  productTitle,
  locale = "en",
  submitReview,
}: CustomerReviewsHybridProps) {
  const router = useRouter();
  
  // Use reviews array as source of truth - if no reviews exist, show 0 rating
  // This prevents the contradiction where rating shows 4.7 but reviews show "No reviews yet"
  const hasReviews = reviews.length > 0;
  const safeRating = hasReviews && Number.isFinite(rating) ? rating : 0;
  const safeCount = hasReviews ? (Number.isFinite(reviewCount) ? reviewCount : reviews.length) : 0;

  const distribution = [1, 2, 3, 4, 5].map((s) => reviews.filter((r) => r.rating === s).length);

  const t = useTranslations("Reviews");

  return (
    <section className="mt-4 rounded-md bg-surface-subtle p-3 border border-border/50">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <h2 className="text-lg font-bold text-foreground tracking-tight">{t("customerReviews")}</h2>
        <div className="flex items-center gap-3">
          {productId && submitReview && (
            <WriteReviewDialog
              productId={productId}
              {...(productTitle ? { productTitle } : {})}
              locale={locale}
              submitReview={submitReview}
              onReviewSubmitted={() => router.refresh()}
              trigger={
                <Button variant="default" size="sm" className="gap-2">
                  <PencilLine className="h-4 w-4" />
                  {t("writeReview")}
                </Button>
              }
            />
          )}
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
            {t("globalRatings", { count: safeCount })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        {/* Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-xl font-bold text-foreground">
              {safeRating.toFixed(1)}
            </div>
            <div>
              <div className="flex gap-0.5 text-rating mb-1" aria-label={`Rating ${safeRating.toFixed(1)} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(safeRating) ? "fill-current" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <div className="text-2xs text-muted-foreground font-medium">
                {t("globalRatings", { count: safeCount })}
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-background/50 p-3 rounded-md border border-border/30">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1] ?? 0;
              const pct = safeCount > 0 ? (count / safeCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5 w-8">
                    <Star className="h-3 w-3 fill-rating text-rating" />
                    <span className="font-medium text-foreground">{star}</span>
                  </div>
                  <Progress value={pct} className="h-1.5 flex-1 bg-muted [&>div]:bg-primary" />
                  <span className="w-6 text-right text-muted-foreground text-2xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews */}
        <div>
          {reviews.length === 0 ? (
            <div className="rounded-md border border-border/50 bg-background p-3 text-center">
              <p className="text-sm text-muted-foreground mb-3">{t("noReviews")}</p>
              {productId && submitReview && (
                <WriteReviewDialog
                  productId={productId}
                  {...(productTitle ? { productTitle } : {})}
                  locale={locale}
                  submitReview={submitReview}
                  onReviewSubmitted={() => router.refresh()}
                  trigger={
                    <Button variant="outline" size="sm">
                      {t("beFirst")}
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {reviews.map((review) => {
                const author =
                  review.user?.display_name ||
                  review.user?.username ||
                  t("anonymousUser");
                return (
                  <Card key={review.id} className="border border-border/50 bg-background rounded-md overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-rating gap-0.5" aria-label={`${review.rating} out of 5`}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                        <span className="text-2xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <UserAvatar
                          name={author}
                          avatarUrl={review.user?.avatar_url ?? null}
                          className="size-6 border border-border bg-muted"
                          fallbackClassName="text-2xs bg-muted"
                        />
                        <span className="font-medium text-foreground text-sm truncate">{author}</span>
                      </div>

                      {review.comment ? (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {review.comment}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("noWrittenComment")}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
