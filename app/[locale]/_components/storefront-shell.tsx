import type { ReactNode } from "react"

import { AppHeader } from "./app-header"
import { SiteFooter } from "./site-footer"
import { MobileTabBar } from "./mobile-tab-bar"
import { CookieConsent } from "./cookie-consent"
import { Toaster } from "./providers/sonner"
import { HeaderProvider } from "@/components/providers/header-context"
import { GeoWelcomeModal } from "./geo-welcome-modal"
import { GuestSellCta } from "./guest-sell-cta"
import { SkipLinks } from "./skip-links"
import { PageShell } from "./page-shell"
import { CategoryDrawerProvider } from "@/components/mobile/category-nav"
import { CategoryBrowseDrawer } from "./category-browse-drawer"
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
    <CategoryDrawerProvider rootCategories={categories}>
      <HeaderProvider>
        <PageShell className="flex flex-col">
          <SkipLinks />

          <AppHeader user={null} categories={categories} />

          <main id="main-content" role="main" className="flex-1 pb-tabbar-safe md:pb-0 pt-app-header">
            {children}
          </main>

          <SiteFooter />
          <MobileTabBar />
          <CategoryBrowseDrawer locale={locale} />
          <Toaster />
          <CookieConsent />
          <GeoWelcomeModal locale={locale} />
          <GuestSellCta />
        </PageShell>
      </HeaderProvider>
    </CategoryDrawerProvider>
  )
}

