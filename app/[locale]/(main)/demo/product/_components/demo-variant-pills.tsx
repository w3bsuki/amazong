"use client";

import { cn } from "@/lib/utils";

interface DemoVariant {
  id: string;
  name: string;
  price_adjustment: number;
  stock: number;
  is_default?: boolean;
}

interface DemoVariantPillsProps {
  variants: DemoVariant[];
  selectedVariantId: string | null;
  onSelect: (id: string) => void;
  locale?: string;
}

/**
 * Demo Variant Pills
 * 
 * IMPROVEMENT: Horizontal pill selector instead of dropdown
 * - All options visible at a glance
 * - Out-of-stock variants clearly marked
 * - Price adjustments shown inline
 * - Better for <6 variants (most products)
 */
export function DemoVariantPills({
  variants,
  selectedVariantId,
  onSelect,
  locale = "en",
}: DemoVariantPillsProps) {
  const t = {
    variant: locale === "bg" ? "Вариант" : "Variant",
    outOfStock: locale === "bg" ? "Няма" : "Out",
  };

  if (variants.length === 0) return null;

  return (
    <div className="py-1">
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
        {t.variant}
      </label>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isSelected = v.id === selectedVariantId;
          const isOutOfStock = v.stock <= 0;
          const hasAdjustment = v.price_adjustment !== 0;

          return (
            <button
              key={v.id}
              type="button"
              onClick={() => !isOutOfStock && onSelect(v.id)}
              disabled={isOutOfStock}
              className={cn(
                "relative h-9 px-3 rounded-full border text-sm font-medium transition-colors",
                "min-w-[60px] flex items-center justify-center gap-1",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : isOutOfStock
                  ? "border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              )}
            >
              <span className={cn(isOutOfStock && "line-through")}>{v.name}</span>
              {hasAdjustment && !isOutOfStock && (
                <span className="text-2xs text-muted-foreground">
                  {v.price_adjustment > 0 ? "+" : ""}{v.price_adjustment}
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-2xs px-1 rounded">
                  {t.outOfStock}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
