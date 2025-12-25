"use client"

import { useState, useEffect, useCallback } from "react"
import { ProductCarouselSection, type CarouselProduct } from "@/components/shared/product/product-carousel-section"

interface CategoryCarouselClientProps {
  locale: string
  categorySlug: string
  title: string
  initialProducts: CarouselProduct[]
  tabs: { id: string; label: string }[]
  icon?: React.ReactNode
  variant?: "default" | "highlighted" | "clean"
}

export function CategoryCarouselClient({
  locale,
  categorySlug,
  title,
  initialProducts,
  tabs,
  icon,
  variant = "default",
}: CategoryCarouselClientProps) {
  const [activeTabId, setActiveTabId] = useState("all")
  const [products, setProducts] = useState<CarouselProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProducts = useCallback(async (slug: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/products/category/${slug}?limit=18`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching category products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleTabChange = (id: string) => {
    if (id === activeTabId) return
    setActiveTabId(id)
    
    if (id === "all") {
      setProducts(initialProducts)
    } else {
      fetchProducts(id)
    }
  }

  return (
    <ProductCarouselSection
      title={title}
      products={products}
      ctaText={locale === "bg" ? "Виж всички" : "See all"}
      ctaHref={`/categories/${activeTabId === "all" ? categorySlug : activeTabId}`}
      emptyMessage={locale === "bg" ? "Няма обяви в тази категория" : "No listings in this category"}
      icon={icon}
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={handleTabChange}
      isLoading={isLoading}
      variant={variant}
    />
  )
}
