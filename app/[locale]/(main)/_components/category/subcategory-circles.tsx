import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import { CategoryCircleVisual } from "./category-circle-visual"

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

interface SubcategoryCirclesProps {
  subcategories: Category[]
  currentCategory?: Category | null
  title?: string
  className?: string
  basePath?: string // "/categories" or undefined for "/search?category="
  /** Optional override for the "All" circle destination. */
  allHref?: string
  /** Pre-serialized search params string (without leading '?') to preserve during navigation */
  searchParamsString?: string
  /** Variant: desktop = larger circles for desktop layout */
  variant?: "default" | "desktop"
  /** Slug of the currently active subcategory (for desktop highlighting) */
  activeSubcategorySlug?: string | null | undefined
  /** Show product counts under category names (DEC-002 curated browse UX) */
  showCounts?: boolean
  /** Optional: handle selection locally (no navigation). When set, renders buttons instead of links. */
  onSelectCategory?: (category: Category) => void
  /** Optional: special handler for the \"All\" circle when onSelectCategory is set. */
  onSelectAll?: () => void
  /** When true, always show Phosphor icons instead of images. */
  preferIcon?: boolean
}

const INVALID_CATEGORY_MARKERS = ["[deprecated]", "[moved]", "[duplicate]"] as const

function isValidCategory(cat: Category) {
  const name = cat.name.toLowerCase()
  return !INVALID_CATEGORY_MARKERS.some((marker) => name.includes(marker))
}

function getCategoryNameByLocale(category: Category, locale: string) {
  if (locale === "bg" && category.name_bg) {
    return category.name_bg
  }
  return category.name
}

function buildCategoryUrl({
  basePath,
  searchParamsString,
  categorySlug,
}: {
  basePath: string | undefined
  searchParamsString: string
  categorySlug: string
}) {
  if (basePath) {
    const params = new URLSearchParams(searchParamsString)
    params.delete("category")
    const queryString = params.toString()
    const categoryPath = `${basePath}/${categorySlug}`
    return queryString ? `${categoryPath}?${queryString}` : categoryPath
  }

  const params = new URLSearchParams(searchParamsString)
  params.set("category", categorySlug)
  return `/search?${params.toString()}`
}

interface AllCircleProps {
  currentCategory: Category
  isDesktop: boolean
  isInteractive: boolean
  activeSubcategorySlug: string | null | undefined
  onSelectCategory: ((category: Category) => void) | undefined
  onSelectAll: (() => void) | undefined
  href: string
  allLabel: string
  allProductsLabel: string
}

