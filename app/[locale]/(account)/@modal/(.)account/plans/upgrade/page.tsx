import { Modal } from "@/components/shared/modal"
import { createClient } from "@/lib/supabase/server"
import { redirect, routing } from "@/i18n/routing"
import { getLocale, getTranslations } from "next-intl/server"
import { UpgradeContent } from "@/app/[locale]/(account)/account/plans/upgrade/upgrade-content"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { connection } from "next/server"
import { getPlansForUpgrade, PRIVATE_PROFILE_SELECT_FOR_UPGRADE, PROFILE_SELECT_FOR_UPGRADE } from "@/lib/data/plans"
import { createSubscriptionCheckoutSession } from "@/app/actions/subscriptions"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

async function UpgradeModalContent() {
  // Ensure this runs dynamically, not during static generation
  await connection()

  const locale = await getLocale()
  const safeLocale = locale === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale: safeLocale, namespace: "AccountPlansUpgrade" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale: safeLocale })
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale: safeLocale })
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

  const commissionRate = privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
  const seller = profile ? {
    id: profile.id,
    tier: profile.tier || 'free',
    commission_rate: commissionRate,
    stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
  } : null

  return (
    <Modal
      title={t("title")}
      description={t("description")}
    >
      <UpgradeContent
        locale={safeLocale}
        plans={plans}
        currentTier={currentTier}
        seller={seller}
        actions={{ createSubscriptionCheckoutSession }}
      />
    </Modal>
  )
}

function UpgradeLoadingFallback({ label }: { label: string }) {
  return (
    <Modal ariaLabel={label}>
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    </Modal>
  )
}

/**
 * Intercepted Upgrade Route
 * 
 * This page is shown as a modal overlay when navigating from within the app.
 * When accessed directly (or on refresh), the user sees the full page version.
 */
export default async function InterceptedUpgradePage() {
  const tCommon = await getTranslations("Common")

  return (
    <Suspense fallback={<UpgradeLoadingFallback label={tCommon("loading")} />}>
      <UpgradeModalContent />
    </Suspense>
  )
}
