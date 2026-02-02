"use client";

import { useTranslations } from "next-intl";

interface ProductDescriptionProps {
  description: string | null;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const t = useTranslations("Product");

  if (!description) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("description")}
      </h3>
      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </div>
  );
}

export type { ProductDescriptionProps };
