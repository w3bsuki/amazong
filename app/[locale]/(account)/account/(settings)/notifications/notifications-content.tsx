"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Bell, ChevronRight as CaretRight, CircleCheck as CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import { Link, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

import type { NotificationRow } from "./notification-types"
import {
  fetchNotificationData,
  markAllNotificationsRead,
  markNotificationRead,
  saveNotificationPreferences,
} from "./notifications-content.data"
import {
  getNotificationIcon,
  getNotificationLink,
  NotificationToggleRow,
} from "./notifications-content.helpers"
import {
  DEFAULT_PREFS,
  EMAIL_PREFERENCE_ROWS,
  IN_APP_PREFERENCE_ROWS,
  isInAppEnabled,
  type NotificationPreferences,
} from "./notifications-content.types"

import { logger } from "@/lib/logger"
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
          return
        }

        const { prefs: loadedPrefs, notifications: loadedNotifications } = await fetchNotificationData(
          supabase,
          user.id
        )

        setPrefs(loadedPrefs)
        setNotifications(loadedNotifications)
      } catch (error) {
        logger.error("[account-notifications] load_notifications_failed", error)
        toast.error(t("toasts.loadError"))
      } finally {
        setIsLoading(false)
        initializedRef.current = true
      }
    },
    [supabase, t]
  )

  useEffect(() => {
    if (initialNotifications !== undefined) {
      void fetchAll({ showSpinner: false })
      return
    }

    void fetchAll({ showSpinner: true })
  }, [fetchAll, initialNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationRead(supabase, notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    } catch {
      toast.error(t("toasts.markReadError"))
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead(supabase)
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

      await saveNotificationPreferences(supabase, user.id, next)
    } catch (error) {
      logger.error("[account-notifications] save_preferences_failed", error)
      toast.error(t("toasts.saveError"))
    }
  }

  const updatePref = <K extends keyof NotificationPreferences>(key: K, value: boolean) => {
    const next = { ...prefs, [key]: value }
    setPrefs(next)

    if (initializedRef.current) {
      void savePrefs(next)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-muted-foreground" />
            <div className="font-semibold text-base text-foreground">{t("title")}</div>
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
          <div className="p-4 text-center text-muted-foreground">{t("loading")}</div>
        ) : visibleNotifications.length === 0 ? (
          <div className="p-4 text-center">
            <Bell size={40} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
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

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 bg-muted border-b border-border">
          <div className="text-sm font-semibold text-foreground">{t("preferences.title")}</div>
          <div className="text-xs text-muted-foreground mt-1">{t("preferences.description")}</div>
        </div>

        <div className="divide-y divide-border">
          <div className="p-3">
            <div className="text-xs font-medium text-muted-foreground">{t("preferences.inApp")}</div>
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
            <div className="text-xs font-medium text-muted-foreground">{t("preferences.email")}</div>
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
            <div className="text-xs font-medium text-muted-foreground">{t("preferences.push")}</div>
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
