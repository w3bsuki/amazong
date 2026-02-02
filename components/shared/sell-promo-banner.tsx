"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Plus } from "@phosphor-icons/react";

export function SellPromoBanner() {
  const t = useTranslations("Home");

  return (
    <Link
      href="/sell"
      className="mx-inset mb-4 flex items-center justify-between gap-3 rounded-md bg-foreground text-background p-3 active:opacity-90 transition-opacity"
    >
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-bold leading-tight">{t("mobile.sellBannerTitle")}</p>
        <p className="text-xs text-background/70 leading-tight">{t("mobile.sellBannerSubtitle")}</p>
      </div>
      <div className="size-9 shrink-0 bg-background text-foreground rounded-full flex items-center justify-center">
        <Plus size={18} weight="bold" />
      </div>
    </Link>
  );
}

