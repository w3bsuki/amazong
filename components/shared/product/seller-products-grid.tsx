"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export function SellerProductsGrid({ products, totalCount, sellerUsername }: SellerProductsGridProps) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getProductHref = (product: SellerProductItem) => {
    const resolvedSellerSlug = product.storeSlug || sellerUsername;
    const resolvedProductSlug = product.slug || product.id;

    // Canonical product URL format: /{username}/{productSlug}
    // If slug is missing, fall back to /{username}/{id} and let the server resolve by id.
    return resolvedSellerSlug ? `/${resolvedSellerSlug}/${resolvedProductSlug}` : "#";
  };

  const hasProducts = Array.isArray(products) && products.length > 0;

  const displayCount = totalCount ?? products.length;
  const viewAllHref = sellerUsername ? `/${sellerUsername}` : undefined;

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    if (!hasProducts) return;
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }

    return;
  }, [hasProducts, products]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 200;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * 2;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!hasProducts) return null;

  return (
    <div className="mt-4 pt-3 border-t border-border/50">
      {/* Header with chevrons */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t("moreFromSeller") || `More from ${products[0]?.sellerName || "this seller"}`}
        </h2>
        <div className="flex items-center gap-1">
          {viewAllHref && displayCount > products.length && (
            <Link 
              href={viewAllHref}
              className="text-xs font-medium text-primary hover:underline mr-2"
            >
              {t("viewAll") || "View all"} ({displayCount})
            </Link>
          )}
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      
      {/* Horizontal scrolling cards */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {products.slice(0, 10).map((product) => (
          <Link
            key={product.id}
            href={getProductHref(product)}
            className="group flex-none w-32 sm:w-[150px] snap-start"
          >
            <div className="aspect-square bg-muted/30 rounded-md overflow-hidden border border-border/50 relative shadow-sm group-hover:shadow-md transition-shadow">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 130px, 150px"
                />
              )}
              {/* Condition badge */}
              {product.condition && (
                <div className="absolute top-2 left-2 bg-background/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-2xs font-bold text-foreground shadow-sm border border-border/30">
                  {product.condition.replaceAll('-', " ")}
                </div>
              )}
            </div>
            <h3 className="text-xs font-semibold text-foreground leading-tight mt-1.5 group-hover:text-[var(--color-link)] line-clamp-2 transition-colors">
              {product.title}
            </h3>
            <p className="text-base font-bold text-foreground mt-1">
              {new Intl.NumberFormat(locale, { 
                style: "currency", 
                currency: "EUR", 
                minimumFractionDigits: 2 
              }).format(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
