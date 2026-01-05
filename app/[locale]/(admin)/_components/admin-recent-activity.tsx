"use client"

import { formatDistanceToNow } from "date-fns"
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
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
        return "bg-account-info-soft text-account-info border-account-stat-border"
      case "delivered":
        return "bg-success/10 text-success border-success/20"
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
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

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Users</CardTitle>
          <CardDescription>New registrations this week</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {users.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No recent users</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-4">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {(user.email || "??").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.full_name || user.email || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="outline" className={getRoleBadge(user.role)}>
                      {user.role || "buyer"}
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
          <CardTitle className="text-base">Recent Products</CardTitle>
          <CardDescription>New listings this week</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {products.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No recent products</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-4">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-xs font-medium">
                      {product.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
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
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <CardDescription>Latest orders placed</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {orders.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No recent orders</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-mono">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status || "pending"}
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
