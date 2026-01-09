"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MobileDescriptionSectionProps {
  description: string | null;
  maxLines?: number;
}

/**
 * MobileDescriptionSection - Collapsible description with "More" button
 *
 * Reference: OLX Bulgaria product page
 * ```
 * Описание
 * ─────────────────────────────
 * Продавам телефона, защото си взех по-нов модел.
 * Работи перфектно, без драскотини по екрана. Винаги е
 * носен с калъф и протектор.
 *                                              [Още]
 * ```
 *
 * Design principles:
 * - Section header with border-top separation
 * - Text with line-clamp (default 4 lines) when collapsed
 * - Expand/collapse with "Още" / "По-малко" button
 * - Preserves whitespace and line breaks in description
 * - No accordion overhead - just visible text
 */
export function MobileDescriptionSection({
  description,
  maxLines = 4,
}: MobileDescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("Product");

  // Don't render if no description
  if (!description || description.trim().length === 0) return null;

  // Determine if we need the expand button
  // Rough heuristic: ~80 chars per line, so 4 lines ≈ 320 chars
  const needsExpand = description.length > maxLines * 80;

  return (
    <div className="px-4 py-4 border-b border-border">
      {/* Section Header - OLX/treido style */}
      <h3 className="text-sm font-bold text-foreground mb-2">
        {t("descriptionTitle")}
      </h3>

      {/* Description Text - OLX/treido style */}
      <div className="relative">
        <p
          className={cn(
            "text-xs text-muted-foreground leading-relaxed whitespace-pre-line",
            !isExpanded && "overflow-hidden"
          )}
          style={!isExpanded ? { WebkitLineClamp: maxLines, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
        >
          {description}
        </p>

        {/* Expand/Collapse Button - OLX/treido style */}
        {needsExpand && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-foreground mt-2 underline decoration-muted-foreground/30 underline-offset-4 active:text-muted-foreground transition-colors"
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        )}
      </div>
    </div>
  );
}
