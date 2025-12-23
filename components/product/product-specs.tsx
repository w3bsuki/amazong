"use client"

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

  // Desktop variant - Card-based 3-column layout
  return (
    <div className="hidden lg:block pt-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Description Card */}
        <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-lg p-5">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-verified rounded-full" />
            {t.description}
          </h3>
          {description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic">
              {t.noDescriptionAvailable}
            </p>
          )}
        </div>

        {/* Specifications Card */}
        <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-lg p-5">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-verified rounded-full" />
            {t.specifications}
          </h3>
          <div className="space-y-2.5">
            {specs.slice(0, 5).map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
                <span className="text-xs font-medium text-muted-foreground">{spec.label}</span>
                <span className="text-sm font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contents Card */}
        <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-lg p-5">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-verified rounded-full" />
            {t.inTheBox}
          </h3>
          <ul className="space-y-2.5">
            {boxContents.map((content, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 flex items-center justify-center bg-verified/10 text-verified text-[10px] font-bold rounded-md shrink-0">
                  {content.qty}
                </span>
                <span className="text-foreground font-medium text-sm">{content.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
