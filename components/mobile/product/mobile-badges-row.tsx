"use client";

import { Package, Truck, Zap, Tag, AlertCircle, CheckCircle2, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileBadgesRowProps {
  condition?: string | null;
  freeShipping?: boolean;
  expressShipping?: boolean;
  stockQuantity?: number | null;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
  isOnSale?: boolean;
  locale?: string;
}

export function MobileBadgesRow({
  condition,
  freeShipping,
  expressShipping,
  stockQuantity,
  stockStatus = "in_stock",
  isOnSale,
  locale = "en",
}: MobileBadgesRowProps) {
  const t = {
    new: locale === "bg" ? "Ново" : "New",
    newWithTags: locale === "bg" ? "Ново с етикети" : "New with tags",
    likeNew: locale === "bg" ? "Като ново" : "Like new",
    used: locale === "bg" ? "Употребявано" : "Used",
    refurbished: locale === "bg" ? "Обновено" : "Refurbished",
    freeShipping: locale === "bg" ? "БЕЗПЛАТНА ДОСТАВКА" : "FREE SHIPPING",
    expressDelivery: locale === "bg" ? "ЕКСПРЕС" : "EXPRESS",
    inStock: locale === "bg" ? "В наличност" : "In stock",
    lowStock: locale === "bg" ? "Само" : "Only",
    left: locale === "bg" ? "бр!" : "left!",
    outOfStock: locale === "bg" ? "Изчерпано" : "Out of stock",
    onSale: locale === "bg" ? "НАМАЛЕНИЕ" : "SALE",
  };

  // Normalize condition string
  const normalizeCondition = (cond: string) => {
    const lower = cond.toLowerCase().replace(/[-_]/g, " ");
    if (lower.includes("new with tag")) return t.newWithTags;
    if (lower.includes("like new") || lower.includes("as new")) return t.likeNew;
    if (lower.includes("refurbished") || lower.includes("renewed")) return t.refurbished;
    if (lower.includes("used") || lower.includes("pre-owned")) return t.used;
    if (lower === "new") return t.new;
    return cond;
  };

  // Determine stock display
  const isLowStock = stockStatus === "low_stock" || (stockQuantity !== null && stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 5);
  const isOutOfStock = stockStatus === "out_of_stock" || stockQuantity === 0;

  const badges = [];

  // Sale badge - FIRST (most important)
  if (isOnSale) {
    badges.push(
      <Badge
        key="sale"
        variant="secondary"
        className="bg-deal text-white text-2xs font-semibold px-2 h-6 rounded border-transparent gap-1 shrink-0"
      >
        <Flame className="size-3" />
        {t.onSale}
      </Badge>
    );
  }

  // Free shipping badge - PROMINENT
  if (freeShipping) {
    badges.push(
      <Badge
        key="shipping"
        variant="secondary"
        className="bg-shipping-free text-white text-2xs font-semibold px-2 h-6 rounded border-transparent gap-1 shrink-0"
      >
        <Truck className="size-3" />
        {t.freeShipping}
      </Badge>
    );
  }

  // Condition badge
  if (condition) {
    badges.push(
      <Badge
        key="condition"
        variant="secondary"
        className="bg-muted text-foreground text-2xs font-medium px-2 h-6 rounded border border-border/50 hover:bg-muted gap-1 shrink-0"
      >
        <Package className="size-3" />
        {normalizeCondition(condition)}
      </Badge>
    );
  }

  // Express shipping badge
  if (expressShipping) {
    badges.push(
      <Badge
        key="express"
        variant="secondary"
        className="bg-shipping-express text-white text-2xs font-semibold px-2 h-6 rounded border-transparent gap-1 shrink-0"
      >
        <Zap className="size-3" />
        {t.expressDelivery}
      </Badge>
    );
  }

  // Stock status badge
  if (isOutOfStock) {
    badges.push(
      <Badge
        key="stock"
        variant="secondary"
        className="bg-stock-out text-white text-2xs font-semibold px-2 h-6 rounded border-transparent gap-1 shrink-0"
      >
        <AlertCircle className="size-3" />
        {t.outOfStock}
      </Badge>
    );
  } else if (isLowStock && stockQuantity !== null && stockQuantity !== undefined) {
    badges.push(
      <Badge
        key="stock"
        variant="secondary"
        className="bg-stock-urgent-bg text-stock-urgent-text text-2xs font-medium px-2 h-6 rounded border border-stock-urgent-text/30 gap-1 shrink-0"
      >
        <AlertCircle className="size-3" />
        {t.lowStock} {stockQuantity} {t.left}
      </Badge>
    );
  } else if (stockStatus === "in_stock" || (stockQuantity && stockQuantity > 5)) {
    badges.push(
      <Badge
        key="stock"
        variant="secondary"
        className="bg-stock-available/15 text-stock-available text-2xs font-medium px-2 h-6 rounded border border-stock-available/30 gap-1 shrink-0"
      >
        <CheckCircle2 className="size-3" />
        {t.inStock}
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pl-4 pr-4 py-2 snap-x">
      {badges.map((badge, i) => (
        <div key={i} className="snap-start">
          {badge}
        </div>
      ))}
    </div>
  );
}
