"use client";

import { useTranslations } from "next-intl";

interface DetailItem {
  label: string;
  value: string;
}

interface MobileDetailsSectionProps {
  details: DetailItem[] | null;
}

/**
 * MobileDetailsSection - Clean key-value details list
 *
 * Reference: OLX Bulgaria product page
 * ```
 * Детайли
 * ─────────────────────────────
 * Състояние        Използвано
 * Марка            Apple
 * Цвят             Graphite
 * Памет            256GB
 * Доставка         Еконт / Спиди
 * ```
 *
 * Design principles:
 * - Section header with border-top separation
 * - Clean key-value rows with dividers
 * - Left: muted label, Right: emphasized value
 * - No pills, no horizontal scrolling - just clear list
 */
export function MobileDetailsSection({
  details,
}: MobileDetailsSectionProps) {
  const t = useTranslations("Product");

  if (!details || details.length === 0) return null;

  return (
    <div className="px-4 py-4">
      {/* Section Header - OLX/treido style */}
      <h3 className="text-sm font-bold text-foreground mb-3">
        {t("detailsTitle")}
      </h3>

      {/* Key-Value List - treido-mock: space-y-2 */}
      <div className="space-y-2">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-xs"
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium text-foreground text-right max-w-[60%] truncate">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
