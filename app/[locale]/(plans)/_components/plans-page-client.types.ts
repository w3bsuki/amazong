export interface SubscriptionPlanRow {
  id: string
  name?: string | null
  tier?: string | null
  account_type?: string | null
  price_monthly?: number | null
  price_yearly?: number | null
  final_value_fee?: number | null
  commission_rate?: number | null
  seller_fee_percent?: number | null
  buyer_protection_percent?: number | null
  buyer_protection_fixed?: number | null
  buyer_protection_cap?: number | null
  max_listings?: number | null
  boosts_included?: number | null
  priority_support?: boolean | null
  description?: string | null
  description_bg?: string | null
  features?: unknown
  analytics_access?: string | null
}

export type PlansPageClientServerActions = {
  createSubscriptionCheckoutSession: (args: {
    planId: string
    billingPeriod: "monthly" | "yearly"
    locale?: "en" | "bg"
  }) => Promise<{ url?: string; error?: string }>
  downgradeToFreeTier: () => Promise<{ tier?: "free"; error?: string }>
}

export type PlansFeatureIconKey = "lightning" | "rocket" | "sparkle"

export type PlansPageContent = {
  title: string
  subtitle: string
  personal: string
  business: string
  monthly: string
  yearly: string
  saveLabel: string
  getStarted: string
  current: string
  popular: string
  mostPopular: string
  feeLabel: string
  buyerFeeLabel: string
  period: { mo: string; yr: string }
  buyerFeeAdvantage: {
    title: string
    desc: string
  }
  planFeatures: {
    listingsPerMonth: string
    unlimitedListings: string
    whenSoldShort: string
    buyerProtection: string
    capLabel: string
    boostsShort: string
    analytics: string
  }
  nav: {
    pricing: string
    comparison: string
    features: string
    faq: string
    guarantee: string
  }
  features: {
    title: string
    subtitle: string
    items: Array<{
      icon: PlansFeatureIconKey
      title: string
      desc: string
    }>
  }
  guarantee: { title: string; desc: string }
  comparison: {
    title: string
    subtitle: string
    plan: string
    price: string
    fee: string
    buyerProtection: string
    listings: string
    boosts: string
    support: string
    unlimited: string
    free: string
  }
  faq: {
    title: string
    subtitle: string
    items: Array<{ q: string; a: string }>
  }
}
