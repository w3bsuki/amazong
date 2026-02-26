import { headers } from "next/headers"
import { connection } from "next/server"
import { setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import type { Metadata } from "next"

import { redirect } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { PageShell } from "../_components/page-shell"
import { FullRouteIntlProvider } from "../_providers/route-intl-provider"

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function OnboardingLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Onboarding is user-scoped and must not be statically rendered.
  await connection()

  const pathname = (await headers()).get("x-pathname") || `/${locale}/onboarding`

  let user: unknown = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    user = error ? null : data.user
  } catch {
    user = null
  }

  if (!user) {
    redirect({ href: { pathname: "/auth/login", query: { next: pathname } }, locale })
  }

  return (
    <FullRouteIntlProvider locale={locale}>
      <PageShell variant="muted" className="flex justify-center">
        <div className="w-full max-w-md">{children}</div>
      </PageShell>
    </FullRouteIntlProvider>
  )
}

