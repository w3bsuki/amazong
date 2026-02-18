import { Suspense, use } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import CategorySlugLoading from "./loading"
import {
  getCategoryBySlug,
  getCategoryContext,
  getSubcategoriesForBrowse,
} from "@/lib/data/categories"
import { CategoryPageDynamicContent } from "./_components/category-page-dynamic-content"

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
  const { slug, locale } = await params
  setRequestLocale(locale)

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

  const t = await getTranslations({ locale, namespace: "CategoryPage" })

  return {
    title: t("metaTitle", { categoryName }),
    description: t("metaDescription", { categoryName }),
    openGraph: {
      title: t("metaTitle", { categoryName }),
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
    <Suspense fallback={<CategorySlugLoading />}>
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

  const categoryContext = use(getCategoryContext(slug))
  if (!categoryContext) {
    notFound()
  }

  const {
    current: currentCategory,
    parent: parentCategory,
    siblings: siblingCategories,
  } = categoryContext

  const subcategoriesWithCounts = use(getSubcategoriesForBrowse(currentCategory.id, false))

  const categoryName = locale === "bg" && currentCategory.name_bg
    ? currentCategory.name_bg
    : currentCategory.name

  const filterableAttributes = categoryContext.attributes.filter((attribute) => attribute.is_filterable)

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
