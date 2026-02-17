"use client"

import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search as MagnifyingGlass, Package, Plus, ShoppingBag, Store as Storefront } from "lucide-react";


// =============================================================================
// Types
// =============================================================================

type EmptyStateVariant =
  | "no-listings"      // Generic: no listings in category/feed
  | "no-search"        // Search returned no results
  | "no-category"      // Category has no products
  | "no-favorites"     // User has no favorites
  | "no-orders"        // User has no orders

interface EmptyStateCTAProps {
  /** Which variant to display */
  variant?: EmptyStateVariant
  /** Override the icon */
  icon?: React.ReactNode
  /** Override the title */
  title?: string
  /** Override the description */
  description?: string
  /** Category name for contextual messages */
  categoryName?: string
  /** Search query for contextual messages */
  searchQuery?: string
  /** Whether to show the CTA button */
  showCTA?: boolean
  /** Override CTA href */
  ctaHref?: string
  /** Override CTA label */
  ctaLabel?: string
  /** Additional className */
  className?: string
}

// =============================================================================
// Content Config (EN/BG)
// =============================================================================

const CONTENT = {
  "no-listings": {
    icon: Package,
    title: { en: "No listings yet", bg: "Все още няма обяви" },
    description: {
      en: "Be the first to list something here!",
      bg: "Бъди първият, който публикува тук!"
    },
    cta: { en: "Create Listing", bg: "Създай обява" },
    href: "/sell",
  },
  "no-search": {
    icon: MagnifyingGlass,
    title: { en: "No results found", bg: "Няма намерени резултати" },
    description: {
      en: "Try different keywords or browse categories",
      bg: "Опитай с други ключови думи или разгледай категориите"
    },
    cta: { en: "Browse All", bg: "Разгледай всички" },
    href: "/",
  },
  "no-category": {
    icon: Storefront,
    title: { en: "Nothing here yet", bg: "Все още няма нищо тук" },
    description: {
      en: "This category is waiting for its first listing",
      bg: "Тази категория чака първата си обява"
    },
    cta: { en: "Start Selling", bg: "Започни да продаваш" },
    href: "/sell",
  },
  "no-favorites": {
    icon: ShoppingBag,
    title: { en: "No favorites yet", bg: "Все още няма любими" },
    description: {
      en: "Save items you love to find them easily later",
      bg: "Запази артикули, които харесваш, за да ги намериш лесно по-късно"
    },
    cta: { en: "Explore", bg: "Разгледай" },
    href: "/",
  },
  "no-orders": {
    icon: Package,
    title: { en: "No orders yet", bg: "Все още няма поръчки" },
    description: {
      en: "Your order history will appear here",
      bg: "Историята на поръчките ти ще се появи тук"
    },
    cta: { en: "Start Shopping", bg: "Започни да пазаруваш" },
    href: "/",
  },
} as const

// =============================================================================
// Component
// =============================================================================

export function EmptyStateCTA({
  variant = "no-listings",
  icon,
  title,
  description,
  categoryName,
  searchQuery,
  showCTA = true,
  ctaHref,
  ctaLabel,
  className,
}: EmptyStateCTAProps) {
  const locale = useLocale() as "en" | "bg"
  const content = CONTENT[variant]
  const Icon = content.icon

  // Build contextual description
  let finalDescription = description || content.description[locale]
  if (categoryName && variant === "no-category") {
    finalDescription = locale === "bg"
      ? `В "${categoryName}" все още няма обяви. Бъди първият!`
      : `"${categoryName}" has no listings yet. Be the first!`
  }
  if (searchQuery && variant === "no-search") {
    finalDescription = locale === "bg"
      ? `Няма резултати за "${searchQuery}". Опитай с други думи.`
      : `No results for "${searchQuery}". Try different keywords.`
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6 text-center",
      className
    )}>
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon || <Icon size={32} className="text-muted-foreground" />}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-1.5">
        {title || content.title[locale]}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-xs mb-3">
        {finalDescription}
      </p>

      {/* CTA Button */}
      {showCTA && (
        <Button asChild variant="cta" className="rounded-full">
          <Link href={ctaHref || content.href}>
            <Plus size={18} />
            {ctaLabel || content.cta[locale]}
          </Link>
        </Button>
      )}
    </div>
  )
}
