import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import { NotificationsContent } from "./notifications-content"

type NotificationType = "purchase" | "order_status" | "message" | "review" | "system" | "promotion"

interface NotificationRow {
  id: string
  type: NotificationType
  title: string
  body: string | null
  data: Record<string, unknown> | null
  order_id: string | null
  product_id: string | null
  conversation_id: string | null
  is_read: boolean
  created_at: string
}

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "NavUser" })

  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Preload notifications server-side so the page never gets stuck in the
  // client component's initial "Loading..." state if hydration or client fetch stalls.
  let initialNotifications: NotificationRow[] = []
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("id,type,title,body,data,order_id,product_id,conversation_id,is_read,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (!error && data) {
      initialNotifications = data as NotificationRow[]
    }
  } catch {
    // If the table isn't available yet (or RLS blocks), fall back to empty state.
  }

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{t("notifications")}</h1>
      <NotificationsContent initialNotifications={initialNotifications} />
    </div>
  )
}
