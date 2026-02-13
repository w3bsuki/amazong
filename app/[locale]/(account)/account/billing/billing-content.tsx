"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Receipt,
  CreditCard,
  Crown,
  Lightning,
  ArrowUpRight,
  Download,
  ArrowSquareOut,
  CalendarBlank,
  CurrencyCircleDollar,
  CheckCircle,
  Clock,
  XCircle,
  SpinnerGap,
  Sparkle,
  Package,
  Info,
  ArrowRight,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"

export type BillingContentServerActions = {
  createBillingPortalSession: (args?: {
    locale?: "en" | "bg"
  }) => Promise<{ url?: string; error?: string }>
}

interface SubscriptionPlan {
  id: string
  name: string
  tier: string
  price_monthly: number
  price_yearly: number
  commission_rate: number
  features: string[]
}

interface Subscription {
  id: string
  seller_id: string
  plan_type: string
  status: string
  price_paid: number
  billing_period: string
  starts_at: string
  expires_at: string
  stripe_subscription_id: string | null
  subscription_plans?: SubscriptionPlan
}

interface Seller {
  id: string
  tier: string
  commission_rate: number
  stripe_customer_id: string | null
  store_name?: string
}

interface Boost {
  id: string
  product_id: string
  price_paid: number
  duration_days: number
  starts_at: string
  expires_at: string
  is_active: boolean
  created_at: string
  products?: {
    id: string
    title: string
    images: string[]
  }
}

interface Invoice {
  id: string
  number: string | null
  status: string | null
  amount_paid: number
  amount_due: number
  currency: string
  created: number
  hosted_invoice_url: string | null
  invoice_pdf: string | null
  description: string | null
  subscription: string | null
  period_start: number | null
  period_end: number | null
}

interface Charge {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  description: string | null
  receipt_url: string | null
  metadata: Record<string, string>
}

