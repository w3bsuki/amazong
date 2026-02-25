import { Suspense } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { validateLocale } from "@/i18n/routing"
import { getCategoryBySlug } from "@/lib/data/categories"
import { createPageMetadata } from "@/lib/seo/metadata"
import {
  CategoryNestedPageContent,
  type CategoryPageSearchParams,
  isPlaceholderSegment,
  PLACEHOLDER_SEGMENT,
} from "../_components/category-page-content"
import { localeStaticParams } from "@/lib/next/static-params"
import { placeholderCategoryMetadata } from "../_lib/category-metadata"

export function generateStaticParams() {
  return localeStaticParams().map((params) => ({
    ...params,
    slug: PLACEHOLDER_SEGMENT,
    subslug: PLACEHOLDER_SEGMENT,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
}): Promise<Metadata> {
  "use cache"
  const { slug, subslug, locale: localeParam } = await params
  cacheLife("categories")
  cacheTag(`category:${subslug}`)

  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "CategoryPage" })

  if (isPlaceholderSegment(slug) || isPlaceholderSegment(subslug)) {
    return placeholderCategoryMetadata(locale, t)
  }

  const leafCategory = await getCategoryBySlug(subslug)
  if (
    !leafCategory ||
    !leafCategory.parent ||
    leafCategory.parent.slug !== slug ||
    leafCategory.parent.parent_id !== null
  ) {
    const tNotFound = await getTranslations({ locale, namespace: "CategoryNotFound" })
    const title = tNotFound("title")
    return createPageMetadata({
      locale,
      path: "/categories",
      title,
      description: title,
    })
  }

  const categoryName = locale === "bg" && leafCategory.name_bg
    ? leafCategory.name_bg
    : leafCategory.name

  const description = t("metaDescription", { categoryName })
  return createPageMetadata({
    locale,
    path: `/categories/${slug}/${subslug}`,
    title: categoryName,
    description,
  })
}

export default function CategoryNestedPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
  searchParams: Promise<CategoryPageSearchParams>
}) {
  return (
    <Suspense fallback={null}>
      <CategoryNestedPageContent
        paramsPromise={paramsPromise}
        searchParamsPromise={searchParamsPromise}
      />
    </Suspense>
  )
}
