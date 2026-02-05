import * as React from "react"
import { ProductCard, type Product } from "@/components/product/product-card"

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <section className="mt-6">
      <div className="px-4">
        <h2 className="text-base font-semibold tracking-tight">New</h2>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  )
}
