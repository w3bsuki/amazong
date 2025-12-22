"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Star, CaretRight as ChevronRight } from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ContactSellerButton } from "@/components/seller/contact-seller-button"
import { FollowSellerButton } from "@/components/seller/follow-seller-button"
import { formatPrice } from "@/lib/format-price"

interface SellerData {
  id: string
  store_name: string
  store_slug?: string
  verified: boolean
  positive_feedback_percentage: number | null
  total_items_sold: number | null
  feedback_score: number | null
  feedback_count: number | null
  ratings: {
    accuracy: number
    shipping_cost: number
    shipping_speed: number
    communication: number
  } | null
}

interface SellerInfoCardProps {
  seller: SellerData
  productId: string
  productTitle: string
  productPrice: number
  productImages: string[]
  variant: 'banner' | 'compact' | 'full'
  locale: string
  isFollowing?: boolean
  currentUserId?: string | null
  t: {
    viewStore: string
    sold: string
    positivePercentage: string
    moreFrom: string
    similarProduct: string
    viewAllItems: string
    detailedSellerRatings: string
    averageLast12Months: string
    accurateDescription: string
    reasonableShippingCost: string
    shippingSpeed: string
    communication: string
    noRatingsYet: string
  }
}

export function SellerInfoCard({
  seller,
  productId,
  productTitle,
  productPrice,
  productImages,
  variant,
  locale,
  isFollowing = false,
  currentUserId,
  t,
}: SellerInfoCardProps) {
  if (variant === 'banner') {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-cta-trust-blue -mx-4 lg:mx-0 lg:mb-4 lg:rounded-lg lg:px-5 lg:py-3">
        <Link 
          href={`/${locale}/${seller.store_slug || seller.id}`}
          className="flex items-center gap-2.5 flex-1 min-w-0"
        >
          <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border border-white/20 bg-white/10 shrink-0">
            <AvatarFallback className="bg-white/20 text-cta-trust-blue-text text-sm font-semibold">
              {seller.store_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-cta-trust-blue-text truncate">{seller.store_name}</span>
              {seller.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" weight="fill" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-cta-trust-blue-text/80">
              {seller.positive_feedback_percentage !== null && (
                <>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-amber-300 text-amber-300" weight="fill" />
                    ))}
                  </div>
                  <span>{seller.positive_feedback_percentage}%</span>
                  {seller.feedback_score !== null && (
                    <>
                      <span>·</span>
                      <span>({seller.feedback_score})</span>
                    </>
                  )}
                  {seller.total_items_sold !== null && (
                    <>
                      <span className="hidden lg:inline">·</span>
                      <span className="hidden lg:inline">{(seller.total_items_sold / 1000).toFixed(0)}K {t.sold}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Link>
        <Link 
          href={`/${locale}/${seller.store_slug || seller.id}`}
          className="shrink-0 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-cta-trust-blue bg-white rounded-full hover:bg-white/90 active:bg-white/80 transition-colors"
        >
          {t.viewStore}
        </Link>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50">
        <Link 
          href={`/${locale}/${seller.store_slug || seller.id}`}
          className="flex items-center gap-3 group"
        >
          <Avatar className="h-10 w-10 border bg-background shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {seller.store_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary group-hover:underline text-base">
                {seller.store_name}
              </span>
              {seller.verified && (
                <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {seller.positive_feedback_percentage !== null && (
                <>
                  <span>{seller.positive_feedback_percentage}% {t.positivePercentage}</span>
                  {seller.total_items_sold !== null && (
                    <>
                      <span>·</span>
                      <span>{(seller.total_items_sold / 1000).toFixed(0)}K {t.sold}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </Link>
      </div>
    )
  }

  // Full variant
  return (
    <div className="bg-seller-card border border-seller-card-border rounded-lg p-4 space-y-3 h-fit">
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Link 
            href={`/${locale}/${seller.store_slug || seller.id}`}
            className="flex items-center gap-3 group"
          >
            <Avatar className="h-11 w-11 border bg-background shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                {seller.store_name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary group-hover:underline truncate">
                  {seller.store_name}
                </span>
                {seller.feedback_score !== null && (
                  <span className="text-muted-foreground text-sm shrink-0">({seller.feedback_score})</span>
                )}
              </div>
              {seller.positive_feedback_percentage !== null && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        weight="fill"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {seller.positive_feedback_percentage}%
                  </span>
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-72 p-0" sideOffset={8}>
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium">
              {t.moreFrom} {seller.store_name}
            </p>
          </div>
          <div className="p-2 space-y-1">
            {productImages.slice(0, 3).map((img, idx) => {
              const priceMultiplier = [0.85, 1.1, 0.95][idx] || 1
              return (
                <Link
                  key={idx}
                  href={`/${locale}/${seller.store_slug || seller.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="w-12 h-12 border rounded bg-white shrink-0 overflow-hidden">
                    <Image src={img} alt="" width={48} height={48} className="object-contain w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {t.similarProduct} #{idx + 1}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(productPrice * priceMultiplier, { locale })}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="p-2 border-t border-border">
            <Link
              href={`/${locale}/${seller.store_slug || seller.id}`}
              className="block text-center text-sm text-primary hover:underline py-1"
            >
              {t.viewAllItems} →
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex gap-2">
        <ContactSellerButton
          sellerId={seller.id}
          productId={productId}
          productTitle={productTitle}
          variant="outline"
          size="sm"
          className="flex-1 rounded-full"
          showIcon={true}
          showLabel={true}
        />
        {currentUserId && currentUserId !== seller.id && (
          <FollowSellerButton
            sellerId={seller.id}
            initialIsFollowing={isFollowing}
            locale={locale}
            size="sm"
            showLabel={false}
            className="rounded-full"
          />
        )}
      </div>

      {/* Detailed Ratings */}
      <div className="pt-3 border-t border-border">
        <h3 className="font-semibold text-sm mb-2">
          {t.detailedSellerRatings}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          {t.averageLast12Months}
        </p>
        {seller.ratings ? (
          <div className="space-y-2">
            {[
              { label: t.accurateDescription, value: seller.ratings.accuracy },
              { label: t.reasonableShippingCost, value: seller.ratings.shipping_cost },
              { label: t.shippingSpeed, value: seller.ratings.shipping_speed },
              { label: t.communication, value: seller.ratings.communication },
            ].map((rating) => (
              <div key={rating.label} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground flex-1">{rating.label}</span>
                <Progress 
                  value={(rating.value / 5) * 100} 
                  className="h-2 w-20"
                  aria-label={`${rating.label}: ${rating.value} out of 5`}
                />
                <span className="text-sm font-medium w-8 text-right">{rating.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">{t.noRatingsYet}</p>
        )}
      </div>
    </div>
  )
}
