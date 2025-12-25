"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { 
  Crown, 
  Buildings, 
  User, 
  ArrowRight,
  SealCheck,
} from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Reuse shared components from plan-card
import { PlansGrid, PlansGridSkeleton, type Plan } from "@/components/pricing/plan-card"

interface PlansModalProps {
  /** Trigger element - if not provided, use open/onOpenChange for controlled mode */
  trigger?: React.ReactNode
  /** Controlled mode: whether the modal is open */
  open?: boolean
  /** Controlled mode: callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default account type tab to show */
  defaultAccountType?: "personal" | "business"
  /** Current user's tier (to show "Current Plan" badge) */
  currentTier?: string
  /** Title override */
  title?: string
  /** Description override */
  description?: string
  /** Source for analytics (where the modal was opened from) */
  source?: "header" | "account" | "sell" | "sidebar" | "other"
}

// =============================================================================
// Translations
// =============================================================================

const translations = {
  en: {
    title: "Choose Your Plan",
    description: "Upgrade for lower fees and more listings",
    personal: "Personal",
    business: "Business",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 17%",
    viewFullComparison: "View full comparison",
    noHiddenFees: "No hidden fees • No per-order charges",
    upgrade: "Upgrade",
  },
  bg: {
    title: "Изберете план",
    description: "Надградете за по-ниски такси и повече обяви",
    personal: "Личен",
    business: "Бизнес",
    monthly: "Месечно",
    yearly: "Годишно",
    save: "Спести 17%",
    viewFullComparison: "Виж пълно сравнение",
    noHiddenFees: "Без скрити такси • Без такси на поръчка",
    upgrade: "Надгради",
  },
}

// =============================================================================
// Main PlansModal Component
// =============================================================================

export function PlansModal({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultAccountType = "personal",
  currentTier,
  title,
  description,
  source: _source,
}: PlansModalProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  // Internal open state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = useMemo(
    () => isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen,
    [isControlled, controlledOnOpenChange]
  )

  const [accountType, setAccountType] = useState<"personal" | "business">(defaultAccountType)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null)

  // Fetch plans when modal opens
  useEffect(() => {
    if (!isOpen) return

    async function fetchPlans() {
      setLoading(true)
      try {
        const res = await fetch("/api/plans")
        if (res.ok) {
          const data = await res.json()
          setPlans(data)
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [isOpen])

  const filteredPlans = plans.filter(p => p.account_type === accountType)

  const handleSelectPlan = useCallback(async (plan: Plan) => {
    if (plan.tier === currentTier) return
    
    // For free plans, just close modal - they're already on free
    if (plan.price_monthly === 0) {
      setIsOpen(false)
      return
    }

    setSubscribingPlan(plan.id)
    
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      // On error, redirect to full plans page
      setIsOpen(false)
      router.push("/plans")
    } finally {
      setSubscribingPlan(null)
    }
  }, [currentTier, billingPeriod, locale, router, setIsOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="max-w-lg sm:max-w-2xl max-h-[85vh] overflow-visible p-0">
        <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5">
          <DialogHeader className="text-center sm:text-center space-y-1">
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="text-2xs px-2 py-0.5">
                <SealCheck weight="fill" className="size-2.5 mr-1 text-primary" />
                {t.noHiddenFees}
              </Badge>
            </div>
            <DialogTitle className="text-lg font-bold">
              {title || t.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {description || t.description}
            </DialogDescription>
          </DialogHeader>

          {/* Compact Controls Row */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {/* Account Type Toggle */}
            <div className="inline-flex p-0.5 rounded-md bg-muted/50 border text-xs">
              <button
                onClick={() => setAccountType("personal")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded font-medium transition-all",
                  accountType === "personal"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User weight={accountType === "personal" ? "fill" : "regular"} className="size-3" />
                {t.personal}
              </button>
              <button
                onClick={() => setAccountType("business")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded font-medium transition-all",
                  accountType === "business"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Buildings weight={accountType === "business" ? "fill" : "regular"} className="size-3" />
                {t.business}
              </button>
            </div>

            <div className="w-px h-5 bg-border" />

            {/* Billing Toggle */}
            <div className="inline-flex p-0.5 rounded-md bg-muted/50 border text-xs">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "px-2 py-1 rounded font-medium transition-all",
                  billingPeriod === "monthly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.monthly}
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "px-2 py-1 rounded font-medium transition-all flex items-center gap-1",
                  billingPeriod === "yearly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.yearly}
                <Badge variant="secondary" className="text-2xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-1 py-0">
                  {t.save}
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid - pt-3 for badge overflow space */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-3 overflow-y-visible">
          {loading ? (
            <PlansGridSkeleton count={filteredPlans.length || 2} variant="compact" />
          ) : (
            <PlansGrid
              plans={filteredPlans}
              locale={locale}
              billingPeriod={billingPeriod}
              currentTier={currentTier}
              loadingPlanId={subscribingPlan}
              onSelectPlan={handleSelectPlan}
              variant="compact"
            />
          )}

          {/* Full Comparison Link */}
          <div className="mt-4 text-center">
            <Link
              href="/plans"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group"
            >
              {t.viewFullComparison}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// Convenience Export: Trigger Button
// =============================================================================

export function PlansModalTrigger({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button> & {
  children?: React.ReactNode
}) {
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <Button variant={variant} size={size} className={className} {...props}>
      {children || (
        <>
          <Crown weight="fill" className="size-4 mr-1.5" />
          {t.upgrade}
        </>
      )}
    </Button>
  )
}

// =============================================================================
// Hook for programmatic control
// =============================================================================

export { usePlansModal } from "@/hooks/use-plans-modal"
