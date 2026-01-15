"use client"

import { SubcategoryCircles } from "@/components/category/subcategory-circles"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
  /** Subtree product count from category_stats (optional, DEC-002) */
  subtree_product_count?: number
}

interface SubcategoryTabsProps {
  currentCategory: Category | null
  subcategories: Category[]
  parentCategory?: Category | null // Kept for backward compatibility (not used here, breadcrumb is separate)
  basePath?: string // "/categories" or undefined for "/search?category="
  variant?: "default" | "desktop" // desktop = larger circles
  /** Slug of the currently active subcategory for desktop highlighting */
  activeSubcategorySlug?: string | null | undefined
  /** Show product counts under category names (DEC-002 curated browse UX) */
  showCounts?: boolean
}

/**
 * Category header section with title and subcategory circles.
 * Shows a banner when at the deepest level (no subcategories).
 */
export function SubcategoryTabs({ currentCategory, subcategories, basePath, variant = "default", activeSubcategorySlug, showCounts = false }: SubcategoryTabsProps) {
  const searchParams = useSearchParams()

  if (!currentCategory) return null

  // At deepest level - show category banner instead of circles
  if (subcategories.length === 0) {
    return <CategoryBanner category={currentCategory} />
  }

  // Has subcategories - show circles
  return (
    <div className="mb-4 pb-3 border-b border-border">
      <SubcategoryCircles
        subcategories={subcategories}
        currentCategory={currentCategory}
        searchParamsString={searchParams.toString()}
        variant={variant}
        activeSubcategorySlug={activeSubcategorySlug}
        showCounts={showCounts}
        {...(basePath ? { basePath } : {})}
      />
    </div>
  )
}

/**
 * Banner shown at the deepest category level.
 */
function CategoryBanner({ category }: { category: Category }) {
  const locale = useLocale()
  const t = useTranslations("Categories")
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name

  return (
    <div className="mb-4 rounded-md bg-primary/5 border border-border/50">
      <div className="flex items-center gap-3 p-3">
        {/* Category Icon or Image */}
        <CategoryCircleVisual
          category={category}
          active={false}
          className="size-(--spacing-category-circle) shrink-0 bg-secondary/30 border border-border/60"
          fallbackIconSize={24}
          fallbackIconWeight="light"
          variant="muted"
        />

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{name}</h2>
          <p className="text-sm text-muted-foreground">
            {t("bannerDescription")}
          </p>
        </div>
      </div>
    </div>
  )
}
