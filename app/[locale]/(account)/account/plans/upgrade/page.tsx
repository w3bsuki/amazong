import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { UpgradeContent } from "./upgrade-content"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

/**
 * Full Upgrade Page
 * 
 * This page is shown when accessing /account/plans/upgrade directly
 * (e.g., from a shared link or page refresh).
 * 
 * When navigating from within the app, the intercepted modal version is shown instead.
 */
export default async function UpgradePage() {
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
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link 
        href="/account/plans"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {locale === 'bg' ? 'Обратно към плановете' : 'Back to plans'}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">
          {locale === 'bg' ? 'Надгради плана си' : 'Upgrade Your Plan'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'bg' 
            ? 'Изберете план с по-ниски комисиони и повече функции'
            : 'Choose a plan with lower commissions and more features'}
        </p>
      </div>
      
      <UpgradeContent 
        locale={locale}
        plans={plans || []}
        currentTier={currentTier}
        seller={seller}
      />
    </div>
  )
}
