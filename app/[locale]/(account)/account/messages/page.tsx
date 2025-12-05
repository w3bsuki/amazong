import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MessagesPageClient } from "./messages-client"

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

export default async function MessagesPage() {
  await connection()
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login?redirect=/account/messages")
  }

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/account/messages")
  }

  return <MessagesPageClient />
}
