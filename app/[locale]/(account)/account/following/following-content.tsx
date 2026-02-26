"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircleCheck as CheckCircle, HeartCrack as HeartBreak, Package, LoaderCircle as SpinnerGap, Star, Store as Storefront, Users } from "lucide-react";
import type { Envelope } from "@/lib/api/envelope"

import { toast } from "sonner"
import { UserAvatar } from "@/components/shared/user-avatar"

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

export type FollowingContentServerActions = {
  unfollowSeller: (
    sellerId: string
  ) => Promise<Envelope<Record<string, never>, { error: string }>>
}

interface FollowingContentProps {
  sellers: FollowedSeller[]
  total: number
  actions: FollowingContentServerActions
}

export function FollowingContent({
  sellers: initialSellers,
  total,
  actions,
}: FollowingContentProps) {
  const t = useTranslations("Account.followingPage")
  const [sellers, setSellers] = useState(initialSellers)
  const [isPending, startTransition] = useTransition()
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null)       

  const handleUnfollow = async (sellerId: string) => {
    setUnfollowingId(sellerId)

    startTransition(async () => {
      const result = await actions.unfollowSeller(sellerId)

      if (result.success) {
        setSellers(prev => prev.filter(s => s.seller_id !== sellerId))
        toast.success(t("toasts.unfollowed"))
      } else {
        toast.error(result.error || t("toasts.error"))
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
            {t("empty.title")}
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
            {t("empty.description")}
          </p>
          <Button asChild>
            <Link href="/">
              {t("empty.cta")}
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
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("count", { count: total })}
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
                  <UserAvatar
                    name={seller.store_name}
                    avatarUrl={seller.profile?.avatar_url ?? null}
                    className="size-14 shrink-0 bg-muted"
                    fallbackClassName="bg-muted text-sm font-semibold"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/seller/${seller.store_slug || seller.id}`}
                        className="font-medium hover:underline truncate"
                      >
                        {seller.store_name}
                      </Link>
                      {seller.verified && (
                        <CheckCircle className="size-4 text-info shrink-0" />
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
                          <Star className="size-3.5" />
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
                    <Link href={`/seller/${seller.store_slug || seller.id}`}>
                      <Storefront className="size-4 mr-1.5" />
                      {t("viewStore")}
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
