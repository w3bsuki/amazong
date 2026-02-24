import { Check, ShieldCheck, User } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import * as PricingCard from "./pricing-card"
import { featureIcons, planIcons } from "./plans-page-client.config"
import { buildPlanFeatureList } from "./plans-page-client.helpers"
import type { PlansPageContent, SubscriptionPlanRow } from "./plans-page-client.types"

export function PlansHeroSection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section id="pricing" className="mb-12 scroll-mt-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{subtitle}</p>
    </section>
  )
}

export function PlansControls({
  accountType,
  setAccountType,
  yearly,
  setYearly,
  t,
}: {
  accountType: "personal" | "business"
  setAccountType: (value: "personal" | "business") => void
  yearly: boolean
  setYearly: (value: boolean) => void
  t: PlansPageContent
}) {
  return (
    <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <div className="flex items-center gap-3 rounded-full border bg-surface-subtle p-1">
        <button
          type="button"
          onClick={() => setAccountType("personal")}
          aria-pressed={accountType === "personal"}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            accountType === "personal"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.personal}
        </button>
        <button
          type="button"
          onClick={() => setAccountType("business")}
          aria-pressed={accountType === "business"}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            accountType === "business"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.business}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className={cn("text-sm", !yearly && "font-medium")}>{t.monthly}</span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className={cn("text-sm", yearly && "font-medium")}>{t.yearly}</span>
        {yearly && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            {t.saveLabel}
          </span>
        )}
      </div>
    </div>
  )
}

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

export function PlansFeaturesSection({ t }: { t: PlansPageContent }) {
  return (
    <section id="features" className="mb-16 scroll-mt-20">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t.features.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t.features.subtitle}</p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
        {t.features.items.map((feature, i) => {
          const Icon = featureIcons[feature.icon]
          return (
            <div key={i} className="flex flex-col items-center bg-background p-4 text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-selected">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

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

export function PlansGuaranteeSection({ t }: { t: PlansPageContent }) {
  return (
    <section id="guarantee" className="mb-16 scroll-mt-20">
      <div className="flex flex-col items-center gap-4 rounded-md border border-selected-border bg-hover p-4 text-center sm:flex-row sm:text-left">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-selected">
          <ShieldCheck className="size-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{t.guarantee.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t.guarantee.desc}</p>
        </div>
      </div>
    </section>
  )
}

export function PlansFaqSection({ t }: { t: PlansPageContent }) {
  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t.faq.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t.faq.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Accordion type="single" collapsible className="w-full">
          {t.faq.items.map((item, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-b px-0 last:border-0">
              <AccordionTrigger className="px-5 py-4 text-left text-sm hover:no-underline data-[state=open]:bg-selected">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export function PlansFooter({
  tFooter,
}: {
  tFooter: (key: string) => string
}) {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <span className="text-sm text-muted-foreground">{tFooter("copyrightSimple")}</span>
        <div className="flex gap-4 text-sm">
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            {tFooter("terms")}
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            {tFooter("privacyPolicy")}
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            {tFooter("contactUs")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
