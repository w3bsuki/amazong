import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { STRIPE_CUSTOMER_ID_SELECT } from "@/lib/supabase/selects/billing"

type DbClient = SupabaseClient<Database>

const SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT =
  "id,name,tier,is_active,price_monthly,price_yearly,stripe_price_monthly_id,stripe_price_yearly_id,final_value_fee,commission_rate,account_type" as const

const SUBSCRIPTION_SELECT_FOR_MANAGE =
  "id,status,auto_renew,expires_at,stripe_subscription_id" as const

export type SubscriptionPlanForCheckout = {
  id: string
  name: string | null
  tier: Database["public"]["Tables"]["subscription_plans"]["Row"]["tier"]
  account_type: Database["public"]["Tables"]["subscription_plans"]["Row"]["account_type"]
  is_active: boolean | null
  price_monthly: number | null
  price_yearly: number | null
  stripe_price_monthly_id: string | null
  stripe_price_yearly_id: string | null
  final_value_fee: number | null
  commission_rate: number | null
}

export type ActiveSubscriptionForManage = {
  id: string
  status: string | null
  auto_renew: boolean | null
  expires_at: string | null
  stripe_subscription_id: string | null
}

export async function fetchPrivateProfileStripeCustomerId(params: {
  supabase: DbClient
  userId: string
}): Promise<{ ok: true; stripeCustomerId: string | null } | { ok: false; error: unknown }> {
  const { supabase, userId } = params

  const { data, error } = await supabase
    .from("private_profiles")
    .select(STRIPE_CUSTOMER_ID_SELECT)
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, stripeCustomerId: data?.stripe_customer_id ?? null }
}

export async function upsertPrivateProfileStripeCustomerId(params: {
  supabase: DbClient
  userId: string
  stripeCustomerId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, stripeCustomerId } = params

  const { error } = await supabase
    .from("private_profiles")
    .upsert({ id: userId, stripe_customer_id: stripeCustomerId }, { onConflict: "id" })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function fetchActiveSubscriptionPlanForCheckout(params: {
  supabase: DbClient
  planId: string
}): Promise<
  { ok: true; plan: SubscriptionPlanForCheckout | null } | { ok: false; error: unknown }
> {
  const { supabase, planId } = params

  const { data, error } = await supabase
    .from("subscription_plans")
    .select(SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT)
    .eq("id", planId)
    .eq("is_active", true)
    .maybeSingle<SubscriptionPlanForCheckout>()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, plan: data ?? null }
}

export async function fetchActiveSubscriptionStripeCustomerId(params: {
  supabase: DbClient
  sellerId: string
}): Promise<{ ok: true; stripeCustomerId: string | null } | { ok: false; error: unknown }> {
  const { supabase, sellerId } = params

  const { data, error } = await supabase
    .from("subscriptions")
    .select(STRIPE_CUSTOMER_ID_SELECT)
    .eq("seller_id", sellerId)
    .eq("status", "active")
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, stripeCustomerId: data?.stripe_customer_id ?? null }
}

export async function fetchActiveSubscriptionForManage(params: {
  supabase: DbClient
  sellerId: string
  autoRenew?: boolean
}): Promise<
  { ok: true; subscription: ActiveSubscriptionForManage | null } | { ok: false; error: unknown }
> {
  const { supabase, sellerId, autoRenew } = params

  let query = supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT_FOR_MANAGE)
    .eq("seller_id", sellerId)
    .eq("status", "active")

  if (autoRenew !== undefined) {
    query = query.eq("auto_renew", autoRenew)
  }

  const { data, error } = await query.maybeSingle<ActiveSubscriptionForManage>()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, subscription: data ?? null }
}

export async function updateSubscriptionAutoRenew(params: {
  supabase: DbClient
  subscriptionId: string
  autoRenew: boolean
  updatedAt: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, subscriptionId, autoRenew, updatedAt } = params

  const { error } = await supabase
    .from("subscriptions")
    .update({ auto_renew: autoRenew, updated_at: updatedAt })
    .eq("id", subscriptionId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateProfileTier(params: {
  adminSupabase: DbClient
  userId: string
  tier: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, userId, tier } = params

  const { error } = await adminSupabase.from("profiles").update({ tier }).eq("id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}
