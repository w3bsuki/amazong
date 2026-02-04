"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Fire, ArrowRight } from "@phosphor-icons/react";
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card";
import type { UIProduct } from "@/lib/types/products";
import { cn } from "@/lib/utils";

interface PromotedListingsStripProps {
  products: UIProduct[];
  className?: string;
}

export function PromotedListingsStrip({ products, className }: PromotedListingsStripProps) {
  const t = useTranslations("Home");

  if (!products || products.length === 0) return null;

  return (
    <section className={cn("py-3", className)}>
      <div className="px-inset-md mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0 size-7 rounded-full bg-muted border border-border/50 flex items-center justify-center"
            aria-hidden="true"
          >
            <Fire size={18} weight="fill" className="text-fire" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground truncate">
            {t("mobile.promotedListings")}
          </h2>
        </div>
        <Link
          href="/search?type=promoted"
          className={cn(
            "inline-flex items-center gap-1",
            "h-(--spacing-touch-sm) px-2.5 rounded-full",
            "border border-border/50 bg-background",
            "text-xs font-medium text-muted-foreground",
            "active:bg-muted active:text-foreground transition-colors"
          )}
        >
          {t("mobile.seeAll")}
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-inset-md">
          {products.slice(0, 8).map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export type { PromotedListingsStripProps };
