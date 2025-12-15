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
      <div className="lg:hidden py-3 space-y-4">
        {/* Technical Specifications */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {t.technicalSpecs}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{spec.label}</span>
                <span className="text-sm font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Package Contents */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {t.whatsInTheBox}
          </h4>
          <ul className="space-y-1.5">
            {boxContents.map((content, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full shrink-0" />
                {content.qty} {content.item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Desktop variant - Card-based 3-column layout
  return (
    <div className="hidden lg:block pt-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Description Card */}
        <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
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
        <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-info rounded-full" />
            {t.specifications}
          </h3>
          <div className="space-y-2.5">
            {specs.slice(0, 5).map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground">{spec.label}</span>
                <span className="text-sm font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contents Card */}
        <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-success rounded-full" />
            {t.inTheBox}
          </h3>
          <ul className="space-y-2.5">
            {boxContents.map((content, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 flex items-center justify-center bg-success/10 text-success text-xs font-semibold rounded-md shrink-0">
                  {content.qty}
                </span>
                <span className="text-foreground">{content.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
