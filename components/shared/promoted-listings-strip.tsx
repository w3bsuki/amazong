"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Fire, ArrowRight } from "@phosphor-icons/react";
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card";
import type { UIProduct } from "@/lib/types/products";

interface PromotedListingsStripProps {
  products: UIProduct[];
}

export function PromotedListingsStrip({ products }: PromotedListingsStripProps) {
  const t = useTranslations("Home");

  if (!products || products.length === 0) return null;

  return (
    <section className="pt-3 pb-1">
      <div className="px-inset mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fire size={18} weight="fill" className="text-fire" />
          <span className="text-sm font-bold text-foreground">{t("mobile.promotedListings")}</span>
        </div>
        <Link
          href="/todays-deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {t("mobile.seeAll")}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-inset">
          {products.slice(0, 8).map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export type { PromotedListingsStripProps };

