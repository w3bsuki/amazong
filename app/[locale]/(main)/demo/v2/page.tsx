import { setRequestLocale } from "next-intl/server"

import { getCategoryHierarchy } from "@/lib/data/categories"
import {
  getBoostedProducts,
  getCategoryRowProducts,
  getNewestProducts,
  toUI,
} from "@/lib/data/products"

import { DemoAppFeed } from "./demo-app-feed"

export default async function DemoV2Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [categories, newestRows, boostedRows, forYouRows] = await Promise.all([
    getCategoryHierarchy(null, 2),
    getNewestProducts(30),
    getBoostedProducts(24),
    getCategoryRowProducts("fashion", 24),
  ])

  const newestProducts = newestRows
    .map((p) => toUI(p))
    .filter((p) => Boolean(p.image))
  const promotedProducts = boostedRows
    .map((p) => toUI(p))
    .filter((p) => Boolean(p.image))
  const forYouProducts = forYouRows
    .map((p) => toUI(p))
    .filter((p) => Boolean(p.image))
  const nearbyProducts = newestProducts
    .filter(
      (p) => typeof p.location === "string" && p.location.trim().length > 0
    )
    .slice(0, 20)

  return (
    <DemoAppFeed
      locale={locale}
      categories={categories}
      promotedProducts={promotedProducts.slice(0, 20)}
      newestProducts={newestProducts.slice(0, 20)}
      nearbyProducts={
        (nearbyProducts.length > 0 ? nearbyProducts : newestProducts).slice(
          0,
          20
        )
      }
      forYouProducts={
        (forYouProducts.length > 0 ? forYouProducts : newestProducts).slice(
          0,
          20
        )
      }
    />
  )
}
