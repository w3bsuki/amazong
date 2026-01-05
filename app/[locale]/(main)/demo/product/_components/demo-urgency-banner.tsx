import { Flame, AlertTriangle, Users, TrendingUp } from "lucide-react";

interface DemoUrgencyBannerProps {
  viewersCount?: number | null;
  stockQuantity?: number | null;
  soldCount?: number | null;
  locale?: string;
}

/**
 * Demo Urgency Banner
 * 
 * IMPROVEMENT: Shows social proof for ALL products, not just multi-quantity listings
 * - Shows viewers even for single items
 * - Shows sold count regardless of current stock
 * - Multiple urgency signals can combine
 */
export function DemoUrgencyBanner({
  viewersCount,
  stockQuantity,
  soldCount,
  locale = "en",
}: DemoUrgencyBannerProps) {
  const t = {
    viewing: locale === "bg" ? "души гледат това" : "people viewing this",
    onlyLeft: locale === "bg" ? "Само" : "Only",
    leftSuffix: locale === "bg" ? "броя останали" : "left in stock",
    sold: locale === "bg" ? "продадени" : "sold",
    highDemand: locale === "bg" ? "Популярен артикул" : "Popular item",
  };

  const showLowStock = stockQuantity != null && stockQuantity > 0 && stockQuantity <= 5;
  const showViewers = viewersCount != null && viewersCount > 0;
  const showSoldCount = soldCount != null && soldCount > 0;

  // No urgency signals
  if (!showLowStock && !showViewers && !showSoldCount) return null;

  // Priority: Low stock warning takes full width
  if (showLowStock) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 bg-urgency-stock-bg rounded-md border border-urgency-stock-border">
        <div className="flex items-center justify-center size-8 rounded-md bg-urgency-stock-icon-bg shrink-0">
          <AlertTriangle className="size-4 text-urgency-stock-icon" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-urgency-stock-text">
            {t.onlyLeft} {stockQuantity} {t.leftSuffix}
          </span>
          {(showViewers || showSoldCount) && (
            <span className="text-xs text-urgency-stock-text/80">
              {showViewers && `${viewersCount} ${t.viewing}`}
              {showViewers && showSoldCount && " · "}
              {showSoldCount && `${soldCount}+ ${t.sold}`}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Combined viewers + sold count row
  return (
    <div className="flex items-center gap-3 py-2">
      {/* Viewers */}
      {showViewers && (
        <div className="flex items-center gap-1.5 text-xs">
          <div className="relative">
            <Users className="size-4 text-urgency-viewers-icon" />
            <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-live-dot rounded-full" />
          </div>
          <span className="font-medium text-urgency-viewers-text">
            <span className="text-urgency-viewers-icon font-bold">{viewersCount}</span> {t.viewing}
          </span>
        </div>
      )}

      {/* Divider */}
      {showViewers && showSoldCount && (
        <div className="h-4 w-px bg-border" />
      )}

      {/* Sold count */}
      {showSoldCount && (
        <div className="flex items-center gap-1.5 text-xs">
          <TrendingUp className="size-4 text-urgency-hot-icon" />
          <span className="font-medium text-urgency-hot-text">
            <span className="text-urgency-hot-icon font-bold">{soldCount}+</span> {t.sold}
          </span>
        </div>
      )}
    </div>
  );
}
