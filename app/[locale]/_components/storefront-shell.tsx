import type { ReactNode } from "react"

import { AppHeader } from "@/components/layout/header/app-header"
import { SiteFooter } from "@/components/layout/footer/site-footer"
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar"
import { CookieConsent } from "@/components/layout/cookie-consent"
import { Toaster } from "@/components/providers/sonner"
import { HeaderProvider } from "@/components/providers/header-context"
import { GeoWelcomeModal } from "@/components/shared/geo-welcome-modal"
import { SkipLinks } from "@/components/shared/skip-links"
import { PageShell } from "@/components/shared/page-shell"
import type { CategoryTreeNode } from "@/lib/category-tree"

export function StorefrontShell({
  children,
  locale,
  categories,
}: {
  children: ReactNode
  locale: string
  categories: CategoryTreeNode[]
}) {
  return (
    <HeaderProvider>
      <PageShell className="flex flex-col">
        <SkipLinks />

        <AppHeader user={null} categories={categories} />

        <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        <SiteFooter />
        <MobileTabBar categories={categories} />
        <Toaster />
        <CookieConsent />
        <GeoWelcomeModal locale={locale} />
      </PageShell>
    </HeaderProvider>
  )
}
