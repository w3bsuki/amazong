import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { UpgradeContent } from "./upgrade-content"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"
import { getPlansForUpgrade, PRIVATE_PROFILE_SELECT_FOR_UPGRADE, PROFILE_SELECT_FOR_UPGRADE } from "@/lib/data/plans"
import { createSubscriptionCheckoutSession } from "@/app/actions/subscriptions"

/**
 * Full Upgrade Page
 * 
 * This page is shown when accessing /account/plans/upgrade directly
 * (e.g., from a shared link or page refresh).
 * 
 * When navigating from within the app, the intercepted modal version is shown instead.
 */
export default async function UpgradePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "AccountPlansUpgrade" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Fetch profile info (public surface) + private billing fields
  const [
    { data: profile },
    { data: privateProfile },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select(PROFILE_SELECT_FOR_UPGRADE)
      .eq('id', user.id)
      .single(),
    supabase
      .from('private_profiles')
      .select(PRIVATE_PROFILE_SELECT_FOR_UPGRADE)
      .eq('id', user.id)
      .maybeSingle(),
  ])

  // Fetch subscription plans
  const plans = await getPlansForUpgrade()

  const currentTier = profile?.tier || 'free'

  // Map profile to seller interface expected by UpgradeContent
  const commissionRate = privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
  const seller = profile ? {
    id: profile.id,
    tier: profile.tier || 'free',
    commission_rate: commissionRate,
    stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
  } : null

  return (
    <div className="p-4 lg:p-4 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/account/plans"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t("backToPlans")}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <UpgradeContent
        locale={locale}
        plans={plans as Parameters<typeof UpgradeContent>[0]['plans']}
        currentTier={currentTier}
        seller={seller}
        actions={{ createSubscriptionCheckoutSession }}
      />
    </div>
  )
}
