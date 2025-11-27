"use client"

import { useEffect, useState, useCallback } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewForm } from "@/components/review-form"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl"
import Link from "next/link"

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

export function ReviewsSection({ rating, reviewCount, productId }: { rating: number, reviewCount: number, productId: string }) {
    const t = useTranslations('Reviews')
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
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
            } else if (data) {
                setReviews(data as Review[])
                
                // Calculate rating distribution
                const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                data.forEach((review: any) => {
                    distribution[review.rating] = (distribution[review.rating] || 0) + 1
                })
                setRatingDistribution(distribution)
            }
        } catch (error) {
            console.error("Error in fetchReviews:", error)
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

    return (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 sm:gap-8 lg:gap-12">
            {/* Left Column: Customer Reviews Summary */}
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{t('customerReviews')}</h2>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-rating">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(rating) ? "fill-current" : "fill-rating-empty stroke-rating stroke-1"}`}
                            />
                        ))}
                    </div>
                    <span className="text-base sm:text-lg font-medium text-foreground">{rating.toFixed(1)} {t('outOf5')}</span>
                </div>
                <div className="text-muted-foreground text-sm mb-4 sm:mb-6">{t('globalRatings', { count: reviewCount })}</div>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 sm:gap-3 text-sm text-link hover:text-link-hover hover:underline cursor-pointer group">
                            <span className="w-10 sm:w-12 text-foreground group-hover:text-link-hover group-hover:underline text-xs sm:text-sm">{star} {t('star')}</span>
                            <Progress 
                                value={getPercentage(ratingDistribution[star])} 
                                className="h-4 sm:h-5 flex-1 rounded-md bg-muted [&>div]:bg-rating border border-border shadow-inner" 
                            />
                            <span className="w-8 text-right text-xs sm:text-sm">{getPercentage(ratingDistribution[star])}%</span>
                        </div>
                    ))}
                </div>

                <Separator className="my-4 sm:my-6" />

                <h3 className="font-bold text-base sm:text-lg mb-2">{t('reviewThisProduct')}</h3>
                <p className="text-sm text-foreground mb-4">{t('shareThoughts')}</p>
                <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
            </div>

            {/* Right Column: Individual Reviews */}
            <div>
                <h3 className="font-bold text-lg mb-4">{t('topReviews')}</h3>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse space-y-2">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-4 bg-muted rounded w-48"></div>
                                <div className="h-20 bg-muted rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">{t('noReviews')}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t('beFirst')}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={review.profiles?.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {review.profiles?.full_name?.slice(0, 2).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-foreground">
                                        {review.profiles?.full_name || "Anonymous"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-4 w-4 ${i < review.rating ? "fill-current" : "fill-rating-empty stroke-rating stroke-1"}`} 
                                            />
                                        ))}
                                    </div>
                                    {review.title && (
                                        <span className="text-sm font-bold text-foreground">{review.title}</span>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="text-sm text-brand-deal font-bold">{t('verifiedPurchase')}</div>
                                {review.comment && (
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {review.comment}
                                    </p>
                                )}
                                <div className="text-sm text-muted-foreground pt-2">
                                    {t('helpfulCount', { count: review.helpful_count || 0 })}
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        className="h-8 px-4 rounded-md border-border text-sm hover:bg-muted"
                                        onClick={() => handleHelpful(review.id)}
                                    >
                                        {t('helpful')}
                                    </Button>
                                    <Button variant="ghost" className="h-8 px-2 text-sm text-muted-foreground hover:bg-transparent hover:underline">
                                        {t('report')}
                                    </Button>
                                </div>
                                <Separator className="mt-4" />
                            </div>
                        ))}
                    </div>
                )}

                {reviews.length > 0 && (
                    <div className="mt-6">
                        <Link href="#" className="text-link hover:text-link-hover hover:underline font-medium text-sm">
                            {t('seeAllReviews')} {">"}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}


