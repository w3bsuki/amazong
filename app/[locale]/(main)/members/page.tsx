import { validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo/metadata"
import MembersPageClient from "./_components/members-page-client"
import { getMembersPageData, type MembersSearchParams } from "./_lib/get-members-page-data"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'MembersPage' })
  return createPageMetadata({
    locale,
    path: "/members",
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

interface MembersPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<MembersSearchParams>
}

export default async function MembersPage({ params, searchParams }: MembersPageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const resolvedSearchParams = await searchParams
  setRequestLocale(locale)

  const data = await getMembersPageData(resolvedSearchParams)

  return (
    <MembersPageClient {...data} locale={locale} />
  )
}

