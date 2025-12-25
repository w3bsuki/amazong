"use client"

import { useState, useCallback, lazy, Suspense, useTransition } from "react"
import { Star, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { markReviewHelpful } from "@/app/actions/reviews"
import { toast } from "sonner"

// Dynamic import for ReviewForm - loaded only when needed
const ReviewForm = lazy(() => import("@/components/shared/product/reviews/review-form").then(mod => ({ default: mod.ReviewForm })))

// Loading skeleton for ReviewForm
function ReviewFormSkeleton() {
  return (
    <Skeleton className="h-11 w-full rounded-md" />
  )
}

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  created_at: string
  helpful_count: number
  images?: string[]
  verified_purchase?: boolean
  seller_response?: string | null
  seller_response_at?: string | null
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface ReviewsSectionClientProps {
  productId: string
  rating: number
  reviewCount: number
  initialReviews: Review[]
  initialDistribution: Record<number, number>
}

export function ReviewsSectionClient({
  productId,
  rating,
  reviewCount,
  initialReviews,
  initialDistribution,
}: ReviewsSectionClientProps) {
  const t = useTranslations("Reviews")
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [selectedStar, setSelectedStar] = useState<number | null>(null)
  const [ratingDistribution] = useState<Record<number, number>>(initialDistribution)
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const handleHelpful = useCallback(async (reviewId: string) => {
    // Prevent double voting (client-side check)
    if (votedReviews.has(reviewId)) {
      toast.info(t("alreadyVoted") || "You've already marked this as helpful")
      return
    }

    startTransition(async () => {
      const result = await markReviewHelpful(reviewId)
      
      if (result.success && result.data) {
        setReviews(prev => prev.map(r => 
          r.id === reviewId 
            ? { ...r, helpful_count: result.data!.newCount }
            : r
        ))
        setVotedReviews(prev => new Set(prev).add(reviewId))
        toast.success(t("markedHelpful") || "Marked as helpful")
      } else {
        toast.error(result.error || "Failed to mark as helpful")
      }
    })
  }, [votedReviews, t])

  const handleReviewSubmitted = useCallback(() => {
    // In a real app, we'd refetch or receive real-time updates
    // For now, just show a toast - the page will refresh via revalidation
    toast.success(t("reviewSuccess") || "Review submitted! Refreshing...")
    window.location.reload()
  }, [t])

  const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
  const getPercentage = (count: number) => totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
  
  // Filter reviews by selected star
  const filteredReviews = selectedStar 
    ? reviews.filter(r => r.rating === selectedStar)
    : reviews

  return (
    <div className="space-y-6">
      {/* Header Row: Title + Overall Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t("customerReviews")}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  weight={i < Math.floor(rating) ? "fill" : "regular"}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-base font-medium text-foreground">{rating.toFixed(1)} {t("outOf5")}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} {t("globalRatings", { count: reviewCount }).replace(/\d+/, "").trim()})</span>
          </div>
        </div>
        
        {/* Write Review CTA */}
        <div className="shrink-0">
          <Suspense fallback={<ReviewFormSkeleton />}>
            <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
          </Suspense>
        </div>
      </div>

      {/* Horizontal Star Filter Bar */}
      <div className="bg-muted/30 dark:bg-muted/10 border border-border rounded-lg p-3 lg:p-4">
        {/* Mobile: Horizontal scroll, Desktop: Flex wrap */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0 lg:flex-wrap">
          <span className="text-sm font-medium text-muted-foreground shrink-0">{t("filterByStars") || "Filter:"}</span>
          <button
            onClick={() => setSelectedStar(null)}
            className={cn(
              "shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors",
              selectedStar === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary/50 text-foreground"
            )}
          >
            {t("all") || "All"}
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star]
            return (
              <button
                key={star}
                onClick={() => setSelectedStar(selectedStar === star ? null : star)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors",
                  selectedStar === star
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary/50 text-foreground"
                )}
              >
                <span>{star}</span>
                <Star size={14} weight="fill" className={cn(
                  selectedStar === star ? "text-primary-foreground" : "text-rating"
                )} />
                <span className="text-xs opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
        
        {/* Rating Distribution Bars - Compact Horizontal */}
        <div className="mt-3 lg:mt-4 flex gap-2 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-5">
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage = getPercentage(ratingDistribution[star])
            return (
              <div key={star} className="shrink-0 w-16 lg:w-auto space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    {star}<Star size={10} weight="fill" className="text-rating" />
                  </span>
                  <span>{percentage}%</span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2 rounded-full bg-muted [&>div]:bg-rating" 
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground text-lg">{t("noReviews")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("beFirst")}</p>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-muted/20 dark:bg-muted/10 rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-3">
                {/* Review Header - Mobile optimized */}
                <div className="flex items-start gap-2.5 lg:gap-3">
                  <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border shrink-0">
                    <AvatarImage src={review.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs lg:text-sm font-medium">
                      {review.profiles?.full_name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm lg:text-base text-foreground truncate">
                        {review.profiles?.full_name || "Anonymous"}
                      </p>
                      {/* Stars - visible on desktop, hidden on mobile */}
                      <div className="hidden lg:flex items-center gap-0.5 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16}
                            weight={i < review.rating ? "fill" : "regular"}
                            className="text-rating"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    {/* Mobile: Stars + meta in one row */}
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <div className="flex items-center gap-0.5 lg:hidden">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12}
                            weight={i < review.rating ? "fill" : "regular"}
                            className="text-rating"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      {review.verified_purchase && (
                        <>
                          <span className="flex items-center gap-1 text-xs text-success font-medium">
                            <CheckCircle size={12} weight="fill" />
                            {t("verifiedPurchase")}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Review Content */}
                {review.title && (
                  <p className="font-semibold text-sm lg:text-base text-foreground">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-sm text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* Seller Response */}
                {review.seller_response && (
                  <div className="mt-3 pl-4 border-l-2 border-primary/30 bg-primary/5 rounded-r-lg p-3">
                    <p className="text-xs font-medium text-primary mb-1">{t("sellerResponse") || "Seller Response"}</p>
                    <p className="text-sm text-muted-foreground">{review.seller_response}</p>
                    {review.seller_response_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.seller_response_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Review Footer - Compact on mobile */}
                <div className="flex items-center gap-2 lg:gap-4 pt-1 lg:pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      "h-7 lg:h-8 px-2 lg:px-3 text-xs hover:text-foreground",
                      votedReviews.has(review.id) 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                    onClick={() => handleHelpful(review.id)}
                    disabled={isPending || votedReviews.has(review.id)}
                  >
                    👍 {t("helpful")} ({review.helpful_count || 0})
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 lg:h-8 px-2 lg:px-3 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t("report")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="rounded-full px-6">
              {t("seeAllReviews")} →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsSectionClient
