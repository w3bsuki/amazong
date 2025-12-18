"use client"

import { Check } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  period: "monthly" | "yearly"
  fee: number
  features: string[]
  popular?: boolean
  current?: boolean
}

interface PricingCardProps {
  plan: PricingPlan
  onSelect?: (plan: PricingPlan) => void
  loading?: boolean
}

// =============================================================================
// Component
// =============================================================================

export function PricingCard({ plan, onSelect, loading }: PricingCardProps) {
  const { name, description, price, period, fee, features, popular, current } = plan

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-card p-5",
        popular && "border-foreground",
        current && "ring-1 ring-muted-foreground"
      )}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">
            Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight">
            {price === 0 ? "Free" : `€${price}`}
          </span>
          {price > 0 && (
            <span className="text-sm text-muted-foreground">
              /{period === "monthly" ? "mo" : "yr"}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {fee}% fee when sold
        </p>
      </div>

      {/* Features */}
      <ul className="mb-4 flex-1 space-y-2">
        {features.slice(0, 4).map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <Check weight="bold" className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-1">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        className="w-full"
        size="sm"
        variant={popular ? "default" : "outline"}
        disabled={current || loading}
        onClick={() => onSelect?.(plan)}
      >
        {loading ? "..." : current ? "Current" : "Get Started"}
      </Button>
    </div>
  )
}

// =============================================================================
// Grid
// =============================================================================

interface PricingGridProps {
  plans: PricingPlan[]
  onSelect?: (plan: PricingPlan) => void
  loadingId?: string | null
}

export function PricingGrid({ plans, onSelect, loadingId }: PricingGridProps) {
  // Dynamic grid: 1 col mobile, 2 col sm, 3 col md, 4 col lg, 5 col xl
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          onSelect={onSelect}
          loading={loadingId === plan.id}
        />
      ))}
    </div>
  )
}

// =============================================================================
// Skeleton
// =============================================================================

export function PricingGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-6">
          <div className="mb-6 space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="mb-6">
            <div className="h-10 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="mb-6 space-y-3">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-4 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="h-10 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
