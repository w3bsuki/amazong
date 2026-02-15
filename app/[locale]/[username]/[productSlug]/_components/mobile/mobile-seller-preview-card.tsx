"use client"

// =============================================================================
// MOBILE SELLER PREVIEW CARD
// =============================================================================
// Compact inline seller card for the product page.
// Shows: Avatar, Name, Verified badge, Rating, Response time, Stats row,
// and "View Profile" button that opens seller drawer.
// =============================================================================

import { Star } from "lucide-react"
import { CheckCircle } from "@/lib/icons/phosphor"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface MobileSellerPreviewCardProps {
  seller: {
    id: string
    name: string
    username?: string | null
    avatarUrl?: string | null
    verified?: boolean
    rating?: number | null
    reviewCount?: number | null
    responseTimeHours?: number | null
    listingsCount?: number | null
    totalSales?: number | null
    joinedYear?: string | null
  }
  /** Callback when View Profile button is clicked */
  onViewProfile?: (() => void) | undefined
  className?: string
}

export function MobileSellerPreviewCard({
  seller,
  onViewProfile,
  className,
}: MobileSellerPreviewCardProps) {
  const t = useTranslations("Product")
  
  // Response time label
  const getResponseLabel = () => {
    if (seller.responseTimeHours == null) return null
    if (seller.responseTimeHours <= 1) {
      return t("seller.respondsWithinHour")
    }
    return t("seller.respondsWithinHours", { hours: Math.round(seller.responseTimeHours) })
  }
  
  const responseLabel = getResponseLabel()

  return (
    <div 
      className={cn(
        "bg-card rounded-2xl border border-border p-4",
        className
      )}
    >
      {/* Top row: Avatar + Info */}
      <div className="flex items-start gap-3">
        <UserAvatar
          name={seller.name}
          avatarUrl={seller.avatarUrl ?? null}
          size="lg"
          className="size-14 shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-foreground truncate">{seller.name}</h3>
            {seller.verified && (
              <CheckCircle weight="fill" className="size-4 text-primary shrink-0" />
            )}
          </div>
          
          {seller.rating != null && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="size-3.5 text-warning fill-warning" />
              <span className="text-sm font-medium text-foreground">{seller.rating.toFixed(1)}</span>
              {seller.reviewCount != null && (
                <span className="text-sm text-muted-foreground">
                  ({seller.reviewCount} {t("seller.reviews")})
                </span>
              )}
            </div>
          )}
          
          {responseLabel && (
            <p className="text-xs text-muted-foreground mt-1">{responseLabel}</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-sm">
        {seller.listingsCount != null && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.listingsCount}</p>
            <p className="text-xs text-muted-foreground">{t("seller.listings")}</p>
          </div>
        )}
        {seller.reviewCount != null && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.reviewCount}</p>
            <p className="text-xs text-muted-foreground">{t("seller.reviews")}</p>
          </div>
        )}
        {seller.joinedYear && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.joinedYear}</p>
            <p className="text-xs text-muted-foreground">{t("seller.memberSince")}</p>
          </div>
        )}
        
        <Button
          variant="default"
          size="sm"
          className="ml-auto"
          onClick={onViewProfile}
        >
          {t("seller.viewProfile")}
        </Button>
      </div>
    </div>
  )
}
