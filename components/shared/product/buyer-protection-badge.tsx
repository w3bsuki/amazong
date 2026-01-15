"use client"

import { ShieldCheck } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

interface BuyerProtectionBadgeProps {
  /** Compact inline badge for product cards, full for detail pages */
  variant?: "inline" | "full"
  className?: string
}

// =============================================================================
// COMPONENT - Vinted-inspired Buyer Protection Badge
// =============================================================================

/**
 * BuyerProtectionBadge - Trust indicator for product cards
 * 
 * Inline variant: Small shield icon + "Protected" text for cards
 * Full variant: Shield icon + title + description for detail pages
 */
function BuyerProtectionBadge({
  variant = "inline",
  className,
}: BuyerProtectionBadgeProps) {
  const t = useTranslations("Product")

  if (variant === "full") {
    return (
      <div className={cn("flex items-start gap-2 p-3 rounded-md bg-trust/5 border border-trust/20", className)}>
        <ShieldCheck size={18} weight="fill" className="text-trust shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-trust">
            {t("buyerProtectionBadgeTitle")}
          </p>
          <p className="text-2xs text-muted-foreground leading-snug mt-0.5">
            {t("buyerProtectionBadgeSubtitle")}
          </p>
        </div>
      </div>
    )
  }

  // Inline variant for product cards
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-2xs text-trust",
      className
    )}>
      <ShieldCheck size={12} weight="fill" className="shrink-0" />
      <span className="font-medium">{t("buyerProtectionInline")}</span>
    </span>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { BuyerProtectionBadge, type BuyerProtectionBadgeProps }
