import * as React from "react"

import { cn } from "@/lib/utils"
import { getCategoryIcon, type IconSize } from "@/lib/category-icons"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

type CategoryLike = {
  slug: string
  image_url?: string | null
  icon?: string | null
}

function hasMeaningfulImageUrl(url: string | null | undefined): url is string {
  if (!url) return false
  if (url === PLACEHOLDER_IMAGE_PATH) return false
  // Some parts of the app still use placeholder.svg; treat as missing.
  if (/\/placeholder\.(svg|png|jpg|jpeg)$/i.test(url)) return false
  if (/placeholder/i.test(url)) return false
  return true
}

function hasMeaningfulIcon(icon: string | null | undefined): icon is string {
  return !!icon && icon.trim().length > 0
}

export interface CategoryCircleVisualProps {
  category: CategoryLike
  active?: boolean
  /** Tailwind size class is expected from caller (e.g. `size-12`, `size-14`). */
  className?: string
  /** Icon size when falling back to Phosphor mapping. */
  fallbackIconSize?: IconSize
  /** Phosphor icon weight when falling back. */
  fallbackIconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  /** Visual style per surface. */
  variant?: "muted" | "menu" | "rail"
}

export function CategoryCircleVisual({
  category,
  active = false,
  className,
  fallbackIconSize = 24,
  fallbackIconWeight = "light", // Treido uses thin stroke (1.5px approx)
  variant = "muted",
}: CategoryCircleVisualProps) {
  const imageUrl = hasMeaningfulImageUrl(category.image_url) ? category.image_url : null
  const icon = hasMeaningfulIcon(category.icon) ? category.icon : null

  // Treido Style: Clean, minimal, professional
  // - Base: subtle border to define edge (especially for light images)
  // - Active: primary border for clear selection state
  const baseStyles = {
    bg: "bg-muted/30",
    iconColor: "text-foreground",
    border: "border border-border/40",
  }

  // Active state: clean primary ring
  const activeStyles = active 
    ? "ring-2 ring-primary ring-offset-1 ring-offset-background border-transparent" 
    : ""

  return (

    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden",
        "transition-all duration-150",
        "group-active:opacity-90",
        baseStyles.bg,
        baseStyles.border,
        activeStyles,
        className
      )}
    >
      {
        imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : icon ? (
          <span className={cn("text-lg leading-none", baseStyles.iconColor)} aria-hidden="true">
            {icon}
          </span>
        ) : (
          <span aria-hidden="true">
            {getCategoryIcon(category.slug, {
              size: fallbackIconSize,
              weight: "regular",
              className: baseStyles.iconColor,
            })}
          </span>
        )
      }
    </div >
  )
}
