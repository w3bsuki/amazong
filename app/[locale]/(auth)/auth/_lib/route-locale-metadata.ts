import type { Metadata } from "next"
import { validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { createPageMetadata } from "@/lib/seo/metadata"

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
  path: string
}): Promise<Metadata> {
  const locale = await resolveRouteLocale(options.params)
  const t = await getTranslations({ locale, namespace: options.namespace })

  const title = t(options.titleKey as never)
  const description = options.descriptionKey ? t(options.descriptionKey as never) : title

  return createPageMetadata({
    locale,
    path: options.path,
    title,
    description,
  })
}
