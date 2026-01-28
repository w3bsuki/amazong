/**
 * ProductGrid — Container query-responsive product grid
 *
 * A responsive product grid that uses container queries (@container)
 * to adapt column count based on the container width rather than viewport.
 * This enables the grid to work correctly inside sidebars, modals, etc.
 *
 * Container Query Breakpoints:
 * - Default: 2 columns
 * - @[520px]: 3 columns
 * - @[720px]: 4 columns
 * - @[960px]: 5 columns
 * - @[1200px]: 6 columns (dense mode)
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
    "@[520px]:grid-cols-3",
    "@[720px]:grid-cols-4",
    "@[960px]:grid-cols-5",
  ],
  compact: [
    "grid-cols-2",
    "@[400px]:grid-cols-3",
    "@[560px]:grid-cols-4",
    "@[720px]:grid-cols-5",
    "@[960px]:grid-cols-6",
  ],
} as const;

export function ProductGrid({
  products,
  viewMode = "grid",
  density = "normal",
  className,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton viewMode={viewMode} density={density} />;
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
      aria-label={`Product ${viewMode} with ${products.length} items`}
      tabIndex={-1}
    >
      <div
        className={cn(
          viewMode === "list"
            ? "flex flex-col gap-3"
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
                {...(product.isBoosted ? { isBoosted: true } : {})}
                index={index}
                {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                {...(product.attributes ? { attributes: product.attributes } : {})}
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
}: {
  viewMode?: ViewMode;
  density?: "normal" | "compact";
  count?: number;
}) {
  return (
    <div data-slot="product-grid-skeleton" className="@container">
      <div
        className={cn(
          viewMode === "list"
            ? "flex flex-col gap-3"
            : ["grid gap-(--product-grid-gap)", ...gridColumnClasses[density]]
        )}
      >
        {Array.from({ length: count }).map((_, i) =>
          viewMode === "list" ? (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <div className="aspect-square w-24 rounded-md bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-5 w-1/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <div key={i} className="space-y-2">
              <div className="aspect-square w-full rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
