import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MessagesPageClient } from "../_components/messages-page-client"

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Messages" })

  return {
    title: t("pageTitle"),
    description: t("pageDescription")
  }
}

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  await connection()
  const supabase = await createClient()

  if (!supabase) {
    redirect(`/${locale}/auth/login?next=/${locale}/chat`)
  }

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login?next=/${locale}/chat`)
  }

  return <MessagesPageClient />
}
