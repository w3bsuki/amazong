import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { STRIPE_CUSTOMER_ID_SELECT } from "@/lib/supabase/selects/billing"

type DbClient = SupabaseClient<Database>

export async function fetchUserPaymentMethod(params: {
  supabase: DbClient
  userId: string
  dbId: string
}): Promise<{ ok: true; stripePaymentMethodId: string | null } | { ok: false; error: unknown }> {
  const { supabase, userId, dbId } = params

  const { data, error } = await supabase
    .from("user_payment_methods")
    .select("id,stripe_payment_method_id")
    .eq("id", dbId)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, stripePaymentMethodId: data?.stripe_payment_method_id ?? null }
}

export async function deleteUserPaymentMethod(params: {
  supabase: DbClient
  userId: string
  dbId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, dbId } = params

  const { error } = await supabase.from("user_payment_methods").delete().eq("id", dbId).eq("user_id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function fetchStripeCustomerId(params: {
  supabase: DbClient
  userId: string
}): Promise<{ ok: true; stripeCustomerId: string | null } | { ok: false; error: unknown }> {
  const { supabase, userId } = params

  const { data, error } = await supabase
    .from("private_profiles")
    .select(STRIPE_CUSTOMER_ID_SELECT)
    .eq("id", userId)
    .single()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, stripeCustomerId: data?.stripe_customer_id ?? null }
}

export async function updateStripeCustomerId(params: {
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

export async function clearDefaultPaymentMethods(params: {
  supabase: DbClient
  userId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId } = params

  const { error } = await supabase.from("user_payment_methods").update({ is_default: false }).eq("user_id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function setDefaultPaymentMethodFlag(params: {
  supabase: DbClient
  userId: string
  dbId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, dbId } = params

  const { error } = await supabase.from("user_payment_methods").update({ is_default: true }).eq("id", dbId).eq("user_id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}
