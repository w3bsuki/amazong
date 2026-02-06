"use client"

import * as React from "react"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { type IconSize } from "@/components/shared/category/category-icons"

import { CategoryCircleVisual } from "./category-circle-visual"

type CategoryLike = {
  slug: string
  image_url?: string | null
  icon?: string | null
}

type LinkHref = React.ComponentProps<typeof Link>["href"]

/**
 * Format a number as a compact string (e.g., 51089 -> "51K")
 */
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1).replace(/\.0$/, '')}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`
  }
  return count.toString()
}

export interface CategoryCircleProps {
  category: CategoryLike
  label: string
  /** Defaults to `label`. */
  ariaLabel?: string

  role?: React.AriaRole

  href?: LinkHref
  prefetch?: boolean
  onClick?: () => void

  active?: boolean
  dimmed?: boolean
  /** Show loading spinner overlay on the circle */
  loading?: boolean

  /** Listing count to display below the label */
  count?: number | undefined
  /** When true, shows count even when label is rendered inside the circle. */
  showCount?: boolean | undefined

  /** Size class for the circle itself (e.g. `size-12`, `size-14`). */
  circleClassName?: string
  /** Classes for the wrapper (Link/button). */
  className?: string
  /** Classes for the label text. */
  labelClassName?: string
  /** Classes for the label when `labelPlacement="inside"`. */
  insideLabelClassName?: string
  /** Classes for the count text. */
  countClassName?: string

  /** Where to render the label. Defaults to `below` for backward compatibility. */
  labelPlacement?: "below" | "inside"

  variant?: "muted" | "menu" | "rail" | "colorful"
  fallbackIconSize?: IconSize
  fallbackIconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  /** 
   * When true, always show Phosphor icon instead of image_url.
   * Use this to prefer icons over photos for cleaner visual hierarchy.
   */
  preferIcon?: boolean
}

export function CategoryCircle({
  category,
  label,
  ariaLabel,
  role,
  href,
  prefetch,
  onClick,
  active,
  dimmed,
  loading,
  count,
  showCount,
  circleClassName,
  className,
  labelClassName,
  insideLabelClassName,
  countClassName,
  labelPlacement = "below",
  variant = "muted",
  fallbackIconSize = 24,
  fallbackIconWeight = "bold", // Bold for better visibility
  preferIcon = true, // Default to Phosphor icons
}: CategoryCircleProps) {
  const baseClasses = cn(
    "group",
    "flex flex-col items-center justify-start",
    "rounded-md p-0.5",
    "transition-colors",
    "touch-manipulation",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    dimmed ? "opacity-50" : "opacity-100",
    className
  )

  const renderCount =
    typeof count === "number" &&
    count > 0 &&
    (showCount ?? labelPlacement === "below")

  const content = (
    <>
      <div className="relative">
        <CategoryCircleVisual
          category={category}
          active={!!active}
          className={cn(
            "mx-auto transition-opacity",
            labelPlacement === "inside" && "pb-3",
            circleClassName,
            loading && "opacity-60"
          )}
          fallbackIconSize={fallbackIconSize}
          fallbackIconWeight={fallbackIconWeight}
          variant={variant}
          preferIcon={preferIcon}
        />
        {labelPlacement === "inside" && (
          <span
            className={cn(
              "absolute inset-x-1 bottom-1 select-none text-center leading-none line-clamp-1",
              "text-2xs font-medium",
              "text-foreground",
              insideLabelClassName
            )}
          >
            {label}
          </span>
        )}
        {/* Loading spinner overlay - subtle ring pulse */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-full rounded-full border-2 border-border border-t-foreground animate-spin" />
          </div>
        )}
      </div>
      {labelPlacement === "below" && (
        <span
          className={cn(
            "mt-1 w-full text-center text-2xs font-medium leading-tight line-clamp-1",
            labelClassName
          )}
        >
          {label}
        </span>
      )}
      {renderCount && (
        <span
          className={cn(
            "text-2xs text-muted-foreground leading-none -mt-0.5",
            countClassName
          )}
        >
          {formatCount(count)}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        aria-label={ariaLabel ?? label}
        onClick={onClick}
        className={baseClasses}
        role={role}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      aria-pressed={active}
      onClick={onClick}
      className={baseClasses}
      role={role}
    >
      {content}
    </button>
  )
}