function AllCircle({
  currentCategory,
  isDesktop,
  isInteractive,
  activeSubcategorySlug,
  onSelectCategory,
  onSelectAll,
  href,
  allLabel,
  allProductsLabel,
}: AllCircleProps) {
  const itemClasses = cn(
    "flex flex-col items-center gap-1 group shrink-0 touch-manipulation",
    isDesktop
      ? "min-w-(--spacing-category-item-desktop) gap-2"
      : "min-w-(--spacing-category-item-lg)"
  )

  const circleContent = (
    <>
      <div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden",
          "transition-all group-active:opacity-90",
          isDesktop && !activeSubcategorySlug
            ? "bg-selected ring-2 ring-ring ring-offset-2 ring-offset-background"
            : "bg-surface-subtle ring-1 ring-border-subtle",
          isDesktop
            ? "size-(--spacing-category-circle-desktop)"
            : "size-(--spacing-category-circle) shrink-0"
        )}
      >
        <span
          className={cn(
            "font-medium text-center px-1 leading-tight text-foreground",
            isDesktop ? "text-sm" : "text-tiny"
          )}
        >
          {allLabel}
        </span>
      </div>

      <span
        className={cn(
          "font-medium text-center text-foreground px-1 leading-tight line-clamp-2",
          isDesktop
            ? "text-sm max-w-(--spacing-category-item-desktop)"
            : "text-tiny max-w-(--spacing-category-item-lg)"
        )}
      >
        {allProductsLabel}
      </span>
    </>
  )

  if (isInteractive) {
    const handleAllClick = () => {
      if (onSelectAll) {
        onSelectAll()
        return
      }
      onSelectCategory?.(currentCategory)
    }

    return (
      <button
        type="button"
        onClick={handleAllClick}
        aria-current={isDesktop && !activeSubcategorySlug ? "page" : undefined}
        className={cn(
          itemClasses,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {circleContent}
      </button>
    )
  }

  return (
    <Link href={href} prefetch={false} className={itemClasses}>
      {circleContent}
    </Link>
  )
}

interface SubcategoryCircleItemProps {
  subcategory: Category
  isDesktop: boolean
  isInteractive: boolean
  activeSubcategorySlug: string | null | undefined
  onSelectCategory: ((category: Category) => void) | undefined
  href: string
  label: string
  showCounts: boolean
  preferIcon: boolean
}

function SubcategoryCircleItem({
  subcategory,
  isDesktop,
  isInteractive,
  activeSubcategorySlug,
  onSelectCategory,
  href,
  label,
  showCounts,
  preferIcon,
}: SubcategoryCircleItemProps) {
  const isActive = isDesktop && activeSubcategorySlug === subcategory.slug
  const itemClasses = cn(
    "flex flex-col items-center group shrink-0 touch-manipulation",
    isDesktop
      ? "min-w-(--spacing-category-item-desktop) gap-2"
      : "min-w-(--spacing-category-item-lg) gap-1.5"
  )

  const content = (
    <>
      <CategoryCircleVisual
        category={subcategory}
        active={isActive}
        className={cn(
          "shrink-0 group-active:opacity-90 transition-all",
          isDesktop
            ? "size-(--spacing-category-circle-desktop)"
            : "size-(--spacing-category-circle)"
        )}
        fallbackIconSize={isDesktop ? 28 : 24}
        fallbackIconWeight="bold"
        variant={isActive ? "rail" : "muted"}
        preferIcon={preferIcon}
      />

      <span
        className={cn(
          "font-medium text-center text-foreground px-1 leading-tight line-clamp-2 w-full",
          isDesktop
            ? "text-sm max-w-(--spacing-category-item-desktop)"
            : "text-tiny max-w-(--spacing-category-item-lg)"
        )}
      >
        {label}
        {showCounts && typeof subcategory.subtree_product_count === "number" && (
          <span className="block text-muted-foreground font-normal text-xs">
            ({subcategory.subtree_product_count})
          </span>
        )}
      </span>
    </>
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={() => onSelectCategory?.(subcategory)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          itemClasses,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <Link href={href} prefetch={false} aria-current={isActive ? "page" : undefined} className={itemClasses}>
      {content}
    </Link>
  )
}

export function SubcategoryCircles({
  subcategories,
  currentCategory,
  className,
  basePath,
  allHref,
  searchParamsString = "",
  variant = "default",
  activeSubcategorySlug = null,
  showCounts = false,
  onSelectCategory,
  onSelectAll,
  preferIcon = true, // Default to Phosphor icons
}: SubcategoryCirclesProps) {
  const locale = useLocale()
  const tCommon = useTranslations("Common")
  const tSearch = useTranslations("SearchFilters")

  const validSubcategories = subcategories.filter(isValidCategory)
  const buildUrl = React.useCallback(
    (categorySlug: string) =>
      buildCategoryUrl({
        basePath,
        searchParamsString,
        categorySlug,
      }),
    [basePath, searchParamsString]
  )

  if (validSubcategories.length === 0) return null

  const isDesktop = variant === "desktop"
  const isInteractive = typeof onSelectCategory === "function"

  return (
    <div className={cn("relative w-full overflow-x-hidden", className)}>
      <div className="relative">
        <div
          className={cn(
            "flex gap-1.5 py-1 pb-2 pr-4 overflow-x-auto scrollbar-hide",
            isDesktop ? "gap-2.5 flex-wrap overflow-x-visible" : "sm:flex-wrap sm:overflow-x-visible"
          )}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {currentCategory && (
            <AllCircle
              currentCategory={currentCategory}
              isDesktop={isDesktop}
              isInteractive={isInteractive}
              activeSubcategorySlug={activeSubcategorySlug}
              onSelectCategory={onSelectCategory}
              onSelectAll={onSelectAll}
              href={allHref ?? buildUrl(currentCategory.slug)}
              allLabel={tCommon("all")}
              allProductsLabel={tSearch("allProducts")}
            />
          )}

          {validSubcategories.map((subcategory) => (
            <SubcategoryCircleItem
              key={subcategory.id}
              subcategory={subcategory}
              isDesktop={isDesktop}
              isInteractive={isInteractive}
              activeSubcategorySlug={activeSubcategorySlug}
              onSelectCategory={onSelectCategory}
              href={buildUrl(subcategory.slug)}
              label={getCategoryNameByLocale(subcategory, locale)}
              showCounts={showCounts}
              preferIcon={preferIcon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

