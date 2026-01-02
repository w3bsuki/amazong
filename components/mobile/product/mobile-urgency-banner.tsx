import { Flame, Clock, AlertTriangle, Users } from "lucide-react";

interface MobileUrgencyBannerProps {
  viewersCount?: number | null;
  stockQuantity?: number | null;
  soldCount?: number | null;
  saleEndsAt?: Date | null;
  locale?: string;
}

export function MobileUrgencyBanner({
  viewersCount,
  stockQuantity,
  soldCount,
  saleEndsAt,
  locale = "en",
}: MobileUrgencyBannerProps) {
  const t = {
    viewing: locale === "bg" ? "души гледат това сега!" : "people are viewing this now!",
    onlyLeft: locale === "bg" ? "Бързо! Остават само" : "Hurry! Only",
    leftSuffix: locale === "bg" ? "броя!" : "left!",
    soldRecently: locale === "bg" ? "продадени тази седмица" : "sold this week",
    saleEnds: locale === "bg" ? "Промоцията свършва след" : "Sale ends in",
  };

  // Determine which urgency message to show (priority order)
  // Only show low stock if total listed quantity (stock + sold) > 1
  // This prevents "Only 1 left" on unique/single items
  const totalListed = (stockQuantity || 0) + (soldCount || 0);
  const isMultiQuantityListing = totalListed > 1;
  
  const showLowStock = 
    stockQuantity !== null && 
    stockQuantity !== undefined && 
    stockQuantity > 0 && 
    stockQuantity <= 5 && 
    isMultiQuantityListing;

  const showViewers = viewersCount !== null && viewersCount !== undefined && viewersCount > 0;
  const showSoldCount = soldCount !== null && soldCount !== undefined && soldCount > 10;
  const showSaleTimer = saleEndsAt !== null && saleEndsAt !== undefined && saleEndsAt > new Date();

  // Calculate time remaining for sale
  const getTimeRemaining = () => {
    if (!saleEndsAt) return null;
    const diff = saleEndsAt.getTime() - Date.now();
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Priority: Low stock > Sale timer > Viewers > Sold count
  if (showLowStock) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-stock-bg rounded-md border border-urgency-stock-border">
        <div className="flex items-center justify-center size-9 rounded-md bg-urgency-stock-icon-bg">
          <AlertTriangle className="size-4 text-urgency-stock-icon" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-urgency-stock-text">
            {t.onlyLeft} {stockQuantity} {t.leftSuffix}
          </span>
          <span className="text-xs text-urgency-stock-text/80">
            {locale === "bg" ? "Високо търсене" : "High demand"}
          </span>
        </div>
      </div>
    );
  }

  if (showSaleTimer) {
    const timeRemaining = getTimeRemaining();
    if (timeRemaining) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-sale-bg rounded-md border border-urgency-sale-border">
          <div className="flex items-center justify-center size-9 rounded-md bg-urgency-sale-icon-bg">
            <Clock className="size-4 text-urgency-sale-icon" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-urgency-sale-text">
              {t.saleEnds} {timeRemaining}
            </span>
            <span className="text-xs text-urgency-sale-text/80">
              {locale === "bg" ? "Не пропускай" : "Don't miss out"}
            </span>
          </div>
        </div>
      );
    }
  }

  if (showViewers) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-viewers-bg rounded-md border border-urgency-viewers-border">
        <div className="relative flex items-center justify-center size-9 rounded-md bg-urgency-viewers-icon-bg">
          <Users className="size-4 text-urgency-viewers-icon" />
          {/* Static dot instead of ping */}
          <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-live-dot rounded-full ring-2 ring-white dark:ring-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-urgency-viewers-text">
            <span className="text-urgency-viewers-icon font-bold">{viewersCount}</span> {t.viewing}
          </span>
          <span className="text-xs text-urgency-viewers-text/80">
            {locale === "bg" ? "Популярен продукт" : "Popular item"}
          </span>
        </div>
      </div>
    );
  }

  if (showSoldCount) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-hot-bg rounded-md border border-urgency-hot-border">
        <div className="flex items-center justify-center size-9 rounded-md bg-urgency-hot-icon-bg">
          <Flame className="size-4 text-urgency-hot-icon" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-urgency-hot-text">
            <span className="text-urgency-hot-icon font-bold">{soldCount}+</span> {t.soldRecently}
          </span>
          <span className="text-xs text-urgency-hot-text/80">
            {locale === "bg" ? "Горещ продукт" : "Hot item"}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
