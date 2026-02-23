import { Folder } from "lucide-react"

import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { cn } from "@/lib/utils"

type Category = {
  id?: string
  name: string
  name_bg?: string | null
  slug: string
  icon?: string | null
  parent_id?: string | null
}

function getDisplayName(category: Category, locale: string) {
  return locale === "bg" && category.name_bg ? category.name_bg : category.name
}

function isEmojiLike(value: string) {
  // Pragmatic: treat short, non-latin strings as emoji/icon.
  return value.length <= 4 && /[^\p{L}\p{N}\s]/u.test(value)
}

/**
 * CategoryBadge - Professional category display
 * 
 * Uses NEUTRAL background with dark text for proper contrast
 * NO blue-on-blue, NO gradient-looking opacity layers
 */
export function CategoryBadge(props: {
  locale: string
  category: Category | null
  subcategory?: Category | null | undefined
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}) {
  const { locale, category, subcategory, size = "sm", showIcon = true, className } = props
  if (!category) return null

  const label = getDisplayName(category, locale)
  const subLabel = subcategory && subcategory.slug !== category.slug ? getDisplayName(subcategory, locale) : null

  const icon = category.icon?.trim()

  const sizeClass =
    size === "lg" ? "text-sm px-3.5 py-2 h-9" : size === "md" ? "text-xs px-3 py-1.5 h-7" : "text-xs px-2.5 py-1 h-6"

  return (
    <MarketplaceBadge
      variant="category"
      className={cn(
        "inline-flex items-center gap-2",
        sizeClass,
        className
      )}
    >
      {showIcon && (
        icon && isEmojiLike(icon) ? (
          <span aria-hidden className="text-base">
            {icon}
          </span>
        ) : (
          <Folder className={cn("text-category-badge-icon", size === "lg" ? "size-4" : "size-3.5")} />
        )
      )}
      <span className="font-medium">
        {label}
        {subLabel ? <span className="text-muted-foreground font-normal"> · {subLabel}</span> : null}
      </span>
    </MarketplaceBadge>
  )
}
