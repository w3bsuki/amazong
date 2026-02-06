/**
 * ProductGrid — Responsive product grid
 *
 * A responsive product grid that adapts column count via standard breakpoints.
 *
 * Breakpoints:
 * - Default: 2 columns
 * - sm: 3 columns
 * - md: 4 columns
 * - lg: 5 columns
 * - xl: 6 columns (compact density)
 *
 * Usage:
 * ```tsx
 * <ProductGrid products={products} viewMode="grid" />
 * <ProductGrid products={products} viewMode="list" />
 * ```
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shared/product/product-card";
import { ProductCardList } from "@/components/shared/product/product-card-list";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export type ViewMode = "grid" | "list";

export interface ProductGridProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  // Optional fields - use `| undefined` for exactOptionalPropertyTypes compatibility
  listPrice?: number | undefined;
  originalPrice?: number | null | undefined;
  isOnSale?: boolean | undefined;
  salePercent?: number | undefined;
  saleEndDate?: string | null | undefined;
  createdAt?: string | null | undefined;
  slug?: string | null | undefined;
  storeSlug?: string | null | undefined;
  username?: string | null | undefined;
  sellerId?: string | null | undefined;
  sellerName?: string | null | undefined;
  sellerAvatarUrl?: string | null | undefined;
  sellerVerified?: boolean | undefined;
  location?: string | undefined;
  condition?: string | undefined;
  isBoosted?: boolean | undefined;
  boostExpiresAt?: string | null | undefined;
  rating?: number | undefined;
  reviews?: number | undefined;
  tags?: string[] | undefined;
  categoryRootSlug?: string | undefined;
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }> | undefined;
  attributes?: Record<string, unknown> | undefined;
  freeShipping?: boolean | undefined;
}

export interface ProductGridProps {
  /** Products to display */
  products: ProductGridProduct[];
  /** Display mode - grid or list */
  viewMode?: ViewMode;
  /** Density - normal or compact for more columns */
  density?: "normal" | "compact";
  /** ProductCard appearance (default: card). Useful for mobile browse tiles. */
  cardAppearance?: "card" | "tile";
  /** ProductCard media aspect ratio (default: square). */
  cardMedia?: "square" | "landscape";
  /** ProductCard density tuning (default: default). */
  cardDensity?: "default" | "compact";
  /** ProductCard title line clamp (default: 1). */
  cardTitleLines?: 1 | 2;
  /** Additional className */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Grid column classes based on container width
 */
const gridColumnClasses = {
  normal: [
    "grid-cols-2",
    "sm:grid-cols-3",
    "md:grid-cols-4",
    "lg:grid-cols-5",
  ],
  compact: [
    "grid-cols-2",
    "sm:grid-cols-3",
    "md:grid-cols-4",
    "lg:grid-cols-5",
    "xl:grid-cols-6",
  ],
} as const;

export function ProductGrid({
  products,
  viewMode = "grid",
  density = "normal",
  cardAppearance,
  cardMedia,
  cardDensity,
  cardTitleLines,
  className,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <ProductGridSkeleton
        viewMode={viewMode}
        density={density}
        {...(cardMedia ? { cardMedia } : {})}
      />
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      id="product-grid"
      data-slot="product-grid"
      className="@container"
      role="list"
      aria-live="polite"
      tabIndex={-1}
    >
      <div
        className={cn(
          viewMode === "list"
            ? "flex flex-col gap-2"
            : ["grid gap-(--product-grid-gap)", ...gridColumnClasses[density]],
          className
        )}
      >
        {products.map((product, index) => (
          <div key={product.id} role="listitem">
            {viewMode === "list" ? (
              <ProductCardList
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.listPrice ?? product.originalPrice ?? null}
                image={product.image}
                createdAt={product.createdAt ?? null}
                slug={product.slug ?? null}
                username={product.storeSlug ?? product.username ?? null}
                sellerId={product.sellerId ?? null}
                sellerName={product.sellerName || product.storeSlug || undefined}
                sellerVerified={Boolean(product.sellerVerified)}
                location={product.location}
                condition={product.condition}
                freeShipping={product.freeShipping ?? false}
              />
            ) : (
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.listPrice ?? product.originalPrice ?? null}
                isOnSale={Boolean(product.isOnSale)}
                salePercent={product.salePercent ?? 0}
                saleEndDate={product.saleEndDate ?? null}
                createdAt={product.createdAt ?? null}
                image={product.image}
                rating={product.rating ?? 0}
                reviews={product.reviews ?? 0}
                slug={product.slug ?? null}
                username={product.storeSlug ?? product.username ?? null}
                sellerId={product.sellerId ?? null}
                sellerName={product.sellerName || product.storeSlug || undefined}
                sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                sellerVerified={Boolean(product.sellerVerified)}
                {...(product.location ? { location: product.location } : {})}
                {...(product.condition ? { condition: product.condition } : {})}
                tags={product.tags ?? []}
                isBoosted={Boolean(product.isBoosted)}
                boostExpiresAt={product.boostExpiresAt ?? null}
                index={index}
                {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                {...(product.attributes ? { attributes: product.attributes } : {})}
                {...(cardAppearance ? { appearance: cardAppearance } : {})}
                {...(cardMedia ? { media: cardMedia } : {})}
                {...(cardDensity ? { density: cardDensity } : {})}
                {...(cardTitleLines ? { titleLines: cardTitleLines } : {})}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ProductGridSkeleton — Loading placeholder for ProductGrid
 */
export function ProductGridSkeleton({
  viewMode = "grid",
  density = "normal",
  count = 12,
  cardMedia = "square",
}: {
  viewMode?: ViewMode;
  density?: "normal" | "compact";
  count?: number;
  cardMedia?: "square" | "landscape";
}) {
  const ratio = cardMedia === "landscape" ? 4 / 3 : 1;

  return (
    <div data-slot="product-grid-skeleton" className="@container">
      <div
        className={cn(
          viewMode === "list"
            ? "flex flex-col gap-2"
            : ["grid gap-(--product-grid-gap)", ...gridColumnClasses[density]]
        )}
      >
        {Array.from({ length: count }).map((_, i) =>
          viewMode === "list" ? (
            <div
              key={i}
              className="flex gap-2.5 p-2 rounded-xl border border-border bg-card"
            >
              <div className="aspect-square w-24 rounded-xl bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded-full animate-pulse" />
                <div className="h-5 w-1/4 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <div key={i} className="space-y-2">
              <div className="relative overflow-hidden rounded-xl bg-muted animate-pulse">
                <AspectRatio ratio={ratio} />
              </div>
              <div className="h-4 w-full bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded-full animate-pulse" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

