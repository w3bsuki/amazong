import { Modal } from "@/components/ui/modal"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { getLocale } from "next-intl/server"
import { UpgradeContent } from "@/app/[locale]/(account)/account/plans/upgrade/upgrade-content"

/**
 * Intercepted Upgrade Route
 * 
 * This page is shown as a modal overlay when navigating from within the app.
 * When accessed directly (or on refresh), the user sees the full page version.
 */
export default async function InterceptedUpgradePage() {
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

  // Fetch seller info
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch subscription plans
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  const currentTier = seller?.tier || 'basic'

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
        plans={plans || []}
        currentTier={currentTier}
        seller={seller}
      />
    </Modal>
  )
}
