import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { getStoreInfo, getStoreProducts, getSellerFeedback } from "@/lib/data/store"
import { StorePageClient } from "@/components/store/store-page-client"

interface StorePageProps {
  params: Promise<{
    storeSlug: string
    locale: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { storeSlug, locale } = await params
  const store = await getStoreInfo(storeSlug)
  
  if (!store) {
    return {
      title: locale === "bg" ? "Магазин не е намерен" : "Store Not Found",
    }
  }
  
  const title = `${store.store_name} | ${locale === "bg" ? "Магазин" : "Store"}`
  const description = store.description 
    || (locale === "bg" 
      ? `Разгледайте продуктите на ${store.store_name}. ${store.total_products} обяви, ${store.positive_feedback_percentage}% положителни отзиви.`
      : `Browse products from ${store.store_name}. ${store.total_products} listings, ${store.positive_feedback_percentage}% positive feedback.`)
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: store.avatar_url ? [store.avatar_url] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function StorePage({ params }: StorePageProps) {
  await connection()
  const { storeSlug, locale } = await params
  setRequestLocale(locale)
  
  // Fetch store info
  const store = await getStoreInfo(storeSlug)
  
  if (!store) {
    notFound()
  }
  
  // Fetch initial products and reviews in parallel
  const [productsData, reviewsData] = await Promise.all([
    getStoreProducts(store.id, { limit: 12 }),
    getSellerFeedback(store.id, { limit: 10 }),
  ])
  
  return (
    <StorePageClient
      store={store}
      initialProducts={productsData.products}
      initialProductsTotal={productsData.total}
      initialReviews={reviewsData.feedback}
      initialReviewsTotal={reviewsData.total}
      locale={locale}
    />
  )
}
