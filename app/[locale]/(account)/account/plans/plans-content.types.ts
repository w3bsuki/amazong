import type { Plan } from "../_components/plan-card"

export interface SubscriptionPlan {
  id: string
  tier: string
  name: string
  account_type?: string | null
  price_monthly: number
  price_yearly: number
  final_value_fee?: number | null
  insertion_fee?: number | null
  per_order_fee?: number | null
  commission_rate?: number | null
  max_listings?: number | null
  boosts_included?: number | null
  priority_support?: boolean | null
  analytics_access?: string | null
  badge_type?: string | null
  description?: string | null
  description_bg?: string | null
  features: unknown
  stripe_price_monthly_id?: string | null
  stripe_price_yearly_id?: string | null
  is_active?: boolean | null
}

export interface SellerPlanInfo {
  id: string
  tier: string
  account_type?: "personal" | "business"
  final_value_fee?: number
  insertion_fee?: number
  commission_rate?: number
  [key: string]: unknown
}

export interface SellerSubscription {
  id: string
  seller_id: string
  plan_type: string
  status: string
  billing_period?: string
  expires_at?: string
  auto_renew?: boolean
  stripe_subscription_id: string | null
  [key: string]: unknown
}

export interface PlansContentProps {
  locale: string
  plans: SubscriptionPlan[]
  currentTier: string
  seller: SellerPlanInfo | null
  currentSubscription: SellerSubscription | null
  actions: {
    cancelSubscription: () => Promise<{ success: boolean; error?: string }>
    reactivateSubscription: () => Promise<{ success: boolean; error?: string }>
    createBillingPortalSession: (args?: {
      locale?: "en" | "bg"
    }) => Promise<{ url?: string; error?: string }>
    createSubscriptionCheckoutSession: (args: {
      planId: string
      billingPeriod: "monthly" | "yearly"
      locale?: "en" | "bg"
    }) => Promise<{ url?: string; error?: string }>
  }
}

export function mapSubscriptionPlanToPlan(subscriptionPlan: SubscriptionPlan): Plan {
  const accountType = subscriptionPlan.account_type === "business" ? "business" : "personal"
  const features = Array.isArray(subscriptionPlan.features)
    ? subscriptionPlan.features.filter((feature): feature is string => typeof feature === "string")
    : []

  return {
    id: subscriptionPlan.id,
    name: subscriptionPlan.name,
    tier: subscriptionPlan.tier,
    account_type: accountType,
    price_monthly: subscriptionPlan.price_monthly,
    price_yearly: subscriptionPlan.price_yearly,
    max_listings: subscriptionPlan.max_listings ?? null,
    final_value_fee: subscriptionPlan.final_value_fee ?? subscriptionPlan.commission_rate ?? 12,
    insertion_fee: 0,
    per_order_fee: 0,
    ...(typeof subscriptionPlan.commission_rate === "number"
      ? { commission_rate: subscriptionPlan.commission_rate }
      : {}),
    boosts_included: subscriptionPlan.boosts_included ?? 0,
    priority_support: subscriptionPlan.priority_support ?? false,
    analytics_access: subscriptionPlan.analytics_access ?? "none",
    badge_type: subscriptionPlan.badge_type ?? null,
    description: subscriptionPlan.description ?? "",
    description_bg: subscriptionPlan.description_bg ?? "",
    features,
  }
}
