"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { CheckCircle, Star, CaretRight as ChevronRight } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ContactSellerButton } from "@/components/seller/contact-seller-button"
import { FollowSellerButton } from "@/components/seller/follow-seller-button"
import { formatPrice } from "@/lib/format-price"

interface SellerData {
  id: string
  store_name: string
  store_slug?: string
  avatar_url?: string | null
  verified: boolean
  positive_feedback_percentage: number | null
  total_items_sold: number | null
  feedback_score: number | null
  feedback_count: number | null
  member_since?: string
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
      <div className="flex items-center gap-3 px-4 py-2.5 bg-background border-b lg:border lg:rounded-md lg:mb-4 border-border">
        <Link 
          href={`/${seller.store_slug || seller.id}`}
          className="flex items-center gap-2.5 flex-1 min-w-0"
        >
          <Avatar className="size-9 border border-border rounded-md shrink-0">
            <AvatarImage src={seller.avatar_url || undefined} alt={seller.store_name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold rounded-md">
              {seller.store_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground text-sm truncate tracking-tight">{seller.store_name}</span>
              {seller.verified && (
                <CheckCircle className="size-3.5 text-verified shrink-0" weight="fill" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              {seller.positive_feedback_percentage !== null && (
                <>
                  <span className="text-success font-bold">{seller.positive_feedback_percentage}% {t.positivePercentage}</span>
                  {seller.feedback_score !== null && (
                    <span className="opacity-60">({seller.feedback_score})</span>
                  )}
                </>
              )}
            </div>
          </div>
        </Link>
        <Link 
          href={`/${seller.store_slug || seller.id}`}
          className="shrink-0 px-3 py-1.5 text-[11px] font-bold text-primary border border-primary/20 rounded-md hover:bg-primary/5 transition-colors uppercase tracking-wider"
        >
          {t.viewStore}
        </Link>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="p-3 bg-background rounded-md border border-border">
        <Link 
          href={`/${seller.store_slug || seller.id}`}
          className="flex items-center gap-3 group"
        >
          <Avatar className="size-10 border border-border bg-muted shrink-0 rounded-md">
            <AvatarImage src={seller.avatar_url || undefined} alt={seller.store_name} />
            <AvatarFallback className="text-muted-foreground text-sm font-bold rounded-md">
              {seller.store_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {seller.store_name}
              </span>
              {seller.verified && (
                <CheckCircle className="size-3.5 text-verified" weight="fill" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              {seller.positive_feedback_percentage !== null && (
                <>
                  <span className="text-success font-bold">{seller.positive_feedback_percentage}% {t.positivePercentage}</span>
                  {seller.total_items_sold !== null && (
                    <>
                      <span className="opacity-40">·</span>
                      <span>{(seller.total_items_sold / 1000).toFixed(0)}K {t.sold}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </Link>
      </div>
    )
  }

  // Full variant - Redesigned for perfect UI/UX (eBay/Amazon style)
  return (
    <div className="bg-seller-card border border-seller-card-border rounded-md p-5 space-y-5">
      <div className="flex items-start gap-4">
        <Link href={`/${seller.store_slug || seller.id}`} className="shrink-0">
          <Avatar className="size-14 border border-border rounded-md">
            <AvatarImage src={seller.avatar_url || undefined} alt={seller.store_name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xl font-bold rounded-md">
              {seller.store_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href={`/${seller.store_slug || seller.id}`}
              className="font-bold text-lg text-foreground truncate hover:text-primary"
            >
              {seller.store_name}
            </Link>
            {seller.verified && (
              <CheckCircle className="size-5 text-verified" weight="fill" />
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {seller.positive_feedback_percentage !== null ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="size-3.5 fill-rating text-rating"
                      weight="fill"
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-success">
                  {seller.positive_feedback_percentage}% {t.positivePercentage}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  ({seller.feedback_score || 0})
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">{t.noRatingsYet}</span>
            )}
            
            {seller.total_items_sold !== null && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-bold">{(seller.total_items_sold / 1000).toFixed(0)}K+</span> {t.sold}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <ContactSellerButton
          sellerId={seller.id}
          productId={productId}
          productTitle={productTitle}
          variant="outline"
          size="sm"
          className="w-full rounded-md font-bold text-[11px] h-9 uppercase tracking-wider border-border"
          showIcon={true}
          showLabel={true}
        />
        {currentUserId && currentUserId !== seller.id && (
          <FollowSellerButton
            sellerId={seller.id}
            initialIsFollowing={isFollowing}
            locale={locale}
            size="sm"
            showLabel={true}
            className="w-full rounded-md h-9 font-bold text-[11px] uppercase tracking-wider border-border"
          />
        )}
        <Button size="sm" asChild className="w-full rounded-md h-9 font-bold text-[11px] uppercase tracking-wider bg-cta-trust-blue text-cta-trust-blue-text hover:bg-cta-trust-blue-hover border-none">
          <Link href={`/${seller.store_slug || seller.id}`}>
            {t.viewStore}
          </Link>
        </Button>
      </div>
      
      {seller.member_since && (
        <div className="pt-4 border-t border-border flex items-center justify-between text-2xs text-muted-foreground font-medium uppercase tracking-widest">
          <span>{locale === 'bg' ? 'Член от' : 'Member since'} {seller.member_since}</span>
          <Link href={`/${seller.store_slug || seller.id}`} className="text-primary hover:underline">
            {t.viewAllItems} →
          </Link>
        </div>
      )}
    </div>
  )
}
