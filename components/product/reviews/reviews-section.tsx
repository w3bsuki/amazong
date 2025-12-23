"use client"

import { useEffect, useState, useCallback, lazy, Suspense } from "react"
import { Star } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

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
    profiles: {
        full_name: string | null
        avatar_url: string | null
    } | null
}

// PRODUCTION: No mock data - show empty state instead
const emptyDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

export function ReviewsSection({ rating, reviewCount, productId }: { rating: number, reviewCount: number, productId: string }) {
    const t = useTranslations('Reviews')
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedStar, setSelectedStar] = useState<number | null>(null)
    const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    })

    const fetchReviews = useCallback(async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("reviews")
                .select(`
                    id,
                    rating,
                    title,
                    comment,
                    created_at,
                    helpful_count,
                    profiles (
                        full_name,
                        avatar_url
                    )
                `)
                .eq("product_id", productId)
                .order("created_at", { ascending: false })
                .limit(10)

            if (error) {
                console.error("Error fetching reviews:", error)
                // PRODUCTION: Show empty state on error
                setReviews([])
                setRatingDistribution(emptyDistribution)
            } else if (data && data.length > 0) {
                setReviews(data as Review[])
                
                // Calculate rating distribution from real data
                const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                data.forEach((review: { rating: number }) => {
                    distribution[review.rating] = (distribution[review.rating] || 0) + 1
                })
                setRatingDistribution(distribution)
            } else {
                // PRODUCTION: No reviews found - show empty state
                setReviews([])
                setRatingDistribution(emptyDistribution)
            }
        } catch (error) {
            console.error("Error in fetchReviews:", error)
            // PRODUCTION: Show empty state on error
            setReviews([])
            setRatingDistribution(emptyDistribution)
        } finally {
            setIsLoading(false)
        }
    }, [productId])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const handleHelpful = async (reviewId: string) => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .rpc('increment_helpful_count', { review_id: reviewId })
            
            if (!error) {
                setReviews(prev => prev.map(r => 
                    r.id === reviewId 
                        ? { ...r, helpful_count: (r.helpful_count || 0) + 1 }
                        : r
                ))
            }
        } catch (error) {
            console.error("Error updating helpful count:", error)
        }
    }

    const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
    const getPercentage = (count: number) => totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
    
    // Filter reviews by selected star
    const filteredReviews = selectedStar 
        ? reviews.filter(r => r.rating === selectedStar)
        : reviews

    return (
        <div className="mt-8 sm:mt-10 space-y-6">
            {/* Header Row: Title + Overall Rating - Refined */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight">{t('customerReviews')}</h2>
                
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-verified/10 px-2 py-1.5 rounded-md border border-verified/10">
                            <span className="text-xl font-bold text-verified">{rating.toFixed(1)}</span>
                            <Star size={16} weight="fill" className="text-verified" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-verified">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        weight={i < Math.floor(rating) ? "fill" : "regular"}
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                {reviewCount} {t('globalRatings', { count: reviewCount }).replace(/\d+/, '').trim()}
                            </span>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Suspense fallback={<ReviewFormSkeleton />}>
                            <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Horizontal Star Filter Bar */}
            <div className="py-3 border-y border-border/40">
                <div className="flex items-center justify-between gap-1">
                    <button
                        onClick={() => setSelectedStar(null)}
                        className={cn(
                            "px-2 py-1.5 text-[10px] font-bold rounded-md border uppercase tracking-tighter shrink-0",
                            selectedStar === null
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background border-border text-foreground"
                        )}
                    >
                        {t('all') || 'All'}
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star]
                        return (
                            <button
                                key={star}
                                onClick={() => setSelectedStar(selectedStar === star ? null : star)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-bold rounded-md border",
                                    selectedStar === star
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-background border-border text-foreground"
                                )}
                            >
                                <span>{star}</span>
                                <Star size={10} weight="fill" className={cn(
                                    selectedStar === star ? "text-background" : "text-verified"
                                )} />
                                <span className="text-[9px] opacity-50 ml-0.5">({count})</span>
                            </button>
                        )
                    })}
                </div>
                
                {/* Rating Distribution Bars */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = getPercentage(ratingDistribution[star])
                        return (
                            <div key={star} className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5 min-w-[20px]">
                                    <span className="text-[10px] font-bold text-muted-foreground">{star}</span>
                                    <Star size={8} weight="fill" className="text-verified" />
                                </div>
                                <Progress 
                                    value={percentage} 
                                    className="h-1 flex-1 rounded-full bg-muted/50 [&>div]:bg-verified [&>div]:transition-none" 
                                />
                                <span className="text-[10px] font-medium text-muted-foreground min-w-[24px] text-right">{percentage}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-3 py-4 border-b border-border/20">
                                <div className="flex gap-3">
                                    <div className="size-10 bg-muted rounded-md"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-muted rounded-md w-1/3"></div>
                                        <div className="h-3 bg-muted rounded-md w-1/4"></div>
                                    </div>
                                </div>
                                <div className="h-16 bg-muted rounded-md"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border/60 rounded-md">
                        <p className="text-foreground font-medium">{t('noReviews')}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t('beFirst')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="py-6 first:pt-0 space-y-3">
                                {/* Review Header */}
                                <div className="flex items-start gap-3">
                                    <Avatar className="size-9 border bg-background shrink-0">
                                        <AvatarImage src={review.profiles?.avatar_url || undefined} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                            {review.profiles?.full_name?.slice(0, 2).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-semibold text-sm text-foreground truncate">
                                                {review.profiles?.full_name || "Anonymous"}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={10}
                                                        weight={i < review.rating ? "fill" : "regular"}
                                                        className="text-verified"
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-verified font-bold uppercase tracking-tight">
                                                {t('verifiedPurchase')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Review Content */}
                                <div className="space-y-1">
                                    {review.title && (
                                        <p className="font-bold text-sm text-foreground leading-tight">{review.title}</p>
                                    )}
                                    {review.comment && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Review Footer */}
                                <div className="flex items-center gap-4 pt-1">
                                    <button 
                                        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                                        onClick={() => handleHelpful(review.id)}
                                    >
                                        <span>Helpful</span>
                                        <span>({review.helpful_count || 0})</span>
                                    </button>
                                    <button 
                                        className="text-[11px] font-medium text-muted-foreground hover:text-destructive"
                                    >
                                        {t('report')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {reviews.length > 0 && (
                    <div className="mt-6 text-center">
                        <Button variant="outline" className="rounded-md px-6 h-10 font-bold text-xs uppercase tracking-wide">
                            {t('seeAllReviews')} →
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}


