/**
 * MoreCategoriesGrid Component
 * 
 * Grid display for the "View All" / "Всички" dropdown section.
 * Shows remaining categories that don't fit in the main subheader row.
 */

"use client"

import { Link } from "@/i18n/routing"
import { getSubheaderIcon } from "@/lib/category-icons"
import type { Category } from "@/hooks/use-categories-cache"

interface MoreCategoriesGridProps {
  categories: Category[]
  locale: string
  onNavigate?: () => void
}

export function MoreCategoriesGrid({ 
  categories, 
  locale, 
  onNavigate 
}: MoreCategoriesGridProps) {
  const getCategoryName = (cat: Category) => 
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name

  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          onClick={onNavigate}
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors group border border-transparent hover:border-border"
        >
          <span className="text-muted-foreground group-hover:text-brand transition-colors">
            {getSubheaderIcon(cat.slug)}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors block truncate">
              {getCategoryName(cat)}
            </span>
            {cat.children && cat.children.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {cat.children.length} {locale === "bg" ? "подкатегории" : "subcategories"}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
