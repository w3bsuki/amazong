"use client"

/**
 * StorePageClient - Legacy Store Page Component
 * 
 * NOTE: This component handles the legacy /store/[storeSlug] route.
 * With the unified profile system, users should be redirected to /u/[username]
 * when they have a username set. This component serves as a fallback for:
 * - Users who don't have a username yet
 * - Legacy bookmarks/links
 * 
 * The main profile experience is now at /u/[username] using PublicProfileClient.
 */

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Calendar,
  Package,
  CheckCircle,
  Storefront,
  ArrowRight,
  Chat,
} from "@phosphor-icons/react"
import { ProductCard } from "@/components/product-card"
import type { StoreInfo, StoreProduct, SellerFeedback } from "@/lib/data/store"
import type { DisplayBadge, TrustScoreBreakdown } from "@/lib/types/badges"

interface StorePageClientProps {
  store: StoreInfo
  initialProducts: StoreProduct[]
  initialProductsTotal: number
  initialReviews: SellerFeedback[]
  initialReviewsTotal: number
  locale: string
  badges: DisplayBadge[]
  trustScore?: number
  trustBreakdown?: TrustScoreBreakdown
  verificationLevel: "basic" | "verified" | "pro" | "enterprise"
  accountType: "personal" | "business"
}

function StarRating({ rating, count, size = "sm" }: { rating: number; count: number; size?: "sm" | "md" }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} weight="fill" className={`text-yellow-500 ${size === "md" ? "size-5" : "size-4"}`} />)
    } else if (i === fullStars && hasHalf) {
      stars.push(<Star key={i} weight="duotone" className={`text-yellow-500 ${size === "md" ? "size-5" : "size-4"}`} />)
    } else {
      stars.push(<Star key={i} weight="regular" className={`text-gray-300 ${size === "md" ? "size-5" : "size-4"}`} />)
    }
  }
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className={`font-medium ${size === "md" ? "text-base" : "text-sm"}`}>{rating.toFixed(1)}</span>
      <span className={`text-muted-foreground ${size === "md" ? "text-sm" : "text-xs"}`}>({count})</span>
    </div>
  )
}

export function StorePageClient({
  store,
  initialProducts,
  initialProductsTotal,
  initialReviews,
  initialReviewsTotal,
  locale,
  badges,
  trustScore,
  verificationLevel,
  accountType,
}: StorePageClientProps) {
  const [activeTab, setActiveTab] = useState("listings")
  
  const displayName = store.store_name
  const initials = displayName.substring(0, 2).toUpperCase()
  const memberSince = new Date(store.created_at)
  
  const t = {
    listings: locale === "bg" ? "Обяви" : "Listings",
    reviews: locale === "bg" ? "Отзиви" : "Reviews",
    memberSince: locale === "bg" ? "Член от" : "Member since",
    sales: locale === "bg" ? "Продажби" : "Sales",
    rating: locale === "bg" ? "Рейтинг" : "Rating",
    viewAll: locale === "bg" ? "Виж всички" : "View All",
    noListings: locale === "bg" ? "Няма активни обяви" : "No active listings",
    noReviews: locale === "bg" ? "Няма отзиви все още" : "No reviews yet",
    business: locale === "bg" ? "Бизнес" : "Business",
    verified: locale === "bg" ? "Верифициран" : "Verified",
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
      {/* Banner */}
      <div className="relative h-32 sm:h-48 md:h-56 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20">
        <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
      </div>
      
      {/* Profile Header */}
      <div className="container relative -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="size-28 sm:size-36 border-4 border-background shadow-lg">
              <AvatarImage src={store.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {store.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-background">
                <CheckCircle className="size-5 text-white" weight="fill" />
              </div>
            )}
          </div>
          
          {/* Name and Actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
                {accountType === "business" && (
                  <Badge variant="secondary" className="gap-1">
                    <Storefront className="size-3.5" />
                    {t.business}
                  </Badge>
                )}
                {verificationLevel !== "basic" && (
                  <Badge variant="outline" className="gap-1 text-blue-600 border-blue-200 bg-blue-50">
                    <CheckCircle className="size-3.5" />
                    {t.verified}
                  </Badge>
                )}
              </div>
              {store.description && (
                <p className="text-muted-foreground mt-1">{store.description}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Link href={`/${locale}/chat?seller=${store.id}`}>
                <Button variant="outline" className="gap-2">
                  <Chat className="size-4" />
                  {locale === "bg" ? "Съобщение" : "Message"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Info and Stats */}
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {t.memberSince} {memberSince.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            
            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.slice(0, 5).map((badge) => (
                  <Badge key={badge.code} variant="secondary" className="gap-1 text-xs">
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column - Stats */}
          <div>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Package className="size-4" />
                    {t.sales}
                  </span>
                  <span className="font-semibold">{store.total_sales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.rating}</span>
                  {store.review_count > 0 ? (
                    <StarRating rating={store.average_rating} count={store.review_count} />
                  ) : (
                    <span className="text-sm text-muted-foreground">{t.noReviews}</span>
                  )}
                </div>
                {trustScore !== undefined && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trust Score</span>
                      <span className="font-semibold">{trustScore}/100</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Tabs Content */}
      <div className="container mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="listings" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              <Package className="size-4 mr-2" />
              {t.listings} ({initialProductsTotal})
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              <Star className="size-4 mr-2" />
              {t.reviews} ({initialReviewsTotal})
            </TabsTrigger>
          </TabsList>
          
          {/* Listings Tab */}
          <TabsContent value="listings" className="mt-6">
            {initialProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {initialProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.images?.[0] || ""}
                      rating={product.rating}
                      reviews={product.review_count}
                      originalPrice={product.list_price}
                      slug={product.slug}
                      storeSlug={store.store_slug}
                      sellerId={store.id}
                      isBoosted={product.is_boosted}
                      index={index}
                      variant="compact"
                    />
                  ))}
                </div>
                {initialProductsTotal > 12 && (
                  <div className="mt-6 flex justify-center">
                    <Link href={`/${locale}/search?seller=${store.id}`}>
                      <Button variant="outline" className="gap-2">
                        {t.viewAll} ({initialProductsTotal})
                        <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Package className="size-12 mx-auto mb-3 opacity-50" />
                <p>{t.noListings}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            {initialReviews.length > 0 ? (
              <div className="space-y-4 max-w-3xl">
                {initialReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-10">
                          <AvatarImage src={review.buyer?.avatar_url || undefined} />
                          <AvatarFallback>
                            {(review.buyer?.full_name || "?").substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {review.buyer?.full_name || (locale === "bg" ? "Анонимен" : "Anonymous")}
                            </span>
                            {review.created_at && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} count={0} />
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Star className="size-12 mx-auto mb-3 opacity-50" />
                <p>{t.noReviews}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
