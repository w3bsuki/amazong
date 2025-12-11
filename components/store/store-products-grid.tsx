"use client"

import Image from "next/image"
import Link from "next/link"
import { Images, Tag } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StoreProduct } from "@/lib/data/store"
import { productBlurDataURL } from "@/lib/image-utils"

interface StoreProductsGridProps {
  products: StoreProduct[]
  storeSlug: string
  locale: string
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

export function StoreProductsGrid({ 
  products, 
  storeSlug,
  locale,
  hasMore = false,
  onLoadMore,
  isLoading = false
}: StoreProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Images className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">
          {locale === "bg" ? "Няма продукти" : "No Products Yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {locale === "bg" 
            ? "Този магазин все още няма добавени продукти." 
            : "This store hasn't added any products yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-8">
      {/* Mobile: Instagram-style 3-column grid with minimal gaps */}
      {/* Desktop: More spacious 4-column grid with card-style product items */}
      <div className="grid grid-cols-3 gap-0.5 md:grid-cols-4 md:gap-4 md:px-4 lg:px-8 md:py-6">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/product/${storeSlug}/${product.slug}`}
            className={cn(
              "relative group overflow-hidden bg-muted",
              // Mobile: square aspect ratio like Instagram
              "aspect-square",
              // Desktop: card-like with rounded corners and hover effects
              "md:aspect-3/4 md:rounded-lg md:border md:border-border md:bg-card",
              "md:hover:border-primary/30 md:hover:shadow-lg md:transition-all md:duration-200"
            )}
          >
            {/* Product image */}
            <div className="relative size-full md:aspect-square md:h-auto">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300",
                    "group-hover:scale-105 md:group-hover:scale-100",
                    "md:rounded-t-lg"
                  )}
                  sizes="(max-width: 768px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL={productBlurDataURL()}
                  loading={index < 6 ? "eager" : "lazy"}
                />
              ) : (
                <div className="size-full bg-muted flex items-center justify-center">
                  <Images className="size-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Mobile: Hover overlay with price */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center md:hidden">
              <div className="text-white text-center">
                <p className="font-bold text-lg">{product.price.toFixed(2)} лв.</p>
                {product.list_price && product.list_price > product.price && (
                  <p className="text-sm line-through opacity-70">
                    {product.list_price.toFixed(2)} лв.
                  </p>
                )}
              </div>
            </div>
            
            {/* Desktop: Product info below image */}
            <div className="hidden md:block p-3 space-y-1.5">
              <h3 className="text-sm font-medium line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-foreground">
                  {product.price.toFixed(2)} лв.
                </span>
                {product.list_price && product.list_price > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.list_price.toFixed(2)} лв.
                  </span>
                )}
              </div>
              {product.list_price && product.list_price > product.price && (
                <div className="flex items-center gap-1 text-xs text-price-sale">
                  <Tag weight="fill" className="size-3" />
                  <span>
                    -{Math.round((1 - product.price / product.list_price) * 100)}%
                  </span>
                </div>
              )}
            </div>
            
            {/* Multiple images indicator */}
            {product.images.length > 1 && (
              <div className="absolute top-2 right-2 text-white drop-shadow-lg md:text-foreground/60">
                <Images weight="fill" className="size-5" />
              </div>
            )}
            
            {/* Featured/Boosted indicator */}
            {(product.is_featured || product.is_boosted) && (
              <div className="absolute top-2 left-2">
                <div className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-sm font-medium">
                  {product.is_featured ? "★" : "⚡"}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
      
      {/* Load more button - centered with better styling */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center py-8 px-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-full px-8 min-w-40"
          >
            {isLoading 
              ? (locale === "bg" ? "Зареждане..." : "Loading...")
              : (locale === "bg" ? "Зареди още" : "Load More")}
          </Button>
        </div>
      )}
    </div>
  )
}
