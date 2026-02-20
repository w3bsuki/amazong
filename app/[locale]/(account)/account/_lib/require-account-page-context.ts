import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

type AccountPageParams = Promise<{
  locale: string
}>

export async function requireAccountPageContext(params: AccountPageParams) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "Account" })
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

  return { locale, t, supabase, user }
}

