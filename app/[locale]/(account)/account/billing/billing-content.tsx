"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { redirectToBillingPortal } from "../_lib/stripe-redirects"
import { bg, enUS } from "date-fns/locale"
import {
  ArrowRight,
  CircleCheck as CheckCircle,
  CircleX as XCircle,
  Clock,
  CreditCard,
  Crown,
  Info,
} from "lucide-react"
import { BillingCurrentPlanCard } from "./billing-current-plan-card"
import { BillingHistoryTabs } from "./billing-history-tabs"
import type {
  BillingContentProps,
  BillingText,
  Charge,
  Invoice,
} from "./billing.types"

import { logger } from "@/lib/logger"
export type { BillingContentServerActions } from "./billing.types"

export function BillingContent({
  locale,
  seller,
  subscription,
  boosts,
  hasStripeCustomer,
  userEmail,
  actions,
}: BillingContentProps) {
  const tBilling = useTranslations("Account.billingPage")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [charges, setCharges] = useState<Charge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPortalLoading, setIsPortalLoading] = useState(false)

  const dateLocale = locale === "bg" ? bg : enUS

  const t: BillingText = {
    title: tBilling("title"),
    subtitle: tBilling("subtitle"),
    currentPlan: tBilling("currentPlan"),
    freePlan: tBilling("freePlan"),
    basicPlan: tBilling("basicPlan"),
    premiumPlan: tBilling("premiumPlan"),
    businessPlan: tBilling("businessPlan"),
    active: tBilling("active"),
    cancelled: tBilling("cancelled"),
    expired: tBilling("expired"),
    pending: tBilling("pending"),
    nextBilling: tBilling("nextBilling"),
    billingPeriod: tBilling("billingPeriod"),
    monthly: tBilling("monthly"),
    yearly: tBilling("yearly"),
    commission: tBilling("commission"),
    managePlan: tBilling("managePlan"),
    upgradePlan: tBilling("upgradePlan"),
    viewPlans: tBilling("viewPlans"),
    paymentHistory: tBilling("paymentHistory"),
    invoices: tBilling("invoices"),
    subscriptions: tBilling("subscriptions"),
    boostPurchases: tBilling("boostPurchases"),
    date: tBilling("date"),
    description: tBilling("description"),
    amount: tBilling("amount"),
    status: tBilling("status"),
    actions: tBilling("actions"),
    download: tBilling("download"),
    view: tBilling("view"),
    paid: tBilling("paid"),
    open: tBilling("open"),
    void: tBilling("void"),
    draft: tBilling("draft"),
    noInvoices: tBilling("noInvoices"),
    noBoosts: tBilling("noBoosts"),
    boostProduct: tBilling("boostProduct"),
    loadingError: tBilling("loadingError"),
    product: tBilling("product"),
    duration: tBilling("duration"),
    days: tBilling("days"),
    expiresIn: tBilling("expiresIn"),
    expired2: tBilling("expired2"),
    sellerSubscription: tBilling("sellerSubscription"),
    listingBoost: tBilling("listingBoost"),
    noBillingYet: tBilling("noBillingYet"),
    startSelling: tBilling("startSelling"),
    becomeSeller: tBilling("becomeSeller"),
    paymentMethods: tBilling("paymentMethods"),
    portalOpenError: tBilling("portalOpenError"),
    paymentFallback: tBilling("paymentFallback"),
    boostHint: tBilling("boostHint"),
    paidPlanDescription: tBilling("paidPlanDescription"),
    freePlanDescription: tBilling("freePlanDescription"),
    noInvoicesDescription: tBilling("noInvoicesDescription"),
    noBoostsDescription: tBilling("noBoostsDescription"),
    activeBadge: tBilling("activeBadge"),
    expiredBadge: tBilling("expiredBadge"),
  }

  useEffect(() => {
    async function fetchBillingData() {
      if (!hasStripeCustomer) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/billing/invoices")
        if (!response.ok) throw new Error("Failed to fetch")

        const data = (await response.json()) as {
          invoices?: Invoice[]
          charges?: Charge[]
        }

        setInvoices(Array.isArray(data.invoices) ? data.invoices : [])
        setCharges(Array.isArray(data.charges) ? data.charges : [])
      } catch (error) {
        logger.error("[account-billing] fetch_billing_data_failed", error)
        toast.error(t.loadingError)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingData()
  }, [hasStripeCustomer, t.loadingError])

  const formatCurrency = (amount: number, currency = "bgn") => {
    const value = amount / 100
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BGN",
    }).format(price)
  }

  const getPlanName = (tier: string) => {
    switch (tier) {
      case "premium":
        return t.premiumPlan
      case "business":
        return t.businessPlan
      default:
        return t.basicPlan
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "paid":
      case "succeeded":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            <CheckCircle className="size-3 mr-1" />
            {t.paid}
          </Badge>
        )
      case "open":
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            <Clock className="size-3 mr-1" />
            {t.open}
          </Badge>
        )
      case "void":
      case "failed":
        return (
          <Badge variant="secondary" className="bg-destructive-subtle text-destructive">
            <XCircle className="size-3 mr-1" />
            {t.void}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status || t.draft}</Badge>
    }
  }

  const handleManageSubscription = async () => {
    setIsPortalLoading(true)
    try {
      await redirectToBillingPortal(actions.createBillingPortalSession, locale)
    } catch (error) {
      logger.error("[account-billing] open_portal_failed", error)
      toast.error(t.portalOpenError)
    } finally {
      setIsPortalLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
        </div>
        {seller && (
          <div className="flex items-center gap-2">
            <Link href="/account/payments">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CreditCard className="size-4" />
                {t.paymentMethods}
              </Button>
            </Link>
            <Link href="/account/plans">
              <Button size="sm" className="gap-1.5">
                <Crown className="size-4" />
                {t.viewPlans}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {!seller && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-selected p-4 mb-4">
              <Crown className="size-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{t.startSelling}</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-4">{t.becomeSeller}</p>
            <Link href="/sell">
              <Button className="gap-1.5">
                {t.startSelling}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {seller && (
        <BillingCurrentPlanCard
          seller={seller}
          subscription={subscription}
          t={t}
          dateLocale={dateLocale}
          formatPrice={formatPrice}
          getPlanName={getPlanName}
          handleManageSubscription={handleManageSubscription}
          isPortalLoading={isPortalLoading}
        />
      )}

      {seller && (
        <BillingHistoryTabs
          boosts={boosts}
          invoices={invoices}
          charges={charges}
          isLoading={isLoading}
          dateLocale={dateLocale}
          t={t}
          formatCurrency={formatCurrency}
          formatPrice={formatPrice}
          getStatusBadge={getStatusBadge}
        />
      )}

      {seller && hasStripeCustomer && (
        <Card className="bg-surface-subtle border-dashed">
          <CardContent className="flex items-start gap-4 pt-4">
            <Info className="size-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground grid gap-1">
              <p>{t.noInvoicesDescription}</p>
              <p>{tBilling("billingEmail", { email: userEmail })}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
