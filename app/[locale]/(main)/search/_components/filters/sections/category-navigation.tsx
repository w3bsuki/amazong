"use client"

import { ChevronDown as CaretDown, ChevronRight as CaretRight } from "lucide-react";

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { CategoryBreadcrumbTrail } from "./category-breadcrumb-trail"
import { getCategoryName, isValidCategory } from "../_lib/category-utils"
import type { BreadcrumbCategory, Category, CategoryWithSubcategories } from "../types"

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
  onToggleShowAllCategories: () => void
  onToggleCategory: (slug: string) => void
}

export function CategoryNavigation({
  categories,
  subcategories,
  currentCategory,
  parentCategory,
  allCategoriesWithSubs,
  ancestry,
  locale,
  expandedCategories,
  showAllCategories,
  onToggleShowAllCategories,
  onToggleCategory,
}: CategoryNavigationProps) {
  const t = useTranslations("SearchFilters")
  const tCommon = useTranslations("Common")

  const validCategories = categories.filter(isValidCategory)
  const validSubcategories = subcategories.filter(isValidCategory)

  const getSubcategoriesFor = (categoryId: string) => {
    const found = allCategoriesWithSubs.find((value) => value.category.id === categoryId)
    return (found?.subs ?? []).filter(isValidCategory)
  }

  return (
    <div className="pb-4">
      {currentCategory ? (
        <>
          {ancestry.length > 1 ? (
            <CategoryBreadcrumbTrail ancestry={ancestry} className="mb-4" />
          ) : parentCategory ? (
            <Link
              href={`/categories/${parentCategory.slug}`}
              className="text-sm text-muted-foreground hover:text-primary hover:underline min-h-11 flex items-center gap-1 mb-2"
            >
              <CaretRight size={14} className="rotate-180" />
              {getCategoryName(parentCategory, locale)}
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

          {showAllCategories && !parentCategory && ancestry.length <= 1 && (
            <div className="ml-2 mb-3 space-y-0.5 pl-3 py-1">
              {validCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
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

          {validSubcategories.length > 0 && (
            <>
              <h3 className="text-xs font-semibold tracking-tight text-sidebar-muted-foreground uppercase mb-2 mt-4">
                {t("subcategories")}
              </h3>
              <nav className="space-y-0.5">
                {validSubcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${subcategory.slug}`}
                    className="text-sm cursor-pointer text-sidebar-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent min-h-11 flex items-center px-2 -mx-2 rounded-md transition-colors"
                  >
                    {getCategoryName(subcategory, locale)}
                  </Link>
                ))}
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
              const categorySubcategories = getSubcategoriesFor(category.id)
              const hasSubcategories = categorySubcategories.length > 0

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between group">
                    <Link
                      href={`/categories/${category.slug}`}
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
                          href={`/categories/${subcategory.slug}`}
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
