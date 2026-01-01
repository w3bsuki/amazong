"use client";

import { Flame, Eye, Clock, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg mx-3 my-2 border border-amber-200 dark:border-amber-800/50">
        <div className="flex items-center justify-center size-9 rounded-lg bg-amber-100 dark:bg-amber-800/40">
          <AlertTriangle className="size-4 text-amber-700 dark:text-amber-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {t.onlyLeft} {stockQuantity} {t.leftSuffix}
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-400/80">
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
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg mx-3 my-2 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center justify-center size-9 rounded-lg bg-blue-100 dark:bg-blue-800/40">
            <Clock className="size-4 text-blue-700 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              {t.saleEnds} {timeRemaining}
            </span>
            <span className="text-xs text-blue-700 dark:text-blue-400/80">
              {locale === "bg" ? "Не пропускай" : "Don't miss out"}
            </span>
          </div>
        </div>
      );
    }
  }

  if (showViewers) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mx-3 my-2 border border-emerald-200 dark:border-emerald-800/50">
        <div className="relative flex items-center justify-center size-9 rounded-lg bg-emerald-100 dark:bg-emerald-800/40">
          <Users className="size-4 text-emerald-700 dark:text-emerald-400" />
          {/* Static dot instead of ping */}
          <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{viewersCount}</span> {t.viewing}
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-400/80">
            {locale === "bg" ? "Популярен продукт" : "Popular item"}
          </span>
        </div>
      </div>
    );
  }

  if (showSoldCount) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg mx-3 my-2 border border-orange-200 dark:border-orange-800/50">
        <div className="flex items-center justify-center size-9 rounded-lg bg-orange-100 dark:bg-orange-800/40">
          <Flame className="size-4 text-orange-700 dark:text-orange-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">
            <span className="text-orange-700 dark:text-orange-400 font-bold">{soldCount}+</span> {t.soldRecently}
          </span>
          <span className="text-xs text-orange-700 dark:text-orange-400/80">
            {locale === "bg" ? "Горещ продукт" : "Hot item"}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
