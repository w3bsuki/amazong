"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface SellerProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  sellerName: string;
  sellerVerified: boolean;
  sellerAvatarUrl: string;
  condition: string;
  freeShipping: boolean;
  categorySlug: string;
  attributes: Record<string, string>;
  storeSlug?: string | null;
  slug?: string | null;
}

interface SellerProductsGridProps {
  products: SellerProductItem[];
  totalCount?: number;
  sellerUsername?: string;
}

/**
 * SellerProductsGrid - "More from Seller" horizontal scroll section
 * 
 * OLX/Treido reference design:
 * ```
 * Още от Иван                    [Виж всички]
 * ┌────┐ ┌────┐ ┌────┐ ┌────┐
 * │    │ │    │ │    │ │    │  ← Horizontal scroll
 * └────┘ └────┘ └────┘ └────┘
 * ```
 * 
 * Mobile: Pure swipe (no chevron buttons)
 * Desktop: Chevron navigation buttons
 */
export function SellerProductsGrid({ products, totalCount, sellerUsername }: SellerProductsGridProps) {
  const t = useTranslations("Product");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getProductHref = (product: SellerProductItem) => {
    const resolvedSellerSlug = product.storeSlug || sellerUsername;
    const resolvedProductSlug = product.slug || product.id;

    // Canonical product URL format: /{username}/{productSlug}
    // If slug is missing, fall back to /{username}/{id} and let the server resolve by id.
    return resolvedSellerSlug ? `/${resolvedSellerSlug}/${resolvedProductSlug}` : "#";
  };

  const hasProducts = Array.isArray(products) && products.length > 0;

  const viewAllHref = sellerUsername ? `/${sellerUsername}` : undefined;
  
  const viewAllText = tCommon("viewAll");
  
  // Seller name for header - extract first name for treido-mock style "More from Ivan"
  const sellerFirstName = products[0]?.sellerName?.split(" ")[0] || "";

  if (!hasProducts) return null;

  return (
    <div className="py-4 bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-sm font-bold text-foreground">
          {sellerFirstName ? t("moreFromSellerName", { name: sellerFirstName }) : t("moreFromSeller")}
        </h3>
        {viewAllHref && (
          <Link 
            href={viewAllHref}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {viewAllText}
          </Link>
        )}
      </div>
      
      {/* Horizontal scroll cards */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth px-4 gap-2.5"
      >
        {products.slice(0, 10).map((product) => (
          <Link
            key={product.id}
            href={getProductHref(product)}
            className="w-32 flex-shrink-0 bg-background rounded border border-border overflow-hidden"
          >
            {/* Image */}
            <div className="aspect-square bg-muted relative">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="130px"
                  loading="lazy"
                />
              )}
            </div>
            {/* Content - treido-mock: p-2 with price bold + title muted */}
            <div className="p-2">
              <p className="font-bold text-foreground text-sm">
                {new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </p>
              <p className="text-tiny text-muted-foreground truncate mt-0.5">
                {product.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
