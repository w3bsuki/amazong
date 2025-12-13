"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightning, ArrowUpRight, User, Buildings } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { PlansGrid, type Plan } from "@/components/plan-card"

interface SubscriptionPlan {
  id: string
  tier: string
  name: string
  account_type?: "personal" | "business"
  price_monthly: number
  price_yearly: number
  // Fee structure (all paid by seller from earnings)
  final_value_fee?: number      // % of sale when item sells
  insertion_fee?: number        // Per listing after free allowance
  per_order_fee?: number        // Flat fee per transaction (payment processing)
  commission_rate?: number      // Legacy field for backward compatibility
  max_listings?: number | null
  boosts_included?: number
  priority_support?: boolean
  analytics_access?: string
  badge_type?: string | null
  description?: string
  description_bg?: string
  features: string[]
  stripe_monthly_price_id: string | null
  stripe_yearly_price_id: string | null
  is_active: boolean
}

interface Seller {
  id: string
  tier: string
  account_type?: "personal" | "business"
  final_value_fee?: number
  insertion_fee?: number
  commission_rate?: number  // Legacy
  [key: string]: unknown
}

interface Subscription {
  id: string
  seller_id: string
  plan_type: string
  status: string
  stripe_subscription_id: string | null
  [key: string]: unknown
}

interface PlansContentProps {
  locale: string
  plans: SubscriptionPlan[]
  currentTier: string
  seller: Seller | null
  currentSubscription: Subscription | null
}

// Convert SubscriptionPlan to Plan interface for shared component
function toPlan(sp: SubscriptionPlan): Plan {
  return {
    id: sp.id,
    name: sp.name,
    tier: sp.tier,
    account_type: sp.account_type || "personal",
    price_monthly: sp.price_monthly,
    price_yearly: sp.price_yearly,
    max_listings: sp.max_listings ?? null,
    // Fee structure (all paid by seller)
    final_value_fee: sp.final_value_fee ?? sp.commission_rate ?? 12,
    insertion_fee: sp.insertion_fee ?? 0.25,
    per_order_fee: sp.per_order_fee ?? 0.25,
    commission_rate: sp.commission_rate,  // Legacy compat
    boosts_included: sp.boosts_included ?? 0,
    priority_support: sp.priority_support ?? false,
    analytics_access: sp.analytics_access ?? "none",
    badge_type: sp.badge_type ?? null,
    description: sp.description ?? "",
    description_bg: sp.description_bg ?? "",
    features: sp.features,
  }
}

