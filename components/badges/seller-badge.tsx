/**
 * Seller Badge Component
 * Displays badges on seller profiles and product cards
 */

"use client"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { DisplayBadge } from "@/lib/types/badges"
import { BADGE_COLORS } from "@/lib/badges"

interface SellerBadgeProps {
  badge: DisplayBadge
  size?: "xs" | "sm" | "md" | "lg"
  showTooltip?: boolean
  showLabel?: boolean
  className?: string
}

const sizeClasses = {
  xs: "h-4 px-1 text-[9px] gap-0.5",
  sm: "h-5 px-1.5 text-[10px] gap-0.5",
  md: "h-6 px-2 text-xs gap-1",
  lg: "h-7 px-3 text-sm gap-1.5",
}

const iconSizes = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export function SellerBadge({
  badge,
  size = "md",
  showTooltip = true,
  showLabel = true,
  className,
}: SellerBadgeProps) {
  const color = badge.color || BADGE_COLORS[badge.code] || "bg-gray-500 text-white"
  
  const badgeElement = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap",
        sizeClasses[size],
        color,
        className
      )}
    >
      <span className={iconSizes[size]}>{badge.icon}</span>
      {showLabel && <span>{badge.name}</span>}
    </span>
  )
  
  if (!showTooltip) {
    return badgeElement
  }
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="font-semibold">{badge.name}</p>
          {badge.description && (
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =====================================================
// Badge Group Component
// =====================================================

interface SellerBadgeGroupProps {
  badges: DisplayBadge[]
  size?: "xs" | "sm" | "md" | "lg"
  maxDisplay?: number
  showTooltip?: boolean
  showLabel?: boolean
  className?: string
  locale?: "en" | "bg"
}

export function SellerBadgeGroup({
  badges,
  size = "sm",
  maxDisplay = 3,
  showTooltip = true,
  showLabel = true,
  className,
  locale: _locale = "en",
}: SellerBadgeGroupProps) {
  // locale prop available for future i18n of badge names
  void _locale
  if (!badges.length) return null
  
  const displayBadges = badges.slice(0, maxDisplay)
  const remainingCount = badges.length - maxDisplay
  
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {displayBadges.map((badge) => (
        <SellerBadge
          key={badge.code}
          badge={badge}
          size={size}
          showTooltip={showTooltip}
          showLabel={showLabel}
        />
      ))}
      {remainingCount > 0 && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full font-medium bg-muted text-muted-foreground",
                  sizeClasses[size]
                )}
              >
                +{remainingCount}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="space-y-1">
                {badges.slice(maxDisplay).map((badge) => (
                  <div key={badge.code} className="flex items-center gap-1.5">
                    <span>{badge.icon}</span>
                    <span className="text-sm">{badge.name}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// =====================================================
// Verification Badge (Special styling)
// =====================================================

interface VerificationBadgeProps {
  level: "basic" | "verified" | "pro" | "enterprise"
  accountType: "personal" | "business"
  size?: "xs" | "sm" | "md" | "lg"
  showTooltip?: boolean
  locale?: "en" | "bg"
  className?: string
}

const verificationConfig = {
  personal: {
    basic: {
      icon: "✓",
      color: "bg-gray-400 text-white",
      name: { en: "Basic", bg: "Базов" },
      description: { en: "Email verified", bg: "Верифициран имейл" },
    },
    verified: {
      icon: "✓",
      color: "bg-blue-500 text-white",
      name: { en: "Verified", bg: "Верифициран" },
      description: { en: "Email & phone verified", bg: "Верифициран имейл и телефон" },
    },
    pro: {
      icon: "✓✓",
      color: "bg-emerald-500 text-white",
      name: { en: "Fully Verified", bg: "Напълно Верифициран" },
      description: { en: "ID verified seller", bg: "Верифицирана самоличност" },
    },
    enterprise: {
      icon: "✓✓✓",
      color: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
      name: { en: "Premium Verified", bg: "Премиум Верифициран" },
      description: { en: "All verifications complete", bg: "Всички верификации завършени" },
    },
  },
  business: {
    basic: {
      icon: "🏢",
      color: "bg-gray-500 text-white",
      name: { en: "Business", bg: "Бизнес" },
      description: { en: "Registered business", bg: "Регистриран бизнес" },
    },
    verified: {
      icon: "✓",
      color: "bg-blue-600 text-white",
      name: { en: "Verified Business", bg: "Верифициран Бизнес" },
      description: { en: "VAT/EIK verified", bg: "Верифициран ДДС/ЕИК" },
    },
    pro: {
      icon: "✓✓",
      color: "bg-emerald-600 text-white",
      name: { en: "Verified Pro", bg: "Верифициран Про" },
      description: { en: "Full document verification", bg: "Пълна документална верификация" },
    },
    enterprise: {
      icon: "✓✓✓",
      color: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
      name: { en: "Verified Enterprise", bg: "Верифициран Ентърпрайз" },
      description: { en: "Premium verified business", bg: "Премиум верифициран бизнес" },
    },
  },
}

export function VerificationBadge({
  level,
  accountType,
  size = "md",
  showTooltip = true,
  locale = "en",
  className,
}: VerificationBadgeProps) {
  const config = verificationConfig[accountType][level]
  
  const badgeElement = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap",
        sizeClasses[size],
        config.color,
        className
      )}
    >
      <span className={iconSizes[size]}>{config.icon}</span>
      <span>{config.name[locale]}</span>
    </span>
  )
  
  if (!showTooltip) {
    return badgeElement
  }
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-semibold">{config.name[locale]}</p>
          <p className="text-xs text-muted-foreground">{config.description[locale]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =====================================================
// Mini Badge for Product Cards
// =====================================================

interface MiniBadgeProps {
  badge: DisplayBadge
  className?: string
}

export function MiniBadge({ badge, className }: MiniBadgeProps) {
  const color = badge.color || BADGE_COLORS[badge.code] || "bg-gray-500 text-white"
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px]",
              color,
              className
            )}
          >
            {badge.icon}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-semibold">{badge.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function MiniBadgeGroup({
  badges,
  maxDisplay = 2,
  className,
}: {
  badges: DisplayBadge[]
  maxDisplay?: number
  className?: string
}) {
  if (!badges.length) return null
  
  const displayBadges = badges.slice(0, maxDisplay)
  
  return (
    <div className={cn("flex items-center -space-x-1", className)}>
      {displayBadges.map((badge) => (
        <MiniBadge key={badge.code} badge={badge} />
      ))}
    </div>
  )
}
