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
  const showLowStock = stockQuantity !== null && stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 5;
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
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-stock-urgent-bg rounded-lg mx-4 my-2 border border-stock-urgent-text/20">
        <div className="flex items-center justify-center size-9 rounded-lg bg-stock-urgent-text/15 animate-pulse">
          <AlertTriangle className="size-4 text-stock-urgent-text" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-stock-urgent-text">
            {t.onlyLeft} {stockQuantity} {t.leftSuffix}
          </span>
          <span className="text-xs text-stock-urgent-text/70">
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
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-bg rounded-lg mx-4 my-2 border border-urgency-icon/20">
          <div className="flex items-center justify-center size-9 rounded-lg bg-urgency-icon/15">
            <Clock className="size-4 text-urgency-icon" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-urgency-text">
              {t.saleEnds} {timeRemaining}
            </span>
            <span className="text-xs text-urgency-text/70">
              {locale === "bg" ? "Не пропускай" : "Don't miss out"}
            </span>
          </div>
        </div>
      );
    }
  }

  if (showViewers) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-bg rounded-lg mx-4 my-2 border border-live-dot/20">
        <div className="relative flex items-center justify-center size-9 rounded-lg bg-live-dot/15">
          <Users className="size-4 text-live-dot" />
          {/* Pulsing dot */}
          <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-live-dot rounded-full animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-live-dot rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-urgency-text">
            <span className="text-live-dot font-bold">{viewersCount}</span> {t.viewing}
          </span>
          <span className="text-xs text-urgency-text/70">
            {locale === "bg" ? "Популярен продукт" : "Popular item"}
          </span>
        </div>
      </div>
    );
  }

  if (showSoldCount) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-urgency-bg rounded-lg mx-4 my-2 border border-urgency-icon/20">
        <div className="flex items-center justify-center size-9 rounded-lg bg-urgency-icon/15">
          <Flame className="size-4 text-urgency-icon" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-urgency-text">
            <span className="text-urgency-icon font-bold">{soldCount}+</span> {t.soldRecently}
          </span>
          <span className="text-xs text-urgency-text/70">
            {locale === "bg" ? "Горещ продукт" : "Hot item"}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
