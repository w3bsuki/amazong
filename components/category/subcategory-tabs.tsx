"use client"

import { SubcategoryCircles } from "@/components/category/subcategory-circles"
import Image from "next/image"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"
import { getCategoryIcon } from "@/lib/category-icons"

import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

interface SubcategoryTabsProps {
  currentCategory: Category | null
  subcategories: Category[]
  parentCategory?: Category | null // Kept for backward compatibility (not used here, breadcrumb is separate)
  basePath?: string // "/categories" or undefined for "/search?category="
}

/**
 * Category header section with title and subcategory circles.
 * Shows a banner when at the deepest level (no subcategories).
 */
export function SubcategoryTabs({ currentCategory, subcategories, basePath }: SubcategoryTabsProps) {
  const searchParams = useSearchParams()

  if (!currentCategory) return null

  // At deepest level - show category banner instead of circles
  if (subcategories.length === 0) {
    return <CategoryBanner category={currentCategory} />
  }

  // Has subcategories - show circles
  return (
    <div className="mb-4 pb-2 border-b border-border">
      <SubcategoryCircles
        subcategories={subcategories}
        currentCategory={currentCategory}
        searchParamsString={searchParams.toString()}
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
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name

  return (
    <div className="mb-4 rounded-md bg-primary/5 border border-border/50">
      <div className="flex items-center gap-3 p-3">
        {/* Category Icon or Image */}
        <CategoryCircleVisual
          category={category}
          active={false}
          className="size-[56px] shrink-0 bg-secondary/30 border border-border/60"
          fallbackIconSize={24}
          fallbackIconWeight="light"
          variant="muted"
        />

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{name}</h2>
          <p className="text-sm text-muted-foreground">
            {locale === "bg" ? "????????? ?????????? ? ???? ?????????" : "Browse products in this category"}
          </p>
        </div>
      </div>
    </div>
  )
}
