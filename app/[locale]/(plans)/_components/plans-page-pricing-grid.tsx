import { Check, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import * as PricingCard from "./pricing-card"
import { planIcons } from "./plans-page-client.config"
import { buildPlanFeatureList } from "./plans-page-client.helpers"
import type { PlansPageContent, SubscriptionPlanRow } from "./plans-page-client.types"

export function PlansPricingGrid({
  filteredPlans,
  yearly,
  currentTier,
  locale,
  t,
  subscribingId,
  onSelect,
}: {
  filteredPlans: SubscriptionPlanRow[]
  yearly: boolean
  currentTier: string
  locale: string
  t: PlansPageContent
  subscribingId: string | null
  onSelect: (planId: string, price: number, isCurrent: boolean) => void
}) {
  return (
    <section className="mb-16">
      <div className="mb-5 rounded-md border border-selected-border bg-selected p-4">
        <p className="text-sm font-semibold">{t.buyerFeeAdvantage.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t.buyerFeeAdvantage.desc}</p>
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto overflow-y-visible px-4 pb-4 pt-3 snap-x snap-mandatory no-scrollbar touch-pan-x md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 xl:grid-cols-5">
        {filteredPlans.map((plan) => {
          const price = yearly ? (plan.price_yearly ?? 0) : (plan.price_monthly ?? 0)
          const originalPrice = yearly ? (plan.price_monthly ?? 0) * 12 : null
          const isCurrent = plan.tier === currentTier
          const isPopular = plan.tier === "plus" || plan.tier === "pro"
          const features = buildPlanFeatureList(locale, t, plan)
          const sellerFee = Number(plan.seller_fee_percent ?? 0)
          const buyerProtection = Number(plan.buyer_protection_percent ?? 0)
          const buyerFixed = Number(plan.buyer_protection_fixed ?? 0)
          const buyerCap = Number(plan.buyer_protection_cap ?? 0)
          const capSuffix =
            buyerCap > 0 ? ` (${t.planFeatures.capLabel} €${buyerCap.toFixed(2)})` : ""
          const icon = planIcons[plan.tier?.toLowerCase() ?? "free"] ?? <User className="size-4" />

          return (
            <PricingCard.Card
              key={plan.id}
              className={cn(
                "shrink-0 w-(--plans-skeleton-card-w) snap-center md:w-auto md:shrink md:snap-none",
                isCurrent && "border-primary bg-selected"
              )}
            >
              <PricingCard.Header>
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    {icon}
                    <span>{plan.name}</span>
                  </PricingCard.PlanName>
                  {isPopular && <PricingCard.Badge>{t.popular}</PricingCard.Badge>}
                  {isCurrent && <PricingCard.Badge>{t.current}</PricingCard.Badge>}
                </PricingCard.Plan>
                <PricingCard.Price>
                  <PricingCard.MainPrice>
                    {price === 0 ? t.comparison.free : `€${price}`}
                  </PricingCard.MainPrice>
                  {price > 0 && (
                    <PricingCard.Period>{yearly ? t.period.yr : t.period.mo}</PricingCard.Period>
                  )}
                  {yearly && originalPrice && originalPrice > price && (
                    <PricingCard.OriginalPrice>€{originalPrice}</PricingCard.OriginalPrice>
                  )}
                </PricingCard.Price>
                <PricingCard.Fee>
                  {t.buyerFeeLabel}: {buyerProtection}% + €{buyerFixed.toFixed(2)}
                  {capSuffix}
                </PricingCard.Fee>
                {sellerFee > 0 && <PricingCard.Fee>{sellerFee}% {t.feeLabel}</PricingCard.Fee>}
                <Button
                  className="mt-3 w-full"
                  disabled={isCurrent || subscribingId === plan.id}
                  onClick={() => onSelect(plan.id, price, isCurrent)}
                >
                  {subscribingId === plan.id ? "..." : isCurrent ? t.current : t.getStarted}
                </Button>
              </PricingCard.Header>

              <PricingCard.Body>
                <PricingCard.Description>
                  {locale === "bg" ? plan.description_bg : plan.description}
                </PricingCard.Description>
                <PricingCard.List>
                  {features.map((feature, i) => (
                    <PricingCard.ListItem key={i}>
                      <Check className="mt-0.5 size-3.5 shrink-0" />
                      <span>{feature}</span>
                    </PricingCard.ListItem>
                  ))}
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>
          )
        })}
      </div>
    </section>
  )
}
