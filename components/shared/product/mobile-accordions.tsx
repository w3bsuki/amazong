"use client";

import { FileText, List, Truck, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "next-intl";

interface MobileAccordionsProps {
  description: string;
  details: Array<{ label: string; value: string }>;
  shippingText?: string;
  returnsText?: string;
}

export function MobileAccordions({ description, details, shippingText, returnsText }: MobileAccordionsProps) {
  const locale = useLocale();
  
  const t = {
    description: locale === "bg" ? "Описание" : "Description",
    productDetails: locale === "bg" ? "Характеристики" : "Product Details",
    shippingReturns: locale === "bg" ? "Доставка и връщане" : "Shipping & Returns",
    shipping: locale === "bg" ? "Доставка" : "Shipping",
    returns: locale === "bg" ? "Връщане" : "Returns",
    defaultShipping: locale === "bg" ? "Доставката се изчислява при поръчка" : "Shipping calculated at checkout",
    defaultReturns: locale === "bg" ? "30 дни връщане. Купувачът плаща за връщане." : "30 days returns. Buyer pays for return shipping.",
  };

  return (
    <div className="lg:hidden">
      <Accordion type="single" collapsible className="w-full">
        {/* Description */}
        <AccordionItem value="description" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-info)]/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[var(--color-info)]" />
              </div>
              <span className="font-bold text-foreground text-sm">{t.description}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
              <p>{description || (locale === "bg" ? "Няма описание" : "No description provided")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Product Details */}
        <AccordionItem value="details" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-verified)]/10 flex items-center justify-center">
                <List className="w-4 h-4 text-[var(--color-verified)]" />
              </div>
              <span className="font-bold text-foreground text-sm">{t.productDetails}</span>
              {details.length > 0 && (
                <span className="ml-auto mr-2 text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {details.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-muted/30 rounded-xl p-4 space-y-2.5">
              {details.length > 0 ? details.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-baseline gap-4 text-sm">
                  <span className="text-muted-foreground font-medium shrink-0">{detail.label}</span>
                  <span className="font-bold text-foreground text-right truncate">{detail.value}</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">{locale === "bg" ? "Няма детайли" : "No details available"}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping & Returns */}
        <AccordionItem value="shipping" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-shipping-free)]/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-[var(--color-shipping-free)]" />
              </div>
              <span className="font-bold text-foreground text-sm">{t.shippingReturns}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-muted/30 rounded-xl p-4 space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t.shipping}</div>
                <div className="text-sm text-foreground">{shippingText ?? t.defaultShipping}</div>
              </div>
              <div className="border-t border-border/50 pt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t.returns}</div>
                <div className="text-sm text-foreground">{returnsText ?? t.defaultReturns}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
