import { getTranslations, setRequestLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { notFound, validateLocale } from "@/i18n/routing"
import { ConversationPageClient } from "../../_components/conversation-page-client"
import { blockUser } from "../../../../actions/blocked-users"
import { reportConversation } from "../../_actions/report-conversation"
import { AuthGateCard } from "../../../_components/auth/auth-gate-card"
import { BUILD_VALIDATION_UUID, localeStaticParamsWith } from "@/lib/next/static-params"
import { createPageMetadata } from "@/lib/seo/metadata"

// Generate static params for build validation (required by cacheComponents)
// Actual pages are rendered server-side for authenticated users
export function generateStaticParams() {
  return localeStaticParamsWith({ conversationId: BUILD_VALIDATION_UUID })
}

/**
 * Generate SEO-friendly metadata for conversation pages
 * Title includes the other party's name for context
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; conversationId: string }>
}) {
  const { locale, conversationId } = await params
  const t = await getTranslations({ locale, namespace: "Messages" })
  const supabase = await createClient()
  const path = `/chat/${conversationId}`

  if (!supabase) {
    return createPageMetadata({
      locale,
      path,
      title: t("pageTitle"),
      description: t("pageDescription"),
      robots: {
        index: false,
        follow: false,
      },
    })
  }

  // Fetch conversation details for metadata
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return createPageMetadata({
      locale,
      path,
      title: t("pageTitle"),
      description: t("pageDescription"),
      robots: {
        index: false,
        follow: false,
      },
    })
  }

  // Get conversation with product info
  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      id,
      buyer_id,
      seller_id,
      product:products(title)
    `)
    .eq("id", conversationId)
    .single()

  if (!conversation) {
    return createPageMetadata({
      locale,
      path,
      title: t("pageTitle"),
      description: t("pageDescription"),
      robots: {
        index: false,
        follow: false,
      },
    })
  }

  // Get the other party's profile
  const otherPartyId = conversation.buyer_id === user.id 
    ? conversation.seller_id 
    : conversation.buyer_id

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, full_name, business_name")
    .eq("id", otherPartyId)
    .single()

  const otherName = profile?.business_name || profile?.display_name || profile?.full_name || t("unknownUser")
  const productTitle = conversation.product?.title

  const title = productTitle 
    ? t("conversationWithProductTitle", { name: otherName, product: productTitle })
    : t("conversationTitle", { name: otherName })

  return createPageMetadata({
    locale,
    path,
    title,
    description: t("conversationDescription", { name: otherName }),
    robots: {
      index: false, // Private conversations shouldn't be indexed
      follow: false,
    },
  })
}

/**
 * Conversation Page - Server Component
 * 
 * This page displays a specific conversation using the proper App Router
 * dynamic segment pattern: /chat/[conversationId]
 * 
 * - Server-side auth validation
 * - Server-side conversation access check
 * - Proper metadata generation
 * - SEO-friendly URLs
 */
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ locale: string; conversationId: string }>
}) {
  const { locale: localeParam, conversationId } = await params
  const locale = validateLocale(localeParam)

  // Enable static rendering
  setRequestLocale(locale)

  const supabase = await createClient()

  const { data: { user } } = await (supabase
    ? supabase.auth.getUser()
    : Promise.resolve({ data: { user: null } }))

  if (!user) {
    const t = await getTranslations({ locale, namespace: "Drawers" })
    return (
      <div className="flex w-full flex-1 items-center justify-center px-inset py-8">
        <AuthGateCard
          title={t("signInPrompt")}
          description={t("signInDescription")}
          nextPath={`/chat/${conversationId}`}
        />
      </div>
    )
  }

  // Validate conversation exists and user has access
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", conversationId)
    .single()

  if (error || !conversation) {
    notFound()
  }

  // Check user is part of this conversation
  const isParticipant = conversation.buyer_id === user.id || conversation.seller_id === user.id

  if (!isParticipant) {
    notFound()
  }

  return (
    <ConversationPageClient 
      conversationId={conversationId}
      actions={{ blockUser, reportConversation }}
    />
  )
}
