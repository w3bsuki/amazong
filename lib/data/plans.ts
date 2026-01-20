import 'server-only'

import { createStaticClient, createClient } from '@/lib/supabase/server'

// =============================================================================
// Select projections — canonical fields to avoid drift
// =============================================================================

/** Full select for public plans pages (no auth needed) */
export const PLANS_SELECT_FULL =
  'id,name,tier,account_type,description,description_bg,features,price_monthly,price_yearly,currency,commission_rate,final_value_fee,seller_fee_percent,buyer_protection_percent,buyer_protection_fixed,buyer_protection_cap,insertion_fee,per_order_fee,max_listings,boosts_included,analytics_access,badge_type,priority_support,stripe_price_monthly_id,stripe_price_yearly_id,is_active,created_at' as const

/** Select for upgrade flows (minimal fields needed for UI + Stripe checkout) */
export const PLANS_SELECT_FOR_UPGRADE =
  'id,tier,name,price_monthly,price_yearly,commission_rate,features,is_active,account_type' as const

/** Select for account plans page (needs Stripe IDs + tier display fields) */
export const PLANS_SELECT_FOR_ACCOUNT =
  'id,name,tier,price_monthly,price_yearly,description,features,is_active,stripe_price_monthly_id,stripe_price_yearly_id,max_listings,commission_rate,account_type,final_value_fee,insertion_fee,per_order_fee,boosts_included,priority_support,analytics_access' as const

/** Profile fields needed for upgrade flows */
export const PROFILE_SELECT_FOR_UPGRADE = 'id,tier,commission_rate,stripe_customer_id' as const

/** Profile fields needed for plans page (includes account_type for filtering) */
export const PROFILE_SELECT_FOR_PLANS = 'id,tier,account_type,commission_rate,stripe_customer_id' as const

// =============================================================================
// Queries — use these instead of inline queries
// =============================================================================

export type SubscriptionPlan = {
  id: string
  name: string
  tier: string
  account_type: string | null
  description?: string | null
  description_bg?: string | null
  features: string[]
  price_monthly: number
  price_yearly: number
  currency?: string
  commission_rate?: number | null
  final_value_fee?: number | null
  seller_fee_percent?: number | null
  buyer_protection_percent?: number | null
  buyer_protection_fixed?: number | null
  buyer_protection_cap?: number | null
  insertion_fee?: number | null
  per_order_fee?: number | null
  max_listings?: number | null
  boosts_included?: number | null
  analytics_access?: string | null
  badge_type?: string | null
  priority_support?: boolean | null
  stripe_price_monthly_id?: string | null
  stripe_price_yearly_id?: string | null
  is_active: boolean
  created_at?: string
}

export type UpgradePlan = {
  id: string
  tier: string
  name: string
  price_monthly: number
  price_yearly: number
  commission_rate: number
  features: string[]
  is_active: boolean
  account_type: string | null
}

/**
 * Fetch all active subscription plans (public, cacheable)
 */
export async function getActivePlans(): Promise<SubscriptionPlan[]> {
  const client = createStaticClient()
  const { data } = await client
    .from('subscription_plans')
    .select(PLANS_SELECT_FULL)
    .eq('is_active', true)
    .order('account_type', { ascending: true })
    .order('price_monthly', { ascending: true })

  return (data ?? []) as SubscriptionPlan[]
}

/**
 * Fetch plans for upgrade UI (minimal fields)
 */
export async function getPlansForUpgrade(): Promise<UpgradePlan[]> {
  const client = await createClient()
  const { data } = await client
    .from('subscription_plans')
    .select(PLANS_SELECT_FOR_UPGRADE)
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  return (data ?? []).map(plan => ({
    ...plan,
    commission_rate: plan.commission_rate ?? 12, // Default to 12% if null
    is_active: plan.is_active ?? true,
    features: plan.features ?? [],
  })) as UpgradePlan[]
}

/**
 * Fetch plans for upgrade UI using static client (for cached routes)
 */
export async function getPlansForUpgradeStatic(): Promise<UpgradePlan[]> {
  const client = createStaticClient()
  const { data } = await client
    .from('subscription_plans')
    .select(PLANS_SELECT_FOR_UPGRADE)
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  return (data ?? []).map(plan => ({
    ...plan,
    commission_rate: plan.commission_rate ?? 12, // Default to 12% if null
    is_active: plan.is_active ?? true,
    features: plan.features ?? [],
  })) as UpgradePlan[]
}