export function PlansContent({ 
  locale, 
  plans, 
  currentTier, 
  seller,
  currentSubscription 
}: PlansContentProps) {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [accountType, setAccountType] = useState<"personal" | "business">(
    seller?.account_type || "personal"
  )
  const searchParams = useSearchParams()

  // Show toast notifications based on URL params (from Stripe redirect)
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success(
        locale === "bg" 
          ? "Абонаментът е активиран успешно!" 
          : "Subscription activated successfully!"
      )
      window.history.replaceState({}, "", window.location.pathname)
    } else if (searchParams.get("canceled") === "true") {
      toast.info(
        locale === "bg" 
          ? "Плащането беше отменено" 
          : "Payment was cancelled"
      )
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [searchParams, locale])

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.price_monthly === 0) {
      toast.info(locale === "bg" ? "Това е безплатен план" : "This is a free plan")
      return
    }

    setLoadingPlanId(plan.id)
    
    try {
      const response = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(
        locale === "bg" 
          ? "Грешка при създаване на плащане. Моля, опитайте отново." 
          : "Error creating payment. Please try again."
      )
    } finally {
      setLoadingPlanId(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/portal", { method: "POST" })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to open customer portal")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Portal error:", error)
      toast.error(
        locale === "bg" 
          ? "Грешка при отваряне на портала. Моля, опитайте отново." 
          : "Error opening portal. Please try again."
      )
    }
  }

  // Filter plans by account type
  const filteredPlans = plans
    .filter((p) => !p.account_type || p.account_type === accountType)
    .map(toPlan)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          {locale === "bg" ? "Изберете план за продавач" : "Choose a Seller Plan"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "bg" 
            ? "Надградете акаунта си за по-ниски комисиони и повече възможности"
            : "Upgrade your account for lower commissions and more features"}
        </p>
      </div>

      {/* Current Plan Badge & Actions */}
      {seller && (
        <div className="flex flex-col items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {locale === "bg" ? "Текущ план: " : "Current plan: "}
            <span className="font-semibold capitalize ml-1">{currentTier}</span>
          </Badge>
          
          <div className="flex items-center gap-2">
            {currentTier !== "business" && (
              <Link href="/account/plans/upgrade">
                <Button size="sm" className="gap-1.5">
                  <ArrowUpRight className="size-4" weight="bold" />
                  {locale === "bg" ? "Надгради" : "Upgrade"}
                </Button>
              </Link>
            )}
            {currentSubscription?.stripe_subscription_id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManageSubscription}
              >
                {locale === "bg" ? "Управление на абонамента" : "Manage Subscription"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Account Type Toggle + Billing Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="inline-flex p-1 rounded-xl bg-muted/50 border">
          <button
            onClick={() => setAccountType("personal")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              accountType === "personal"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User weight={accountType === "personal" ? "fill" : "regular"} className="size-4" />
            {locale === "bg" ? "Личен" : "Personal"}
          </button>
          <button
            onClick={() => setAccountType("business")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              accountType === "business"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Buildings weight={accountType === "business" ? "fill" : "regular"} className="size-4" />
            {locale === "bg" ? "Бизнес" : "Business"}
          </button>
        </div>

        <div className="hidden sm:block w-px h-8 bg-border" />

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingPeriod === "monthly" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod("monthly")}
          >
            {locale === "bg" ? "Месечно" : "Monthly"}
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              billingPeriod === "yearly" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod("yearly")}
          >
            {locale === "bg" ? "Годишно" : "Yearly"}
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              -17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans Grid - Uses shared component */}
      <PlansGrid
        plans={filteredPlans}
        locale={locale}
        billingPeriod={billingPeriod}
        currentTier={currentTier}
        loadingPlanId={loadingPlanId}
        onSelectPlan={handleSelectPlan}
        variant="compact"
      />

      {/* Boost Section - Compact */}
      <div className="mt-6 md:mt-10">
        <Card className="border-border">
          <CardHeader className="p-4 pb-2 md:p-6 md:pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-muted">
                <Lightning className="size-4 text-primary" weight="fill" />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">
                  {locale === 'bg' ? 'Промотирай обявите си' : 'Boost Your Listings'}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {locale === 'bg' 
                    ? 'Покажи продуктите си на повече хора'
                    : 'Show your products to more people'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 md:p-6 md:pt-0">
            {/* Horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible">
              <div className="border border-border rounded-md p-3 text-center shrink-0 w-24 snap-center sm:w-auto">
                <p className="text-lg font-semibold">2.99 лв</p>
                <p className="text-xs text-muted-foreground">{locale === 'bg' ? '7 дни' : '7 days'}</p>
              </div>
              <div className="border border-primary rounded-md p-3 text-center relative shrink-0 w-24 snap-center sm:w-auto">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                  {locale === 'bg' ? 'Най-добра' : 'Best'}
                </Badge>
                <p className="text-lg font-semibold">4.99 лв</p>
                <p className="text-xs text-muted-foreground">{locale === 'bg' ? '14 дни' : '14 days'}</p>
              </div>
              <div className="border border-border rounded-md p-3 text-center shrink-0 w-24 snap-center sm:w-auto">
                <p className="text-lg font-semibold">8.99 лв</p>
                <p className="text-xs text-muted-foreground">{locale === 'bg' ? '30 дни' : '30 days'}</p>
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-3 text-center">
              {locale === 'bg' 
                ? 'Промотираните обяви се показват в секцията "Препоръчани" и имат по-високо позициониране.'
                : 'Boosted listings appear in "Recommended" and rank higher in search.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ or Help */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {locale === 'bg' ? 'Имате въпроси? ' : 'Have questions? '}
          <a href="/customer-service" className="text-link hover:underline">
            {locale === 'bg' ? 'Свържете се с нас' : 'Contact us'}
          </a>
        </p>
      </div>
    </div>
  )
}
