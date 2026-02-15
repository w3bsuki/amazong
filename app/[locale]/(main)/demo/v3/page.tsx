import { setRequestLocale } from "next-intl/server"

import { getCategoryHierarchy } from "@/lib/data/categories"
import {
  getBoostedProducts,
  getCategoryRowProducts,
  getNewestProducts,
  toUI,
} from "@/lib/data/products"

import { DemoV3Home } from "./demo-v3-home"

/**
 * Demo V3 — Category-tab + context-pill mobile homepage.
 *
 * Layout:
 *   Header (existing)
 *   ├─ L0 category underline tabs (scrollable)
 *   ├─ Context pills (discovery modes OR sub-categories)
 *   ├─ 2-column product grid (infinite scroll)
 *   └─ Bottom nav (existing)
 *
 * Product tap → quick-view drawer (existing system).
 */
export default async function DemoV3Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Fetch categories (L0 + L1 + L2) and products in parallel
  const [categories, newestRows, boostedRows, fashionRows, electronicsRows, autoRows] =
    await Promise.all([
      getCategoryHierarchy(null, 2),
      getNewestProducts(30),
      getBoostedProducts(24),
      getCategoryRowProducts("fashion", 24),
      getCategoryRowProducts("electronics", 20),
      getCategoryRowProducts("automotive", 20),
    ])

  const toUIFiltered = (rows: Awaited<ReturnType<typeof getNewestProducts>>) =>
    rows.map((p) => toUI(p)).filter((p) => Boolean(p.image))

  const newestProducts = toUIFiltered(newestRows)
  const promotedProducts = toUIFiltered(boostedRows)
  const nearbyProducts = newestProducts
    .filter((p) => typeof p.location === "string" && p.location.trim().length > 0)
    .slice(0, 20)

  // Pre-load products by category slug for instant tab switching
  const categoryProducts: Record<string, ReturnType<typeof toUIFiltered>> = {
    fashion: toUIFiltered(fashionRows),
    electronics: toUIFiltered(electronicsRows),
    automotive: toUIFiltered(autoRows),
  }

  return (
    <DemoV3Home
      locale={locale}
      categories={categories}
      newestProducts={newestProducts.slice(0, 24)}
      promotedProducts={promotedProducts.slice(0, 20)}
      nearbyProducts={(nearbyProducts.length > 0 ? nearbyProducts : newestProducts).slice(0, 20)}
      forYouProducts={newestProducts.slice(0, 20)}
      categoryProducts={categoryProducts}
    />
  )
}