interface BillingContentProps {
  locale: string
  seller: Seller | null
  subscription: Subscription | null
  boosts: Boost[]
  hasStripeCustomer: boolean
  userEmail: string
  actions: BillingContentServerActions
}

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

  const dateLocale = locale === 'bg' ? bg : enUS
  const withLocale = (path: string) => `/${locale}${path}`

  // Translations
  const t = {
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

  // Fetch invoices from API
  useEffect(() => {
    async function fetchBillingData() {
      if (!hasStripeCustomer) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/billing/invoices')
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()
        setInvoices(data.invoices || [])
        setCharges(data.charges || [])
      } catch (error) {
        console.error('Error fetching billing data:', error)
        toast.error(t.loadingError)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingData()
  }, [hasStripeCustomer, t.loadingError])

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'bgn') => {
    // Stripe amounts are in smallest currency unit (stotinki for BGN)
    const value = currency.toLowerCase() === 'bgn' ? amount / 100 : amount / 100
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value)
  }

  // Format local price (already in major units)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BGN',
    }).format(price)
  }

  // Get plan display name
  const getPlanName = (tier: string) => {
    switch (tier) {
      case 'premium': return t.premiumPlan
      case 'business': return t.businessPlan
      default: return t.basicPlan
    }
  }

  // Get status badge
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'paid':
      case 'succeeded':
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            <CheckCircle className="size-3 mr-1" weight="fill" />
            {t.paid}
          </Badge>
        )
      case 'open':
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            <Clock className="size-3 mr-1" weight="fill" />
            {t.open}
          </Badge>
        )
      case 'void':
      case 'failed':
        return (
          <Badge variant="secondary" className="bg-destructive-subtle text-destructive">
            <XCircle className="size-3 mr-1" weight="fill" />
            {t.void}
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            {status || t.draft}
          </Badge>
        )
    }
  }

  // Handle manage subscription portal
  const handleManageSubscription = async () => {
    setIsPortalLoading(true)
    try {
      const { url, error } = await actions.createBillingPortalSession({
        locale: locale === 'bg' ? 'bg' : 'en',
      })

      if (error) {
        throw new Error(error)
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Portal error:', error)
      toast.error(t.portalOpenError)
    } finally {
      setIsPortalLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
        </div>
        {seller && (
          <div className="flex items-center gap-2">
            <Link href={withLocale("/account/payments")}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CreditCard className="size-4" />
                {t.paymentMethods}
              </Button>
            </Link>
            <Link href={withLocale("/account/plans")}>
              <Button size="sm" className="gap-1.5">
                <Crown className="size-4" weight="fill" />
                {t.viewPlans}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Not a Seller State */}
      {!seller && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-selected p-4 mb-4">
              <Crown className="size-8 text-primary" weight="duotone" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{t.startSelling}</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              {t.becomeSeller}
            </p>
            <Link href={withLocale("/sell")}>
              <Button className="gap-1.5">
                {t.startSelling}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Card */}
      {seller && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="size-5 text-primary" weight="fill" />
                {t.currentPlan}
              </CardTitle>
              {subscription && (
                <Badge
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    subscription.status === 'active' && 'bg-success'
                  )}
                >
                  {subscription.status === 'active' ? t.active :
                    subscription.status === 'cancelled' ? t.cancelled :
                      subscription.status === 'expired' ? t.expired : t.pending}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-content-auto items-center gap-4">
              {/* Plan Info */}
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-md",
                    seller.tier === 'business' ? "bg-selected" :
                      seller.tier === 'premium' ? "bg-warning/10" :
                        "bg-muted"
                  )}>
                    {seller.tier === 'business' ? (
                      <Sparkle className="size-5 text-primary" weight="fill" />
                    ) : seller.tier === 'premium' ? (
                      <Crown className="size-5 text-warning" weight="fill" />
                    ) : (
                      <Package className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg capitalize">
                      {getPlanName(seller.tier)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t.commission}: {seller.commission_rate}%
                    </p>
                  </div>
                </div>

                {/* Subscription Details */}
                {subscription && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarBlank className="size-4" />
                      <span>{t.nextBilling}:</span>
                      <span className="text-foreground font-medium">
                        {format(new Date(subscription.expires_at), 'PP', { locale: dateLocale })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CurrencyCircleDollar className="size-4" />
                      <span>{t.billingPeriod}:</span>
                      <span className="text-foreground font-medium">
                        {subscription.billing_period === 'yearly' ? t.yearly : t.monthly}
                        {' • '}
                        {formatPrice(subscription.price_paid)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Free Plan Notice */}
                {!subscription && seller.tier === 'basic' && (
                  <p className="text-sm text-muted-foreground">
                    {t.freePlanDescription}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                {subscription?.stripe_subscription_id && (
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    disabled={isPortalLoading}
                    className="gap-1.5"
                  >
                    {isPortalLoading ? (
                      <SpinnerGap className="size-4 animate-spin" />
                    ) : (
                      <ArrowSquareOut className="size-4" />
                    )}
                    {t.managePlan}
                  </Button>
                )}
                {seller.tier !== 'business' && (
                  <Link href={withLocale("/account/plans")}>
                    <Button className="gap-1.5 w-full">
                      <ArrowUpRight className="size-4" weight="bold" />
                      {t.upgradePlan}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History Tabs */}
      {seller && (
        <Tabs defaultValue="invoices" className="grid gap-4">
          <TabsList>
            <TabsTrigger value="invoices" className="gap-1.5">
              <Receipt className="size-4" />
              {t.invoices}
            </TabsTrigger>
            <TabsTrigger value="boosts" className="gap-1.5">
              <Lightning className="size-4" />
              {t.boostPurchases}
            </TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.paymentHistory}</CardTitle>
                <CardDescription>
                  {t.paidPlanDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded shrink-0" />
                        <div className="grid gap-2 flex-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : invoices.length === 0 && charges.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="size-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">{t.noInvoices}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.noBillingYet}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.date}</TableHead>
                          <TableHead>{t.description}</TableHead>
                          <TableHead>{t.amount}</TableHead>
                          <TableHead>{t.status}</TableHead>
                          <TableHead className="text-right">{t.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(invoice.created * 1000), 'PP', { locale: dateLocale })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Crown className="size-4 text-warning shrink-0" />
                                <span className="truncate max-w-52">
                                  {invoice.description || t.sellerSubscription}
                                  {invoice.number && (
                                    <span className="text-muted-foreground ml-1">
                                      #{invoice.number}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(invoice.amount_paid, invoice.currency)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(invoice.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {invoice.hosted_invoice_url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                  >
                                    <a
                                      href={invoice.hosted_invoice_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ArrowSquareOut className="size-4" />
                                    </a>
                                  </Button>
                                )}
                                {invoice.invoice_pdf && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                  >
                                    <a
                                      href={invoice.invoice_pdf}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Download className="size-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* One-time charges (boosts, etc.) */}
                        {charges.map((charge) => (
                          <TableRow key={charge.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(charge.created * 1000), 'PP', { locale: dateLocale })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Lightning className="size-4 text-primary shrink-0" />
                                <span className="truncate max-w-52">
                                      {charge.description ||
                                    (charge.metadata?.type === 'listing_boost'
                                      ? t.listingBoost
                                      : t.paymentFallback)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(charge.amount, charge.currency)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(charge.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              {charge.receipt_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={charge.receipt_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ArrowSquareOut className="size-4" />
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boosts Tab */}
          <TabsContent value="boosts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{t.boostPurchases}</CardTitle>
                  <CardDescription>
                    {t.noBoostsDescription}
                  </CardDescription>
                </div>
                <Link href={withLocale("/account/selling")}>
                  <Button size="sm" className="gap-1.5">
                    <Lightning className="size-4" weight="fill" />
                    {t.boostProduct}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {boosts.length === 0 ? (
                  <div className="text-center py-8">
                    <Lightning className="size-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">{t.noBoosts}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.boostHint}
                    </p>
                    <Link href={withLocale("/account/selling")} className="mt-4 inline-block">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Lightning className="size-4" />
                        {t.boostProduct}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.product}</TableHead>
                          <TableHead>{t.duration}</TableHead>
                          <TableHead>{t.amount}</TableHead>
                          <TableHead>{t.status}</TableHead>
                          <TableHead>{t.date}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {boosts.map((boost) => {
                          const isExpired = new Date(boost.expires_at) < new Date()
                          const expiresIn = formatDistanceToNow(new Date(boost.expires_at), {
                            locale: dateLocale,
                            addSuffix: true,
                          })

                          return (
                            <TableRow key={boost.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {boost.products?.images?.[0] && (
                                    <Image
                                      src={boost.products.images[0]}
                                      alt=""
                                      width={40}
                                      height={40}
                                      className="size-10 rounded object-cover"
                                    />
                                  )}
                                  <span className="truncate max-w-44 font-medium">
                                    {boost.products?.title || boost.product_id}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {boost.duration_days} {t.days}
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatPrice(boost.price_paid)}
                              </TableCell>
                              <TableCell>
                                {boost.is_active && !isExpired ? (
                                  <Badge className="bg-selected text-primary">
                                    <Lightning className="size-3 mr-1" weight="fill" />
                                    {t.activeBadge}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    {t.expired2}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {format(new Date(boost.created_at), 'PP', { locale: dateLocale })}
                                {boost.is_active && !isExpired && (
                                  <div className="text-xs text-primary mt-0.5">
                                    {t.expiresIn} {expiresIn}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Info */}
      {seller && hasStripeCustomer && (
        <Card className="bg-surface-subtle border-dashed">
          <CardContent className="flex items-start gap-4 pt-4">
            <Info className="size-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground grid gap-1">
              <p>
                {t.noInvoicesDescription}
              </p>
              <p>
                {tBilling("billingEmail", { email: userEmail })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
