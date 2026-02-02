"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ShieldCheck, Tag, Truck } from "@phosphor-icons/react";

export function TrustBadgesInline() {
  const t = useTranslations("Home");

  const badges = [
    { icon: ShieldCheck, label: t("mobile.trustProtected") },
    { icon: Truck, label: t("mobile.trustFastShip") },
    { icon: Tag, label: t("mobile.trustBestPrices") },
  ];

  return (
    <div className="mx-inset my-3 flex items-center justify-between py-2.5 px-3 bg-surface-subtle rounded-md border border-border">
      {badges.map(({ icon: Icon, label }, i) => (
        <div key={label} className={cn("flex items-center gap-1.5", i > 0 && "border-l border-border pl-3")}>
          <Icon size={14} weight="fill" className="text-muted-foreground" />
          <span className="text-2xs text-muted-foreground font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

