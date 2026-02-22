import type { ReactNode } from "react"

import { AppHeader } from "./app-header"
import { SiteFooter } from "./site-footer"
import { HeaderProvider } from "@/components/providers/header-context"
import { SkipLinks } from "./skip-links"
import { PageShell } from "./page-shell"
import { CategoryDrawerProvider } from "@/components/mobile/category-nav/category-drawer-context"
import { DeferredStorefrontUi } from "./deferred-storefront-ui"
import type { CategoryTreeNode } from "@/lib/data/categories/types"

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
          <DeferredStorefrontUi locale={locale} />
        </PageShell>
      </HeaderProvider>
    </CategoryDrawerProvider>
  )
}

