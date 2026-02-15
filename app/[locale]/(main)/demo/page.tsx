import { getTranslations, setRequestLocale } from "next-intl/server"

import { getCategoryHierarchy } from "@/lib/data/categories"
import { getBoostedProducts, getCategoryRowProducts, getNewestProducts, toUI } from "@/lib/data/products"

import { DemoLandingLab } from "./demo-lab"

export default async function DemoLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const tMobile = await getTranslations({ locale, namespace: "Home.mobile" })
  const tFilterHub = await getTranslations({ locale, namespace: "FilterHub" })
  const tCommon = await getTranslations({ locale, namespace: "Common" })

  const [categories, newestRows, boostedRows, forYouRows] = await Promise.all([
    getCategoryHierarchy(null, 2),
    getNewestProducts(30),
    getBoostedProducts(24),
    getCategoryRowProducts("fashion", 24),
  ])

  const newestProducts = newestRows.map((product) => toUI(product)).filter((product) => Boolean(product.image))
  const promotedProducts = boostedRows.map((product) => toUI(product)).filter((product) => Boolean(product.image))
  const forYouProducts = forYouRows.map((product) => toUI(product)).filter((product) => Boolean(product.image))
  const nearbyProducts = newestProducts
    .filter((product) => typeof product.location === "string" && product.location.trim().length > 0)
    .slice(0, 14)

  const heroProduct = promotedProducts[0] ?? newestProducts[0] ?? forYouProducts[0] ?? null

  const normalizedPromoted = promotedProducts.slice(0, 14)
  const normalizedNewest = newestProducts.slice(0, 14)
  const normalizedNearby = (nearbyProducts.length > 0 ? nearbyProducts : newestProducts).slice(0, 14)
  const normalizedForYou = (forYouProducts.length > 0 ? forYouProducts : newestProducts).slice(0, 14)

  return (
    <DemoLandingLab
      locale={locale}
      categories={categories}
      heroProduct={heroProduct}
      promotedProducts={normalizedPromoted}
      newestProducts={normalizedNewest}
      nearbyProducts={normalizedNearby}
      forYouProducts={normalizedForYou}
      labels={{
        seeAll: tMobile("seeAll"),
        scopePromoted: locale === "bg" ? "Промо" : "Promo",
        scopeNewest: locale === "bg" ? "Нови" : "New",
        scopeNearby: locale === "bg" ? "Близо" : "Near",
        scopeForYou: locale === "bg" ? "За теб" : "For you",
        filterActionLabel: tFilterHub("allFilters"),
        filterTitle: tFilterHub("allFilters"),
        allCategoriesLabel: tCommon("allCategories"),
        clearLabel: tCommon("clear"),
        closeLabel: tCommon("close"),
        scopeBanners: locale === "bg"
          ? {
              promoted: {
                eyebrow: tMobile("promoBannerEyebrow"),
                title: "Промотирани обяви",
                subtitle: tMobile("promoBannerSubtitle"),
              },
              newest: {
                eyebrow: "Най-нови",
                title: "Нови обяви",
                subtitle: "Последно добавени продукти в Treido.",
              },
              nearby: {
                eyebrow: "Близо до теб",
                title: "Оферти наблизо",
                subtitle: "Открий продавачи и продукти във вашия район.",
              },
              forYou: {
                eyebrow: "За теб",
                title: "Подбрано за теб",
                subtitle: "Персонализирани предложения според интересите ти.",
              },
            }
          : {
              promoted: {
                eyebrow: tMobile("promoBannerEyebrow"),
                title: "Promoted listings",
                subtitle: tMobile("promoBannerSubtitle"),
              },
              newest: {
                eyebrow: "Newest",
                title: "Fresh listings",
                subtitle: "Latest products just added to Treido.",
              },
              nearby: {
                eyebrow: "Nearby",
                title: "Offers near you",
                subtitle: "Browse products from sellers around your location.",
              },
              forYou: {
                eyebrow: "For you",
                title: "Picked for you",
                subtitle: "Personalized suggestions based on your interests.",
              },
            },
      }}
    />
  )
}
