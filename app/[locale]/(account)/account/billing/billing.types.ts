import type { Locale } from "date-fns"
import type { ReactNode } from "react"

export type BillingContentServerActions = {
  createBillingPortalSession: (args?: {
    locale?: "en" | "bg"
  }) => Promise<{ url?: string; error?: string }>
}

export interface SubscriptionPlan {
  id: string
  name: string
  tier: string
  price_monthly: number
  price_yearly: number
  commission_rate: number
  features: string[]
}

export interface Subscription {
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

export interface Seller {
  id: string
  tier: string
  commission_rate: number
  stripe_customer_id: string | null
  store_name?: string
}

export interface Boost {
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

export interface Invoice {
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

export interface Charge {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  description: string | null
  receipt_url: string | null
  metadata: Record<string, string>
}

export interface BillingContentProps {
  locale: string
  seller: Seller | null
  subscription: Subscription | null
  boosts: Boost[]
  hasStripeCustomer: boolean
  userEmail: string
  actions: BillingContentServerActions
}

export interface BillingText {
  title: string
  subtitle: string
  currentPlan: string
  freePlan: string
  basicPlan: string
  premiumPlan: string
  businessPlan: string
  active: string
  cancelled: string
  expired: string
  pending: string
  nextBilling: string
  billingPeriod: string
  monthly: string
  yearly: string
  commission: string
  managePlan: string
  upgradePlan: string
  viewPlans: string
  paymentHistory: string
  invoices: string
  subscriptions: string
  boostPurchases: string
  date: string
  description: string
  amount: string
  status: string
  actions: string
  download: string
  view: string
  paid: string
  open: string
  void: string
  draft: string
  noInvoices: string
  noBoosts: string
  boostProduct: string
  loadingError: string
  product: string
  duration: string
  days: string
  expiresIn: string
  expired2: string
  sellerSubscription: string
  listingBoost: string
  noBillingYet: string
  startSelling: string
  becomeSeller: string
  paymentMethods: string
  portalOpenError: string
  paymentFallback: string
  boostHint: string
  paidPlanDescription: string
  freePlanDescription: string
  noInvoicesDescription: string
  noBoostsDescription: string
  activeBadge: string
  expiredBadge: string
}

export type BillingStatusBadge = (status: string | null) => ReactNode
export type BillingDateLocale = Locale
