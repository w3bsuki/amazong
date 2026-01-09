import { SiteHeader } from "@/components/layout/header/site-header"
import { SiteFooter } from "@/components/layout/footer/site-footer"
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { setRequestLocale } from "next-intl/server"

import { OnboardingProvider } from "@/components/providers/onboarding-provider"
import { Toaster } from "@/components/providers/sonner"
import { GeoWelcomeModal } from "@/components/shared/geo-welcome-modal"
import { CookieConsent } from "@/components/layout/cookie-consent"
import { SkipLinks } from "@/components/shared/skip-links"

// =============================================================================
// CATEGORY [SLUG] LAYOUT
//
// Custom layout for /categories/[slug] routes that:
// - Hides the main SiteHeader on mobile (hideOnMobile={true})
// - Allows contextual category header from page.tsx to take over
// - Keeps desktop header visible
//
// This follows the same pattern as [username] layout for product pages.
// =============================================================================

export default async function CategorySlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale } = await params

  setRequestLocale(locale)

  const categories = await getCategoryHierarchy(null, 2)

  async function HeaderWithUser() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    // hideOnMobile: contextual header in page.tsx handles mobile
    // hideSubheader: category pages don't need the nav subheader
    return (
      <SiteHeader
        user={data.user}
        categories={categories}
        hideOnMobile
        hideSubheader
      />
    )
  }

  return (
    <OnboardingProvider locale={locale}>
      <div className="bg-secondary min-h-screen flex flex-col">
        <SkipLinks />

        <Suspense
          fallback={
            <div className="hidden lg:block h-(--header-skeleton-h-md) w-full bg-header-bg" />
          }
        >
          <HeaderWithUser />
        </Suspense>

        <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        <SiteFooter />
        <MobileTabBar categories={categories} />
        <Toaster />
        <CookieConsent />
        <GeoWelcomeModal locale={locale} />
      </div>
    </OnboardingProvider>
  )
}
