"use client"

// =============================================================================
// ADAPTIVE PRODUCT PAGE DEMO
// =============================================================================
// Shows how the same product page layout adapts to different categories.
// Toggle between Electronics, Automotive, Fashion, Real Estate to see
// how hero specs and key info change per category.
// =============================================================================

import { useState } from "react"
import { ProductPageDesktop } from "./_components/product-page-desktop"
import { ProductPageMobile } from "./_components/product-page-mobile"
import { DEMO_PRODUCTS, type ProductCategory } from "./_data/demo-products"

const CATEGORIES: { id: ProductCategory; label: string; emoji: string }[] = [
  { id: "electronics", label: "Electronics", emoji: "📱" },
  { id: "automotive", label: "Automotive", emoji: "🚗" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "real-estate", label: "Real Estate", emoji: "🏠" },
]

export default function AdaptiveProductPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("electronics")
  const product = DEMO_PRODUCTS[activeCategory]

  return (
    <div className="min-h-dvh bg-background">
      {/* Category Switcher - Demo Only */}
      <div className="sticky top-0 z-[60] bg-card border-b border-border">
        <div className="container py-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-medium text-muted-foreground shrink-0 hidden sm:block">
              Demo Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${activeCategory === cat.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                <span className="mr-1.5">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <ProductPageDesktop product={product} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <ProductPageMobile product={product} />
      </div>
    </div>
  )
}
