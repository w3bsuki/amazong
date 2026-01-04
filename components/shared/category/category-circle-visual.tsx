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
  fallbackIconWeight = "regular",
  variant = "muted",
}: CategoryCircleVisualProps) {
  const imageUrl = hasMeaningfulImageUrl(category.image_url) ? category.image_url : null
  const icon = hasMeaningfulIcon(category.icon) ? category.icon : null

  // Variant-specific styling
  // - muted: Light bg, brand icon (default browse)
  // - menu: Neutral bg for drawers/menus (avoid loud/glowy look)
  // - rail: Minimal styling for dense lists
  const variantStyles = {
    muted: {
      bg: "bg-muted",
      iconColor: "text-brand",
    },
    menu: {
      bg: "bg-muted",
      iconColor: "text-brand",
    },
    rail: {
      bg: "bg-muted/50",
      iconColor: "text-muted-foreground",
    },
  }

  const styles = variantStyles[variant]
  const activeStyles = active ? "border-primary" : "border-border/40"

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden",
        "border-2",
        "shadow-none",
        "transition-colors duration-100",
        styles.bg,
        activeStyles,
        className
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : icon ? (
        <span className={cn("text-lg leading-none", styles.iconColor)} aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span aria-hidden="true">
          {getCategoryIcon(category.slug, {
            size: fallbackIconSize,
            weight: fallbackIconWeight,
            className: styles.iconColor,
          })}
        </span>
      )}
    </div>
  )
}
