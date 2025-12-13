"use client"

import { Check, User, Crown, Buildings, Rocket, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

export interface Plan {
  id: string
  name: string
  tier: string
  account_type: "personal" | "business"
  price_monthly: number
  price_yearly: number
  max_listings: number | null
  // Fee structure (all paid by seller from their earnings)
  final_value_fee: number  // % of sale taken when item sells
  insertion_fee: number    // Fee per listing AFTER free allowance
  per_order_fee: number    // Flat fee per transaction (payment processing)
  boosts_included: number
  priority_support: boolean
  analytics_access: string
  badge_type: string | null
  description: string
  description_bg: string
  features: string[]
  // Legacy field for backward compatibility during migration
  commission_rate?: number
}

interface PlanCardProps {
  plan: Plan
  locale: string
  billingPeriod: "monthly" | "yearly"
  isCurrentPlan?: boolean
  isLoading?: boolean
  onSelect?: (plan: Plan) => void
  variant?: "compact" | "full"
}

// =============================================================================
// Translations
// =============================================================================

const translations = {
  en: {
    free: "Free",
    perMonth: "/mo",
    perYear: "/yr",
    currentPlan: "Current",
    upgrade: "Upgrade",
    getStarted: "Get Started",
    downgrade: "Downgrade",
    popular: "Popular",
    bestValue: "Best Value",
    listings: "free listings",
    unlimited: "Unlimited",
    fvf: "per sale",           // Final Value Fee
    perOrder: "per order",     // Per-order fee (payment processing)
    insertionFee: "per extra", // Insertion fee after free listings
    noFees: "No extra fees",   // For enterprise plans
    boosts: "boosts/mo",
    included: "Included:",
    moreFeatures: "more",
  },
  bg: {
    free: "Безплатно",
    perMonth: "/мес",
    perYear: "/год",
    currentPlan: "Текущ",
    upgrade: "Надгради",
    getStarted: "Започни",
    downgrade: "Понижи",
    popular: "Популярен",
    bestValue: "Най-добра цена",
    listings: "безплатни обяви",
    unlimited: "Неограничено",
    fvf: "на продажба",        // Final Value Fee
    perOrder: "на поръчка",    // Per-order fee
    insertionFee: "за допълн.", // Insertion fee
    noFees: "Без допълн. такси",
    boosts: "буста/мес",
    included: "Включено:",
    moreFeatures: "още",
  },
}

// =============================================================================
// Utility Functions
// =============================================================================

function getPlanIcon(tier: string) {
  switch (tier) {
    case "basic":
      return <User weight="duotone" className="size-5" />
    case "premium":
      return <Crown weight="fill" className="size-5" />
    case "business":
      return <Buildings weight="duotone" className="size-5" />
    default:
      return <Rocket weight="duotone" className="size-5" />
  }
}

function isPremiumPlan(plan: Plan): boolean {
  return plan.tier === "premium" || plan.name.toLowerCase().includes("pro")
}

function isBestValuePlan(plan: Plan): boolean {
  return plan.name.toLowerCase().includes("pro+") || plan.name.toLowerCase().includes("enterprise")
}

// =============================================================================
// Component
// =============================================================================

export function PlanCard({
  plan,
  locale,
  billingPeriod,
  isCurrentPlan = false,
  isLoading = false,
  onSelect,
  variant = "compact",
}: PlanCardProps) {
  const t = translations[locale as keyof typeof translations] || translations.en
  const isPopular = isPremiumPlan(plan) && !isBestValuePlan(plan)
  const isBest = isBestValuePlan(plan)
  const price = billingPeriod === "monthly" ? plan.price_monthly : plan.price_yearly

  const formatPrice = (price: number) => {
    if (price === 0) return t.free
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const maxFeatures = variant === "compact" ? 3 : 6
  const visibleFeatures = plan.features.slice(0, maxFeatures)
  const hiddenCount = plan.features.length - maxFeatures

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-card transition-all",
        // Mobile: large cards for horizontal scroll (shows ~10-15% peek of next card)
        // Using calc to account for container padding (1rem each side) and gap (1rem)
        // Compact: smaller cards for modals, Full: larger cards for pages
        variant === "compact" 
          ? "w-[calc(100vw-4rem)] max-w-[280px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-none"
          : "w-[calc(100vw-3rem)] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-none",
        // Styling based on plan type
        isPopular && "border-primary ring-1 ring-primary/20 shadow-md",
        isBest && "border-amber-500 ring-1 ring-amber-500/20 shadow-md",
        isCurrentPlan && "bg-muted/30",
        // Padding
        variant === "compact" ? "p-4" : "p-5 md:p-6"
      )}
    >
      {/* Badge */}
      {(isPopular || isBest) && (
        <Badge
          className={cn(
            "absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5",
            isPopular && "bg-primary text-primary-foreground",
            isBest && "bg-amber-500 text-white"
          )}
        >
          {isBest ? t.bestValue : t.popular}
        </Badge>
      )}

      {/* Header: Icon + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center shrink-0",
            isPopular
              ? "bg-primary text-primary-foreground"
              : isBest
                ? "bg-amber-500 text-white"
                : "bg-muted text-muted-foreground"
          )}
        >
          {getPlanIcon(plan.tier)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base leading-tight truncate">{plan.name}</h3>
          {isCurrentPlan && (
            <Badge variant="secondary" className="text-[10px] mt-0.5 px-1.5 py-0">
              {t.currentPlan}
            </Badge>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{formatPrice(price)}</span>
          {price > 0 && (
            <span className="text-muted-foreground text-sm">
              {billingPeriod === "monthly" ? t.perMonth : t.perYear}
            </span>
          )}
        </div>
        {/* Description */}
        {variant === "full" && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {locale === "bg" ? plan.description_bg : plan.description}
          </p>
        )}
      </div>

      {/* Stats Row - Key fees: listings, FVF%, per-order fee */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 pb-3 border-b flex-wrap">
        {/* Free listings count */}
        <span className="inline-flex items-center gap-1">
          <span className="font-semibold text-foreground">
            {plan.max_listings ?? "∞"}
          </span>
          {t.listings}
        </span>
        <span className="text-border">•</span>
        {/* Final Value Fee (% per sale) */}
        <span className="inline-flex items-center gap-1">
          <span className="font-semibold text-foreground">
            {plan.final_value_fee ?? plan.commission_rate}%
          </span>
          {t.fvf}
        </span>
        <span className="text-border">•</span>
        {/* Per-order fee OR "No fees" for enterprise */}
        {(plan.per_order_fee ?? 0.25) > 0 ? (
          <span className="inline-flex items-center gap-1">
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat(locale, { style: "currency", currency: "BGN", minimumFractionDigits: 2 }).format(plan.per_order_fee ?? 0.25)}
            </span>
            {t.perOrder}
          </span>
        ) : (
          <span className="text-green-600 dark:text-green-400 font-medium">
            {t.noFees}
          </span>
        )}
        {/* Boosts included */}
        {plan.boosts_included > 0 && (
          <>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-foreground">
                {plan.boosts_included >= 999 ? "∞" : plan.boosts_included}
              </span>
              {t.boosts}
            </span>
          </>
        )}
      </div>

      {/* Features */}
      <div className="mb-4 flex-1">
        {variant === "full" && (
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {t.included}
          </p>
        )}
        <ul className="space-y-1.5">
          {visibleFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <Check
                weight="bold"
                className={cn(
                  "size-3.5 shrink-0 mt-0.5",
                  isPopular ? "text-primary" : isBest ? "text-amber-500" : "text-muted-foreground"
                )}
              />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>
        {hiddenCount > 0 && (
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            +{hiddenCount} {t.moreFeatures}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <Button
        size="sm"
        variant={isPopular || isBest ? "default" : "outline"}
        className={cn(
          "w-full",
          isPopular && "bg-primary hover:bg-primary/90",
          isBest && "bg-amber-500 hover:bg-amber-600 text-white",
          isCurrentPlan && "opacity-50 cursor-not-allowed"
        )}
        disabled={isCurrentPlan || isLoading}
        onClick={() => onSelect?.(plan)}
      >
        {isLoading ? (
          <SpinnerGap className="size-4 animate-spin" />
        ) : isCurrentPlan ? (
          t.currentPlan
        ) : price === 0 ? (
          t.getStarted
        ) : (
          t.upgrade
        )}
      </Button>
    </div>
  )
}

// =============================================================================
// Plans Grid Component (with mobile horizontal scroll)
// =============================================================================

interface PlansGridProps {
  plans: Plan[]
  locale: string
  billingPeriod: "monthly" | "yearly"
  currentTier?: string
  loadingPlanId?: string | null
  onSelectPlan?: (plan: Plan) => void
  variant?: "compact" | "full"
  className?: string
}

export function PlansGrid({
  plans,
  locale,
  billingPeriod,
  currentTier,
  loadingPlanId,
  onSelectPlan,
  variant = "compact",
  className,
}: PlansGridProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {locale === "bg" ? "Няма налични планове" : "No plans available"}
      </div>
    )
  }

  return (
    <div
      className={cn(
        // Mobile: horizontal scroll with snap, negative margin to extend past container padding
        // pt-3 gives space for badges that overflow top
        "-mx-4 px-4 pt-3 flex gap-4 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory no-scrollbar",
        // Desktop: reset margins and use grid layout
        plans.length === 2 && "md:mx-0 md:px-0 md:grid md:grid-cols-2 md:overflow-visible md:pb-0",
        plans.length >= 3 && "md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0",
        className
      )}
    >
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          locale={locale}
          billingPeriod={billingPeriod}
          isCurrentPlan={plan.tier === currentTier}
          isLoading={loadingPlanId === plan.id}
          onSelect={onSelectPlan}
          variant={variant}
        />
      ))}
    </div>
  )
}

// =============================================================================
// Loading Skeleton
// =============================================================================

export function PlansGridSkeleton({ count = 3, variant = "full" }: { count?: number; variant?: "compact" | "full" }) {
  return (
    <div className="-mx-4 px-4 pt-3 flex gap-4 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory no-scrollbar md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "shrink-0 snap-center md:w-auto md:shrink md:snap-none rounded-xl border bg-card p-4 animate-pulse",
            variant === "compact" ? "w-[calc(100vw-4rem)] max-w-[280px]" : "w-[calc(100vw-3rem)]"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-muted" />
            <div className="h-5 w-24 bg-muted rounded" />
          </div>
          <div className="h-8 w-20 bg-muted rounded mb-3" />
          <div className="h-4 bg-muted rounded mb-3" />
          <div className="space-y-2 mb-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-3 bg-muted rounded w-full" />
            ))}
          </div>
          <div className="h-9 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}
