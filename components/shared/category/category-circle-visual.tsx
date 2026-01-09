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

  // Treido Style:
  // - Base: bg-zinc-50 (bg-secondary/30), border-zinc-200 (border-border/60)
  // - Active: Scale down
  const styles = {
    bg: "bg-secondary/30",
    iconColor: "text-foreground",
    border: "border-border/60",
  }

  // If active (selected state), use darker border
  const activeStyles = active ? "border-primary ring-1 ring-primary/20" : styles.border

  return (
    <div
      className={cn(
        // Treido: w-[56px] h-[56px] -> we expect parent to pass size-14 (56px) or similar
        // If not, we enforce a good default in parent, but here we handle the visual properties.
        "rounded-full flex items-center justify-center overflow-hidden",
        "border",
        "transition-all duration-200", // Smooth transition
        "group-active:scale-95", // Treido: active:scale-95 (via group from parent)
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
