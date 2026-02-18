import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  ActivityCardShell,
  ActivityEmptyState,
  ActivityRow,
  ActivityScrollList,
  ActivityThumbnail,
} from "@/components/shared/activity-feed"

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

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20"
    case "draft":
      return "bg-muted text-foreground border-border"
    case "sold":
      return "bg-info/10 text-info border-info/20"
    default:
      return "bg-muted text-foreground border-border"
  }
}

const formatCurrencyBGN = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 2,
  }).format(value)

export function BusinessRecentActivity({ products, orders }: BusinessRecentActivityProps) {
  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      {/* Recent Products */}
      <ActivityCardShell title="Recent Products" description="Your latest listings this week">
        <ActivityScrollList>
          {products.length === 0 ? (
            <ActivityEmptyState>No recent products</ActivityEmptyState>
          ) : (
            products.map((product) => (
              <ActivityRow
                key={product.id}
                className="p-4"
                media={
                  <ActivityThumbnail
                    src={product.images?.[0]}
                    alt={product.title}
                    className="size-10 rounded-md bg-muted shrink-0"
                    sizes="40px"
                    fallback={
                      <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                        {product.title.slice(0, 2).toUpperCase()}
                      </div>
                    }
                  />
                }
                content={
                  <>
                    <p className="truncate text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                    </p>
                  </>
                }
                trailing={
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-success">{formatCurrencyBGN(product.price)}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(product.status)}`}>
                      {product.status || "active"}
                    </Badge>
                  </div>
                }
              />
            ))
          )}
        </ActivityScrollList>
      </ActivityCardShell>

      {/* Recent Orders */}
      <ActivityCardShell title="Recent Orders" description="Latest orders you've received">
        <ActivityScrollList>
          {orders.length === 0 ? (
            <ActivityEmptyState>No recent orders</ActivityEmptyState>
          ) : (
            orders.map((order) => {
              // Handle both array and single object from Supabase
              const product = Array.isArray(order.product) ? order.product[0] : order.product
              return (
                <ActivityRow
                  key={order.id}
                  className="p-4"
                  media={
                    <ActivityThumbnail
                      src={product?.images?.[0]}
                      alt={product?.title || "Unknown Product"}
                      className="size-10 rounded-md bg-muted shrink-0"
                      sizes="40px"
                      fallback={
                        <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                          ?
                        </div>
                      }
                    />
                  }
                  content={
                    <>
                      <p className="truncate text-sm font-medium">{product?.title || "Unknown Product"}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty:{" "}
                        {order.quantity}
                        {" • "}
                        {order.order?.created_at
                          ? formatDistanceToNow(new Date(order.order.created_at), { addSuffix: true })
                          : ""}
                      </p>
                    </>
                  }
                  trailing={
                    <div className="text-sm font-medium tabular-nums">
                      {formatCurrencyBGN(order.price_at_purchase * order.quantity)}
                    </div>
                  }
                />
              )
            })
          )}
        </ActivityScrollList>
      </ActivityCardShell>
    </div>
  )
}
