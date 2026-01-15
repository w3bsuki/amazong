import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { Suspense } from "react"
import { createClient, createStaticClient } from "@/lib/supabase/server"
import { getPublicProfileData, getProfileMetadata } from "@/lib/data/profile-page"
import { PublicProfileClient } from "./profile-client"
import { routing } from "@/i18n/routing"

// =============================================================================
// SEO-OPTIMIZED PROFILE PAGE - HYBRID CACHING
// URL Pattern: /{username}
// Example: /indecisive_wear
// 
// CACHING STRATEGY:
// - Profile data is PUBLIC and CACHED via 'use cache' in getPublicProfileData
// - User-specific data (isOwnProfile, isFollowing) is DYNAMIC (requires auth)
// - Uses Suspense to stream dynamic content while showing cached content fast
// 
// ISR OPTIMIZATION:
// - generateStaticParams fetches top 25 active sellers for build-time pre-rendering
// - High-traffic seller pages are pre-built for fast first loads + SEO
// - New/less-active sellers are rendered on-demand (ISR)
// =============================================================================

// Pre-generate top 25 active sellers (by product count) for fast SEO pages
export async function generateStaticParams() {
  const supabase = createStaticClient()
  
  // Fallback when Supabase isn't configured (e.g. local/E2E)
  if (!supabase) {
    return routing.locales.map((locale) => ({ locale, username: '__fallback__' }))
  }

  // Fetch top 25 active sellers with products (ordered by activity)
  const { data: sellers } = await supabase
    .from("profiles")
    .select("username, products(id)")
    .eq("is_seller", true)
    .not("username", "is", null)
    .limit(25)

  if (!sellers || sellers.length === 0) {
    return routing.locales.map((locale) => ({ locale, username: '__fallback__' }))
  }

  // Sort by product count (most active sellers first) and take top 25
  const activeSellers = sellers
    .map(s => ({ 
      username: s.username as string, 
      productCount: Array.isArray(s.products) ? s.products.length : 0 
    }))
    .filter(s => s.username && s.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 25)

  // Generate locale × username combinations
  return routing.locales.flatMap((locale) =>
    activeSellers.map((s) => ({ locale, username: s.username }))
  )
}

// Proper types for products and reviews - must match profile-client.tsx
interface ProfileProduct {
  id: string
  title: string
  slug: string | null
  price: number
  list_price: number | null
  images: string[] | null
  rating: number | null
  review_count: number | null
  created_at: string
  is_boosted: boolean | null
  seller_id: string | null
  condition: string | null
}

interface ReviewPerson {
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

interface SellerReview {
  id: string
  rating: number
  comment: string | null
  item_as_described: boolean | null
  shipping_speed: boolean | null
  communication: boolean | null
  created_at: string
  buyer: ReviewPerson | null
}

interface BuyerReview {
  id: string
  rating: number
  comment: string | null
  payment_promptness: boolean | null
  communication: boolean | null
  created_at: string
  seller: ReviewPerson | null
}

interface ProfilePageProps {
  params: Promise<{
    username: string
    locale: string
  }>
}

// Generate metadata for SEO - uses CACHED data function
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username, locale } = await params

  const data = await getProfileMetadata(username)

  if (!data?.profile) {
    return {
      title: locale === "bg" ? "Профил не е намерен" : "Profile Not Found",
    }
  }

  const { profile, sellerStats } = data
  const displayName = profile.display_name || profile.username
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://treido.eu"
  const canonicalUrl = `${siteUrl}/${locale}/${username}`
  
  const title = `${displayName} (@${profile.username})`
  const totalSales = sellerStats?.total_sales ?? 0
  const avgRating = sellerStats?.average_rating ?? 0
  const description = profile.bio
    || (locale === "bg"
      ? `Вижте профила на ${displayName} в Treido. ${profile.is_seller ? `${totalSales} продажби, ⭐ ${avgRating.toFixed(1)}` : "Член на Treido"}`
      : `View ${displayName}'s profile on Treido. ${profile.is_seller ? `${totalSales} sales, ⭐ ${avgRating.toFixed(1)}` : "Treido member"}`)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en/${username}`,
        bg: `${siteUrl}/bg/${username}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: canonicalUrl,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Dynamic user-specific data component (wrapped in Suspense)
async function UserSpecificData({ 
  profileId, 
  isSeller 
}: { 
  profileId: string
  isSeller: boolean 
}) {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  const isOwnProfile = currentUser?.id === profileId
  
  // Check if current user is following this seller
  let isFollowing = false
  if (currentUser && isSeller && !isOwnProfile) {
    const { data: followData } = await supabase
      .from("store_followers")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("seller_id", profileId)
      .maybeSingle()
    isFollowing = !!followData
  }
  
  return { isOwnProfile, isFollowing }
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  // NO connection() - uses cached getPublicProfileData function
  const { username, locale } = await params
  setRequestLocale(locale)

  // Handle fallback from generateStaticParams (when Supabase unavailable at build)
  if (username === '__fallback__') {
    notFound()
  }

  // Fetch ALL public profile data from CACHED function (single call)
  const profileData = await getPublicProfileData(username)

  if (!profileData?.profile) {
    notFound()
  }

  const { 
    profile, 
    products, 
    productCount, 
    sellerReviews, 
    sellerReviewCount,
    buyerReviews,
    buyerReviewCount 
  } = profileData

  // Fetch user-specific data (dynamic, requires auth)
  // This is the ONLY dynamic part - wrapped separately for potential streaming
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  const isOwnProfile = currentUser?.id === profile.id
  
  let isFollowing = false
  if (currentUser && profile.is_seller && !isOwnProfile) {
    const { data: followData } = await supabase
      .from("store_followers")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("seller_id", profile.id)
      .maybeSingle()
    isFollowing = !!followData
  }

  return (
    <PublicProfileClient
      profile={profile}
      products={products}
      productCount={productCount}
      sellerReviews={sellerReviews}
      sellerReviewCount={sellerReviewCount}
      buyerReviews={buyerReviews}
      buyerReviewCount={buyerReviewCount}
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
      locale={locale}
    />
  )
}
