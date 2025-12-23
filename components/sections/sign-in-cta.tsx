import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getLocale, getTranslations } from 'next-intl/server'

/**
 * Async server component that checks auth state and shows sign-in CTA.
 * This is the only section that requires cookies() - wrapped in Suspense.
 */
export async function SignInCTA() {
  const supabase = await createClient()
  const locale = await getLocale()
  const t = await getTranslations('Home')
  
  // If Supabase connection fails, don't show anything
  if (!supabase) {
    return null
  }
  
  // Check if user is logged in
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user || null
  
  // Don't render for logged-in users
  if (user) {
    return null
  }
  
  return (
    <div className="bg-cta-trust-blue rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h3 className="text-base sm:text-xl font-bold text-cta-trust-blue-text mb-1 tracking-tight">
          {locale === "bg" ? "Влез в акаунта си" : "Sign in for the best experience"}
        </h3>
        <p className="text-cta-trust-blue-text/80 text-xs sm:text-sm leading-relaxed">
          {locale === "bg" ? "Персонализирани препоръки и по-бързо пазаруване" : "Personalized recommendations and faster checkout"}
        </p>
      </div>
      <Link href="/auth/login" className="w-full sm:w-auto">
        <Button className="w-full min-h-10 sm:min-h-11 px-8 bg-white hover:bg-white/90 text-cta-trust-blue text-sm font-bold rounded-full transition-transform active:scale-[0.98]">
          {t('sections.signInSecurely')}
        </Button>
      </Link>
    </div>
  )
}
