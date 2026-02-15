import { setRequestLocale } from "next-intl/server"

import { getCategoryHierarchy } from "@/lib/data/categories"
import {
  getBoostedProducts,
  getCategoryRowProducts,
  getDealsProducts,
  getNewestProducts,
  toUI,
} from "@/lib/data/products"

import { DemoV4Home } from "./demo-v4-home"

const CATEGORY_POOL_LIMIT = 24
const FEATURED_CATEGORY_LIMIT = 8

/**
 * Demo V4 — Refined mobile homepage IA.
 *
 * Goals:
 * - Keep fast, in-place browsing on home.
 * - Add explicit path to full category pages.
 * - Remove ambiguity between quick browse and deep browse.
 */
export default async function DemoV4Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [categories, newestRows, boostedRows, dealsRows] = await Promise.all([
    getCategoryHierarchy(null, 2),
    getNewestProducts(40),
    getBoostedProducts(28),
    getDealsProducts(24),
  ])

  const featuredCategories = categories.slice(0, FEATURED_CATEGORY_LIMIT)

  const categoryRows = await Promise.all(
    featuredCategories.map(async (category) => {
      try {
        const rows = await getCategoryRowProducts(category.slug, CATEGORY_POOL_LIMIT)
        return { slug: category.slug, rows }
      } catch {
        return { slug: category.slug, rows: [] }
      }
    })
  )

  const toUIRows = (rows: Awaited<ReturnType<typeof getNewestProducts>>) =>
    rows.map((product) => toUI(product)).filter((product) => Boolean(product.image))

  const newestProducts = toUIRows(newestRows)
  const promotedProducts = toUIRows(boostedRows)
  const dealsProducts = toUIRows(dealsRows)
  const nearbyProducts = newestProducts
    .filter((product) => typeof product.location === "string" && product.location.trim().length > 0)
    .slice(0, CATEGORY_POOL_LIMIT)

  const categoryProducts: Record<string, ReturnType<typeof toUIRows>> = {}
  for (const categoryData of categoryRows) {
    categoryProducts[categoryData.slug] = toUIRows(categoryData.rows).slice(0, CATEGORY_POOL_LIMIT)
  }

  const fallbackCategorySlug = featuredCategories[0]?.slug
  const forYouProducts = fallbackCategorySlug
    ? (categoryProducts[fallbackCategorySlug] ?? newestProducts)
    : newestProducts

  return (
    <DemoV4Home
      locale={locale}
      categories={categories}
      newestProducts={newestProducts.slice(0, CATEGORY_POOL_LIMIT)}
      promotedProducts={promotedProducts.slice(0, CATEGORY_POOL_LIMIT)}
      nearbyProducts={(nearbyProducts.length > 0 ? nearbyProducts : newestProducts).slice(0, CATEGORY_POOL_LIMIT)}
      dealsProducts={dealsProducts.slice(0, CATEGORY_POOL_LIMIT)}
      forYouProducts={forYouProducts.slice(0, CATEGORY_POOL_LIMIT)}
      categoryProducts={categoryProducts}
    />
  )
}
