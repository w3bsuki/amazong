import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PublicProfileClient } from "./profile-client"

// =============================================================================
// SEO-OPTIMIZED PROFILE PAGE
// URL Pattern: /{username}
// Example: /indecisive_wear
// =============================================================================

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

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username, locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    return { title: "Profile Not Found" }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, account_type, is_seller")
    .ilike("username", username)
    .single()

  if (!profile) {
    return {
      title: locale === "bg" ? "Профил не е намерен" : "Profile Not Found",
    }
  }

  // Fetch seller stats if seller
  let sellerStats: { total_sales: number | null; average_rating: number | null } | null = null
  if (profile.is_seller) {
    const { data: stats } = await supabase
      .from("seller_stats")
      .select("total_sales, average_rating")
      .eq("seller_id", profile.id)
      .single()
    sellerStats = stats
  }

  const displayName = profile.display_name || profile.username
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amazong.com"
  const canonicalUrl = `${siteUrl}/${locale}/${username}`
  
  const title = `${displayName} (@${profile.username}) | Amazong`
  const totalSales = sellerStats?.total_sales ?? 0
  const avgRating = sellerStats?.average_rating ?? 0
  const description = profile.bio
    || (locale === "bg"
      ? `Вижте профила на ${displayName} в Amazong. ${profile.is_seller ? `${totalSales} продажби, ⭐ ${avgRating.toFixed(1)}` : "Член на Amazong"}`
      : `View ${displayName}'s profile on Amazong. ${profile.is_seller ? `${totalSales} sales, ⭐ ${avgRating.toFixed(1)}` : "Amazong member"}`)

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

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  await connection()
  const { username, locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  // Fetch profile - note: seller/buyer stats are in separate tables
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      avatar_url,
      banner_url,
      bio,
      account_type,
      tier,
      is_seller,
      is_verified_business,
      verified,
      location,
      business_name,
      website_url,
      social_links,
      created_at
    `)
    .ilike("username", username)
    .single()

  if (error || !profile) {
    notFound()
  }

  // If seller, fetch their products
  let products: ProfileProduct[] = []
  let productCount = 0

  if (profile.is_seller) {
    const { data: sellerProducts, count } = await supabase
      .from("products")
      .select(`
        id,
        title,
        slug,
        price,
        list_price,
        images,
        rating,
        review_count,
        created_at,
        is_boosted,
        seller_id,
        condition
      `, { count: "exact" })
      .eq("seller_id", profile.id)
      .eq("status", "active")
      .order("is_boosted", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12)

    products = (sellerProducts || []) as ProfileProduct[]
    productCount = count || 0
  }

  // Fetch seller feedback/reviews if seller
  let reviews: SellerReview[] = []
  let reviewCount = 0
  let sellerStats: { total_sales: number | null; average_rating: number | null; follower_count: number | null } | null = null

  if (profile.is_seller) {
    // Get seller stats
    const { data: stats } = await supabase
      .from("seller_stats")
      .select("total_sales, average_rating, follower_count")
      .eq("seller_id", profile.id)
      .single()
    sellerStats = stats

    const { data: sellerReviews, count } = await supabase
      .from("seller_feedback")
      .select(`
        id,
        rating,
        comment,
        item_as_described,
        shipping_speed,
        communication,
        created_at,
        buyer:profiles!seller_feedback_buyer_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `, { count: "exact" })
      .eq("seller_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10)

    reviews = (sellerReviews || []) as SellerReview[]
    reviewCount = count || 0
  }

  // Fetch buyer stats and feedback
  let buyerReviews: BuyerReview[] = []
  let buyerReviewCount = 0
  let buyerStats: { total_orders: number | null } | null = null

  // Get buyer stats
  const { data: bStats } = await supabase
    .from("buyer_stats")
    .select("total_orders")
    .eq("user_id", profile.id)
    .single()
  buyerStats = bStats

  if ((buyerStats?.total_orders ?? 0) > 0) {
    const { data: feedback, count } = await supabase
      .from("buyer_feedback")
      .select(`
        id,
        rating,
        comment,
        payment_promptness,
        communication,
        created_at,
        seller:profiles!buyer_feedback_seller_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `, { count: "exact" })
      .eq("buyer_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10)

    buyerReviews = (feedback || []) as BuyerReview[]
    buyerReviewCount = count || 0
  }

  // Check if current user is viewing their own profile
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const isOwnProfile = currentUser?.id === profile.id

  // Check if current user is following this seller
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

  // Transform social_links from Json to Record<string, string>
  const socialLinks = profile.social_links && typeof profile.social_links === 'object' && !Array.isArray(profile.social_links)
    ? profile.social_links as Record<string, string>
    : null

  // Hide business fields for personal accounts
  const publicProfile = {
    id: profile.id,
    username: profile.username,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    banner_url: profile.banner_url,
    bio: profile.bio,
    account_type: profile.account_type,
    is_seller: profile.is_seller,
    is_verified_business: profile.is_verified_business,
    verified: profile.verified,
    location: profile.location,
    business_name: profile.account_type === "business" ? profile.business_name : null,
    website_url: profile.account_type === "business" ? profile.website_url : null,
    social_links: profile.account_type === "business" ? socialLinks : null,
    created_at: profile.created_at,
    // Stats from separate tables
    total_sales: sellerStats?.total_sales ?? 0,
    average_rating: sellerStats?.average_rating ?? null,
    total_purchases: buyerStats?.total_orders ?? 0,
    follower_count: sellerStats?.follower_count ?? 0,
  }

  return (
    <PublicProfileClient
      profile={publicProfile}
      products={products}
      productCount={productCount}
      sellerReviews={reviews}
      sellerReviewCount={reviewCount}
      buyerReviews={buyerReviews}
      buyerReviewCount={buyerReviewCount}
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
      locale={locale}
    />
  )
}
