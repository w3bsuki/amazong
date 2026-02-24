import { ChevronDown as CaretDown, ChevronRight as CaretRight } from "lucide-react"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

export interface BreadcrumbCategory {
  slug: string
  name: string
  name_bg: string | null
}

export interface CategoryWithSubcategories {
  category: Category
  subs: Category[]
}

function isValidCategory(category: Category): boolean {
  const name = category.name.toLowerCase()
  return !name.includes("[deprecated]") && !name.includes("[moved]") && !name.includes("[duplicate]")
}

function getCategoryName(category: Category, locale: string): string {
  if (locale === "bg" && category.name_bg) {
    return category.name_bg
  }

  return category.name
}

function getLeafCategoriesForRoot(
  allCategoriesWithSubs: CategoryWithSubcategories[],
  rootId: string
): Category[] {
  const found = allCategoriesWithSubs.find((value) => value.category.id === rootId)
  return (found?.subs ?? []).filter(isValidCategory)
}

function resolveParentCategory(options: {
  currentCategory: Category
  parentCategory?: Category | null | undefined
  allCategoriesWithSubs: CategoryWithSubcategories[]
}): Category | null {
  const { currentCategory, parentCategory, allCategoriesWithSubs } = options
  if (parentCategory) return parentCategory

  const inferred = allCategoriesWithSubs.find((entry) =>
    entry.subs.some((subcategory) => subcategory.id === currentCategory.id)
  )
  return inferred?.category ?? null
}

interface CategoryNavigationProps {
  categories: Category[]
  subcategories: Category[]
  currentCategory: Category | null
  parentCategory?: Category | null | undefined
  allCategoriesWithSubs: CategoryWithSubcategories[]
  ancestry: BreadcrumbCategory[]
  locale: string
  expandedCategories: string[]
  showAllCategories: boolean
  getCategoryHref: (slug: string | null) => string
  onToggleShowAllCategories: () => void
  onToggleCategory: (slug: string) => void
}

export function CategoryNavigation({
  categories,
  subcategories,
  currentCategory,
  parentCategory,
  allCategoriesWithSubs,
  locale,
  expandedCategories,
  showAllCategories,
  getCategoryHref,
  onToggleShowAllCategories,
  onToggleCategory,
}: CategoryNavigationProps) {
  const t = useTranslations("SearchFilters")
  const tCommon = useTranslations("Common")

  const validCategories = categories.filter(isValidCategory)
  const validSubcategories = subcategories.filter(isValidCategory)

  const resolvedParentCategory = currentCategory
    ? resolveParentCategory({
        currentCategory,
        parentCategory,
        allCategoriesWithSubs,
      })
    : null

  const leafCategories = currentCategory
    ? resolvedParentCategory
      ? getLeafCategoriesForRoot(allCategoriesWithSubs, resolvedParentCategory.id)
      : validSubcategories
    : []

  return (
    <div className="pb-4">
      {currentCategory ? (
        <>
          {resolvedParentCategory ? (
            <Link
              href={getCategoryHref(resolvedParentCategory.slug)}
              className="text-sm text-muted-foreground hover:text-primary hover:underline min-h-11 flex items-center gap-1 mb-2"
            >
              <CaretRight size={14} className="rotate-180" />
              {getCategoryName(resolvedParentCategory, locale)}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onToggleShowAllCategories}
              className="text-sm text-muted-foreground hover:text-primary min-h-11 flex items-center gap-1 w-full mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <CaretRight size={14} className={showAllCategories ? "rotate-90" : "rotate-180"} />
              <span className="hover:underline">{tCommon("allCategories")}</span>
            </button>
          )}

          {showAllCategories && !resolvedParentCategory && (
            <div className="ml-2 mb-3 space-y-0.5 pl-3 py-1">
              {validCategories.map((category) => (
                <Link
                  key={category.id}
                  href={getCategoryHref(category.slug)}
                  className={`text-sm cursor-pointer min-h-11 flex items-center px-2 -mx-2 rounded-md transition-colors ${
                    category.id === currentCategory.id
                      ? "font-semibold text-sidebar-foreground bg-sidebar-accent"
                      : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {getCategoryName(category, locale)}
                </Link>
              ))}
            </div>
          )}

          {leafCategories.length > 0 && (
            <>
              <h3 className="text-xs font-semibold tracking-tight text-sidebar-muted-foreground uppercase mb-2 mt-4">
                {t("subcategories")}
              </h3>
              <nav className="space-y-0.5">
                {leafCategories.map((subcategory) => {
                  const isActive = subcategory.id === currentCategory.id
                  return (
                    <Link
                      key={subcategory.id}
                      href={getCategoryHref(subcategory.slug)}
                      className={`text-sm cursor-pointer min-h-11 flex items-center px-2 -mx-2 rounded-md transition-colors ${
                        isActive
                          ? "font-semibold text-sidebar-foreground bg-sidebar-accent"
                          : "text-sidebar-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      {getCategoryName(subcategory, locale)}
                    </Link>
                  )
                })}
              </nav>
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="font-semibold tracking-tight text-base mb-3 text-sidebar-foreground">{t("department")}</h3>
          <nav className="space-y-0.5">
            {validCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.slug)
              const categorySubcategories = getLeafCategoriesForRoot(allCategoriesWithSubs, category.id)
              const hasSubcategories = categorySubcategories.length > 0

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between group">
                    <Link
                      href={getCategoryHref(category.slug)}
                      className="text-sm cursor-pointer hover:text-sidebar-accent-foreground flex-1 min-h-11 flex items-center text-sidebar-foreground"
                    >
                      {getCategoryName(category, locale)}
                    </Link>
                    {hasSubcategories && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault()
                          onToggleCategory(category.slug)
                        }}
                        className="size-11 flex items-center justify-center hover:bg-sidebar-accent rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label={
                          isExpanded
                            ? t("collapseSubcategories", { category: getCategoryName(category, locale) })
                            : t("expandSubcategories", { category: getCategoryName(category, locale) })
                        }
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <CaretDown size={16} className="text-sidebar-muted-foreground" aria-hidden="true" />
                        ) : (
                          <CaretRight size={16} className="text-sidebar-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </div>

                  {isExpanded && hasSubcategories && (
                    <div className="ml-3 mt-1 space-y-0.5 pl-3">
                      {categorySubcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={getCategoryHref(subcategory.slug)}
                          className="text-sm cursor-pointer min-h-11 flex items-center px-2 -mx-2 rounded-md text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                          {getCategoryName(subcategory, locale)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </>
      )}
    </div>
  )
}
