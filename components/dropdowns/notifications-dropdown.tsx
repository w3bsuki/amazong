"use client"

import { useState, useEffect, useCallback } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { Bell, Package, ChatCircle, Star, Users, Tag, Check, CheckCircle, CaretRight, X } from "@phosphor-icons/react"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "purchase" | "order_status" | "message" | "review" | "system" | "promotion"
  title: string
  body: string | null
  data: Record<string, unknown>
  order_id: string | null
  product_id: string | null
  conversation_id: string | null
  is_read: boolean
  created_at: string
}

interface NotificationsDropdownProps {
  user: User | null
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "purchase":
      return <Package size={18} weight="duotone" className="text-green-500" />
    case "order_status":
      return <Package size={18} weight="duotone" className="text-blue-500" />
    case "message":
      return <ChatCircle size={18} weight="duotone" className="text-purple-500" />
    case "review":
      return <Star size={18} weight="duotone" className="text-yellow-500" />
    case "system":
      return <Users size={18} weight="duotone" className="text-gray-500" />
    case "promotion":
      return <Tag size={18} weight="duotone" className="text-orange-500" />
    default:
      return <Bell size={18} weight="duotone" />
  }
}

const getNotificationLink = (notification: Notification): string => {
  if (notification.conversation_id) {
    return `/chat?conversation=${notification.conversation_id}`
  }
  if (notification.order_id) {
    // Check if it's a seller notification (purchase type)
    if (notification.type === "purchase") {
      return `/account/sales`
    }
    return `/account/orders`
  }
  if (notification.product_id) {
    return `/account/selling`
  }
  // For followers
  if (notification.data?.event_type === "new_follower") {
    return `/account`
  }
  return "/account"
}

export function NotificationsDropdown({ user }: NotificationsDropdownProps) {
  const t = useTranslations("NotificationsDropdown")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (!error && data) {
      setNotifications(data as Notification[])
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
    setIsLoading(false)
  }, [user])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Real-time subscription
  useEffect(() => {
    if (!user) return

    const supabase = createClient()
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient()
    await supabase.rpc("mark_notification_read", { p_notification_id: notificationId })
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    await supabase.rpc("mark_all_notifications_read")
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  // Don't show for non-authenticated users
  if (!user) {
    return null
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xl"
          className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-brand hover:bg-header-hover relative [&_svg]:size-6"
          aria-label={`${t("title")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell weight="regular" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-96 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={20} weight="regular" className="text-muted-foreground" />
            <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
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
              onClick={(e) => {
                e.preventDefault()
                markAllAsRead()
              }}
            >
              <CheckCircle size={14} className="mr-1" />
              {t("markAllRead")}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              {t("loading")}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={40} weight="thin" className="mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification)}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id)
                    }
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-start gap-3 p-3 hover:bg-muted transition-colors",
                    !notification.is_read && "bg-accent/30"
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm line-clamp-1",
                      !notification.is_read ? "font-semibold text-foreground" : "text-foreground"
                    )}>
                      {notification.title}
                    </p>
                    {notification.body && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="shrink-0 w-2 h-2 rounded-full bg-brand mt-2" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted border-t border-border">
          <Link href="/account/notifications" onClick={() => setIsOpen(false)}>
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {t("viewAll")}
              <CaretRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
