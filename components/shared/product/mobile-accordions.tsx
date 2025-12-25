"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileAccordionsProps {
  description: string;
  details: Array<{ label: string; value: string }>;
}

export function MobileAccordions({ description, details }: MobileAccordionsProps) {
  return (
    <div className="mt-6 lg:hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger className="font-bold text-slate-900">Description</AccordionTrigger>
          <AccordionContent>
            <div className="richtext max-w-none text-muted-foreground text-sm">
              <p>{description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="details">
          <AccordionTrigger className="font-bold text-slate-900">Product Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-y-2 text-sm">
              {details.map((detail, idx) => (
                <div key={idx} className="grid grid-cols-[140px_1fr] items-baseline">
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="font-medium text-foreground truncate">: {detail.value}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger className="font-bold text-slate-900">Shipping & Returns</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[90px_1fr] gap-2">
                <div className="font-medium">Shipping:</div>
                <div>Does not ship to Bulgaria</div>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-2">
                <div className="font-medium">Returns:</div>
                <div>30 days returns. Buyer pays for return shipping.</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
