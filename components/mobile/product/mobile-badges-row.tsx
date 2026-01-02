import { Package, Truck, Zap, AlertCircle, CheckCircle2, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileBadgesRowProps {
  condition?: string | null;
  freeShipping?: boolean;
  expressShipping?: boolean;
  stockQuantity?: number | null;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
  isOnSale?: boolean;
  locale?: string;
}

/**
 * MobileBadgesRow - WCAG 2.2 AA compliant badges
 * 
 * Uses light background + dark text pattern for ≥4.5:1 contrast ratio
 * at 10-12px text size per DESIGN.md badge tokens.
 */
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
    freeShipping: locale === "bg" ? "Безплатна доставка" : "Free shipping",
    expressDelivery: locale === "bg" ? "Експрес" : "Express",
    inStock: locale === "bg" ? "В наличност" : "In stock",
    lowStock: locale === "bg" ? "Само" : "Only",
    left: locale === "bg" ? "бр!" : "left!",
    outOfStock: locale === "bg" ? "Изчерпано" : "Out of stock",
    onSale: locale === "bg" ? "Намаление" : "Sale",
  };

  // Normalize condition string
  const normalizeCondition = (cond: string) => {
    const lower = cond.toLowerCase().replaceAll(/[-_]/g, " ");
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

  // Condition badge - FIRST (most important for C2C marketplace)
  if (condition) {
    badges.push(
      <Badge
        key="condition"
        variant="secondary"
        className="bg-muted text-foreground text-2xs font-semibold px-2 h-6 rounded-sm border border-border gap-1 shrink-0"
      >
        <Package className="size-3" />
        {normalizeCondition(condition)}
      </Badge>
    );
  }

  // Sale badge - Light red bg + dark red text (WCAG AA)
  if (isOnSale) {
    badges.push(
      <Badge
        key="sale"
        variant="secondary"
        className="bg-deal/10 text-deal text-2xs font-semibold px-2 h-6 rounded-sm border border-deal/20 gap-1 shrink-0"
      >
        <Flame className="size-3" />
        {t.onSale}
      </Badge>
    );
  }

  // Free shipping badge - Light blue bg + dark blue text (WCAG AA)
  if (freeShipping) {
    badges.push(
      <Badge
        key="shipping"
        variant="secondary"
        className="bg-shipping-free/10 text-shipping-free text-2xs font-semibold px-2 h-6 rounded-sm border border-shipping-free/20 gap-1 shrink-0"
      >
        <Truck className="size-3" />
        {t.freeShipping}
      </Badge>
    );
  }

  // Express shipping badge - Light green bg + dark green text (WCAG AA)
  if (expressShipping) {
    badges.push(
      <Badge
        key="express"
        variant="secondary"
        className="bg-shipping-express/10 text-shipping-express text-2xs font-semibold px-2 h-6 rounded-sm border border-shipping-express/20 gap-1 shrink-0"
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
        className="bg-stock-out/10 text-stock-out text-2xs font-semibold px-2 h-6 rounded-sm border border-stock-out/20 gap-1 shrink-0"
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
        className="bg-stock-urgent-bg text-stock-urgent-text text-2xs font-medium px-2 h-6 rounded-sm border border-stock-urgent-text/30 gap-1 shrink-0"
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
        className="bg-stock-available/10 text-stock-available text-2xs font-medium px-2 h-6 rounded-sm border border-stock-available/20 gap-1 shrink-0"
      >
        <CheckCircle2 className="size-3" />
        {t.inStock}
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 py-2 snap-x">
      {badges.map((badge, i) => (
        <div key={i} className="snap-start">
          {badge}
        </div>
      ))}
    </div>
  );
}
