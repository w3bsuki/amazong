"use client"

import { useTranslations } from "next-intl"
import { Eye, Heart, Fire } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface ProductSocialProofProps {
  viewCount?: number | null | undefined
  favoritesCount?: number | null | undefined
  showHotIndicator?: boolean
  className?: string
}

/**
 * ProductSocialProof - Shows view count and favorites count on product detail page
 * Similar to OLX/Bazar "X people have viewed this" indicator
 */
export function ProductSocialProof({
  viewCount,
  favoritesCount,
  showHotIndicator = false,
  className,
}: ProductSocialProofProps) {
  const t = useTranslations("ProductSocialProof")

  const hasViewCount = viewCount && viewCount > 0
  const hasFavorites = favoritesCount && favoritesCount > 0
  const isHot = showHotIndicator && viewCount && viewCount > 100

  if (!hasViewCount && !hasFavorites) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 text-sm text-muted-foreground",
        className
      )}
    >
      {/* View count */}
      {hasViewCount && (
        <span className="inline-flex items-center gap-1.5">
          <Eye size={16} className="text-muted-foreground" />
          <span>
            {t("viewCount", { count: viewCount })}
          </span>
        </span>
      )}

      {/* Favorites count */}
      {hasFavorites && (
        <span className="inline-flex items-center gap-1.5">
          <Heart size={16} className="text-favorite" weight="fill" />
          <span>
            {t("favoritesCount", { count: favoritesCount })}
          </span>
        </span>
      )}

      {/* Hot indicator */}
      {isHot && (
        <span className="inline-flex items-center gap-1 rounded-full bg-hot-bg px-2 py-0.5 text-xs font-medium text-hot">
          <Fire size={12} weight="fill" />
          {t("popular")}
        </span>
      )}
    </div>
  )
}
