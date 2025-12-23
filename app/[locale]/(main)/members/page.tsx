import { routing } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import type { Metadata } from "next"
import MembersPageClient from "./_components/members-page-client"
import type { MembersSearchParams } from "./_components/members-types"
import { getMembersPageData } from "./_components/get-members-page-data"

export const metadata: Metadata = {
  title: "Members | Amazong Community",
  description: "Discover members of the Amazong community. Browse sellers and buyers, filter by ratings and activity.",
}

interface MembersPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<MembersSearchParams>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function MembersPage({ params, searchParams }: MembersPageProps) {
  await connection()
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  setRequestLocale(locale)

  const data = await getMembersPageData(resolvedSearchParams)
  
  return (
    <MembersPageClient {...data} locale={locale} />
  )
}
