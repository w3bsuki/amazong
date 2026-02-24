import { Check } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { planIcons } from "./plans-page-client.config"
import type { PlansPageContent, SubscriptionPlanRow } from "./plans-page-client.types"

function PlansComparisonTable({
  filteredPlans,
  yearly,
  currentTier,
  t,
  formatPrice,
  className,
}: {
  filteredPlans: SubscriptionPlanRow[]
  yearly: boolean
  currentTier: string
  t: PlansPageContent
  formatPrice: (price: number) => string
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-subtle hover:bg-surface-subtle">
            <TableHead className="h-12 w-(--plans-table-head-w) pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.plan}
            </TableHead>
            <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.price}
            </TableHead>
            <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.fee}
            </TableHead>
            <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.buyerProtection}
            </TableHead>
            <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.listings}
            </TableHead>
            <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.boosts}
            </TableHead>
            <TableHead className="h-12 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.comparison.support}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlans.map((plan, index) => {
            const price = yearly ? (plan.price_yearly ?? 0) : (plan.price_monthly ?? 0)
            const isCurrent = plan.tier === currentTier
            const isPopular = plan.tier === "plus" || plan.tier === "pro"
            const sellerFee = Number(plan.seller_fee_percent ?? 0)
            const buyerProtection = Number(plan.buyer_protection_percent ?? 0)
            const buyerFixed = Number(plan.buyer_protection_fixed ?? 0)
            const buyerCap = Number(plan.buyer_protection_cap ?? 0)

            return (
              <TableRow
                key={plan.id}
                className={cn(
                  "h-16",
                  index === filteredPlans.length - 1 && "border-0",
                  isPopular && "bg-hover",
                  isCurrent && "bg-selected"
                )}
              >
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        isCurrent || isPopular
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {planIcons[plan.tier ?? "free"]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.name}</span>
                      {(isCurrent || isPopular) && (
                        <span
                          className={cn(
                            "text-xs",
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {isCurrent ? t.current : t.mostPopular}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-base font-bold tabular-nums">
                    {price === 0 ? t.comparison.free : formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-xs text-muted-foreground">{yearly ? t.period.yr : t.period.mo}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("font-semibold tabular-nums", sellerFee === 0 && "text-success")}>
                    {sellerFee}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold tabular-nums">
                    {buyerProtection}% + €{buyerFixed.toFixed(2)}
                    {buyerCap > 0 ? ` (${t.planFeatures.capLabel} €${buyerCap.toFixed(2)})` : ""}
                  </span>
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {plan.max_listings == null || plan.max_listings >= 9999 ? (
                    <span className="font-medium text-primary">{t.comparison.unlimited}</span>
                  ) : (
                    plan.max_listings
                  )}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {(plan.boosts_included ?? 0) >= 999 ? (
                    <span className="font-medium text-primary">∞</span>
                  ) : (
                    plan.boosts_included ?? 0
                  )}
                </TableCell>
                <TableCell className="pr-4 text-center">
                  {plan.priority_support ? (
                    <Check className="mx-auto size-5 text-primary" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export function PlansComparisonSection({
  filteredPlans,
  yearly,
  currentTier,
  t,
  formatPrice,
}: {
  filteredPlans: SubscriptionPlanRow[]
  yearly: boolean
  currentTier: string
  t: PlansPageContent
  formatPrice: (price: number) => string
}) {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <div className="mb-10 hidden text-center md:block">
        <h2 className="text-2xl font-bold tracking-tight">{t.comparison.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t.comparison.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-md border md:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="comparison" className="border-0">
            <AccordionTrigger className="px-5 py-4 hover:no-underline data-[state=open]:bg-selected">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">{t.comparison.title}</span>
                <span className="text-xs text-muted-foreground">{t.comparison.subtitle}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <PlansComparisonTable
                filteredPlans={filteredPlans}
                yearly={yearly}
                currentTier={currentTier}
                t={t}
                formatPrice={formatPrice}
                className="rounded-none border-0"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="hidden md:block">
        <PlansComparisonTable
          filteredPlans={filteredPlans}
          yearly={yearly}
          currentTier={currentTier}
          t={t}
          formatPrice={formatPrice}
        />
      </div>
    </section>
  )
}
