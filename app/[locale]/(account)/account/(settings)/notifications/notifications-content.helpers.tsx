import { Bell, MessageCircle as ChatCircle, Package, Star, Tag, Users } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import type { NotificationRow, NotificationType } from "./notification-types"

export function getNotificationIcon(type: NotificationType) {
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

export function getNotificationLink(notification: NotificationRow): string {
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

export function NotificationToggleRow({
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
}) {
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
