import type { ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { setRequestLocale } from "next-intl/server"

import { redirect, type Locale, validateLocale } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>

export interface AccountPageShellContext {
  locale: Locale
  supabase: SupabaseServerClient
  user: User
}

export interface AccountPageShellRenderResult {
  content: ReactNode
  title?: ReactNode
  className?: string
}

export async function withAccountPageShell(
  params: Promise<{ locale: string }>,
  render: (
    context: AccountPageShellContext
  ) => AccountPageShellRenderResult | Promise<AccountPageShellRenderResult>
) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  const result = await render({ locale, supabase, user })

  if (!result.title) {
    return result.content
  }

  return (
    <div className={result.className ?? "flex flex-col gap-4 md:gap-4"}>
      <h1 className="sr-only">{result.title}</h1>
      {result.content}
    </div>
  )
}
