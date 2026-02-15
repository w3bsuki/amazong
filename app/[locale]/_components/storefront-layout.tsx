import type { ReactNode } from "react"
import { getCategoryHierarchy } from "@/lib/data/categories"

import { CommerceProviders } from "../_providers/commerce-providers"
import { StorefrontShell } from "./storefront-shell"

type StorefrontShellWrapper = (shell: ReactNode) => ReactNode

export async function StorefrontLayout({
  children,
  locale,
  wrapShell,
}: {
  children: ReactNode
  locale: string
  wrapShell?: StorefrontShellWrapper
}) {
  // Keep global layout payload lean:
  // - L0 categories are enough for header nav + category drawer entry points.
  // - Deeper levels are fetched lazily by route-specific UIs when needed.
  const categories = await getCategoryHierarchy(null, 0)
  const shell = (
    <StorefrontShell locale={locale} categories={categories}>
      {children}
    </StorefrontShell>
  )

  return <CommerceProviders>{wrapShell ? wrapShell(shell) : shell}</CommerceProviders>
}
