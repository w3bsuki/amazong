"use client"

import { CaretRight, CheckCircle, Star } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, safeAvatarSrc } from "@/lib/utils"

interface QuickViewSellerCardProps {
  sellerName?: string | null | undefined
  sellerAvatarUrl?: string | null | undefined
  sellerVerified?: boolean | undefined
  /** Product rating to show in compact mode */
  rating?: number | undefined
  /** Review count */
  reviews?: number | undefined
  /** New: granular verification levels */
  emailVerified?: boolean | undefined
  phoneVerified?: boolean | undefined
  idVerified?: boolean | undefined
  isVerifiedBusiness?: boolean | undefined
  onNavigateToProduct: () => void
  /** Use compact inline layout for mobile */
  compact?: boolean
}

export function QuickViewSellerCard({
  sellerName,
  sellerAvatarUrl,
  sellerVerified,
  rating,
  reviews,
  emailVerified,
  phoneVerified,
  idVerified,
  isVerifiedBusiness,
  onNavigateToProduct,
  compact = false,
}: QuickViewSellerCardProps) {
  const tProduct = useTranslations("Product")
  
  const hasVerification = emailVerified || phoneVerified || idVerified || isVerifiedBusiness || sellerVerified
  const safeSellerName = sellerName ?? tProduct("seller")
  const hasRating = typeof rating === "number" && rating > 0
  const avatarSrc = safeAvatarSrc(sellerAvatarUrl)

  return (
    <button
      type="button"
      onClick={onNavigateToProduct}
      className={cn(
        "w-full rounded-xl border border-border bg-card text-left transition-colors",
        compact ? "p-2.5" : "p-3",
        "hover:bg-hover active:bg-active",
        "focus-visible:ring-2 focus-visible:ring-focus-ring"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={safeSellerName} /> : null}
          <AvatarFallback className="text-sm font-semibold">
            {(safeSellerName.trim()[0] ?? "?").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">{safeSellerName}</p>
            <CaretRight size={18} className="shrink-0 text-muted-foreground" />
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {hasVerification && (
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={12} weight="fill" />
                {tProduct("verifiedSeller")}
              </span>
            )}
            {hasRating && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star size={12} weight="fill" className="text-muted-foreground" />
                <span>{rating.toFixed(1)}</span>
                {typeof reviews === "number" && reviews > 0 ? <span>({reviews})</span> : null}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
