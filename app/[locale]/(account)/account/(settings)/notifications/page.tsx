import { getTranslations } from "next-intl/server"
import { NotificationsContent } from "./notifications-content"
import type { NotificationRow } from "./notification-types"
import { withAccountPageShell } from "../../_lib/account-page-shell"

export const metadata = {
  title: "Notifications | Treido",
  description: "Manage your notification preferences.",
}

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return withAccountPageShell(params, async ({ locale, supabase, user }) => {
    const t = await getTranslations({ locale, namespace: "NavUser" })

    // Preload notifications server-side so the page never gets stuck in the
    // client component's initial "Loading..." state if hydration or client fetch stalls.
    let initialNotifications: NotificationRow[] = []
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id,type,title,body,data,order_id,product_id,conversation_id,is_read,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (!error && data) {
        initialNotifications = data as NotificationRow[]
      }
    } catch {
      // If the table isn't available yet (or RLS blocks), fall back to empty state.
    }

    return {
      title: t("notifications"),
      content: <NotificationsContent initialNotifications={initialNotifications} />,
    }
  })
}
