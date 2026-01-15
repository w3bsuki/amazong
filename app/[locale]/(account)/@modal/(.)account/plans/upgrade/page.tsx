import { Modal } from "@/components/shared/modal"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { UpgradeContent } from "@/app/[locale]/(account)/account/plans/upgrade/upgrade-content"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { connection } from "next/server"
import { routing } from "@/i18n/routing"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const PROFILE_SELECT_FOR_UPGRADE = 'id,tier,commission_rate,stripe_customer_id'
const SUBSCRIPTION_PLANS_SELECT_FOR_UPGRADE =
  'id,tier,name,price_monthly,price_yearly,commission_rate,features,is_active,account_type'

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
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select(SUBSCRIPTION_PLANS_SELECT_FOR_UPGRADE)
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  const currentTier = profile?.tier || 'basic'

  // Transform plans to ensure proper types (database can return null for some fields)
  const transformedPlans = (plans || []).map(plan => ({
    ...plan,
    is_active: plan.is_active ?? true,
    features: plan.features ?? [],
  }))

  return (
    <Modal
      title={locale === 'bg' ? 'Надгради плана си' : 'Upgrade Your Plan'}
      description={locale === 'bg'
        ? 'Изберете план с по-ниски комисиони и повече функции'
        : 'Choose a plan with lower commissions and more features'
      }
    >
      <UpgradeContent
        locale={locale}
        plans={transformedPlans}
        currentTier={currentTier}
        seller={profile}
      />
    </Modal>
  )
}

function UpgradeLoadingFallback() {
  return (
    <Modal
      title="Upgrade Your Plan"
      description="Choose a plan with lower commissions and more features"
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
