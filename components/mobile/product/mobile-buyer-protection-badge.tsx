"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * MobileBuyerProtectionBadge - treido-mock style
 * 
 * Reference: treido-mock ProductPage.tsx lines 93-103
 * - Simple row with icon + text (no Card wrapper)
 * - subtle muted background
 * - px-4 py-3 padding
 */
export function MobileBuyerProtectionBadge() {
  const t = useTranslations("Product");

  return (
    <div className="px-4 py-3 border-t border-border bg-muted/30">
      <div className="flex items-start gap-3">
        <ShieldCheck className="size-5 text-foreground mt-0.5" strokeWidth={1.5} />
        <div>
          <h3 className="text-xs font-bold text-foreground">{t("buyerProtectionBadgeTitle")}</h3>
          <p className="text-xs text-muted-foreground leading-snug mt-0.5">
            {t("buyerProtectionBadgeSubtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
