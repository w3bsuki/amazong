"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Calendar,
  Package,
  ShoppingBag,
  CheckCircle,
  Storefront,
  Globe,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  TiktokLogo,
  YoutubeLogo,
  PencilSimple,
  ShareNetwork,
  Heart,
  ArrowRight,
} from "@phosphor-icons/react"
import { ProductCard } from "@/components/shared/product/product-card"
import { FollowSellerButton, type FollowSellerActions } from "@/components/seller/follow-seller-button"
import { SellerVerificationBadge } from "@/components/shared/product/seller-verification-badge"
import { safeAvatarSrc } from "@/lib/utils"

// =============================================================================
// Types - Match the data shape from lib/data/profile-page.ts
// =============================================================================

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

interface PublicProfileClientProps {
  profile: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    banner_url: string | null
    bio: string | null
    account_type: string | null
    tier?: string | null
    is_seller: boolean | null
    is_verified_business: boolean | null
    verified?: boolean | null
    location: string | null
    business_name: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    total_sales: number
    total_purchases: number
    average_rating?: number | null
    follower_count?: number
    created_at: string
  }
  products: ProfileProduct[]
  productCount: number
  sellerReviews: SellerReview[]
  sellerReviewCount: number
  buyerReviews: BuyerReview[]
  buyerReviewCount: number
  isOwnProfile: boolean
  isFollowing: boolean
  locale: string
  /** Actions for follow/unfollow - passed from server component */
  followActions?: FollowSellerActions
}

