import { Suspense, use } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { notFound, redirect, routing, validateLocale } from "@/i18n/routing"
import {
  getCategoryBySlug,
  getCategoryContext,
  getSubcategoriesForBrowse,
} from "@/lib/data/categories"

const PLACEHOLDER_SLUG = "__placeholder__"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    slug: PLACEHOLDER_SLUG,
  }))
}

interface CategoryPageSearchParams {
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

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  "use cache"
  const { slug, locale: localeParam } = await params
  cacheLife("categories")
  cacheTag(`category:${slug}`)

  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "CategoryPage" })

  if (slug.startsWith("[") || slug === PLACEHOLDER_SLUG) {
    const tCategories = await getTranslations({ locale, namespace: "Categories" })
    const categoryName = tCategories("title")

    return {
      title: categoryName,
      description: t("metaDescription", { categoryName }),
      openGraph: {
        title: categoryName,
        description: t("metaDescription", { categoryName }),
      },
    }
  }

  const category = await getCategoryBySlug(slug)

  if (!category) {
    const tNotFound = await getTranslations({ locale, namespace: "CategoryNotFound" })
    return {
      title: tNotFound("title"),
    }
  }

  const categoryName = locale === "bg" && category.name_bg
    ? category.name_bg
    : category.name

  return {
    title: categoryName,
    description: t("metaDescription", { categoryName }),
    openGraph: {
      title: categoryName,
      description: t("metaDescription", { categoryName }),
    },
  }
}

export default function CategoryPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<CategoryPageSearchParams>
}) {
  return (
    <Suspense fallback={null}>
      <CategoryPageContent paramsPromise={paramsPromise} searchParamsPromise={searchParamsPromise} />
    </Suspense>
  )
}

function CategoryPageContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ slug: string; locale: string }>
  searchParamsPromise: Promise<CategoryPageSearchParams>
}) {
  const { slug, locale } = use(paramsPromise)
  setRequestLocale(locale)

  if (slug.startsWith("[") || slug === PLACEHOLDER_SLUG) {
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

  const subcategoriesWithCounts = use(getSubcategoriesForBrowse(currentCategory.id, false))

  const categoryName = locale === "bg" && currentCategory.name_bg
    ? currentCategory.name_bg
    : currentCategory.name

  const filterableAttributes = categoryContext.attributes.filter((attribute) => attribute.is_filterable)
  const { CategoryPageDynamicContent } = use(import("./_components/category-page-dynamic-content"))

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
