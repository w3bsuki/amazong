"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Storefront,
  Star,
  Users,
  Package,
  CheckCircle,
  HeartBreak,
  SpinnerGap,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { unfollowSeller } from "@/app/actions/seller-follows"

function shouldBypassNextImage(src: string) {
  // Next/Image will 400 on remote SVGs (e.g. Dicebear) unless dangerouslyAllowSVG is enabled.
  // For avatars, use plain <img> for SVGs to keep the page console-clean.
  const normalized = src.toLowerCase()
  return normalized.includes("api.dicebear.com") || normalized.includes("/svg") || normalized.endsWith(".svg")
}

// Type matches what page.tsx fetches with joined query
interface FollowedSeller {
  seller_id: string
  created_at: string
  seller: {
    id: string
    store_name: string
    store_slug: string | null
    description: string | null
    verified: boolean | null
    profile: {
      full_name: string | null
      avatar_url: string | null
    } | null
  } | null
  seller_stats: {
    follower_count: number | null
    total_reviews: number | null
    average_rating: number | null
    total_listings: number | null
  } | null
}

interface FollowingContentProps {
  locale: string
  sellers: FollowedSeller[]
  total: number
}

export function FollowingContent({ locale, sellers: initialSellers, total }: FollowingContentProps) {
  const [sellers, setSellers] = useState(initialSellers)
  const [isPending, startTransition] = useTransition()
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null)

  const handleUnfollow = async (sellerId: string) => {
    setUnfollowingId(sellerId)
    
    startTransition(async () => {
      const result = await unfollowSeller(sellerId)
      
      if (result.success) {
        setSellers(prev => prev.filter(s => s.seller_id !== sellerId))
        toast.success(locale === "bg" ? "Спряхте да следвате магазина" : "Unfollowed store")
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка" : "Error"))
      }
      
      setUnfollowingId(null)
    })
  }

  if (sellers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Storefront className="size-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">
            {locale === "bg" ? "Не следвате никой магазин" : "You're not following any stores"}
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
            {locale === "bg" 
              ? "Когато последвате магазин, ще виждате техните нови продукти и оферти тук" 
              : "When you follow a store, you'll see their new products and offers here"}
          </p>
          <Button asChild>
            <Link href={`/${locale}`}>
              {locale === "bg" ? "Разгледай магазини" : "Browse stores"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {locale === "bg" ? "Следвани магазини" : "Following"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === "bg" ? `${total} магазина` : `${total} stores`}
          </p>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((follow) => {
          if (!follow.seller) return null
          
          const seller = follow.seller
          const stats = follow.seller_stats

          return (
            <Card key={follow.seller_id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative size-14 rounded-full overflow-hidden bg-muted shrink-0">
                    {seller.profile?.avatar_url ? (
                      shouldBypassNextImage(seller.profile.avatar_url) ? (
                        <img
                          src={seller.profile.avatar_url}
                          alt={seller.store_name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Image
                          src={seller.profile.avatar_url}
                          alt={seller.store_name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="size-full flex items-center justify-center">
                        <Storefront className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link 
                        href={`/${locale}/seller/${seller.store_slug || seller.id}`}
                        className="font-medium hover:underline truncate"
                      >
                        {seller.store_name}
                      </Link>
                      {seller.verified && (
                        <CheckCircle className="size-4 text-blue-500 shrink-0" weight="fill" />
                      )}
                    </div>
                    
                    {seller.profile?.full_name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {seller.profile.full_name}
                      </p>
                    )}

                    {/* Stats */}
                    {stats && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="size-3.5" weight="fill" />
                          {stats.average_rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {stats.follower_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="size-3.5" />
                          {stats.total_listings || 0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {seller.description && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {seller.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/${locale}/seller/${seller.store_slug || seller.id}`}>
                      <Storefront className="size-4 mr-1.5" />
                      {locale === "bg" ? "Виж магазина" : "View Store"}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnfollow(follow.seller_id)}
                    disabled={isPending && unfollowingId === follow.seller_id}
                  >
                    {isPending && unfollowingId === follow.seller_id ? (
                      <SpinnerGap className="size-4 animate-spin" />
                    ) : (
                      <HeartBreak className="size-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
