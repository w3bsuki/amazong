"use client"

// =============================================================================
// MOBILE TRUST SECTIONS
// =============================================================================
// Safety tips banner and report button for mobile product pages.
// Matches prototype pattern from ListingDetail.tsx.
// =============================================================================

import { Shield, Flag } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface MobileSafetyTipsProps {
  className?: string
}

interface MobileReportButtonProps {
  onReport?: (() => void) | undefined
  className?: string
}

/**
 * Safety Tips Banner
 * Displays marketplace safety guidelines in a highlighted banner.
 */
export function MobileSafetyTips({ className }: MobileSafetyTipsProps) {
  const t = useTranslations("Product")
  
  return (
    <div className={cn(
      "bg-primary-subtle rounded-2xl p-4 flex gap-3",
      className
    )}>
      <Shield className="size-5 text-primary shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium text-foreground text-sm">{t("safety.title")}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {t("safety.description")}
        </p>
      </div>
    </div>
  )
}

/**
 * Report Listing Button
 * Centered action to report suspicious or problematic listings.
 */
export function MobileReportButton({ onReport, className }: MobileReportButtonProps) {
  const t = useTranslations("Product")
  
  return (
    <button 
      onClick={onReport}
      className={cn(
        "flex items-center justify-center gap-2 w-full py-3",
        "text-sm text-muted-foreground",
        "active:text-foreground transition-colors",
        className
      )}
    >
      <Flag className="size-4" />
      {t("report.listing")}
    </button>
  )
}
