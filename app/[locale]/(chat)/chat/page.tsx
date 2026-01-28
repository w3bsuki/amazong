import { getTranslations } from "next-intl/server"
import { redirect } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { MessagesPageClient } from "../_components/messages-page-client"
import { blockUser } from "@/app/actions/blocked-users"
import { reportConversation } from "../_actions/report-conversation"
import { AuthGateCard } from "@/components/shared/auth/auth-gate-card"

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
  searchParams: Promise<{ conversation?: string; seller?: string; product?: string }>
}) {
  const { locale } = await params
  const { conversation, seller, product } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await (supabase
    ? supabase.auth.getUser()
    : Promise.resolve({ data: { user: null } }))

  if (!user) {
    const t = await getTranslations({ locale, namespace: "Drawers" })
    return (
      <div className="flex w-full flex-1 items-center justify-center px-inset py-8">
        <AuthGateCard title={t("signInPrompt")} description={t("signInDescription")} nextPath="/chat" />
      </div>
    )
  }

  // Handle legacy URL format: /chat?conversation=xxx -> /chat/xxx
  // This ensures old links continue to work and get redirected to the new format
  if (conversation) {
    return redirect({ href: `/chat/${conversation}`, locale })
  }

  return (
    <MessagesPageClient 
      actions={{ blockUser, reportConversation }} 
      initialSellerId={seller}
      initialProductId={product}
    />
  )
}