function StarRating({ rating, count, size = "sm" }: { rating: number; count: number; size?: "sm" | "md" }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} weight="fill" className={`text-rating ${size === "md" ? "size-5" : "size-4"}`} />)
    } else if (i === fullStars && hasHalf) {
      stars.push(<Star key={i} weight="duotone" className={`text-rating ${size === "md" ? "size-5" : "size-4"}`} />)
    } else {
      stars.push(<Star key={i} weight="regular" className={`text-rating-empty ${size === "md" ? "size-5" : "size-4"}`} />)
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

function formatTimeAgo(input: string, locale: string): string | null {
  const d = new Date(input)
  const ms = d.getTime()
  if (!Number.isFinite(ms)) return null

  const diffSeconds = Math.round((ms - Date.now()) / 1000)
  const abs = Math.abs(diffSeconds)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" })

  if (abs < 60) return rtf.format(diffSeconds, "second")

  const diffMinutes = Math.round(diffSeconds / 60)
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute")

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour")

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day")

  const diffWeeks = Math.round(diffDays / 7)
  if (Math.abs(diffWeeks) < 5) return rtf.format(diffWeeks, "week")

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month")

  const diffYears = Math.round(diffDays / 365)
  return rtf.format(diffYears, "year")
}

export function PublicProfileClient({
  profile,
  products,
  productCount,
  sellerReviews,
  sellerReviewCount,
  buyerReviews,
  buyerReviewCount,
  isOwnProfile,
  isFollowing,
  followActions,
}: PublicProfileClientProps) {
  const locale = useLocale()
  const tProfile = useTranslations("ProfilePage")
  const tSeller = useTranslations("Seller")

  const [activeTab, setActiveTab] = useState(profile.is_seller ? "listings" : "buyer-reviews")

  const displayName = profile.display_name || profile.username || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()
  const memberSince = new Date(profile.created_at)

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <FacebookLogo className="size-5" weight="fill" />,
    instagram: <InstagramLogo className="size-5" weight="fill" />,
    twitter: <TwitterLogo className="size-5" weight="fill" />,
    tiktok: <TiktokLogo className="size-5" weight="fill" />,
    youtube: <YoutubeLogo className="size-5" weight="fill" />,
  }

  const memberSinceLabel = tSeller("memberSince", {
    date: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(memberSince),
  })

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
      {/* Banner */}
      <div className="relative h-32 sm:h-48 md:h-56 bg-primary/10">
        {profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Profile Header */}
      <div className="container relative -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="size-28 sm:size-36 border-4 border-background shadow-none">
              <AvatarImage src={safeAvatarSrc(profile.avatar_url)} alt={displayName} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {profile.is_verified_business && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 border-2 border-background">
                <CheckCircle className="size-5 text-primary-foreground" weight="fill" />
              </div>
            )}
          </div>

          {/* Name and Actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
                {profile.account_type === "business" && (
                  <Badge variant="secondary" className="gap-1">
                    <Storefront className="size-3.5" />
                    {tProfile("business")}
                  </Badge>
                )}
                {profile.is_seller && (
                  <Badge variant="outline" className="gap-1 text-success border-success/20 bg-success/10">
                    <Package className="size-3.5" />
                    {tProfile("seller")}
                  </Badge>
                )}
                <SellerVerificationBadge
                  variant="badge"
                  size="sm"
                  isVerifiedBusiness={Boolean(profile.is_verified_business)}
                />
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.is_seller && sellerReviewCount > 0 && profile.average_rating ? (
                <div className="mt-1">
                  <StarRating rating={profile.average_rating} count={sellerReviewCount} />
                </div>
              ) : null}
              {profile.business_name && (
                <p className="text-sm text-muted-foreground mt-0.5">{profile.business_name}</p>
              )}
            </div>

            <div className="flex gap-2">
              {isOwnProfile ? (
                <Link href="/account/profile">
                  <Button variant="outline" size="sm" className="gap-2">
                    <PencilSimple className="size-4" />
                    {tProfile("editProfile")}
                  </Button>
                </Link>
              ) : profile.is_seller && followActions ? (
                <>
                  <FollowSellerButton
                    sellerId={profile.id}
                    initialIsFollowing={isFollowing}
                    actions={followActions}
                    locale={locale}
                    size="sm"
                  />
                  <Button variant="ghost" size="icon" className="size-9" aria-label={tProfile("share")}>
                    <ShareNetwork className="size-4" />
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="icon" className="size-9" aria-label={tProfile("share")}>
                  <ShareNetwork className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip (desktop-first) */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {profile.is_seller && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{tProfile("forSale")}</p>
                <p className="text-xl font-semibold tabular-nums">{productCount}</p>
              </CardContent>
            </Card>
          )}
          {profile.is_seller && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{tProfile("sales")}</p>
                <p className="text-xl font-semibold tabular-nums">{profile.total_sales}</p>
              </CardContent>
            </Card>
          )}
          {profile.is_seller && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{tProfile("followers")}</p>
                <p className="text-xl font-semibold tabular-nums">{profile.follower_count ?? 0}</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{tProfile("purchases")}</p>
              <p className="text-xl font-semibold tabular-nums">{profile.total_purchases}</p>
            </CardContent>
          </Card>
        </div>

        {/* Bio and Info */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {/* Left Column - Bio and Details */}
          <div className="md:col-span-2 space-y-4">
            {profile.bio && (
              <p className="text-muted-foreground">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {memberSinceLabel}
              </span>
            </div>

            {/* Social Links */}
            {profile.social_links && Object.keys(profile.social_links).length > 0 && (
              <div className="flex gap-2">
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Globe className="size-5" />
                  </a>
                )}
                {Object.entries(profile.social_links).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {socialIcons[platform] || <Globe className="size-5" />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 space-y-3">
                {/* Seller Stats */}
                {profile.is_seller && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Package className="size-4" />
                        {tProfile("sales")}
                      </span>
                      <span className="font-semibold">{profile.total_sales}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {tProfile("sellerRating")}
                      </span>
                      {sellerReviewCount > 0 && profile.average_rating ? (
                        <StarRating rating={profile.average_rating} count={sellerReviewCount} />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {tProfile("noReviewsYet")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Heart className="size-4" />
                        {tProfile("followers")}
                      </span>
                      <span className="font-semibold">{profile.follower_count ?? 0}</span>
                    </div>
                    <Separator />
                  </div>
                )}

                {/* Buyer Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <ShoppingBag className="size-4" />
                      {tProfile("purchases")}
                    </span>
                    <span className="font-semibold">{profile.total_purchases}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {tProfile("buyerRating")}
                    </span>
                    {buyerReviewCount > 0 ? (
                      <span className="text-sm font-medium">{buyerReviewCount}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {tProfile("noReviewsYet")}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="container mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {profile.is_seller && (
              <TabsTrigger value="listings">
                <Package className="size-4 md:size-5 mr-1" />
                {tProfile("forSale")} <span className="tabular-nums">({productCount})</span>
              </TabsTrigger>
            )}
            {profile.is_seller && (
              <TabsTrigger value="seller-reviews">
                <Star className="size-4 md:size-5 mr-2" />
                {tProfile("reviews")} <span className="tabular-nums">({sellerReviewCount})</span>
              </TabsTrigger>
            )}
            {(!profile.is_seller || profile.total_purchases > 0) && (
              <TabsTrigger value="buyer-reviews">
                <Star className="size-4 md:size-5 mr-2" />
                {tProfile("buyerRating")} <span className="tabular-nums">({buyerReviewCount})</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Listings Tab */}
          {profile.is_seller && (
            <TabsContent value="listings" className="mt-6">
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.images?.[0] || ''}
                        originalPrice={product.list_price}
                        sellerId={product.seller_id}
                        slug={product.slug}
                        {...(product.condition ? { condition: product.condition } : {})}
                        username={profile.username}
                        sellerName={displayName}
                        sellerAvatarUrl={profile.avatar_url}
                        sellerVerified={Boolean(profile.is_verified_business)}
                        sellerTier={profile.account_type === 'business' ? 'business' : (profile.tier === 'premium' ? 'premium' : 'basic')}
                      />
                    ))}
                  </div>
                  {productCount > 12 && (
                    <div className="mt-6 flex justify-center">
                      <Link href={`/search?seller=${profile.id}`}>
                        <Button variant="outline" className="gap-2">
                          {tProfile("viewAll")} ({productCount})
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Package className="size-12 mx-auto mb-3 opacity-50" />
                  <p>{tProfile("noActiveListings")}</p>
                </div>
              )}
            </TabsContent>
          )}

          {/* Seller Reviews Tab */}
          {profile.is_seller && (
            <TabsContent value="seller-reviews" className="mt-6">
              {sellerReviews.length > 0 ? (
                <div className="space-y-4 max-w-3xl">
                  {sellerReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-10">
                            <AvatarImage src={safeAvatarSrc(review.buyer?.avatar_url)} />
                            <AvatarFallback>
                              {(review.buyer?.display_name || review.buyer?.username || "?").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              {review.buyer?.username ? (
                                <Link
                                  href={`/${review.buyer.username}`}
                                  className="font-medium hover:underline"
                                >
                                  {review.buyer.display_name || review.buyer.username}
                                </Link>
                              ) : (
                                <span className="font-medium">
                                  {review.buyer?.display_name || review.buyer?.username}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(review.created_at, locale) ?? ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} count={0} />
                              <div className="flex gap-1 text-xs">
                                {review.item_as_described && (
                                  <Badge variant="secondary" className="text-2xs py-0">
                                    {tProfile("accurate")}
                                  </Badge>
                                )}
                                {review.shipping_speed && (
                                  <Badge variant="secondary" className="text-2xs py-0">
                                    {tProfile("fastShipping")}
                                  </Badge>
                                )}
                                {review.communication && (
                                  <Badge variant="secondary" className="text-2xs py-0">
                                    {tProfile("goodComms")}
                                  </Badge>
                                )}
                              </div>
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
                  <p>{tProfile("noReviewsYet")}</p>
                </div>
              )}
            </TabsContent>
          )}

          {/* Buyer Reviews Tab */}
          {(!profile.is_seller || profile.total_purchases > 0) && (
            <TabsContent value="buyer-reviews" className="mt-6">
              {buyerReviews.length > 0 ? (
                <div className="space-y-4 max-w-3xl">
                  {buyerReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-10">
                            <AvatarImage src={safeAvatarSrc(review.seller?.avatar_url)} />
                            <AvatarFallback>
                              {(review.seller?.display_name || review.seller?.username || "?").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              {review.seller?.username ? (
                                <Link
                                  href={`/${review.seller.username}`}
                                  className="font-medium hover:underline"
                                >
                                  {review.seller.display_name || review.seller.username}
                                </Link>
                              ) : (
                                <span className="font-medium">
                                  {review.seller?.display_name || review.seller?.username}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(review.created_at, locale) ?? ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} count={0} />
                              <div className="flex gap-1 text-xs">
                                {review.payment_promptness && (
                                  <Badge variant="secondary" className="text-2xs py-0">
                                    {tProfile("promptPayment")}
                                  </Badge>
                                )}
                                {review.communication && (
                                  <Badge variant="secondary" className="text-2xs py-0">
                                    {tProfile("goodComms")}
                                  </Badge>
                                )}
                              </div>
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
                  <p>{tProfile("noReviewsYet")}</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
