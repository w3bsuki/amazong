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

  // Treido Style: (Updated: Flat, clean, no glows)
  // - Base: bg-muted/20 (very subtle), border-border/60
  // - Active: border-primary (clean 1px border), no ring glows
  const styles = {
    bg: "bg-muted/20",
    iconColor: "text-foreground",
    border: "border-border/60",
  }

  // If active (selected state), use cleaner border without glow rings
  const activeStyles = active ? "border-primary bg-background" : styles.border

  return (

    <div
      className={cn(
        // Treido: w-[56px] h-[56px] -> we expect parent to pass size-14 (56px) or similar
        // If not, we enforce a good default in parent, but here we handle the visual properties.
        "rounded-full flex items-center justify-center overflow-hidden",
        "border",
        "transition-[border-color,background-color,opacity] duration-150", // Specific properties for better perf
        "group-active:opacity-90", // Treido: active:opacity-90 (via group from parent)
        styles.bg,
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
          <span className={cn("text-lg leading-none", styles.iconColor)} aria-hidden="true">
            {icon}
          </span>
        ) : (
          <span aria-hidden="true">
            {getCategoryIcon(category.slug, {
              size: fallbackIconSize,
              weight: "regular", // Treido: Regular weight for better legibility on flat design
              className: styles.iconColor,
            })}
          </span>
        )
      }
    </div >
  )
}
