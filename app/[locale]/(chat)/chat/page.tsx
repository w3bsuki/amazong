import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MessagesPageClient } from "../_components/messages-page-client"
import { blockUser } from "@/app/actions/blocked-users"
import { reportConversation } from "../_actions/report-conversation"

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
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ conversation?: string }>
}) {
  const { locale } = await params
  const { conversation } = await searchParams
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

  // Handle legacy URL format: /chat?conversation=xxx -> /chat/xxx
  // This ensures old links continue to work and get redirected to the new format
  if (conversation) {
    redirect(`/${locale}/chat/${conversation}`)
  }

  return (
    <MessagesPageClient actions={{ blockUser, reportConversation }} />
  )
}
