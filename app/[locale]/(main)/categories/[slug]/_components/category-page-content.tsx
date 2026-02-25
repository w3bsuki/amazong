import { use } from "react"
import { setRequestLocale } from "next-intl/server"

import { notFound, redirect } from "@/i18n/routing"
import {
  getCategoryContext,
  getSubcategoriesForBrowse,
} from "@/lib/data/categories"

import { CategoryPageDynamicContent } from "./category-page-dynamic-content"

export const PLACEHOLDER_SEGMENT = "__placeholder__"

export function isPlaceholderSegment(segment: string) {
  return segment.startsWith("[") || segment === PLACEHOLDER_SEGMENT
}

export interface CategoryPageSearchParams {
  minPrice?: string
  maxPrice?: string
  minRating?: string
  subcategory?: string
  tag?: string
  deals?: string
  brand?: string
  availability?: string
  sort?: string
  page?: string
  [key: string]: string | string[] | undefined
}

export function CategoryRootPageContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ slug: string; locale: string }>
  searchParamsPromise: Promise<CategoryPageSearchParams>
}) {
  const { slug, locale } = use(paramsPromise)
  setRequestLocale(locale)

  if (isPlaceholderSegment(slug)) {
    return null
  }

  const categoryContext = use(getCategoryContext(slug))
  if (!categoryContext) {
    notFound()
  }

  const {
    current: currentCategory,
    parent: parentCategory,
    siblings: siblingCategories,
  } = categoryContext

  if (currentCategory.parent_id) {
    // Canonical leaf route is /categories/[root]/[leaf] in the strict 2-level tree.
    if (parentCategory && !parentCategory.parent_id) {
      redirect({
        href: `/categories/${parentCategory.slug}/${currentCategory.slug}`,
        locale,
      })
    }
    notFound()
  }

  const subcategoriesWithCounts = use(
    getSubcategoriesForBrowse(currentCategory.id, false)
  )

  const categoryName =
    locale === "bg" && currentCategory.name_bg
      ? currentCategory.name_bg
      : currentCategory.name

  const filterableAttributes = categoryContext.attributes.filter(
    (attribute) => attribute.is_filterable
  )

  return (
    <CategoryPageDynamicContent
      locale={locale}
      slug={slug}
      categoryId={currentCategory.id}
      searchParamsPromise={searchParamsPromise}
      currentCategory={currentCategory}
      parentCategory={parentCategory}
      siblingCategories={siblingCategories}
      subcategoriesWithCounts={subcategoriesWithCounts}
      filterableAttributes={filterableAttributes}
      categoryName={categoryName}
    />
  )
}

export function CategoryNestedPageContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ slug: string; subslug: string; locale: string }>
  searchParamsPromise: Promise<CategoryPageSearchParams>
}) {
  const { locale, slug: rootSlug, subslug } = use(paramsPromise)
  setRequestLocale(locale)

  if (isPlaceholderSegment(rootSlug) || isPlaceholderSegment(subslug)) {
    return null
  }

  const categoryContext = use(getCategoryContext(subslug))
  if (!categoryContext) {
    notFound()
  }

  const {
    current: currentCategory,
    parent: parentCategory,
    siblings: siblingCategories,
    children,
    attributes,
  } = categoryContext

  const isLeafCategory = children.length === 0
  const hasValidRootParent =
    parentCategory?.slug === rootSlug && parentCategory.parent_id === null

  if (!currentCategory.parent_id || !isLeafCategory || !hasValidRootParent) {
    notFound()
  }

  const categoryName =
    locale === "bg" && currentCategory.name_bg
      ? currentCategory.name_bg
      : currentCategory.name
  const filterableAttributes = attributes.filter(
    (attribute) => attribute.is_filterable
  )

  return (
    <CategoryPageDynamicContent
      locale={locale}
      slug={subslug}
      categoryId={currentCategory.id}
      searchParamsPromise={searchParamsPromise}
      currentCategory={currentCategory}
      parentCategory={parentCategory}
      siblingCategories={siblingCategories}
      subcategoriesWithCounts={[]}
      filterableAttributes={filterableAttributes}
      categoryName={categoryName}
    />
  )
}

