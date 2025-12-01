"use client"

import { Star } from "@phosphor-icons/react"

interface RatingScrollLinkProps {
  rating: number
  ratingLabel: string
  ratingsText: string
}

export function RatingScrollLink({ rating, ratingLabel, ratingsText }: RatingScrollLinkProps) {
  const handleScrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews')
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        onClick={handleScrollToReviews}
        className="flex items-center gap-2 group cursor-pointer"
        aria-label={`${ratingLabel}. Click to view reviews`}
      >
        <div 
          role="img" 
          aria-label={ratingLabel}
          className="flex text-rating text-sm"
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              weight={i < Math.floor(rating) ? "fill" : "regular"}
              className="h-4 w-4"
            />
          ))}
        </div>
        <span className="text-link hover:text-link-hover hover:underline text-sm font-medium">
          {ratingsText}
        </span>
      </button>
    </div>
  )
}
