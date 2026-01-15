"use client"

import { Heart } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

interface FavoritesCountProps {
  count: number
  className?: string
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format count with K suffix for thousands (1234 → "1.2K")
 */
function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`
  }
  return count.toString()
}

// =============================================================================
// COMPONENT - Vinted-style favorites count
// =============================================================================

/**
 * FavoritesCount - Shows number of users who favorited an item
 * 
 * Displays as: ♡ 24 or ♡ 1.2K
 * Inspired by Vinted's social proof on product cards
 */
function FavoritesCount({ count, className }: FavoritesCountProps) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-2xs text-muted-foreground",
        className
      )}
      aria-label={`${count} favorites`}
    >
      <Heart size={10} weight="fill" className="text-muted-foreground/70" />
      <span className="tabular-nums">{formatCount(count)}</span>
    </span>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { FavoritesCount, formatCount, type FavoritesCountProps }
