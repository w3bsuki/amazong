"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link, useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { Bell, Package, ChatCircle, Star, Users, Tag, CheckCircle, CaretRight } from "@phosphor-icons/react"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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

type NotificationPreferences = {
  in_app_purchase: boolean
  in_app_order_status: boolean
  in_app_message: boolean
  in_app_review: boolean
  in_app_system: boolean
  in_app_promotion: boolean
}

const DEFAULT_PREFS: NotificationPreferences = {
  in_app_purchase: true,
  in_app_order_status: true,
  in_app_message: true,
  in_app_review: true,
  in_app_system: true,
  in_app_promotion: true,
}

const isInAppEnabled = (prefs: NotificationPreferences, type: Notification["type"]) => {
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

const getStringFromData = (data: Record<string, unknown> | null | undefined, key: string) => {
  const value = data?.[key]
  return typeof value === "string" ? value : null
}

const getNumberFromData = (data: Record<string, unknown> | null | undefined, key: string) => {
  const value = data?.[key]
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "purchase":
      return <Package size={18} weight="duotone" className="text-success" />
    case "order_status":
      return <Package size={18} weight="duotone" className="text-info" />
    case "message":
      return <ChatCircle size={18} weight="duotone" className="text-primary" />
    case "review":
      return <Star size={18} weight="duotone" className="text-rating" />
    case "system":
      return <Users size={18} weight="duotone" className="text-muted-foreground" />
    case "promotion":
      return <Tag size={18} weight="duotone" className="text-warning" />
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
  const locale = useLocale()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS)
  const lastToastIdRef = useRef<string | null>(null)

  const fetchPreferences = useCallback(async () => {
    if (!user) return

    try {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from("notification_preferences")
        .select(
          "in_app_purchase,in_app_order_status,in_app_message,in_app_review,in_app_system,in_app_promotion"
        )
        .eq("user_id", user.id)
        .maybeSingle()

      if (!error && data) {
        setPrefs({
          in_app_purchase: data.in_app_purchase ?? true,
          in_app_order_status: data.in_app_order_status ?? true,
          in_app_message: data.in_app_message ?? true,
          in_app_review: data.in_app_review ?? true,
          in_app_system: data.in_app_system ?? true,
          in_app_promotion: data.in_app_promotion ?? true,
        })
      } else {
        setPrefs(DEFAULT_PREFS)
      }
    } catch {
      // If the table isn't present yet (or any other error), default to all enabled.
      setPrefs(DEFAULT_PREFS)
    }
  }, [user])

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
      const filtered = (data as Notification[]).filter(n => isInAppEnabled(prefs, n.type))
      setNotifications(filtered)
      setUnreadCount(filtered.filter(n => !n.is_read).length)
    }
    setIsLoading(false)
  }, [user, prefs])

  // Load preferences once per user
  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  // Fetch notifications whenever preferences (filtering) changes
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

          if (!isInAppEnabled(prefs, newNotification.type)) {
            return
          }

          setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
          setUnreadCount(prev => prev + 1)

          // Toast important notifications (avoid duplicates).
          if (lastToastIdRef.current !== newNotification.id) {
            lastToastIdRef.current = newNotification.id

            if (newNotification.type === "purchase") {
              const buyerName = getStringFromData(newNotification.data, "buyer_name")
              const productTitle =
                getStringFromData(newNotification.data, "product_title") ??
                getStringFromData(newNotification.data, "title")
              const price = getNumberFromData(newNotification.data, "price")

              const currencyLocale = locale === "bg" ? "bg-BG" : "en-US"
              const formattedPrice =
                typeof price === "number"
                  ? new Intl.NumberFormat(currencyLocale, { style: "currency", currency: "BGN" }).format(price)
                  : null

              const baseDescription = (
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground line-clamp-1">
                      {buyerName ? (locale === "bg" ? `${buyerName} направи поръчка` : `${buyerName} placed an order`) : (locale === "bg" ? "Нова поръчка" : "New order")}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {productTitle ? `“${productTitle}”` : (newNotification.body ?? "")}
                    </div>
                    {formattedPrice && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {locale === "bg" ? "Сума:" : "Amount:"} {formattedPrice}
                      </div>
                    )}
                  </div>
                </div>
              )

              // Show immediately, then try to enrich with product image.
              toast(newNotification.title, {
                id: newNotification.id,
                description: baseDescription,
                action: {
                  label: locale === "bg" ? "Виж продажбата" : "View Sale",
                  onClick: () => router.push("/account/sales"),
                },
              })

              // Optional: load a product image for a richer toast.
              const productId = newNotification.product_id
              if (productId) {
                const supabase = createClient()
                void (async () => {
                  const { data } = await supabase
                    .from("products")
                    .select(
                      "images, product_images(image_url,thumbnail_url,display_order,is_primary)"
                    )
                    .eq("id", productId)
                    .maybeSingle()

                  const productImages = (data as any)?.product_images as
                    | Array<{ image_url: string | null; thumbnail_url: string | null; is_primary: boolean | null; display_order: number | null }>
                    | null

                  const primary = productImages?.find((img) => img.is_primary) ??
                    productImages?.slice().sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]

                  const imageUrl =
                    primary?.thumbnail_url ??
                    primary?.image_url ??
                    ((data as any)?.images?.[0] as string | undefined) ??
                    null

                  if (!imageUrl) return

                  toast(newNotification.title, {
                    id: newNotification.id,
                    description: (
                      <div className="flex items-start gap-3">
                        <img
                          src={imageUrl ?? undefined}
                          alt={productTitle ?? "Product"}
                          className="h-10 w-10 rounded-md object-cover border"
                        />
                        {baseDescription}
                      </div>
                    ),
                    action: {
                      label: locale === "bg" ? "Виж продажбата" : "View Sale",
                      onClick: () => router.push("/account/sales"),
                    },
                  })
                })()
              }
            } else if (newNotification.type === "order_status") {
              toast(newNotification.title, {
                description: newNotification.body ?? undefined,
              })
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, prefs, locale, router])

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
          data-testid="notifications-dropdown"
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
        className="w-80 sm:w-96 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
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
                    "flex items-start gap-3 p-3 hover:bg-muted",
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
