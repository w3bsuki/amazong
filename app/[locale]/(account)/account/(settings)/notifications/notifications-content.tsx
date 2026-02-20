"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Link, useRouter } from "@/i18n/routing"
import { Bell, ChevronRight as CaretRight, MessageCircle as ChatCircle, CircleCheck as CheckCircle, Package, Star, Tag, Users } from "lucide-react";

import { formatDistanceToNow } from "date-fns"

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

type NotificationPreferences = {
  in_app_purchase: boolean
  in_app_order_status: boolean
  in_app_message: boolean
  in_app_review: boolean
  in_app_system: boolean
  in_app_promotion: boolean
  email_purchase: boolean
  email_order_status: boolean
  email_message: boolean
  email_review: boolean
  email_system: boolean
  email_promotion: boolean
  push_enabled: boolean
}

const DEFAULT_PREFS: NotificationPreferences = {
  in_app_purchase: true,
  in_app_order_status: true,
  in_app_message: true,
  in_app_review: true,
  in_app_system: true,
  in_app_promotion: true,
  email_purchase: false,
  email_order_status: false,
  email_message: false,
  email_review: false,
  email_system: false,
  email_promotion: false,
  push_enabled: false,
}

const IN_APP_PREFERENCE_ROWS = [
  {
    titleKey: "rows.newSales.title",
    descriptionKey: "rows.newSales.description",
    prefKey: "in_app_purchase",
  },
  {
    titleKey: "rows.orderStatus.title",
    descriptionKey: "rows.orderStatus.description",
    prefKey: "in_app_order_status",
  },
  {
    titleKey: "rows.messages.title",
    descriptionKey: "rows.messages.description",
    prefKey: "in_app_message",
  },
  {
    titleKey: "rows.reviews.title",
    descriptionKey: "rows.reviews.description",
    prefKey: "in_app_review",
  },
  {
    titleKey: "rows.system.title",
    descriptionKey: "rows.system.description",
    prefKey: "in_app_system",
  },
  {
    titleKey: "rows.promotions.title",
    descriptionKey: "rows.promotions.description",
    prefKey: "in_app_promotion",
  },
] as const satisfies ReadonlyArray<{
  titleKey: string
  descriptionKey: string
  prefKey: keyof NotificationPreferences
}>

const EMAIL_PREFERENCE_ROWS = [
  { titleKey: "rows.newSalesEmail", prefKey: "email_purchase" },
  { titleKey: "rows.orderStatusEmail", prefKey: "email_order_status" },
  { titleKey: "rows.messagesEmail", prefKey: "email_message" },
  { titleKey: "rows.reviewsEmail", prefKey: "email_review" },
  { titleKey: "rows.systemEmail", prefKey: "email_system" },
  { titleKey: "rows.promotionsEmail", prefKey: "email_promotion" },
] as const satisfies ReadonlyArray<{
  titleKey: string
  prefKey: keyof NotificationPreferences
}>

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "purchase":
      return <Package size={18} className="text-success" />
    case "order_status":
      return <Package size={18} className="text-info" />
    case "message":
      return <ChatCircle size={18} className="text-primary" />
    case "review":
      return <Star size={18} className="text-warning" />
    case "system":
      return <Users size={18} className="text-muted-foreground" />
    case "promotion":
      return <Tag size={18} className="text-destructive" />
    default:
      return <Bell size={18} />
  }
}

const isInAppEnabled = (prefs: NotificationPreferences, type: NotificationType) => {
  switch (type) {
    case "purchase":
      return prefs.in_app_purchase
    case "order_status":
      return prefs.in_app_order_status
    case "message":
      return prefs.in_app_message
    case "review":
      return prefs.in_app_review
    case "system":
      return prefs.in_app_system
    case "promotion":
      return prefs.in_app_promotion
    default:
      return true
  }
}

const getNotificationLink = (notification: NotificationRow): string => {
  if (notification.conversation_id) {
    return `/chat/${notification.conversation_id}`
  }
  if (notification.order_id) {
    if (notification.type === "purchase") {
      return `/account/sales`
    }
    return `/account/orders`
  }
  if (notification.product_id) {
    return `/account/selling`
  }
  if (notification.data?.event_type === "new_follower") {
    return `/account/following`
  }
  return "/account"
}

