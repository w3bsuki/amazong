"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { ArrowRight, Building2 as Buildings, BadgeCheck as SealCheck, User } from "lucide-react";

import { useLocale } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getSubscriptionCheckoutUrl } from "../_lib/stripe-redirects"

import { logger } from "@/lib/logger"
// Reuse shared components from plan-card
import { PlansGrid, PlansGridSkeleton, type Plan } from "./plan-card"

export type PlansModalServerActions = {
  createSubscriptionCheckoutSession: (args: {
    planId: string
    billingPeriod: "monthly" | "yearly"
    locale?: "en" | "bg"
  }) => Promise<{ url?: string; error?: string }>
}

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
  actions: PlansModalServerActions
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

function isPlanRecord(value: unknown): value is Plan {
  if (!value || typeof value !== "object") return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.tier === "string" &&
    (candidate.account_type === "personal" || candidate.account_type === "business") &&
    typeof candidate.price_monthly === "number" &&
    typeof candidate.price_yearly === "number" &&
    Array.isArray(candidate.features)
  )
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
  source,
  actions,
}: PlansModalProps) {
  const router = useRouter()
  const locale = useLocale()
  const localeKey = locale === "bg" ? "bg" : "en"
  const t = translations[localeKey]

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
          const payload: unknown = await res.json()
          if (Array.isArray(payload)) {
            setPlans(payload.filter(isPlanRecord))
          } else {
            setPlans([])
          }
        }
      } catch (error) {
        logger.error("[plans-modal] fetch_plans_failed", error)
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
      const url = await getSubscriptionCheckoutUrl(actions.createSubscriptionCheckoutSession, {
        planId: plan.id,
        billingPeriod,
        locale,
      })

      if (url) {
        window.location.href = url
      } else {
        // No URL returned but no error - unexpected state, redirect to full page
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      logger.error("[plans-modal] checkout_session_failed", error)
      // On error, redirect to full plans page where user can see clearer error
      setIsOpen(false)
      router.push("/plans")
    } finally {
      setSubscribingPlan(null)
    }
  }, [actions, currentTier, billingPeriod, router, setIsOpen, locale])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="max-w-lg sm:max-w-2xl max-h-dialog overflow-visible p-0" data-source={source ?? "unknown"}>
        <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5">
          <DialogHeader className="text-center sm:text-center space-y-1">
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="text-2xs px-2 py-0.5">
                <SealCheck className="size-2.5 mr-1 text-primary" />
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
            <div className="inline-flex p-0.5 rounded-md bg-surface-subtle border text-xs">
              <button
                type="button"
                onClick={() => setAccountType("personal")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded font-medium transition-all",
                  accountType === "personal"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={accountType === "personal"}
              >
                <User className="size-3" />
                {t.personal}
              </button>
              <button
                type="button"
                onClick={() => setAccountType("business")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded font-medium transition-all",
                  accountType === "business"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={accountType === "business"}
              >
                <Buildings className="size-3" />
                {t.business}
              </button>
            </div>

            <div className="w-px h-5 bg-border" />

            {/* Billing Toggle */}
            <div className="inline-flex p-0.5 rounded-md bg-surface-subtle border text-xs">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "px-2 py-1 rounded font-medium transition-all",
                  billingPeriod === "monthly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={billingPeriod === "monthly"}
              >
                {t.monthly}
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "px-2 py-1 rounded font-medium transition-all flex items-center gap-1",
                  billingPeriod === "yearly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={billingPeriod === "yearly"}
              >
                {t.yearly}
                <Badge variant="secondary" className="text-2xs bg-success/10 text-success border-success/20 px-1 py-0">
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
              {...(currentTier ? { currentTier } : {})}
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
