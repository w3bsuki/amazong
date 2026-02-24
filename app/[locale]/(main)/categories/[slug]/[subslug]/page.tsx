import { Suspense, use } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { notFound, routing, validateLocale } from "@/i18n/routing"
import { getCategoryBySlug, getCategoryContext } from "@/lib/data/categories"
import { CategoryPageDynamicContent } from "../_components/category-page-dynamic-content"

const PLACEHOLDER_SLUG = "__placeholder__"
const PLACEHOLDER_SUBSLUG = "__placeholder__"

function isPlaceholderSegment(segment: string) {
  return segment.startsWith("[") || segment === PLACEHOLDER_SLUG || segment === PLACEHOLDER_SUBSLUG
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    slug: PLACEHOLDER_SLUG,
    subslug: PLACEHOLDER_SUBSLUG,
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

  const leafCategory = await getCategoryBySlug(subslug)
  if (
    !leafCategory ||
    !leafCategory.parent ||
    leafCategory.parent.slug !== slug ||
    leafCategory.parent.parent_id !== null
  ) {
    const tNotFound = await getTranslations({ locale, namespace: "CategoryNotFound" })
    return {
      title: tNotFound("title"),
    }
  }

  const categoryName = locale === "bg" && leafCategory.name_bg
    ? leafCategory.name_bg
    : leafCategory.name

  return {
    title: categoryName,
    description: t("metaDescription", { categoryName }),
    openGraph: {
      title: categoryName,
      description: t("metaDescription", { categoryName }),
    },
  }
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

function CategoryNestedPageContent({
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

  const categoryName = locale === "bg" && currentCategory.name_bg
    ? currentCategory.name_bg
    : currentCategory.name
  const filterableAttributes = attributes.filter((attribute) => attribute.is_filterable)

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
