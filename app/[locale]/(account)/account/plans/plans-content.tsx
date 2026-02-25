"use client"

import { useState, useEffect, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlansBoostSection } from "./plans-boost-section"
import { getPlansContentCopy } from "./plans-content.copy"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  RefreshCw as ArrowsClockwise,
  Calendar as CalendarBlank,
  TriangleAlert as Warning,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getSubscriptionCheckoutUrl, redirectToBillingPortal } from "../_lib/stripe-redirects"
import { PlansGrid, type Plan } from "../_components/plan-card"
import {
  mapSubscriptionPlanToPlan,
  type PlansContentProps,
} from "./plans-content.types"

import { logger } from "@/lib/logger"
export function PlansContent({
  locale,
  plans,
  currentTier,
  seller,
  currentSubscription,
  actions,
}: PlansContentProps) {
  const copy = getPlansContentCopy(locale)
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [isPending, startTransition] = useTransition()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const searchParams = useSearchParams()

  // Computed: Is this subscription set to cancel at period end?
  const isCancelledButActive = currentSubscription?.status === "active" && currentSubscription?.auto_renew === false
  const hasActiveSubscription = currentSubscription?.status === "active" && currentTier !== "free"

  // Format expiry date
  const expiryDate = currentSubscription?.expires_at
    ? new Date(currentSubscription.expires_at).toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    : null

  // Show toast notifications based on URL params (from Stripe redirect)
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success(copy.subscriptionActivated)
      window.history.replaceState({}, "", window.location.pathname)
    } else if (searchParams.get("canceled") === "true") {
      toast.info(copy.paymentCancelled)
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [searchParams, copy])

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    startTransition(async () => {
      const result = await actions.cancelSubscription()
      if (result.success) {
        toast.success(copy.cancelAtPeriodEnd)
        setCancelDialogOpen(false)
      } else {
        toast.error(result.error || copy.genericError)
      }
    })
  }

  // Handle subscription reactivation
  const handleReactivate = () => {
    startTransition(async () => {
      const result = await actions.reactivateSubscription()
      if (result.success) {
        toast.success(copy.subscriptionReactivated)
      } else {
        toast.error(result.error || copy.genericError)
      }
    })
  }

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.price_monthly === 0) {
      toast.info(copy.freePlanInfo)
      return
    }

    setLoadingPlanId(plan.id)

    try {
      const url = await getSubscriptionCheckoutUrl(actions.createSubscriptionCheckoutSession, {
        planId: plan.id,
        billingPeriod,
        locale,
      })
      if (url) window.location.href = url
    } catch (err) {
      logger.error("[account-plans] checkout_session_failed", err)
      toast.error(copy.checkoutError)
    } finally {
      setLoadingPlanId(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      await redirectToBillingPortal(actions.createBillingPortalSession, locale)
    } catch (err) {
      logger.error("[account-plans] portal_open_failed", err)
      toast.error(copy.portalError)
    }
  }

  // Plans are already filtered by account type from server
  // Just map to Plan interface for display
  const mappedPlans = plans.map(mapSubscriptionPlanToPlan)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          {copy.headerTitle}
        </h1>
        <p className="text-muted-foreground">
          {copy.headerDescription}
        </p>
      </div>

      {/* Current Subscription Status Card */}
      {seller && hasActiveSubscription && (
        <Card className={cn(
          "max-w-md mx-auto",
          isCancelledButActive && "border-warning/50 bg-warning/5"
        )}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              {/* Plan Badge & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={isCancelledButActive ? "outline" : "secondary"} className="text-sm px-3 py-1">
                    {copy.currentPlanPrefix}
                    <span className="font-semibold capitalize ml-1">{currentTier}</span>
                  </Badge>
                  {isCancelledButActive && (
                    <Badge variant="outline" className="text-warning border-warning/50">
                      {copy.cancelling}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Expiry Info */}
              {expiryDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarBlank className="size-4" />
                  <span>{isCancelledButActive ? copy.accessEndsOn(expiryDate) : copy.nextBilling(expiryDate)}</span>
                </div>
              )}

              {/* Cancellation Warning */}
              {isCancelledButActive && (
                <div className="flex items-start gap-2 p-2 rounded-md bg-warning/10 text-warning text-xs">
                  <Warning className="size-4 shrink-0 mt-0.5" />
                  <span>{copy.cancellationWarning}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {isCancelledButActive ? (
                  // Show Reactivate button if cancelled but not yet expired
                  <Button
                    size="sm"
                    onClick={handleReactivate}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    <ArrowsClockwise className={cn("size-4", isPending && "animate-spin")} />
                    {copy.reactivate}
                  </Button>
                ) : (
                  // Show Cancel button for active subscriptions
                  <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                        <X className="size-4" />
                        {copy.cancelSubscription}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{copy.cancelDialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>{copy.cancelDialogDescription}</p>
                          {expiryDate && (
                            <p className="font-medium">
                              {copy.accessExpiresOn(expiryDate)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {copy.resubscribeHint}
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{copy.keepSubscription}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          disabled={isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive"
                        >
                          {isPending
                            ? copy.processing
                            : copy.cancelConfirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Stripe Portal for payment method management */}
                {currentSubscription?.stripe_subscription_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManageSubscription}
                    className="text-xs"
                  >
                    {copy.paymentMethods}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Badge for free tier users */}
      {seller && !hasActiveSubscription && (
        <div className="flex flex-col items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {copy.currentPlanPrefix}
            <span className="font-semibold capitalize ml-1">{currentTier}</span>
          </Badge>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {copy.freeTierHint}
          </p>
        </div>
      )}

      {/* Billing Period Toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingPeriod === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod("monthly")}
            aria-pressed={billingPeriod === "monthly"}
          >
            {copy.monthly}
          </button>
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              billingPeriod === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod("yearly")}
            aria-pressed={billingPeriod === "yearly"}
          >
            {copy.yearly}
            <Badge variant="secondary" className="text-xs bg-selected text-primary">
              -17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans Grid - Uses shared component */}
      <PlansGrid
        plans={mappedPlans}
        locale={locale}
        billingPeriod={billingPeriod}
        currentTier={currentTier}
        loadingPlanId={loadingPlanId}
        onSelectPlan={handleSelectPlan}
        variant="compact"
      />

      <PlansBoostSection copy={copy} />

      {/* FAQ or Help */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {copy.contactPrefix}
          <Link href="/customer-service" className="text-link hover:underline">
            {copy.contactUs}
          </Link>
        </p>
      </div>
    </div>
  )
}
