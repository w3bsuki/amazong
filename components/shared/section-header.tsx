"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ArrowRight } from "@phosphor-icons/react"

// =============================================================================
// SectionHeader - Professional marketplace section title component
// 
// Design system compliant:
// - Uses semantic tokens (text-body, text-compact, text-muted-foreground)
// - No arbitrary values or opacity modifiers
// - Proper touch targets (min-h-touch-sm)
// - Icon slot for category/section icons
// =============================================================================

export interface SectionHeaderProps {
  /** Section title text */
  title: string
  /** Optional icon element (e.g., Fire, Tag, TShirt icons) */
  icon?: React.ReactNode
  /** "See all" link href */
  seeAllHref?: string
  /** "See all" link text (default: "See all") */
  seeAllText?: string
  /** Additional className for the header container */
  className?: string
}

/**
 * SectionHeader - Reusable header for homepage/category sections
 * 
 * @example
 * <SectionHeader
 *   title="Today's Deals"
 *   icon={<Tag size={18} weight="fill" className="text-price-sale" />}
 *   seeAllHref="/todays-deals"
 *   seeAllText="View all"
 * />
 */
export function SectionHeader({
  title,
  icon,
  seeAllHref,
  seeAllText = "See all",
  className,
}: SectionHeaderProps) {
  return (
    <header 
      className={cn(
        "px-inset mb-3 flex items-center justify-between min-h-touch-sm",
        className
      )}
    >
      {/* Title with optional icon */}
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="shrink-0 [&>svg]:size-5" aria-hidden="true">
            {icon}
          </span>
        )}
        <h2 className="text-body font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      {/* See all link */}
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="flex items-center gap-1 text-compact font-medium text-primary min-h-touch-sm px-1 -mr-1 active:opacity-70 transition-opacity"
        >
          {seeAllText}
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </header>
  )
}

/**
 * SectionContainer - Wrapper for horizontal scrolling section content
 * 
 * Features:
 * - Semantic spacing tokens (section-top, section-bottom)
 * - Horizontal snap scrolling for smooth mobile experience
 * - No-scrollbar for clean UI
 */
export function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("pt-section-top pb-section-bottom", className)}>
      {children}
    </section>
  )
}

/**
 * SectionScrollArea - Horizontal scroll container with snap points
 * 
 * Uses:
 * - overflow-x-auto for horizontal scrolling
 * - snap-x snap-mandatory for smooth snapping
 * - no-scrollbar for clean mobile UI
 * - px-inset for proper edge padding
 */
export function SectionScrollArea({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory">
      <div className={cn("flex gap-3 px-inset pb-1", className)}>
        {children}
      </div>
    </div>
  )
}
