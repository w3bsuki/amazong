import * as React from "react"
import { CategoryChips } from "@/components/home/category-chips"
import { PromotedCarousel } from "@/components/home/promoted-carousel"
import { ProductGrid } from "@/components/home/product-grid"

export function HomePage({
  categories,
  promoted,
  products,
}: {
  categories: any[]
  promoted: any[]
  products: any[]
}) {
  return (
    <div className="pb-24">
      <CategoryChips items={categories} />
      <PromotedCarousel items={promoted} />
      <ProductGrid items={products} />
    </div>
  )
}
