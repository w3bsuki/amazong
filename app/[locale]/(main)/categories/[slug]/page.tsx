import { Suspense } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { validateLocale } from "@/i18n/routing"
import { getCategoryBySlug } from "@/lib/data/categories"
import {
  CategoryRootPageContent,
  type CategoryPageSearchParams,
  isPlaceholderSegment,
  PLACEHOLDER_SEGMENT,
} from "./_components/category-page-content"
import { localeStaticParams } from "@/lib/next/static-params"
import { placeholderCategoryMetadata } from "./_lib/category-metadata"

export function generateStaticParams() {
  return localeStaticParams().map((params) => ({
    ...params,
    slug: PLACEHOLDER_SEGMENT,
  }))
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

  if (isPlaceholderSegment(slug)) {
    return placeholderCategoryMetadata(locale, t)
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
      <CategoryRootPageContent
        paramsPromise={paramsPromise}
        searchParamsPromise={searchParamsPromise}
      />
    </Suspense>
  )
}
