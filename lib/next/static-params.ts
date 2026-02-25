import { routing } from "@/i18n/routing"

export function localeStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export function emptyStaticParams() {
  return []
}
