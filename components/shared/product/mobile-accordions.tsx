"use client";

import { Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

interface MobileAccordionsProps {
  description?: string | null;
  details?: Array<{ label: string; value: string }> | null;
  shippingText?: string;
  returnsText?: string;
}

/**
 * MobileAccordions - Product details accordions
 * 
 * Simplified: Only shipping & returns accordion.
 * Description and Details are now inline sections (not hidden in accordions).
 * Uses semantic tokens for consistency with design system.
 */
export function MobileAccordions({ shippingText, returnsText }: MobileAccordionsProps) {
  const t = useTranslations("Product");

  return (
    <div className="lg:hidden">
      <Accordion type="single" collapsible className="w-full">
        {/* Shipping & Returns */}
        <AccordionItem value="shipping" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]]:bg-surface-subtle">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-md bg-muted flex items-center justify-center">
                <Truck className="size-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-foreground text-sm">{t("shippingReturns")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Shipping */}
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  {t("shipping")}
                </div>
                <div className="text-sm text-foreground">
                  {shippingText ?? t("defaultShipping")}
                </div>
              </div>
              {/* Returns */}
              <div className="border-t border-border/50 pt-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  {t("returns")}
                </div>
                <div className="text-sm text-foreground">
                  {returnsText ?? t("defaultReturns")}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
