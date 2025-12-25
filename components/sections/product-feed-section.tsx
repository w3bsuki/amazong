"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/routing"
import { ArrowRight } from "@phosphor-icons/react"

interface Product {
  id: string
  title: string
  price: number
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: 'basic' | 'premium' | 'business'
  sellerVerified?: boolean
  categorySlug?: string
  location?: string
  condition?: string
  brand?: string
  make?: string
  model?: string
  year?: string
  isBoosted?: boolean
  tags?: string[]
  attributes?: Record<string, string>
}

interface ProductFeedSectionProps {
  locale: string
  type: "newest" | "promoted" | "deals"
  title: string
  subtitle?: string
  viewAllLink?: string
}

export function ProductFeedSection({ locale, type, title, subtitle, viewAllLink }: ProductFeedSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [pageSize, setPageSize] = useState(12)

  useEffect(() => {
    const computePageSize = () => {
      const w = window.innerWidth
      if (w >= 1536) return 14
      if (w >= 1280) return 10
      if (w >= 1024) return 8
      if (w >= 768) return 6
      return 4
    }
    setPageSize(computePageSize())
  }, [])

  const fetchProducts = useCallback(async (pageNum: number, limit: number, append = false) => {
    setIsLoading(true)
    try {
      const endpoint = type === "promoted"
        ? "/api/products/promoted"
        : type === "deals"
          ? "/api/products/deals"
          : "/api/products/newest"
      const url = `${endpoint}?page=${pageNum}&limit=${limit}`

      const res = await fetch(url)
      if (!res.ok) return

      const data = await res.json()
      if (!data || !Array.isArray(data.products)) return

      const transformed: Product[] = data.products.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
        listPrice: p.listPrice ?? p.list_price,
        isOnSale: p.isOnSale ?? p.is_on_sale,
        salePercent: p.salePercent ?? p.sale_percent,
        saleEndDate: p.saleEndDate ?? p.sale_end_date,
        image: p.image || (Array.isArray(p.images) ? p.images[0] : "/placeholder.svg"),
        rating: p.rating,
        reviews: p.reviews ?? p.review_count,
        slug: p.slug,
        storeSlug: p.storeSlug ?? p.store_slug,
        sellerId: p.sellerId,
        sellerName: p.sellerName,
        sellerAvatarUrl: p.sellerAvatarUrl,
        sellerTier: p.sellerTier,
        sellerVerified: p.sellerVerified,
        categorySlug: p.categorySlug || p.category_slug || undefined,
        location: p.location,
        isBoosted: type === 'promoted' || p.isBoosted,
      }))

      if (append) {
        setProducts(prev => [...prev, ...transformed])
      } else {
        setProducts(transformed)
      }
      setHasMore(data.hasMore ?? (transformed.length === limit))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchProducts(1, pageSize, false)
  }, [fetchProducts, pageSize])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage, pageSize, true)
    }
  }

  return (
    <section className="w-full py-8" aria-label={title}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {locale === "bg" ? "Виж всички" : "View all"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {products.length === 0 && isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
            {products.map((product, index) => {
              const { sellerName, categorySlug, ...rest } = product
              return (
                <div key={product.id}>
                  <ProductCard
                    {...rest}
                    categorySlug={categorySlug || undefined}
                    sellerName={sellerName || undefined}
                    showPills={true}
                    index={index}
                  />
                </div>
              )
            })}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className={cn(
                  "px-8 py-3 rounded-full font-medium text-sm transition-all",
                  "bg-muted hover:bg-muted/80 text-foreground",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {locale === "bg" ? "Зареждане..." : "Loading..."}
                  </span>
                ) : (
                  locale === "bg" ? "Зареди още" : "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
