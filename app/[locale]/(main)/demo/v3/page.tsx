import { setRequestLocale } from "next-intl/server"

import { getCategoryHierarchy } from "@/lib/data/categories"
import {
  getBoostedProducts,
  getCategoryRowProducts,
  getDealsProducts,
  getNewestProducts,
  toUI,
} from "@/lib/data/products"

import { DemoV3Home } from "./demo-v3-home"

/** Pool size for each product feed. */
const POOL = 16
/** Max featured categories to pre-load products for. */
const FEATURED_LIMIT = 6
/** Keep demo routes responsive on slow data sources. */
const DEMO_FETCH_TIMEOUT_MS = 4500

async function withDemoTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), DEMO_FETCH_TIMEOUT_MS)),
    ])
    return result
  } catch {
    return fallback
  }
}

/**
 * Demo V3 — Best-in-class mobile C2C/B2B marketplace homepage.
 *
 * Architecture:
 *   ┌─ Sticky L0 category tabs (icons + underline + overflow sheet)
 *   ├─ Sticky context pills (discovery scopes / sub-categories)
 *   ├─ Context line (product count + browse link)
 *   ├─ Edge-to-edge 2-col product grid
 *   └─ Product tap → quick-view drawer (existing)
 *
 * Data strategy: pre-load products per featured category for instant
 * tab switching. Discovery scopes share newest/boosted/deals/nearby pools.
 */
export default async function DemoV3Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Phase 1: categories + global feeds
  const [categories, newestRows, boostedRows, dealsRows] = await Promise.all([
    withDemoTimeout(getCategoryHierarchy(null, 1), []),
    withDemoTimeout(getNewestProducts(28), []),
    withDemoTimeout(getBoostedProducts(POOL), []),
    withDemoTimeout(getDealsProducts(POOL), []),
  ])

  const featured = categories.slice(0, FEATURED_LIMIT)

  // Phase 2: per-category product pools (parallel)
  const categoryRows = await Promise.all(
    featured.map(async (cat) => {
      const rows = await withDemoTimeout(getCategoryRowProducts(cat.slug, POOL), [])
      return { slug: cat.slug, rows }
    })
  )

  const toUIRows = (rows: Awaited<ReturnType<typeof getNewestProducts>>) =>
    rows.map((p) => toUI(p)).filter((p) => Boolean(p.image))

  const newestProducts = toUIRows(newestRows)
  const promotedProducts = toUIRows(boostedRows)
  const dealsProducts = toUIRows(dealsRows)
  const nearbyProducts = newestProducts
    .filter((p) => typeof p.location === "string" && p.location.trim().length > 0)
    .slice(0, POOL)

  const categoryProducts: Record<string, ReturnType<typeof toUIRows>> = {}
  for (const { slug, rows } of categoryRows) {
    categoryProducts[slug] = toUIRows(rows).slice(0, POOL)
  }

  // "For you" — first featured category pool as a lightweight personalization stand-in
  const firstSlug = featured[0]?.slug
  const forYouPool = firstSlug ? (categoryProducts[firstSlug] ?? newestProducts) : newestProducts

  return (
    <DemoV3Home
      locale={locale}
      categories={categories}
      newestProducts={newestProducts.slice(0, POOL)}
      promotedProducts={promotedProducts.slice(0, POOL)}
      dealsProducts={dealsProducts.slice(0, POOL)}
      nearbyProducts={(nearbyProducts.length > 0 ? nearbyProducts : newestProducts).slice(0, POOL)}
      forYouProducts={forYouPool.slice(0, POOL)}
      categoryProducts={categoryProducts}
    />
  )
}
