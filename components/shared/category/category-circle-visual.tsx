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

  // Unified styling: brand-tinted backgrounds for visibility
  const base =
    variant === "menu"
      ? "bg-brand/10 border border-brand/20 text-brand"
      : variant === "rail"
        ? "bg-brand/10 border border-brand/20 text-brand"
        : "bg-brand/10 border border-brand/20 text-brand" // muted now uses brand tint

  const activeStyles = active
    ? "bg-brand text-white border-brand shadow-sm"
    : ""

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden",
        "transition-colors duration-150",
        base,
        activeStyles,
        // hover states (avoid when active)
        !active && "hover:bg-brand/20 hover:border-brand/30",
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
        <span className="text-lg leading-none" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span aria-hidden="true">
          {getCategoryIcon(category.slug, {
            size: fallbackIconSize,
            weight: fallbackIconWeight,
            className: cn(active ? "text-white" : "text-brand"),
          })}
        </span>
      )}
    </div>
  )
}
