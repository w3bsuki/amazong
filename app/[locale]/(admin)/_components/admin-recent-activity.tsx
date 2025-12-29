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
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200"
      case "seller":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
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
          <ScrollArea className="h-[300px]">
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
          <ScrollArea className="h-[300px]">
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
                    <span className="text-sm font-medium text-emerald-600">{formatCurrency(product.price)}</span>
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
          <ScrollArea className="h-[300px]">
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
