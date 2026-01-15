import * as React from "react"

import { cn } from "@/lib/utils"
import { getCategoryIcon, getCategoryColor, type IconSize } from "@/lib/category-icons"
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
  variant?: "muted" | "menu" | "rail" | "colorful"
}

export function CategoryCircleVisual({
  category,
  active = false,
  className,
  fallbackIconSize = 24,
  fallbackIconWeight = "regular",
  variant = "colorful", // Default to colorful OLX-style
}: CategoryCircleVisualProps) {
  const imageUrl = hasMeaningfulImageUrl(category.image_url) ? category.image_url : null
  const icon = hasMeaningfulIcon(category.icon) ? category.icon : null
  
  // Get category-specific colors
  const colors = getCategoryColor(category.slug)
  
  // Determine background and ring styles based on variant
  const isColorful = variant === "colorful"
  const bgClass = isColorful ? colors.bg : "bg-muted/20"
  const iconColorClass = isColorful ? colors.text : "text-foreground"
  
  // Ring style: active uses category color, inactive uses subtle border
  const ringClass = active
    ? cn("ring-2", isColorful ? colors.ring : "ring-primary")
    : "ring-1 ring-border/50 group-hover:ring-2 group-hover:ring-foreground/15"

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden",
        bgClass,
        "transition-all duration-150",
        "group-active:scale-95",
        ringClass,
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
          <span className={cn("text-lg leading-none", iconColorClass)} aria-hidden="true">
            {icon}
          </span>
        ) : (
          <span aria-hidden="true">
            {getCategoryIcon(category.slug, {
              size: fallbackIconSize,
              weight: fallbackIconWeight,
              className: iconColorClass,
            })}
          </span>
        )
      }
    </div>
  )
}
