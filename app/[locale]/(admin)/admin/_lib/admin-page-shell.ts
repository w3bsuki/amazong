import { bg, enUS } from "date-fns/locale"
import { getLocale, getTranslations } from "next-intl/server"
import { connection } from "next/server"

export async function getAdminPageShell(namespace: string) {
  // Mark admin routes as dynamic without relying on route segment config.
  await connection()

  const t = await getTranslations(namespace)
  const locale = await getLocale()
  const dateLocale = locale === "bg" ? bg : enUS

  return { t, locale, dateLocale }
}

