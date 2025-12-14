import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { getStoreInfo, getStoreProducts, getSellerFeedback, getStoreBadgeData } from "@/lib/data/store"
import { StorePageClient } from "@/components/store/store-page-client"
import { calculateSellerTrustScore } from "@/lib/badges"
import type { DisplayBadge, TrustScoreBreakdown } from "@/lib/types/badges"
import { createClient } from "@/lib/supabase/server"

interface StorePageProps {
  params: Promise<{
    storeSlug: string
    locale: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { storeSlug, locale } = await params
  const store = await getStoreInfo(storeSlug)
  
  if (!store) {
    return {
      title: locale === "bg" ? "Магазин не е намерен" : "Store Not Found",
    }
  }
  
  const title = `${store.store_name} | ${locale === "bg" ? "Магазин" : "Store"}`
  const description = store.description 
    || (locale === "bg" 
      ? `Разгледайте продуктите на ${store.store_name}. ${store.total_products} обяви, ${store.positive_feedback_percentage}% положителни отзиви.`
      : `Browse products from ${store.store_name}. ${store.total_products} listings, ${store.positive_feedback_percentage}% positive feedback.`)
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: store.avatar_url ? [store.avatar_url] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function StorePage({ params }: StorePageProps) {
  await connection()
  const { storeSlug, locale } = await params
  setRequestLocale(locale)
  
  // Fetch store info
  const store = await getStoreInfo(storeSlug)
  
  if (!store) {
    notFound()
  }
  
  // Check if the seller has a username - if so, redirect to /u/[username]
  const supabase = await createClient()
  if (supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", store.id)
      .single()
    
    if (profile?.username) {
      redirect(`/${locale}/u/${profile.username}`)
    }
  }
  
  // Fetch initial products, reviews, and badge data in parallel
  const [productsData, reviewsData, badgeData] = await Promise.all([
    getStoreProducts(store.id, { limit: 12 }),
    getSellerFeedback(store.id, { limit: 10 }),
    getStoreBadgeData(store.id),
  ])
  
  // Process badge data for display
  let displayBadges: DisplayBadge[] = []
  let trustScore: number | undefined
  let trustBreakdown: TrustScoreBreakdown | undefined
  let verificationLevel: "basic" | "verified" | "pro" | "enterprise" = "basic"
  
  if (badgeData) {
    // Convert badges to display format
    displayBadges = badgeData.badges.map(b => ({
      code: b.code,
      name: b.name,
      icon: b.icon || "🏅",
      color: b.color || "bg-gray-500 text-white",
      description: b.description || "",
      tier: b.tier,
      category: b.category as any,
    }))
    
    // Calculate trust score
    const sellerStats = badgeData.stats ? {
      seller_id: store.id,
      total_listings: badgeData.stats.total_listings,
      active_listings: badgeData.stats.active_listings,
      total_sales: badgeData.stats.total_sales,
      total_revenue: 0,
      average_rating: badgeData.stats.average_rating,
      total_reviews: badgeData.stats.total_reviews,
      five_star_reviews: 0,
      positive_feedback_pct: store.positive_feedback_percentage,
      item_described_pct: 100,
      shipping_speed_pct: 100,
      communication_pct: 100,
      follower_count: store.follower_count,
      response_time_hours: null,
      response_rate_pct: 100,
      shipped_on_time_pct: 100,
      repeat_customer_pct: 0,
      first_sale_at: null,
      last_sale_at: null,
      updated_at: new Date().toISOString(),
    } : null
    
    const userVerification = badgeData.verification ? {
      id: "",
      user_id: store.id,
      email_verified: badgeData.verification.email_verified,
      phone_verified: badgeData.verification.phone_verified,
      phone_number: null,
      id_verified: badgeData.verification.id_verified,
      id_document_type: null,
      id_verified_at: null,
      address_verified: false,
      address_verified_at: null,
      trust_score: badgeData.verification.trust_score,
      created_at: "",
      updated_at: "",
    } : null
    
    const businessVerification = badgeData.businessVerification ? {
      id: "",
      seller_id: store.id,
      legal_name: null,
      vat_number: null,
      eik_number: null,
      vat_verified: badgeData.businessVerification.vat_verified,
      vat_verified_at: null,
      registration_doc_url: null,
      registration_verified: badgeData.businessVerification.registration_verified,
      registration_verified_at: null,
      verified_by: null,
      bank_verified: false,
      bank_verified_at: null,
      verification_level: badgeData.businessVerification.verification_level,
      verification_notes: null,
      created_at: "",
      updated_at: "",
    } : null
    
    const scoreResult = calculateSellerTrustScore(
      userVerification,
      businessVerification,
      sellerStats,
      store.account_type
    )
    
    trustScore = scoreResult.total
    trustBreakdown = scoreResult
    
    // Determine verification level
    if (store.account_type === "business") {
      if (badgeData.businessVerification?.verification_level === 5) {
        verificationLevel = "enterprise"
      } else if (badgeData.businessVerification?.registration_verified) {
        verificationLevel = "pro"
      } else if (badgeData.businessVerification?.vat_verified) {
        verificationLevel = "verified"
      }
    } else {
      if (badgeData.verification?.id_verified) {
        verificationLevel = "pro"
      } else if (badgeData.verification?.phone_verified) {
        verificationLevel = "verified"
      } else if (badgeData.verification?.email_verified) {
        verificationLevel = "basic"
      }
    }
  }
  
  return (
    <StorePageClient
      store={store}
      initialProducts={productsData.products}
      initialProductsTotal={productsData.total}
      initialReviews={reviewsData.feedback}
      initialReviewsTotal={reviewsData.total}
      locale={locale}
      badges={displayBadges}
      trustScore={trustScore}
      trustBreakdown={trustBreakdown}
      verificationLevel={verificationLevel}
      accountType={store.account_type}
    />
  )
}
