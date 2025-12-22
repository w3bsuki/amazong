/**
 * Server component for fetching initial reviews data
 * Follows Next.js best practices: server component for data, client for interactivity
 */

import { createClient } from "@/lib/supabase/server"
import { ReviewsSectionClient } from "./reviews-section-client"

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  created_at: string
  helpful_count: number
  images: string[]
  verified_purchase: boolean
  seller_response: string | null
  seller_response_at: string | null
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface ReviewsSectionServerProps {
  productId: string
  rating: number
  reviewCount: number
}

/**
 * Fetch reviews data on the server for initial render
 * This improves SEO and initial page load performance
 */
async function fetchReviewsData(productId: string) {
  const supabase = await createClient()
  
  if (!supabase) {
    return {
      reviews: [] as Review[],
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        title,
        comment,
        created_at,
        helpful_count,
        images,
        verified_purchase,
        seller_response,
        seller_response_at,
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
      return {
        reviews: [] as Review[],
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      }
    }

    // Calculate rating distribution from real data
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (data && data.length > 0) {
      data.forEach((review: { rating: number }) => {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1
      })
    }

    return {
      reviews: (data as Review[]) || [],
      ratingDistribution: distribution,
    }
  } catch (error) {
    console.error("Error in fetchReviewsData:", error)
    return {
      reviews: [] as Review[],
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }
}

/**
 * Server Component - fetches data then renders client component
 * This pattern gives us:
 * - Server-side data fetching (better performance, SEO)
 * - Client-side interactivity (filtering, voting)
 */
export async function ReviewsSectionServer({
  productId,
  rating,
  reviewCount,
}: ReviewsSectionServerProps) {
  // Fetch data on server
  const { reviews, ratingDistribution } = await fetchReviewsData(productId)

  // Pass to client component for interactivity
  return (
    <ReviewsSectionClient
      productId={productId}
      rating={rating}
      reviewCount={reviewCount}
      initialReviews={reviews}
      initialDistribution={ratingDistribution}
    />
  )
}

export default ReviewsSectionServer
