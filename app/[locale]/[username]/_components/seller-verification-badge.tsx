"use client"

import { Building2 as Buildings, Mail as EnvelopeSimple, IdCard as IdentificationCard, Phone, BadgeCheck as SealCheck } from "lucide-react";

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// =============================================================================
// TYPES
// =============================================================================

interface VerificationLevel {
  emailVerified?: boolean | undefined
  phoneVerified?: boolean | undefined
  idVerified?: boolean | undefined
  isVerifiedBusiness?: boolean | undefined
}

interface SellerVerificationBadgeProps extends VerificationLevel {
  /** Show as compact icon only or expanded with label */
  variant?: "icon" | "badge"
  /** Size of the icon */
  size?: "sm" | "md"
  className?: string
}

// =============================================================================
// HELPERS
// =============================================================================

function getVerificationTier(v: VerificationLevel): number {
  if (v.isVerifiedBusiness) return 4 // Business verified = top tier
  if (v.idVerified) return 3
  if (v.phoneVerified) return 2
  if (v.emailVerified) return 1
  return 0
}

function getVerificationColor(tier: number): string {
  switch (tier) {
    case 4: return "text-verify-business" // Business
    case 3: return "text-verify-id" // ID
    case 2: return "text-verify-phone" // Phone
    case 1: return "text-verify-email" // Email
    default: return "text-muted-foreground"
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * SellerVerificationBadge - Tiered verification indicator
 * 
 * Tiers:
 * - Tier 1: Email verified (✓)
 * - Tier 2: Phone verified (✓✓)
 * - Tier 3: ID verified (✓✓✓)
 * - Tier 4: Verified Business (checkmark + building)
 */
function SellerVerificationBadge({
  emailVerified,
  phoneVerified,
  idVerified,
  isVerifiedBusiness,
  variant = "icon",
  size = "sm",
  className,
}: SellerVerificationBadgeProps) {
  const t = useTranslations("SellerVerification")
  const tier = getVerificationTier({ emailVerified, phoneVerified, idVerified, isVerifiedBusiness })
  
  if (tier === 0) return null

  const iconSize = size === "sm" ? 12 : 16
  const color = getVerificationColor(tier)

  const label =
    (isVerifiedBusiness && t("verifiedBusiness")) ||
    (idVerified && t("idVerified")) ||
    (phoneVerified && t("phoneVerified")) ||
    (emailVerified && t("emailVerified")) ||
    ""

  // Build tooltip content showing all verification levels
  const tooltipContent = (
    <div className="space-y-1 text-xs">
      <div className={cn("flex items-center gap-1.5", emailVerified ? "text-foreground" : "text-muted-foreground opacity-50")}>
        <EnvelopeSimple size={12} />
        <span>{t("email")}</span>
        {emailVerified && <span className="text-muted-foreground">✓</span>}
      </div>
      <div className={cn("flex items-center gap-1.5", phoneVerified ? "text-foreground" : "text-muted-foreground opacity-50")}>
        <Phone size={12} />
        <span>{t("phone")}</span>
        {phoneVerified && <span className="text-muted-foreground">✓</span>}
      </div>
      <div className={cn("flex items-center gap-1.5", idVerified ? "text-foreground" : "text-muted-foreground opacity-50")}>
        <IdentificationCard size={12} />
        <span>{t("id")}</span>
        {idVerified && <span className="text-muted-foreground">✓</span>}
      </div>
      {isVerifiedBusiness && (
        <div className="flex items-center gap-1.5 text-verify-business font-medium pt-1 border-t border-border">
          <Buildings size={12} />
          <span>{t("verifiedBusiness")}</span>
        </div>
      )}
    </div>
  )

  if (variant === "badge") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-2xs font-medium",
            tier === 4 && "bg-muted text-verify-business",
            tier === 3 && "bg-muted text-verify-id",
            tier === 2 && "bg-muted text-verify-phone",
            tier === 1 && "bg-muted text-verify-email",
            className
          )}>
            <SealCheck size={iconSize} />
            <span>{label}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-2">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    )
  }

  // Icon variant - just the checkmark(s)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("inline-flex items-center shrink-0", color, className)}>
          {tier >= 4 ? (
            // Business: Building icon
            <Buildings size={iconSize} />
          ) : (
            // Personal: 1-3 checkmarks based on tier
            <>
              <SealCheck size={iconSize} />
              {tier >= 2 && <SealCheck size={iconSize} className="-ml-1" />}
              {tier >= 3 && <SealCheck size={iconSize} className="-ml-1" />}
            </>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-2">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { 
  SellerVerificationBadge, 
  getVerificationTier, 
  type SellerVerificationBadgeProps,
  type VerificationLevel 
}
