"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { House, CaretRight } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

interface CategoryPageBreadcrumbProps {
  currentCategory: Category
  parentCategory?: Category | null
  className?: string
}

/**
 * Simple inline breadcrumb for category pages.
 * Placed inside container, matches content flow.
 */
export function CategoryPageBreadcrumb({
  currentCategory,
  parentCategory,
  className
}: CategoryPageBreadcrumbProps) {
  const locale = useLocale()
  const t = useTranslations('SearchFilters')

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("py-2", className)}
    >
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <House size={14} weight="regular" aria-hidden="true" />
          </Link>
        </li>

        <li aria-hidden="true">
          <CaretRight size={12} className="text-muted-foreground/50" />
        </li>

        {/* All Departments */}
        <li className="flex items-center">
          <Link
            href="/categories"
            className="hover:text-foreground hover:underline underline-offset-2 transition-colors"
          >
            {t('allDepartments')}
          </Link>
        </li>

        {/* Parent Category (if exists) */}
        {parentCategory && (
          <>
            <li aria-hidden="true">
              <CaretRight size={12} className="text-muted-foreground/50" />
            </li>
            <li className="flex items-center">
              <Link
                href={`/categories/${parentCategory.slug}`}
                className="hover:text-foreground hover:underline underline-offset-2 transition-colors"
              >
                {getCategoryName(parentCategory)}
              </Link>
            </li>
          </>
        )}

        {/* Current Category */}
        <li aria-hidden="true">
          <CaretRight size={12} className="text-muted-foreground/50" />
        </li>
        <li className="flex items-center">
          <span
            className="text-foreground font-medium"
            aria-current="page"
          >
            {getCategoryName(currentCategory)}
          </span>
        </li>
      </ol>
    </nav>
  )
}
