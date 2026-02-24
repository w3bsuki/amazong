import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { Calendar, CheckCircle2, Sparkles, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { SellerProfileData } from "./seller-profile-drawer.types"

function isNewSeller(seller: SellerProfileData): boolean {
  return (seller.totalSales ?? 0) === 0 || (seller.positivePercent ?? 0) === 0
}

export function SellerHeader({ seller }: { seller: SellerProfileData }) {
  const t = useTranslations("Product")
  const tVerif = useTranslations("SellerVerification")
  const showNewSellerBadge = isNewSeller(seller)

  return (
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <UserAvatar
          name={seller.name}
          avatarUrl={seller.avatarUrl}
          size="xl"
          className="size-16"
        />
        {seller.verified ? (
          <span className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full ring-2 ring-background flex items-center justify-center">
            <CheckCircle2 className="size-3 text-primary-foreground" fill="currentColor" />
          </span>
        ) : null}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h2 className="text-base font-bold text-foreground truncate">{seller.name}</h2>
          {seller.verified ? (
            <MarketplaceBadge variant="verified-personal" className="shrink-0 text-2xs px-1.5 py-0">
              {t("verified")}
            </MarketplaceBadge>
          ) : null}
          {showNewSellerBadge ? (
            <Badge variant="secondary" className="shrink-0 text-2xs px-1.5 py-0 gap-1">
              <Sparkles className="size-2.5" />
              {tVerif("newSeller")}
            </Badge>
          ) : null}
        </div>
        {seller.username ? (
          <p className="text-sm text-muted-foreground">@{seller.username}</p>
        ) : null}
        {seller.rating != null && seller.rating > 0 ? (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="size-3.5 fill-warning text-warning" />
            <span className="text-sm font-semibold text-foreground">{seller.rating.toFixed(1)}</span>
            {seller.reviewCount != null && seller.reviewCount > 0 ? (
              <span className="text-xs text-muted-foreground">({seller.reviewCount})</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function SellerStats({ seller }: { seller: SellerProfileData }) {
  const t = useTranslations("Seller")
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const joinedText = mounted && seller.joinedAt
    ? formatDistanceToNow(new Date(seller.joinedAt), {
        addSuffix: false,
        locale: locale === "bg" ? bg : enUS,
      })
    : seller.joinedYear ?? null

  const isNew = isNewSeller(seller)

  return (
    <div className="rounded-xl bg-muted px-3 py-2.5 space-y-1.5">
      <div className="flex items-center gap-4 text-sm">
        {seller.listingsCount != null && seller.listingsCount > 0 ? (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.listingsCount}</p>
            <p className="text-xs text-muted-foreground">{t("listings")}</p>
          </div>
        ) : null}
        {seller.totalSales != null && seller.totalSales > 0 ? (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.totalSales}</p>
            <p className="text-xs text-muted-foreground">{t("itemsSold")}</p>
          </div>
        ) : null}
        {!isNew && seller.positivePercent != null ? (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.positivePercent}%</p>
            <p className="text-xs text-muted-foreground">{t("positive")}</p>
          </div>
        ) : null}
        {seller.responseTimeHours != null && seller.responseTimeHours > 0 ? (
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {seller.responseTimeHours <= 1 ? "<1h" : `${Math.round(seller.responseTimeHours)}h`}
            </p>
            <p className="text-xs text-muted-foreground">{t("response")}</p>
          </div>
        ) : null}
      </div>

      {joinedText ? (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border-subtle">
          <Calendar className="size-3" strokeWidth={1.5} />
          <span>{t("memberSince", { date: joinedText })}</span>
        </div>
      ) : null}
    </div>
  )
}

export function SellerBio({ bio }: { bio: string | null | undefined }) {
  const t = useTranslations("Seller")

  if (!bio) return null

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("aboutThisSeller")}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
    </div>
  )
}
