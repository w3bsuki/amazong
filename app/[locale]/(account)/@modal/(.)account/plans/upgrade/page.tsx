import { Modal } from "@/components/shared/modal"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { UpgradeContent } from "@/app/[locale]/(account)/account/plans/upgrade/upgrade-content"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { connection } from "next/server"
import { routing } from "@/i18n/routing"
import { getPlansForUpgrade, PROFILE_SELECT_FOR_UPGRADE } from "@/lib/data/plans"
import { createSubscriptionCheckoutSession } from "@/app/actions/subscriptions"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

async function UpgradeModalContent() {
  // Ensure this runs dynamically, not during static generation
  await connection()

  const locale = await getLocale()
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile info (seller fields are now on profiles)
  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT_FOR_UPGRADE)
    .eq('id', user.id)
    .single()

  // Fetch subscription plans
  const plans = await getPlansForUpgrade()

  const currentTier = profile?.tier || 'basic'

  return (
    <Modal
      title={locale === 'bg' ? 'Надгради плана си' : 'Upgrade Your Plan'}
      description={locale === 'bg'
        ? 'Изберете план с по-ниски такси и повече функции'
        : 'Choose a plan with lower fees and more features'
      }
    >
      <UpgradeContent
        locale={locale}
        plans={plans}
        currentTier={currentTier}
        seller={profile}
        actions={{ createSubscriptionCheckoutSession }}
      />
    </Modal>
  )
}

function UpgradeLoadingFallback() {
  return (
    <Modal
      title="Upgrade Your Plan"
      description="Choose a plan with lower fees and more features"
    >
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
export default function InterceptedUpgradePage() {
  return (
    <Suspense fallback={<UpgradeLoadingFallback />}>
      <UpgradeModalContent />
    </Suspense>
  )
}
