import { Package, Truck, Clock } from "lucide-react";
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
 * MobileBadgesRow - Professional E-commerce Badge System
 * 
 * Design principles:
 * - MAX 3 badges visible (condition primary, others secondary)
 * - High contrast OKLCH colors (no blue-on-blue, no gradients)
 * - Larger text (text-xs = 12px) for mobile readability
 * - h-6 (24px) height for proper touch targets
 */
export function MobileBadgesRow({
  condition,
  freeShipping,
  stockQuantity,
  stockStatus = "in_stock",
  locale = "en",
}: MobileBadgesRowProps) {
  const t = {
    new: locale === "bg" ? "Ново" : "New",
    newWithTags: locale === "bg" ? "Ново с етикети" : "New with tags",
    likeNew: locale === "bg" ? "Като ново" : "Like new",
    used: locale === "bg" ? "Употребявано" : "Used",
    usedExcellent: locale === "bg" ? "Отлично състояние" : "Excellent",
    usedGood: locale === "bg" ? "Добро състояние" : "Good",
    refurbished: locale === "bg" ? "Обновено" : "Refurbished",
    freeShipping: locale === "bg" ? "Безплатна доставка" : "Free shipping",
    lowStock: locale === "bg" ? "Само" : "Only",
    left: locale === "bg" ? "бр!" : "left!",
  };

  // Normalize condition string to display name
  const normalizeCondition = (cond: string): string => {
    const lower = cond.toLowerCase().replaceAll(/[-_]/g, " ");
    if (lower.includes("new with tag")) return t.newWithTags;
    if (lower.includes("like new") || lower.includes("as new")) return t.likeNew;
    if (lower.includes("refurbished") || lower.includes("renewed")) return t.refurbished;
    if (lower.includes("used excellent") || lower.includes("excellent")) return t.usedExcellent;
    if (lower.includes("used good") || lower.includes("good")) return t.usedGood;
    if (lower.includes("used") || lower.includes("pre-owned")) return t.used;
    if (lower === "new") return t.new;
    return cond;
  };

  // Determine if low stock (show urgency)
  const isLowStock = stockStatus === "low_stock" || 
    (stockQuantity !== null && stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 3);

  const badges: React.ReactNode[] = [];

  // 1. CONDITION BADGE - Always first, most important for C2C
  if (condition) {
    badges.push(
      <Badge
        key="condition"
        variant="condition-pro"
        className="h-6 px-2.5 text-xs gap-1.5 shrink-0"
      >
        <Package className="size-3.5" />
        {normalizeCondition(condition)}
      </Badge>
    );
  }

  // 2. SHIPPING BADGE - Secondary info
  if (freeShipping) {
    badges.push(
      <Badge
        key="shipping"
        variant="shipping-pro"
        className="h-6 px-2.5 text-xs gap-1.5 shrink-0"
      >
        <Truck className="size-3.5" />
        {t.freeShipping}
      </Badge>
    );
  }

  // 3. STOCK URGENCY - Only if truly low (≤3 items)
  if (isLowStock && stockQuantity !== null && stockQuantity !== undefined && stockQuantity > 0) {
    badges.push(
      <Badge
        key="stock"
        variant="stock-urgent"
        className="h-6 px-2.5 text-xs gap-1.5 shrink-0"
      >
        <Clock className="size-3.5" />
        {t.lowStock} {stockQuantity} {t.left}
      </Badge>
    );
  }

  // Max 3 badges - truncate if needed
  const visibleBadges = badges.slice(0, 3);

  if (visibleBadges.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2">
      {visibleBadges}
    </div>
  );
}
