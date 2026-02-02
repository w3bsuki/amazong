import type { ReactNode } from "react"

import { PageShell } from "@/components/shared/page-shell"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell variant="muted" className="flex justify-center">
      <div className="w-full max-w-md">{children}</div>
    </PageShell>
  )
}
