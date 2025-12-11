"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, ThumbsDown, Package, ChatCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { SellerFeedback } from "@/lib/data/store"

interface StoreReviewsListProps {
  reviews: SellerFeedback[]
  locale: string
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return locale === "bg" ? "Днес" : "Today"
  }
  if (diffDays === 1) {
    return locale === "bg" ? "Вчера" : "Yesterday"
  }
  if (diffDays < 7) {
    return locale === "bg" ? `Преди ${diffDays} дни` : `${diffDays} days ago`
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return locale === "bg" ? `Преди ${weeks} седм.` : `${weeks}w ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return locale === "bg" ? `Преди ${months} мес.` : `${months}mo ago`
  }
  
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          weight={star <= rating ? "fill" : "regular"}
          className={cn(
            "size-4",
            star <= rating ? "text-amber-500" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

export function StoreReviewsList({ 
  reviews, 
  locale,
  hasMore = false,
  onLoadMore,
  isLoading = false
}: StoreReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ChatCircle className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">
          {locale === "bg" ? "Няма отзиви" : "No Reviews Yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {locale === "bg" 
            ? "Този продавач все още няма получени отзиви от клиенти." 
            : "This seller hasn't received any customer reviews yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y pb-20 md:pb-8 md:px-4 lg:px-8 md:py-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 md:px-0 md:py-5">
          <div className="flex gap-3 md:gap-4">
            {/* Avatar */}
            <Avatar className="size-10 md:size-11 shrink-0">
              <AvatarImage 
                src={review.buyer?.avatar_url || undefined} 
                alt={review.buyer?.full_name || "Anonymous"} 
              />
              <AvatarFallback className="text-xs bg-muted">
                {getInitials(review.buyer?.full_name ?? null)}
              </AvatarFallback>
            </Avatar>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {review.buyer?.full_name || (locale === "bg" ? "Анонимен" : "Anonymous")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.created_at, locale)}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                
                {/* Rating badge - use theme tokens */}
                <Badge 
                  variant="secondary"
                  className={cn(
                    "gap-1 text-xs",
                    review.rating >= 4 
                      ? "bg-stock-available/10 text-stock-available border-stock-available/20"
                      : review.rating >= 3
                      ? "bg-stock-low/10 text-stock-low border-stock-low/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {review.rating >= 4 ? (
                    <ThumbsUp weight="fill" className="size-3" />
                  ) : review.rating < 3 ? (
                    <ThumbsDown weight="fill" className="size-3" />
                  ) : null}
                  {review.rating >= 4 
                    ? (locale === "bg" ? "Положителен" : "Positive")
                    : review.rating >= 3
                    ? (locale === "bg" ? "Неутрален" : "Neutral")
                    : (locale === "bg" ? "Отрицателен" : "Negative")}
                </Badge>
              </div>
              
              {/* Comment */}
              {review.comment && (
                <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
                  {review.comment}
                </p>
              )}
              
              {/* Verified purchase */}
              {review.order_id && (
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <Package weight="fill" className="size-3.5 text-stock-available" />
                  <span className="text-stock-available font-medium">
                    {locale === "bg" ? "Потвърдена покупка" : "Verified Purchase"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Load more button - centered with better styling */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center py-8 px-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-full px-8 min-w-40"
          >
            {isLoading 
              ? (locale === "bg" ? "Зареждане..." : "Loading...")
              : (locale === "bg" ? "Зареди още" : "Load More")}
          </Button>
        </div>
      )}
    </div>
  )
}
