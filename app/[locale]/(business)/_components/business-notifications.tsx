"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { formatDistanceToNow } from "date-fns"
import {
  IconBell,
  IconShoppingCart,
  IconPackage,
  IconStar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconSettings,
  IconDots,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type NotificationType = "order" | "inventory" | "review" | "alert" | "success"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  href?: string
}

interface BusinessNotificationsProps {
  initialNotifications?: Notification[]
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  order: IconShoppingCart,
  inventory: IconPackage,
  review: IconStar,
  alert: IconAlertTriangle,
  success: IconCheck,
}

const notificationColors: Record<NotificationType, string> = {
  order: "bg-info/10 text-info",
  inventory: "bg-selected text-primary",
  review: "bg-warning/10 text-warning",
  alert: "bg-destructive-subtle text-destructive",
  success: "bg-success/10 text-success",
}

// Demo notifications - in production, these would come from a real notifications system
const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New order received",
    message: "You have a new order ABC-123 for BGN 45.99",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    read: false,
    href: "/dashboard/orders",
  },
  {
    id: "2",
    type: "inventory",
    title: "Low stock alert",
    message: "Product 'Blue Widget' is running low (3 left)",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    href: "/dashboard/inventory?filter=low",
  },
  {
    id: "3",
    type: "review",
    title: "New review",
    message: "A customer left a 5-star review on 'Red Gadget'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    href: "/dashboard/reviews",
  },
  {
    id: "4",
    type: "success",
    title: "Order delivered",
    message: "Order #XYZ789 was successfully delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    href: "/dashboard/orders",
  },
]

export function BusinessNotifications({
  initialNotifications = defaultNotifications
}: BusinessNotificationsProps) {
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const [isOpen, setIsOpen] = React.useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <IconBell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center text-2xs bg-destructive text-destructive-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-7" asChild>
              <Link href="/dashboard/settings?tab=notifications">
                <IconSettings className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-(--business-notifications-scroll-h)">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted mb-2">
                <IconBell className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const iconColor = notificationColors[notification.type]

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 hover:bg-hover active:bg-active transition-colors",
                      !notification.read && "bg-selected"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "flex size-8 items-center justify-center rounded-full shrink-0 mt-0.5",
                      iconColor
                    )}>
                      <Icon className="size-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={notification.href || "#"}
                        onClick={() => {
                          markAsRead(notification.id)
                          setIsOpen(false)
                        }}
                        className="block"
                      >
                        <p className={cn(
                          "text-sm leading-tight",
                          !notification.read && "font-medium"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-2xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </Link>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-6 shrink-0">
                          <IconDots className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {!notification.read && (
                          <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                            <IconCheck className="size-4 mr-2" />
                            Mark as read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => clearNotification(notification.id)}
                          className="text-destructive"
                        >
                          <IconX className="size-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="size-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs h-8"
                asChild
              >
                <Link href="/dashboard/notifications">
                  View all notifications
                </Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
