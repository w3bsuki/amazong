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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'sold':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
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
          <ScrollArea className="h-[300px]">
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
                          {product.title.substring(0, 2).toUpperCase()}
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
                      <span className="text-sm font-medium text-emerald-600">
                        {formatCurrency(product.price)}
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
          <ScrollArea className="h-[300px]">
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
                        {formatCurrency(order.price_at_purchase * order.quantity)}
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
