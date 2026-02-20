import "server-only"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import {
  getPlansForUpgrade,
  PRIVATE_PROFILE_SELECT_FOR_UPGRADE,
  PROFILE_SELECT_FOR_UPGRADE,
} from "@/lib/data/plans"

export type UpgradeLocale = "en" | "bg"

export async function getUpgradeData(locale: UpgradeLocale) {
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  const [{ data: profile }, { data: privateProfile }] = await Promise.all([
    supabase.from("profiles").select(PROFILE_SELECT_FOR_UPGRADE).eq("id", user.id).single(),
    supabase
      .from("private_profiles")
      .select(PRIVATE_PROFILE_SELECT_FOR_UPGRADE)
      .eq("id", user.id)
      .maybeSingle(),
  ])

  const plans = await getPlansForUpgrade()
  const currentTier = profile?.tier || "free"

  const commissionRate =
    privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
  const seller = profile
    ? {
        id: profile.id,
        tier: profile.tier || "free",
        commission_rate: commissionRate,
        stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
      }
    : null

  return { plans, currentTier, seller }
}

