import type { Metadata } from "next"
import { validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"

type LocaleParams = Promise<{ locale: string }>

export async function resolveRouteLocale(params: LocaleParams) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  return locale
}

export async function buildRouteMetadata(options: {
  params: LocaleParams
  namespace: string
  titleKey: string
  descriptionKey?: string
}): Promise<Metadata> {
  const locale = await resolveRouteLocale(options.params)
  const t = await getTranslations({ locale, namespace: options.namespace })

  return {
    title: t(options.titleKey as never),
    ...(options.descriptionKey
      ? { description: t(options.descriptionKey as never) }
      : {}),
  }
}
