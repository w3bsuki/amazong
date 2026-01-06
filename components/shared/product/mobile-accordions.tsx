"use client";

import { FileText, List, Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

interface MobileAccordionsProps {
  description: string;
  details: Array<{ label: string; value: string }>;
  shippingText?: string;
  returnsText?: string;
}

/**
 * MobileAccordions - Product details accordions
 * 
 * Uses neutral backgrounds with colored icons for proper contrast.
 * Simplified styling per design system.
 */
export function MobileAccordions({ description, details, shippingText, returnsText }: MobileAccordionsProps) {
  const t = useTranslations("Product");

  return (
    <div className="lg:hidden">
      <Accordion type="single" collapsible className="w-full">
        {/* Description */}
        <AccordionItem value="description" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-2.5 hover:no-underline [&[data-state=open]]:bg-accent/30">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-md bg-muted flex items-center justify-center">
                <FileText className="size-4 text-info" />
              </div>
              <span className="font-semibold text-foreground text-sm">{t("description")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="bg-muted/30 rounded-md p-2.5 text-sm text-muted-foreground leading-relaxed">
              <p>{description || t("noDescription")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Product Details */}
        <AccordionItem value="details" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-2.5 hover:no-underline [&[data-state=open]]:bg-accent/30">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-md bg-muted flex items-center justify-center">
                <List className="size-4 text-verified" />
              </div>
              <span className="font-semibold text-foreground text-sm">{t("productDetails")}</span>
              {details.length > 0 && (
                <span className="ml-auto mr-2 text-xs font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                  {details.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="bg-muted/30 rounded-md p-2.5 space-y-2">
              {details.length > 0 ? details.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-baseline gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0">{detail.label}</span>
                  <span className="font-medium text-foreground text-right truncate">{detail.value}</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">{t("noDetails")}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping & Returns */}
        <AccordionItem value="shipping" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-2.5 hover:no-underline [&[data-state=open]]:bg-accent/30">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-md bg-muted flex items-center justify-center">
                <Truck className="size-4 text-shipping-free" />
              </div>
              <span className="font-semibold text-foreground text-sm">{t("shippingReturns")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="bg-muted/30 rounded-md p-2.5 space-y-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{t("shipping")}</div>
                <div className="text-sm text-foreground">{shippingText ?? t("defaultShipping")}</div>
              </div>
              <div className="border-t border-border/50 pt-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{t("returns")}</div>
                <div className="text-sm text-foreground">{returnsText ?? t("defaultReturns")}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
