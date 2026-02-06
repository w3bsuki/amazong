"use client"

import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { CaretRight, House } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface BreadcrumbCategory {
  slug: string
  name: string
  name_bg: string | null
}

interface CategoryBreadcrumbTrailProps {
  /** Full ancestry from L0 to current category */
  ancestry: BreadcrumbCategory[]
  /** Optional className for the container */
  className?: string
}

/**
 * Hierarchical breadcrumb trail for category sidebar.
 * Shows the full drill-down path: Fashion → Men's → Clothing → T-Shirts
 * 
 * Visual design:
 * - Indented tree structure (not horizontal breadcrumb)
 * - Each level is clickable
 * - Current level (last item) is highlighted
 */
export function CategoryBreadcrumbTrail({ ancestry, className }: CategoryBreadcrumbTrailProps) {
  const locale = useLocale()
  const t = useTranslations("Common")
  const tCategories = useTranslations("Categories")

  const getCategoryName = (cat: BreadcrumbCategory): string => {
    if (locale === "bg" && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  // Early return if empty
  if (ancestry.length === 0) return null

  // Extract current (last) and parents with type safety
  const parentCategories = ancestry.slice(0, -1)
  const last = ancestry[ancestry.length - 1]
  if (!last) return null // TypeScript guard
  const currentCategory: BreadcrumbCategory = last

  // Compute current category name here for type safety
  const currentCategoryName = getCategoryName(currentCategory)

  return (
    <nav
      aria-label={tCategories("navigationAriaLabel")}
      className={cn("text-sm", className)}
    >
      {/* All Categories link */}
      <Link
        href="/categories"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-1 group"
      >
        <House size={14} weight="regular" className="shrink-0 opacity-60 group-hover:opacity-100" />
        <span className="hover:underline">{t("allCategories")}</span>
      </Link>

      {/* Ancestry trail - indented tree structure */}
      <div className="mt-1 space-y-0.5">
        {parentCategories.map((cat, index) => (
          <div
            key={cat.slug}
            className="flex items-center"
            style={{ paddingLeft: `${(index + 1) * 12}px` }}
          >
            <CaretRight
              size={10}
              weight="bold"
              className="text-muted-foreground mr-1 shrink-0"
            />
            <Link
              href={`/categories/${cat.slug}`}
              className="text-muted-foreground hover:text-foreground hover:underline transition-colors py-0.5 truncate"
            >
              {getCategoryName(cat)}
            </Link>
          </div>
        ))}

        {/* Current category - highlighted */}
        <div
          className="flex items-center"
          style={{ paddingLeft: `${ancestry.length * 12}px` }}
        >
          <CaretRight
            size={10}
            weight="bold"
            className="text-primary mr-1 shrink-0"
          />
          <span className="font-semibold text-foreground py-0.5 truncate">
            {currentCategoryName}
          </span>
        </div>
      </div>
    </nav>
  )
}
