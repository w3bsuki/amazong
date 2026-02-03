import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { formatCurrency } from "@/app/[locale]/_lib/format-currency"

interface RecentProduct {
  id: string
  title: string
  price: number
  created_at: string
  images: string[] | null
  status: string | null
}

interface RecentOrder {
  id: string
  quantity: number
  price_at_purchase: number
  order_id: string
  product: {
    id: string
    title: string
    images: string[] | null
  } | null
  order: {
    id: string
    created_at: string
  } | null
}

interface BusinessRecentActivityProps {
  products: RecentProduct[]
  orders: RecentOrder[]
}

export function BusinessRecentActivity({ products, orders }: BusinessRecentActivityProps) {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20'
      case 'draft':
        return 'bg-muted text-foreground border-border'
      case 'sold':
        return 'bg-info/10 text-info border-info/20'
      default:
        return 'bg-muted text-foreground border-border'
    }
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Products</CardTitle>
          <CardDescription>Your latest listings this week</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {products.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No recent products</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-4">
                    <div className="relative size-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                          {product.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-success">
                        {formatCurrency(product.price, { locale: "en-US", maximumFractionDigits: 2 })}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(product.status)}`}>
                        {product.status || 'active'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <CardDescription>Latest orders you've received</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-(--spacing-scroll-md)">
            <div className="divide-y">
              {orders.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No recent orders</p>
              ) : (
                orders.map((order) => {
                  // Handle both array and single object from Supabase
                  const product = Array.isArray(order.product) ? order.product[0] : order.product
                  return (
                    <div key={order.id} className="flex items-center gap-3 p-4">
                      <div className="relative size-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {product?.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {product?.title || 'Unknown Product'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {order.quantity} • {order.order?.created_at ? formatDistanceToNow(new Date(order.order.created_at), { addSuffix: true }) : ''}
                        </p>
                      </div>
                      <div className="text-sm font-medium tabular-nums">
                        {formatCurrency(order.price_at_purchase * order.quantity, { locale: "en-US", maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
