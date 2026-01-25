"use client"

import * as React from "react"
import { SealCheck, Buildings } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn, safeAvatarSrc } from "@/lib/utils"
import BoringAvatar from "boring-avatars"
import { AVATAR_VARIANTS, COLOR_PALETTES, type AvatarVariant } from "@/lib/avatar-palettes"

// =============================================================================
// TYPES
// =============================================================================

export type VerifiedAvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface VerificationStatus {
  emailVerified?: boolean | undefined
  phoneVerified?: boolean | undefined
  idVerified?: boolean | undefined
  isVerifiedBusiness?: boolean | undefined
}

export interface VerifiedAvatarProps extends VerificationStatus {
  name: string
  avatarUrl?: string | null
  size?: VerifiedAvatarSize
  alt?: string
  className?: string
  /** Show verification ring around avatar */
  showRing?: boolean
  /** Tooltip text (auto-generated if not provided) */
  tooltipLabel?: string
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const SIZE_CLASSES: Record<VerifiedAvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
}

const BADGE_SIZE: Record<VerifiedAvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
}

const BADGE_POSITION: Record<VerifiedAvatarSize, string> = {
  xs: "-bottom-0.5 -right-0.5",
  sm: "-bottom-0.5 -right-0.5",
  md: "-bottom-1 -right-1",
  lg: "-bottom-1 -right-1",
  xl: "-bottom-1.5 -right-1.5",
}

// =============================================================================
// HELPERS
// =============================================================================

function getVerificationTier(v: VerificationStatus): number {
  if (v.isVerifiedBusiness === true) return 4
  if (v.idVerified === true) return 3
  if (v.phoneVerified === true) return 2
  if (v.emailVerified === true) return 1
  return 0
}

function getRingColor(tier: number): string {
  switch (tier) {
    case 4: return "ring-verify-business"
    case 3: return "ring-verify-id"
    case 2: return "ring-verify-phone"
    case 1: return "ring-verify-email"
    default: return ""
  }
}

function getBadgeColor(tier: number): string {
  switch (tier) {
    case 4: return "text-verify-business"
    case 3: return "text-verify-id"
    case 2: return "text-verify-phone"
    case 1: return "text-verify-email"
    default: return "text-muted-foreground"
  }
}

type ParsedBoringAvatar = {
  variant: AvatarVariant
  colors: string[]
  name: string
}

function parseBoringAvatar(
  value: string | null | undefined,
  fallbackName: string
): ParsedBoringAvatar | null {
  if (!value || !value.startsWith("boring-avatar:")) return null
  const [, variantRaw, paletteRaw, seedRaw] = value.split(":")

  const variant = AVATAR_VARIANTS.includes(variantRaw as AvatarVariant)
    ? (variantRaw as AvatarVariant)
    : AVATAR_VARIANTS[0]

  const paletteIndex = Number.parseInt(paletteRaw || "0", 10)
  const colors =
    COLOR_PALETTES[Number.isNaN(paletteIndex) ? 0 : paletteIndex] ?? COLOR_PALETTES[0] ?? []

  return { variant, colors, name: seedRaw || fallbackName || "user" }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0]?.[0] ?? ""
  const second = parts.length > 1 ? parts[1]?.[0] ?? "" : parts[0]?.[1] ?? ""
  return (first + second).toUpperCase() || "?"
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * VerifiedAvatar - Avatar with verification badge overlay
 * 
 * Like Twitter's verified checkmark on profile pictures.
 * Badge appears in bottom-right corner of avatar.
 * 
 * Tiers:
 * - Tier 1: Email verified (blue check)
 * - Tier 2: Phone verified (green check)
 * - Tier 3: ID verified (gold check)
 * - Tier 4: Verified Business (building icon)
 */
export function VerifiedAvatar({
  name,
  avatarUrl,
  size = "md",
  alt,
  className,
  showRing = false,
  tooltipLabel,
  emailVerified,
  phoneVerified,
  idVerified,
  isVerifiedBusiness,
}: VerifiedAvatarProps) {
  const tier = getVerificationTier({ emailVerified, phoneVerified, idVerified, isVerifiedBusiness })
  const boringAvatar = parseBoringAvatar(avatarUrl, name)
  const src = boringAvatar ? undefined : safeAvatarSrc(avatarUrl)
  const label = alt ?? name

  const defaultTooltip = 
    (isVerifiedBusiness && "Verified Business") ||
    (idVerified && "ID Verified") ||
    (phoneVerified && "Phone Verified") ||
    (emailVerified && "Verified") ||
    ""

  const badge = tier > 0 && (
    <span
      className={cn(
        "absolute flex items-center justify-center",
        "rounded-full bg-background",
        "ring-2 ring-background",
        BADGE_POSITION[size],
        getBadgeColor(tier)
      )}
    >
      {tier === 4 ? (
        <Buildings size={BADGE_SIZE[size]} weight="fill" />
      ) : (
        <SealCheck size={BADGE_SIZE[size]} weight="fill" />
      )}
    </span>
  )

  const avatarElement = (
    <div className={cn("relative inline-flex", className)}>
      <Avatar
        className={cn(
          SIZE_CLASSES[size],
          showRing && tier > 0 && "ring-2",
          showRing && getRingColor(tier)
        )}
      >
        {src ? <AvatarImage src={src} alt={label} /> : null}
        {boringAvatar ? (
          <AvatarFallback className="bg-transparent p-0">
            <BoringAvatar
              size={80}
              name={boringAvatar.name}
              variant={boringAvatar.variant}
              colors={boringAvatar.colors}
              className="size-full"
            />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="text-sm font-semibold bg-muted">
            {initialsFromName(name)}
          </AvatarFallback>
        )}
      </Avatar>
      {badge}
    </div>
  )

  // Wrap in tooltip if verified
  if (tier > 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {avatarElement}
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {tooltipLabel || defaultTooltip}
        </TooltipContent>
      </Tooltip>
    )
  }

  return avatarElement
}