const NotificationToggleRow = ({
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  title: string
  description?: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
  disabled?: boolean
}) => {
  return (
    <div className={cn("flex items-center gap-3 p-3", disabled && "opacity-60")}> 
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}

export function NotificationsContent({
  initialNotifications,
}: {
  initialNotifications?: NotificationRow[]
}) {
  const t = useTranslations("Account.notificationsPage")
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [isLoading, setIsLoading] = useState(() => initialNotifications === undefined)
  const [notifications, setNotifications] = useState<NotificationRow[]>(() => initialNotifications ?? [])
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS)
  const initializedRef = useRef(false)

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => isInAppEnabled(prefs, n.type))
  }, [notifications, prefs])

  const unreadCount = useMemo(() => {
    return visibleNotifications.filter((n) => !n.is_read).length
  }, [visibleNotifications])

  const fetchAll = useCallback(
    async ({ showSpinner }: { showSpinner: boolean } = { showSpinner: true }) => {
      if (showSpinner) {
        setIsLoading(true)
      }
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) {
        setIsLoading(false)
        return
      }

      // Preferences (optional)
      try {
        const { data: prefData, error: prefError } = await supabase
          .from("notification_preferences")
          .select(
            "user_id,in_app_purchase,in_app_order_status,in_app_message,in_app_review,in_app_system,in_app_promotion,email_purchase,email_order_status,email_message,email_review,email_system,email_promotion,push_enabled"
          )
          .eq("user_id", user.id)
          .maybeSingle()

        if (!prefError && prefData) {
          setPrefs({
            in_app_purchase: prefData.in_app_purchase ?? true,
            in_app_order_status: prefData.in_app_order_status ?? true,
            in_app_message: prefData.in_app_message ?? true,
            in_app_review: prefData.in_app_review ?? true,
            in_app_system: prefData.in_app_system ?? true,
            in_app_promotion: prefData.in_app_promotion ?? true,
            email_purchase: prefData.email_purchase ?? false,
            email_order_status: prefData.email_order_status ?? false,
            email_message: prefData.email_message ?? false,
            email_review: prefData.email_review ?? false,
            email_system: prefData.email_system ?? false,
            email_promotion: prefData.email_promotion ?? false,
            push_enabled: prefData.push_enabled ?? false,
          })
        }
      } catch {
        // If preferences table isn't present yet, keep defaults.
      }

      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id,type,title,body,data,order_id,product_id,conversation_id,is_read,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications((data ?? []) as NotificationRow[])
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast.error(t("toasts.loadError"))
    } finally {
      setIsLoading(false)
      initializedRef.current = true
    }
    },
    [supabase, t]
  )

  useEffect(() => {
    // If we have SSR-provided notifications, render immediately and refresh quietly.
    if (initialNotifications !== undefined) {
      void fetchAll({ showSpinner: false })
      return
    }

    void fetchAll({ showSpinner: true })
  }, [fetchAll, initialNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.rpc("mark_notification_read", { p_notification_id: notificationId })
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    } catch {
      toast.error(t("toasts.markReadError"))
    }
  }

  const markAllAsRead = async () => {
    try {
      await supabase.rpc("mark_all_notifications_read")
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch {
      toast.error(t("toasts.markAllReadError"))
    }
  }

  const savePrefs = async (next: NotificationPreferences) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) return

      await supabase
        .from("notification_preferences")
        .upsert(
          {
            user_id: user.id,
            ...next,
          },
          { onConflict: "user_id" }
        )
    } catch (error) {
      console.error("Error saving notification prefs:", error)
      toast.error(t("toasts.saveError"))
    }
  }

  const updatePref = <K extends keyof NotificationPreferences>(key: K, value: boolean) => {
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    // Avoid saving until we have attempted initial load.
    if (initializedRef.current) {
      void savePrefs(next)
    }
  }

  return (
    <div className="space-y-4">
      {/* All notifications */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-muted-foreground" />
            <div className="font-semibold text-base text-foreground">
              {t("title")}
            </div>
            {unreadCount > 0 && (
              <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => void markAllAsRead()}
            >
              <CheckCircle size={14} className="mr-1" />
              {t("markAll")}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            {t("loading")}
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="p-4 text-center">
            <Bell size={40} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visibleNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={getNotificationLink(notification)}
                onClick={() => {
                  if (!notification.is_read) {
                    void markAsRead(notification.id)
                  }
                }}
                className={cn(
                  "flex items-start gap-3 p-3 hover:bg-muted",
                  !notification.is_read && "bg-selected"
                )}
              >
                <div className="shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm line-clamp-1",
                      !notification.is_read ? "font-semibold text-foreground" : "text-foreground"
                    )}
                  >
                    {notification.title}
                  </p>
                  {notification.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.body}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!notification.is_read && <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 bg-muted border-b border-border">
          <div className="text-sm font-semibold text-foreground">
            {t("preferences.title")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t("preferences.description")}
          </div>
        </div>

        <div className="divide-y divide-border">
          <div className="p-3">
            <div className="text-xs font-medium text-muted-foreground">
              {t("preferences.inApp")}
            </div>
          </div>

          {IN_APP_PREFERENCE_ROWS.map((row) => (
            <NotificationToggleRow
              key={row.prefKey}
              title={t(row.titleKey)}
              description={t(row.descriptionKey)}
              checked={prefs[row.prefKey]}
              onCheckedChange={(v) => updatePref(row.prefKey, v)}
            />
          ))}

          <div className="p-3">
            <div className="text-xs font-medium text-muted-foreground">
              {t("preferences.email")}
            </div>
          </div>

          {EMAIL_PREFERENCE_ROWS.map((row) => (
            <NotificationToggleRow
              key={row.prefKey}
              title={t(row.titleKey)}
              checked={prefs[row.prefKey]}
              onCheckedChange={(v) => updatePref(row.prefKey, v)}
            />
          ))}

          <div className="p-3">
            <div className="text-xs font-medium text-muted-foreground">
              {t("preferences.push")}
            </div>
          </div>
          <NotificationToggleRow
            title={t("rows.push.title")}
            description={t("rows.push.description")}
            checked={prefs.push_enabled}
            onCheckedChange={() => {}}
            disabled
          />
        </div>

        <div className="p-3 bg-muted border-t border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              router.push("/account/sales")
            }}
          >
            {t("goToSales")}
            <CaretRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
