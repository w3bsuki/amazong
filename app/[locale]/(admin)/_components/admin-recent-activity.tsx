"use client"

import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { useLocale, useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  const getStatusColor = (status: string | null) => {
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
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
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

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "seller":
        return "bg-brand/10 text-brand border-brand/20"
      default:
        return "bg-muted text-muted-foreground border-border"
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("recent.usersTitle")}</CardTitle>
          <CardDescription>{t("recent.usersDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {users.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">{t("recent.emptyUsers")}</p>
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
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("recent.productsTitle")}</CardTitle>
          <CardDescription>{t("recent.productsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {products.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">{t("recent.emptyProducts")}</p>
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
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("recent.ordersTitle")}</CardTitle>
          <CardDescription>{t("recent.ordersDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {orders.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">{t("recent.emptyOrders")}</p>
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
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
