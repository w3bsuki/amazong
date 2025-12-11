"use client"

import { useState, useCallback } from "react"
import { StoreProfileHeader } from "@/components/store/store-profile-header"
import { StoreTabs, type StoreTab } from "@/components/store/store-tabs"
import { StoreProductsGrid } from "@/components/store/store-products-grid"
import { StoreReviewsList } from "@/components/store/store-reviews-list"
import type { StoreInfo, StoreProduct, SellerFeedback } from "@/lib/data/store"

interface StorePageClientProps {
  store: StoreInfo
  initialProducts: StoreProduct[]
  initialProductsTotal: number
  initialReviews: SellerFeedback[]
  initialReviewsTotal: number
  locale: string
}

const PRODUCTS_PER_PAGE = 12
const REVIEWS_PER_PAGE = 10

export function StorePageClient({
  store,
  initialProducts,
  initialProductsTotal,
  initialReviews,
  initialReviewsTotal,
  locale
}: StorePageClientProps) {
  const [activeTab, setActiveTab] = useState<StoreTab>("products")
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts)
  const [productsTotal, setProductsTotal] = useState(initialProductsTotal)
  const [productsLoading, setProductsLoading] = useState(false)
  const [reviews, setReviews] = useState<SellerFeedback[]>(initialReviews)
  const [reviewsTotal, setReviewsTotal] = useState(initialReviewsTotal)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const loadMoreProducts = useCallback(async () => {
    if (productsLoading || products.length >= productsTotal) return
    
    setProductsLoading(true)
    try {
      const response = await fetch(
        `/api/store/${store.id}/products?offset=${products.length}&limit=${PRODUCTS_PER_PAGE}`
      )
      if (response.ok) {
        const data = await response.json()
        setProducts(prev => [...prev, ...data.products])
        setProductsTotal(data.total)
      }
    } catch (error) {
      console.error("Failed to load more products:", error)
    } finally {
      setProductsLoading(false)
    }
  }, [store.id, products.length, productsTotal, productsLoading])

  const loadMoreReviews = useCallback(async () => {
    if (reviewsLoading || reviews.length >= reviewsTotal) return
    
    setReviewsLoading(true)
    try {
      const response = await fetch(
        `/api/store/${store.id}/reviews?offset=${reviews.length}&limit=${REVIEWS_PER_PAGE}`
      )
      if (response.ok) {
        const data = await response.json()
        setReviews(prev => [...prev, ...data.feedback])
        setReviewsTotal(data.total)
      }
    } catch (error) {
      console.error("Failed to load more reviews:", error)
    } finally {
      setReviewsLoading(false)
    }
  }, [store.id, reviews.length, reviewsTotal, reviewsLoading])

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <StoreProfileHeader store={store} locale={locale} />
      
      {/* Tabs - sticky on scroll */}
      <StoreTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        productCount={productsTotal}
        reviewCount={reviewsTotal}
        locale={locale}
      />
      
      {/* Tab Content - centered container matching main page */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl">
          {activeTab === "products" && (
            <StoreProductsGrid
              products={products}
              storeSlug={store.store_slug}
              locale={locale}
              hasMore={products.length < productsTotal}
              onLoadMore={loadMoreProducts}
              isLoading={productsLoading}
            />
          )}
          
          {activeTab === "reviews" && (
            <StoreReviewsList
              reviews={reviews}
              locale={locale}
              hasMore={reviews.length < reviewsTotal}
              onLoadMore={loadMoreReviews}
              isLoading={reviewsLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}
