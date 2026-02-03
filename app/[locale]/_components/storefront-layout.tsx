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
  const categories = await getCategoryHierarchy(null, 2)
  const shell = (
    <StorefrontShell locale={locale} categories={categories}>
      {children}
    </StorefrontShell>
  )

  return <CommerceProviders>{wrapShell ? wrapShell(shell) : shell}</CommerceProviders>
}
