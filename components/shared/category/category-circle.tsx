"use client"

import * as React from "react"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { type IconSize } from "@/lib/category-icons"

import { CategoryCircleVisual } from "./category-circle-visual"

type CategoryLike = {
  slug: string
  image_url?: string | null
  icon?: string | null
}

type LinkHref = React.ComponentProps<typeof Link>["href"]

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

  /** Size class for the circle itself (e.g. `size-12`, `size-14`). */
  circleClassName?: string
  /** Classes for the wrapper (Link/button). */
  className?: string
  /** Classes for the label text. */
  labelClassName?: string

  variant?: "muted" | "menu" | "rail" | "colorful"
  fallbackIconSize?: IconSize
  fallbackIconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
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
  circleClassName,
  className,
  labelClassName,
  variant = "muted",
  fallbackIconSize = 24,
  fallbackIconWeight = "regular",
}: CategoryCircleProps) {
  const baseClasses = cn(
    "group snap-start shrink-0",
    "flex flex-col items-center gap-1.5",
    "touch-action-manipulation",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
    dimmed ? "opacity-50" : "opacity-100",
    className
  )

  const content = (
    <>
      <CategoryCircleVisual
        category={category}
        active={!!active}
        className={circleClassName ?? ""}
        fallbackIconSize={fallbackIconSize}
        fallbackIconWeight={fallbackIconWeight}
        variant={variant}
      />
      <span className={labelClassName}>{label}</span>
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
