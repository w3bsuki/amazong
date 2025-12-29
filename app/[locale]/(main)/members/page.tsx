import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import MembersPageClient from "./_components/members-page-client"
import type { MembersSearchParams } from "./_lib/members-types"
import { getMembersPageData } from "./_lib/get-members-page-data"

export const metadata: Metadata = {
  title: "Members | Treido Community",
  description: "Discover members of the Treido community. Browse sellers and buyers, filter by ratings and activity.",
}

interface MembersPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<MembersSearchParams>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
