"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ProfileShell,
  ProfileStats,
  ProfileTabs,
  ProfileSettingsPanel,
  ProfileHeaderSync,
} from "@/components/shared/profile"
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
  Gear,
  ChatCircle,
  Users,
} from "@phosphor-icons/react"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { FollowSellerButton, type FollowSellerActions } from "./_components/follow-seller-button"
import { SellerVerificationBadge } from "./_components/seller-verification-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useAuth } from "@/components/providers/auth-state-manager"
import { EmptyStateCTA } from "../_components/empty-state-cta"

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
    created_at: string | null  // nullable from cache to avoid ISR write storms
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
  const { signOut } = useAuth()

  // Avoid SSR/hydration mismatch for time-based + Intl-rendered text (React error 419 in prod).
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const [activeTab, setActiveTab] = useState(profile.is_seller ? "listings" : "reviews")

  const displayName = profile.display_name || profile.username || tProfile("user")
  // Handle nullable created_at (ISR cache optimization)
  const memberSince = profile.created_at ? new Date(profile.created_at) : null

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <FacebookLogo className="size-5" weight="fill" />,
    instagram: <InstagramLogo className="size-5" weight="fill" />,
    twitter: <TwitterLogo className="size-5" weight="fill" />,
    tiktok: <TiktokLogo className="size-5" weight="fill" />,
    youtube: <YoutubeLogo className="size-5" weight="fill" />,
  }

  const memberSinceLabel =
    isHydrated && memberSince
      ? tSeller("memberSince", {
          date: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(memberSince),
        })
      : null

  // Build stats for the horizontal row (Tradesphere pattern: 4 stats)
  const statsItems = profile.is_seller
    ? [
        { value: productCount, label: tProfile("listings") },
        { value: profile.total_sales, label: tProfile("sold") },
        { value: profile.follower_count ?? 0, label: tProfile("followers") },
        { value: profile.total_purchases, label: tProfile("following") },
      ]
    : [
        { value: profile.total_purchases, label: tProfile("purchases") },
        { value: buyerReviewCount, label: tProfile("reviews") },
      ]

  // Build tabs array
  const tabs = [
    // Listings tab (sellers only)
    ...(profile.is_seller ? [{
      value: "listings",
      label: tProfile("forSale"),
      count: productCount,
      icon: <Package className="size-4" />,
      content: (
        <div className="px-4 py-4">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <MobileProductCard
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
                    layout="feed"
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
            <EmptyStateCTA
              variant="no-listings"
              title={tProfile("noActiveListings")}
              showCTA={Boolean(isOwnProfile)}
            />
          )}
        </div>
      ),
    }] : []),

    // Reviews tab
    {
      value: "reviews",
      label: tProfile("reviews"),
      count: profile.is_seller ? sellerReviewCount : buyerReviewCount,
      icon: <Star className="size-4" />,
      content: (
        <div className="px-4 py-4">
          {profile.is_seller ? (
            // Seller reviews
            sellerReviews.length > 0 ? (
              <div className="space-y-3">
                {sellerReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          name={review.buyer?.display_name || review.buyer?.username || "?"}
                          avatarUrl={review.buyer?.avatar_url ?? null}
                          className="size-9"
                          fallbackClassName="text-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            {review.buyer?.username ? (
                              <Link
                                href={`/${review.buyer.username}`}
                                className="font-medium text-sm truncate tap-transparent"
                              >
                                {review.buyer.display_name || review.buyer.username}
                              </Link>
                            ) : (
                              <span className="font-medium text-sm truncate">
                                {review.buyer?.display_name || tProfile("buyer")}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {isHydrated ? formatTimeAgo(review.created_at, locale) ?? "" : ""}
                            </span>
                          </div>
                          <div className="mt-1">
                            <StarRating rating={review.rating} count={0} />
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Star className="size-12 mx-auto mb-3" />
                <p>{tProfile("noReviewsYet")}</p>
              </div>
            )
          ) : (
            // Buyer reviews
            buyerReviews.length > 0 ? (
              <div className="space-y-3">
                {buyerReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          name={review.seller?.display_name || review.seller?.username || "?"}
                          avatarUrl={review.seller?.avatar_url ?? null}
                          className="size-9"
                          fallbackClassName="text-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            {review.seller?.username ? (
                              <Link
                                href={`/${review.seller.username}`}
                                className="font-medium text-sm truncate tap-transparent"
                              >
                                {review.seller.display_name || review.seller.username}
                              </Link>
                            ) : (
                              <span className="font-medium text-sm truncate">
                                {review.seller?.display_name || tProfile("seller")}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {isHydrated ? formatTimeAgo(review.created_at, locale) ?? "" : ""}
                            </span>
                          </div>
                          <div className="mt-1">
                            <StarRating rating={review.rating} count={0} />
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Star className="size-12 mx-auto mb-3" />
                <p>{tProfile("noReviewsYet")}</p>
              </div>
            )
          )}
        </div>
      ),
    },

    // Followers tab
    {
      value: "followers",
      label: tProfile("followers"),
      icon: <Users className="size-4" />,
      content: (
        <div className="space-y-3 pb-4">
          {(profile.follower_count ?? 0) > 0 ? (
            <>
              <div className="py-8 text-center text-muted-foreground">
                <Users className="size-12 mx-auto mb-3" />
                <p className="text-sm">
                  {tProfile("followersCount", { count: profile.follower_count ?? 0 })}
                </p>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="size-12 mx-auto mb-3" />
              <p>{tProfile("noFollowersYet")}</p>
            </div>
          )}
        </div>
      ),
    },

    // Settings tab (own profile only)
    ...(isOwnProfile ? [{
      value: "settings",
      label: tProfile("settings"),
      icon: <Gear className="size-4" />,
      content: (
        <ProfileSettingsPanel
          isSeller={Boolean(profile.is_seller)}
          onSignOut={signOut}
        />
      ),
    }] : []),
  ]

  // Header content: bio, location, badges, social
  const headerContent = (
    <div className="space-y-2">
      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5">
        {profile.account_type === "business" && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Storefront className="size-3" />
            {tProfile("business")}
          </Badge>
        )}
        {profile.is_seller && (
          <Badge variant="success-subtle" className="gap-1 text-xs">
            <Package className="size-3" />
            {tProfile("seller")}
          </Badge>
        )}
        <SellerVerificationBadge
          variant="badge"
          size="sm"
          isVerifiedBusiness={Boolean(profile.is_verified_business)}
        />
      </div>

      {/* Rating */}
      {profile.is_seller && sellerReviewCount > 0 && profile.average_rating ? (
        <StarRating rating={profile.average_rating} count={sellerReviewCount} />
      ) : null}

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
      )}

      {/* Location and member since */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {profile.location}
          </span>
        )}
        {memberSinceLabel && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {memberSinceLabel}
          </span>
        )}
      </div>

      {/* Social links */}
      {profile.social_links && Object.keys(profile.social_links).length > 0 && (
        <div className="flex gap-2 pt-1">
          {profile.website_url && (
            <IconButton
              asChild
              variant="outline"
              aria-label={tProfile("openWebsite")}
              className="rounded-full bg-surface-subtle"
            >
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="size-4" aria-hidden="true" />
              </a>
            </IconButton>
          )}
          {Object.entries(profile.social_links).map(([platform, url]) => {
            if (!url) return null
            return (
              <IconButton
                key={platform}
                asChild
                variant="outline"
                aria-label={tProfile("openSocial", { platform })}
                className="rounded-full bg-surface-subtle"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <span aria-hidden="true">
                    {socialIcons[platform] || <Globe className="size-4" />}
                  </span>
                </a>
              </IconButton>
            )
          })}
        </div>
      )}
    </div>
  )

  // Action buttons (Tradesphere style: rounded-xl, side-by-side)
  const handleShareProfile = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (!url) return

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: displayName,
          url,
        })
        return
      } catch {
        // User cancelled or share failed - silently ignore
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        // Best-effort only
      }
    }
  }

  const actions = isOwnProfile ? (
    <>
      <Link href="/account/profile" className="w-full sm:flex-1 min-w-0">
        <Button className="w-full rounded-xl min-w-0">
          <PencilSimple className="size-4" />
          <span className="truncate">{tProfile("editProfile")}</span>
        </Button>
      </Link>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="hidden sm:inline-flex rounded-xl"
        onClick={handleShareProfile}
      >
        <ShareNetwork className="size-4" />
      </Button>
    </>
  ) : (
    <>
      {profile.is_seller && followActions ? (
        <FollowSellerButton
          sellerId={profile.id}
          initialIsFollowing={isFollowing}
          actions={followActions}
          locale={locale}
          variant="default"
          size="default"
          className="w-full sm:flex-1 rounded-xl"
        />
      ) : null}
      {!isOwnProfile && (
        <Link href={`/chat?to=${profile.id}`} className="w-full sm:flex-1 min-w-0">
          <Button variant="secondary" className="w-full rounded-xl gap-2 min-w-0">
            <ChatCircle className="size-4" />
            <span className="truncate">{tSeller("message")}</span>
          </Button>
        </Link>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden sm:inline-flex rounded-xl"
        aria-label={tProfile("share")}
        onClick={handleShareProfile}
      >
        <ShareNetwork className="size-5" />
      </Button>
    </>
  )

  return (
    <>
      <ProfileHeaderSync
        displayName={profile.display_name}
        username={profile.username}
        avatarUrl={profile.avatar_url}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        sellerId={profile.id}
      />
      <ProfileShell
        displayName={displayName}
        username={profile.username}
        avatarUrl={profile.avatar_url}
        bannerUrl={profile.banner_url}
        isVerifiedBusiness={Boolean(profile.is_verified_business)}
        stats={<ProfileStats stats={statsItems} />}
        actions={actions}
        headerContent={headerContent}
        tabs={
          <ProfileTabs
            tabs={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        }
      />
    </>
  )
}
