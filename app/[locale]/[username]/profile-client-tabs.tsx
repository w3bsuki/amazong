import { ArrowRight, Package, Settings as Gear, Star, Users } from "lucide-react"
import type { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { UserAvatar } from "@/components/shared/user-avatar"
import { EmptyStateCTA } from "../_components/empty-state-cta"
import { ProfileSettingsPanel } from "./_components/profile/profile-settings-panel"

import { StarRating, formatTimeAgo } from "./profile-client.helpers"
import type { BuyerReview, ProfileProduct, ReviewPerson, SellerReview } from "./profile-client.types"

type Translator = ReturnType<typeof useTranslations>

type ProfileShape = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  is_seller: boolean | null
  is_verified_business: boolean | null
  account_type: string | null
  tier?: string | null
  follower_count?: number
}

type ProfileTab = {
  value: string
  label: string
  count?: number
  icon: React.ReactNode
  content: React.ReactNode
}

function ReviewCard({
  person,
  fallbackLabel,
  createdAt,
  rating,
  comment,
  isHydrated,
  locale,
}: {
  person: ReviewPerson | null
  fallbackLabel: string
  createdAt: string
  rating: number
  comment: string | null
  isHydrated: boolean
  locale: string
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <UserAvatar
            name={person?.display_name || person?.username || "?"}
            avatarUrl={person?.avatar_url ?? null}
            className="size-9"
            fallbackClassName="text-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              {person?.username ? (
                <Link href={`/${person.username}`} className="tap-transparent truncate text-sm font-medium">
                  {person.display_name || person.username}
                </Link>
              ) : (
                <span className="truncate text-sm font-medium">{person?.display_name || fallbackLabel}</span>
              )}
              <span className="shrink-0 text-xs text-muted-foreground">
                {isHydrated ? formatTimeAgo(createdAt, locale) ?? "" : ""}
              </span>
            </div>
            <div className="mt-1">
              <StarRating rating={rating} count={0} />
            </div>
            {comment && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{comment}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function buildProfileTabs({
  profile,
  displayName,
  products,
  productCount,
  sellerReviews,
  sellerReviewCount,
  buyerReviews,
  buyerReviewCount,
  isOwnProfile,
  isHydrated,
  locale,
  tProfile,
  signOut,
}: {
  profile: ProfileShape
  displayName: string
  products: ProfileProduct[]
  productCount: number
  sellerReviews: SellerReview[]
  sellerReviewCount: number
  buyerReviews: BuyerReview[]
  buyerReviewCount: number
  isOwnProfile: boolean
  isHydrated: boolean
  locale: string
  tProfile: Translator
  signOut: () => Promise<void>
}): ProfileTab[] {
  return [
    ...(profile.is_seller
      ? [
          {
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
                          image={product.images?.[0] || ""}
                          originalPrice={product.list_price}
                          sellerId={product.seller_id}
                          slug={product.slug}
                          {...(product.condition ? { condition: product.condition } : {})}
                          username={profile.username}
                          sellerName={displayName}
                          sellerAvatarUrl={profile.avatar_url}
                          sellerVerified={Boolean(profile.is_verified_business)}
                          sellerTier={
                            profile.account_type === "business"
                              ? "business"
                              : profile.tier === "premium"
                                ? "premium"
                                : "basic"
                          }
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
          },
        ]
      : []),
    {
      value: "reviews",
      label: tProfile("reviews"),
      count: profile.is_seller ? sellerReviewCount : buyerReviewCount,
      icon: <Star className="size-4" />,
      content: (
        <div className="px-4 py-4">
          {profile.is_seller ? (
            sellerReviews.length > 0 ? (
              <div className="space-y-3">
                {sellerReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    person={review.buyer}
                    fallbackLabel={tProfile("buyer")}
                    createdAt={review.created_at}
                    rating={review.rating}
                    comment={review.comment}
                    isHydrated={isHydrated}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Star className="mx-auto mb-3 size-12" />
                <p>{tProfile("noReviewsYet")}</p>
              </div>
            )
          ) : buyerReviews.length > 0 ? (
            <div className="space-y-3">
              {buyerReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  person={review.seller}
                  fallbackLabel={tProfile("seller")}
                  createdAt={review.created_at}
                  rating={review.rating}
                  comment={review.comment}
                  isHydrated={isHydrated}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Star className="mx-auto mb-3 size-12" />
              <p>{tProfile("noReviewsYet")}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      value: "followers",
      label: tProfile("followers"),
      icon: <Users className="size-4" />,
      content: (
        <div className="space-y-3 pb-4">
          {(profile.follower_count ?? 0) > 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 size-12" />
              <p className="text-sm">
                {tProfile("followersCount", { count: profile.follower_count ?? 0 })}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 size-12" />
              <p>{tProfile("noFollowersYet")}</p>
            </div>
          )}
        </div>
      ),
    },
    ...(isOwnProfile
      ? [
          {
            value: "settings",
            label: tProfile("settings"),
            icon: <Gear className="size-4" />,
            content: <ProfileSettingsPanel isSeller={Boolean(profile.is_seller)} onSignOut={signOut} />,
          },
        ]
      : []),
  ]
}

