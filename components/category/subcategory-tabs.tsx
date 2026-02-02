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
  /** Sibling categories to show when at leaf level (no subcategories) */
  siblingCategories?: Category[]
  parentCategory?: Category | null // Kept for backward compatibility (not used here, breadcrumb is separate)
  basePath?: string // "/categories" or undefined for "/search?category="
  variant?: "default" | "desktop" // desktop = larger circles
  /** Slug of the currently active subcategory for desktop highlighting */
  activeSubcategorySlug?: string | null | undefined
  /** Show product counts under category names (DEC-002 curated browse UX) */
  showCounts?: boolean
  /** Optional: handle selection locally (no navigation). When set, renders buttons instead of links. */
  onSelectCategory?: (category: Category) => void
}

/**
 * Category header section with title and subcategory circles.
 * Shows siblings when at the deepest level (no subcategories).
 */
export function SubcategoryTabs({ 
  currentCategory, 
  subcategories, 
  siblingCategories = [],
  basePath, 
  variant = "default", 
  activeSubcategorySlug, 
  showCounts = false,
  onSelectCategory,
}: SubcategoryTabsProps) {
  const searchParams = useSearchParams()

  if (!currentCategory) return null

  // At deepest level - show sibling navigation circles (current category highlighted among siblings)
  if (subcategories.length === 0) {
    // If we have siblings, show them as navigation circles
    if (siblingCategories.length > 0) {
      return (
        <div className="mb-4 pb-3 border-b border-border">
          {/* Small banner context showing current category */}
          <CategoryBannerCompact category={currentCategory} />
          
          {/* Sibling circles for navigation - current is highlighted */}
          <SubcategoryCircles
            subcategories={siblingCategories}
            currentCategory={currentCategory}
            searchParamsString={searchParams.toString()}
            variant={variant}
            activeSubcategorySlug={currentCategory.slug}
            showCounts={showCounts}
            {...(basePath ? { basePath } : {})}
            {...(onSelectCategory ? { onSelectCategory } : {})}
          />
        </div>
      )
    }
    
    // No siblings either - just show banner
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
        {...(onSelectCategory ? { onSelectCategory } : {})}
      />
    </div>
  )
}

/**
 * Compact banner shown above sibling circles at leaf level.
 */
function CategoryBannerCompact({ category }: { category: Category }) {
  const locale = useLocale()
  const t = useTranslations("Categories")
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name

  return (
    <div className="flex items-center gap-2 mb-3">
      <CategoryCircleVisual
        category={category}
        active={true}
        className="size-10 shrink-0"
        fallbackIconSize={20}
        fallbackIconWeight="regular"
        variant="colorful"
      />
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-foreground truncate">{name}</h2>
        <p className="text-xs text-muted-foreground">{t("browseSiblings")}</p>
      </div>
    </div>
  )
}

/**
 * Full banner shown at the deepest category level when no siblings available.
 */
function CategoryBanner({ category }: { category: Category }) {
  const locale = useLocale()
  const t = useTranslations("Categories")
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name

  return (
    <div className="mb-4 rounded-md bg-surface-subtle border border-border/50">
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
