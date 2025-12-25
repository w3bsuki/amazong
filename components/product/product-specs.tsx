"use client"

import { Package, FileText, Info } from "lucide-react"

interface ProductSpecsProps {
  productId: string
  description: string | null
  variant: 'mobile' | 'desktop'
  t: {
    technicalSpecs: string
    whatsInTheBox: string
    description: string
    specifications: string
    inTheBox: string
    noDescriptionAvailable: string
    itemNumber: string
    condition: string
    conditionNew: string
    brand: string
    type: string
    model: string
    countryOfOrigin: string
    warranty: string
    months: string
    mainProduct: string
    userManual: string
    warrantyCard: string
    originalPackaging: string
  }
}

export function ProductSpecs({
  productId,
  description,
  variant,
  t,
}: ProductSpecsProps) {
  // eBay-style item specifics - organized as clean key-value pairs
  const specs = [
    { label: t.itemNumber, value: productId.slice(0, 8) },
    { label: t.condition.replace(':', ''), value: t.conditionNew },
    { label: t.brand, value: 'Generic' },
    { label: t.type, value: 'Standard' },
    { label: t.model, value: 'N/A' },
    { label: t.countryOfOrigin, value: 'Bulgaria' },
    { label: t.warranty, value: `12 ${t.months}` },
  ]

  const boxContents = [
    { qty: '1×', item: t.mainProduct },
    { qty: '1×', item: t.userManual },
    { qty: '1×', item: t.warrantyCard },
    { qty: '✓', item: t.originalPackaging },
  ]

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden py-4 space-y-8">
        {/* Technical Specifications */}
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
            {t.technicalSpecs}
          </h4>
          <div className="grid grid-cols-1 gap-y-0.5">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                <span className="text-xs font-medium text-muted-foreground">{spec.label}</span>
                <span className="text-sm font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Package Contents */}
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
            {t.whatsInTheBox}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {boxContents.map((content, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1">
                <div className="size-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-[10px] font-bold shrink-0">
                  {content.qty}
                </div>
                <span className="text-sm font-medium text-foreground">{content.item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop variant - eBay-style clean 2-column table layout
  // Based on eBay's ItemSpecifics pattern: professional, scannable, organized
  return (
    <div className="hidden lg:block pt-8">
      <div className="space-y-8">
        
        {/* Item Specifics Section - eBay-style 2-column table */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <Info className="size-4 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {t.specifications}
            </h3>
          </div>
          
          {/* eBay-style specifications table - clean 2-column grid */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <tbody>
                {specs.map((spec, idx) => (
                  <tr 
                    key={idx} 
                    className={idx % 2 === 0 ? "bg-muted/30" : "bg-background"}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-2/5 border-r border-border/50">
                      {spec.label}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Description Section */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex size-7 items-center justify-center rounded-md bg-info/10">
              <FileText className="size-4 text-info" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {t.description}
            </h3>
          </div>
          
          <div className="rounded-lg border border-border bg-muted/20 p-5">
            {description ? (
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t.noDescriptionAvailable}
              </p>
            )}
          </div>
        </section>

        {/* What's in the Box Section - eBay-style checklist */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex size-7 items-center justify-center rounded-md bg-success/10">
              <Package className="size-4 text-success" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {t.inTheBox}
            </h3>
          </div>
          
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-border">
              {boxContents.map((content, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx < 2 ? "border-b border-border" : ""
                  } ${idx % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                >
                  <span className="flex size-6 items-center justify-center rounded-md bg-success/10 text-success text-xs font-bold shrink-0">
                    {content.qty}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {content.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
      </div>
    </div>
  )
}
