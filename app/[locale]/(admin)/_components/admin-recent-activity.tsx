"use client"

import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { useLocale, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ActivityCardShell, ActivityEmptyState, ActivityScrollList } from "@/components/shared/activity-feed"

interface RecentUser {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  created_at: string
}

interface RecentProduct {
  id: string
  title: string
  price: number
  created_at: string
  seller_id: string
}

interface RecentOrder {
  id: string
  total_amount: number
  status: string | null
  created_at: string
  user_id: string
}

interface AdminRecentActivityProps {
  users: RecentUser[]
  products: RecentProduct[]
  orders: RecentOrder[]
}

function getStatusColor(status: string | null) {
  switch (status) {
    case "paid":
      return "bg-success/10 text-success border-success/20"
    case "pending":
      return "bg-warning/10 text-warning border-warning/20"
    case "processing":
      return "bg-order-processing/10 text-order-processing border-order-processing/20"
    case "shipped":
      return "bg-order-shipped/10 text-order-shipped border-order-shipped/20"
    case "delivered":
      return "bg-success/10 text-success border-success/20"
    case "cancelled":
      return "bg-destructive-subtle text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getRoleBadge(role: string | null) {
  switch (role) {
    case "admin":
      return "bg-destructive-subtle text-destructive border-destructive/20"
    case "seller":
      return "bg-selected text-primary border-selected-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function AdminRecentActivity({ users, products, orders }: AdminRecentActivityProps) {
  const t = useTranslations("AdminDashboard")
  const locale = useLocale()
  const dateLocale = locale === "bg" ? bg : enUS

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BGN",
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "paid":
        return t("status.paid")
      case "pending":
        return t("status.pending")
      case "processing":
        return t("status.processing")
      case "shipped":
        return t("status.shipped")
      case "delivered":
        return t("status.delivered")
      case "cancelled":
        return t("status.cancelled")
      default:
        return t("status.unknown")
    }
  }

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "admin":
        return t("roles.admin")
      case "seller":
        return t("roles.seller")
      default:
        return t("roles.buyer")
    }
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
      <ActivityCardShell title={t("recent.usersTitle")} description={t("recent.usersDescription")}>
        <ActivityScrollList>
          {users.length === 0 ? (
            <ActivityEmptyState>{t("recent.emptyUsers")}</ActivityEmptyState>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-4">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {(user.email || t("recent.fallbacks.unknown")).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.full_name || user.email || t("recent.fallbacks.unknown")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: dateLocale })}
                  </p>
                </div>
                <Badge variant="outline" className={getRoleBadge(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            ))
          )}
        </ActivityScrollList>
      </ActivityCardShell>

      <ActivityCardShell title={t("recent.productsTitle")} description={t("recent.productsDescription")}>
        <ActivityScrollList>
          {products.length === 0 ? (
            <ActivityEmptyState>{t("recent.emptyProducts")}</ActivityEmptyState>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-4">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted text-xs font-medium">
                  {product.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(product.created_at), { addSuffix: true, locale: dateLocale })}
                  </p>
                </div>
                <span className="text-sm font-medium text-success">{formatCurrency(product.price)}</span>
              </div>
            ))
          )}
        </ActivityScrollList>
      </ActivityCardShell>

      <ActivityCardShell title={t("recent.ordersTitle")} description={t("recent.ordersDescription")}>
        <ActivityScrollList>
          {orders.length === 0 ? (
            <ActivityEmptyState>{t("recent.emptyOrders")}</ActivityEmptyState>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-mono">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: dateLocale })}
                  </p>
                </div>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
                <span className="text-sm font-medium tabular-nums">{formatCurrency(order.total_amount)}</span>
              </div>
            ))
          )}
        </ActivityScrollList>
      </ActivityCardShell>
    </div>
  )
}
