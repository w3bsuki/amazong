"use client";

import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

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

export function CustomerReviewsHybrid({ rating, reviewCount, reviews }: CustomerReviewsHybridProps) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const safeCount = Number.isFinite(reviewCount) ? reviewCount : 0;

  const distribution = [1, 2, 3, 4, 5].map((s) => reviews.filter((r) => r.rating === s).length);

  return (
    <section className="mt-12 rounded-xl bg-muted/20 p-6 lg:p-10 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Customer Reviews</h2>
        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
          {safeCount} total
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
        {/* Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-primary text-3xl font-bold text-foreground">
              {safeRating.toFixed(1)}
            </div>
            <div>
              <div className="flex gap-0.5 text-rating mb-2" aria-label={`Rating ${safeRating.toFixed(1)} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(safeRating) ? "fill-current" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                Based on {safeCount} reviews
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border/30">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1] ?? 0;
              const pct = safeCount > 0 ? (count / safeCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-10">
                    <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                    <span className="font-bold text-foreground">{star}</span>
                  </div>
                  <Progress value={pct} className="h-2 bg-muted [&>div]:bg-primary" />
                  <span className="w-10 text-right text-muted-foreground font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews */}
        <div>
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-background p-6 text-sm text-muted-foreground">
              No reviews yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reviews.map((review) => {
                const author = review.user?.display_name || review.user?.username || "User";
                return (
                  <Card key={review.id} className="border border-border/50 bg-background rounded-xl overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex text-rating gap-0.5" aria-label={`${review.rating} out of 5`}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {formatDate(review.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarImage src={review.user?.avatar_url || undefined} alt={author} />
                          <AvatarFallback className="text-[10px]">{initials(author)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground text-sm truncate">{author}</div>
                        </div>
                      </div>

                      {review.comment ? (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {review.comment}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No written comment.</p>
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
