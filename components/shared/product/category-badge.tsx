import { Tag } from "lucide-react"

import { Badge } from "../../ui/badge"
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

export function CategoryBadge(props: {
  locale: string
  category: Category | null
  subcategory?: Category | null
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const { locale, category, subcategory, size = "sm", className } = props
  if (!category) return null

  const label = getDisplayName(category, locale)
  const subLabel = subcategory && subcategory.slug !== category.slug ? getDisplayName(subcategory, locale) : null

  const icon = category.icon?.trim()

  const sizeClass =
    size === "lg" ? "text-sm px-3 py-1.5" : size === "md" ? "text-xs px-2.5 py-1" : "text-[10px] px-2 py-0.5"

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-category-badge-border bg-category-badge-bg text-category-badge-text",
        sizeClass,
        className
      )}
    >
      {icon && isEmojiLike(icon) ? (
        <span aria-hidden className="text-category-badge-icon">
          {icon}
        </span>
      ) : (
        <Tag className={cn("text-category-badge-icon", size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5")} />
      )}
      <span className="font-medium">
        {label}
        {subLabel ? <span className="text-muted-foreground"> · {subLabel}</span> : null}
      </span>
    </Badge>
  )
}
