import * as React from "react"

import { cn } from "@/lib/utils"
import { getCategoryIcon, getCategoryColor, type IconSize } from "./category-icons"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import Image from "next/image"

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
  /** 
   * When true, always show Phosphor icon instead of image_url.
   * Use this to prefer icons over photos for cleaner visual hierarchy.
   */
  preferIcon?: boolean
}

export function CategoryCircleVisual({
  category,
  active = false,
  className,
  fallbackIconSize = 24,
  fallbackIconWeight = "bold", // Bold for better visibility
  variant = "rail",
  preferIcon = true, // Default to Phosphor icons (set to false to show images/emojis)
}: CategoryCircleVisualProps) {
  // When preferIcon is true, skip image_url AND icon (emoji) checks - go straight to Phosphor
  const imageUrl = !preferIcon && hasMeaningfulImageUrl(category.image_url) ? category.image_url : null
  const icon = !preferIcon && hasMeaningfulIcon(category.icon) ? category.icon : null
  
  // Get category-specific colors
  const colors = getCategoryColor(category.slug)
  
  const isColorful = variant === "colorful"
  const surfaceClass = (() => {
    if (variant === "colorful") return colors.bg
    if (active) return "bg-selected"
    return "bg-surface-subtle group-hover:bg-hover"
  })()
  const iconColorClass = isColorful ? colors.text : "text-foreground"
  const ringClass = active
    ? cn("ring-2 ring-offset-1 ring-offset-background", isColorful ? colors.ring : "ring-selected-border")
    : cn(
        "ring-1 ring-border-subtle",
        isColorful ? colors.hoverRing : "group-hover:ring-hover-border"
      )

  // Filled circles for app-like browsing. No visible outlines.
  const depthClass = active ? "shadow-sm" : "shadow-2xs"

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden",
        surfaceClass,
        "transition-shadow duration-150",
        ringClass,
        depthClass,
        className
      )}
    >
      {
        imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
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
